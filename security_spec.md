# Security Specification: Hadramout El-Bagour Restaurant (`security_spec.md`)

## 1. Data Invariants & Master Source of Truth

1. **Default-Deny Catch-All**: Every unmatched path is strictly denied (`allow read, write: if false;`).
2. **Admin Authorization Invariant**: Admin privileges require a signed-in user with `request.auth.token.email_verified == true` AND either the bootstrapped owner email (`mohmedsaye528@gmail.com`) or an existing document at `/databases/$(database)/documents/admins/$(request.auth.uid)`.
3. **PII Isolation (Split Collection Pattern)**:
   - `/orders/{orderId}` contains customer PII (`customerName`, `customerPhone`, `customerAddress`). Reads (`get`, `list`) are strictly restricted to the verified owner (`resource.data.customerUid == request.auth.uid`) or `isBootstrappedAdmin()`.
   - `/orderTracking/{orderId}` stores only non-PII status tracking data (`orderNumber`, `status`, `deliveryMethod`, `totalAmount`, `itemCount`, `itemsSummaryAr`, `itemsSummaryEn`) and must be created atomically alongside `/orders/{orderId}` using `existsAfter(/databases/$(database)/documents/orderTracking/$(orderId))`.
   - `/reservations/{reservationId}` contains customer PII (`customerName`, `customerPhone`) and restricts reads (`get`, `list`) to the verified owner (`resource.data.customerUid == request.auth.uid`) or `isBootstrappedAdmin()`.
4. **Anti-Update-Gap & Schema Enforcement**: Every `create` and `update` operation invokes its corresponding `isValid[Entity](incoming())` helper enforcing `hasAll`, `hasOnly`, exact types, bounded string lengths, bounded array sizes, and regex patterns.
5. **Temporal Integrity & Immutability**:
   - `createdAt == request.time` on `create`, and `incoming().createdAt == existing().createdAt` on `update`.
   - `updatedAt == request.time` on `create` and `update`.
   - Terminal states (`delivered`, `cancelled`, `completed`) cannot be mutated by non-admins.
6. **Query Enforcer & Cost-Optimization**:
   - No `allow list` block contains `get()` or `exists()` calls.
   - Public `allow list` rules explicitly filter on `resource.data.isVisible == true` or `resource.data.isApproved == true`.

---

## 2. The "Dirty Dozen" Adversarial Payloads

1. **Payload 1 (Shadow Field Injection on `menuItems`)**:
   `{ ...validMenuItem, "isAdminOverride": true }` -> Rejected by `data.keys().hasOnly(...)`.
2. **Payload 2 (Unverified Admin Email Spoofing on `settings/general`)**:
   `auth: { uid: "attacker", token: { email: "mohmedsaye528@gmail.com", email_verified: false } }` -> Rejected by `request.auth.token.email_verified == true`.
3. **Payload 3 (PII Leakage via Unauthorized `get` on `orders/{orderId}`)**:
   Authenticated user `uid: "user_B"` attempts to `get` an order where `customerUid == "user_A"` -> Rejected by `isOrderOwner(existing()) || isAdmin()`.
4. **Payload 4 (Orphaned Order Write without Atomic `orderTracking` Sync)**:
   Client writes to `/orders/ord_123` without writing `/orderTracking/ord_123` in the same batch -> Rejected by `existsAfter(/databases/$(database)/documents/orderTracking/$(orderId))`.
5. **Payload 5 (ID Poisoning / 1.5KB Document ID)**:
   Creating `/orders/<200-char-junk-id>` -> Rejected by `isValidId(orderId)` enforcing `id.size() <= 128 && id.matches('^[a-zA-Z0-9_\\-]+$')`.
6. **Payload 6 (Denial-of-Wallet 1MB String in `notes`)**:
   `{ ...validOrder, "notes": "<10000_chars>" }` -> Rejected by `data.notes.size() <= 500`.
7. **Payload 7 (Unbounded Array Injection in `orders.items`)**:
   `{ ...validOrder, "items": [30 items] }` -> Rejected by `data.items.size() >= 1 && data.items.size() <= 25`.
8. **Payload 8 (State Shortcutting on Order Creation)**:
   Customer attempts to create an order with `status: "delivered"` -> Rejected by `incoming().status == 'new'`.
9. **Payload 9 (Self-Approved Review Creation)**:
   Customer creates `/reviews/rev_1` with `isApproved: true` -> Rejected by `incoming().isApproved == false || isAdmin()`.
10. **Payload 10 (Timestamp Forgery / Backdating)**:
    Customer sends `createdAt: Timestamp(2020, 1, 1)` -> Rejected by `incoming().createdAt == request.time`.
11. **Payload 11 (Immortal Field Mutation on Order Update)**:
    Updating `createdAt` or `customerUid` on an existing order -> Rejected by `incoming().createdAt == existing().createdAt && incoming().customerUid == existing().customerUid`.
12. **Payload 12 (Self-Assigned Admin Privilege Escalation)**:
    Non-admin user attempts `setDoc('/admins/attacker_uid', { email: 'a@b.com', role: 'admin' })` -> Rejected because only `isBootstrappedAdmin()` can write to `/admins/{adminUid}`.

---

## 3. Hardened Red Team Conflict Report

| Collection | Identity Spoofing | State Shortcutting | Resource Poisoning | Value Poisoning (`isValid` in Update) | PII Blanket Test | Query Trust Test |
| :--- | :--- | :--- | :--- | :--- | :--- | :--- |
| `menuItems` | PASS (Admin only) | PASS (Admin only) | PASS (`isValidId` + bounds) | PASS (`isValidMenuItem` wraps update) | N/A (Public catalog) | PASS (`resource.data.isVisible == true`) |
| `categories` | PASS (Admin only) | PASS (Admin only) | PASS (`isValidId` + bounds) | PASS (`isValidCategory` wraps update) | N/A (Public catalog) | PASS (`resource.data.isVisible == true`) |
| `orders` | PASS (`customerUid` checked) | PASS (`status == 'new'` on create) | PASS (`items.size() <= 25`) | PASS (`isValidOrder` wraps update) | PASS (Owner/Admin only) | PASS (`resource.data.customerUid == request.auth.uid`) |
| `orderTracking` | PASS (Atomic sync) | PASS (`status == 'new'` on create) | PASS (`isValidId` + bounds) | PASS (`isValidOrderTracking` wraps update) | PASS (Zero PII stored) | PASS (`resource.data.orderNumber is string`) |
| `reservations` | PASS (`customerUid` checked) | PASS (`status == 'new'` on create) | PASS (`isValidId` + bounds) | PASS (`isValidReservation` wraps update) | PASS (Owner/Admin only) | PASS (`resource.data.customerUid == request.auth.uid`) |
| `reviews` | PASS (`authorUid` checked) | PASS (`isApproved == false` on guest create) | PASS (`isValidId` + bounds) | PASS (`isValidReview` wraps update) | PASS (Public display name only) | PASS (`resource.data.isApproved == true`) |
| `gallery` | PASS (Admin only) | PASS (Admin only) | PASS (`isValidId` + bounds) | PASS (`isValidGalleryItem` wraps update) | N/A (Public gallery) | PASS (`resource.data.isVisible == true`) |
| `settings` | PASS (Admin only) | PASS (Admin only) | PASS (`settingId == 'general'`) | PASS (`isValidSettings` wraps update) | N/A (Public info) | PASS (Single doc `get` only) |
| `admins` | PASS (Bootstrapped admin only) | PASS (Immutable role) | PASS (`isValidId` + bounds) | PASS (`isValidAdminUser` wraps update) | PASS (Admin/Self only) | PASS (`isBootstrappedAdmin()`) |
