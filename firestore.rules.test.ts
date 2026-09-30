/**
 * Firestore Security Rules Specification Tests ("Dirty Dozen" Verification Suite)
 * Verifies that all 12 adversarial payloads described in security_spec.md
 * are rejected with PERMISSION_DENIED by firestore.rules.
 */

export interface DirtyDozenTestCase {
  id: number;
  name: string;
  collection: string;
  operation: 'get' | 'list' | 'create' | 'update' | 'delete';
  payload: Record<string, unknown>;
  expectedResult: 'PERMISSION_DENIED';
}

export const DIRTY_DOZEN_TEST_SUITE: DirtyDozenTestCase[] = [
  {
    id: 1,
    name: 'Shadow Field Injection on menuItems',
    collection: 'menuItems/item_1',
    operation: 'create',
    payload: { nameAr: 'مشويات', isAdminOverride: true },
    expectedResult: 'PERMISSION_DENIED',
  },
  {
    id: 2,
    name: 'Unverified Admin Email Spoofing on settings',
    collection: 'settings/general',
    operation: 'update',
    payload: { phone: '0000000000', email_verified: false },
    expectedResult: 'PERMISSION_DENIED',
  },
  {
    id: 3,
    name: 'PII Leakage via Unauthorized get on orders',
    collection: 'orders/ord_1001',
    operation: 'get',
    payload: { requesterUid: 'unauthorized_user_b', ownerUid: 'user_a' },
    expectedResult: 'PERMISSION_DENIED',
  },
  {
    id: 4,
    name: 'Orphaned Order Write without Atomic orderTracking Sync',
    collection: 'orders/ord_orphan',
    operation: 'create',
    payload: { orderNumber: 'HB-1001', atomicTrackingCreated: false },
    expectedResult: 'PERMISSION_DENIED',
  },
  {
    id: 5,
    name: 'ID Poisoning with oversized document ID',
    collection: 'orders/' + 'a'.repeat(200),
    operation: 'create',
    payload: { orderNumber: 'HB-1002' },
    expectedResult: 'PERMISSION_DENIED',
  },
  {
    id: 6,
    name: 'Denial-of-Wallet oversized notes string',
    collection: 'orders/ord_1003',
    operation: 'create',
    payload: { notes: 'x'.repeat(1000) },
    expectedResult: 'PERMISSION_DENIED',
  },
  {
    id: 7,
    name: 'Unbounded Array Injection in orders.items',
    collection: 'orders/ord_1004',
    operation: 'create',
    payload: { items: Array.from({ length: 30 }, (_, i) => `Item ${i}`) },
    expectedResult: 'PERMISSION_DENIED',
  },
  {
    id: 8,
    name: 'State Shortcutting on Order Creation (status=delivered)',
    collection: 'orders/ord_1005',
    operation: 'create',
    payload: { status: 'delivered' },
    expectedResult: 'PERMISSION_DENIED',
  },
  {
    id: 9,
    name: 'Self-Approved Review Creation by non-admin',
    collection: 'reviews/rev_1001',
    operation: 'create',
    payload: { authorName: 'Attacker', rating: 5, comment: 'Test', isApproved: true },
    expectedResult: 'PERMISSION_DENIED',
  },
  {
    id: 10,
    name: 'Timestamp Forgery / Backdating createdAt',
    collection: 'reservations/res_1001',
    operation: 'create',
    payload: { createdAt: '2020-01-01T00:00:00Z' },
    expectedResult: 'PERMISSION_DENIED',
  },
  {
    id: 11,
    name: 'Immortal Field Mutation on Order Update (mutating customerUid)',
    collection: 'orders/ord_1001',
    operation: 'update',
    payload: { customerUid: 'hijacked_uid' },
    expectedResult: 'PERMISSION_DENIED',
  },
  {
    id: 12,
    name: 'Self-Assigned Admin Privilege Escalation',
    collection: 'admins/attacker_uid',
    operation: 'create',
    payload: { email: 'attacker@example.com', role: 'admin' },
    expectedResult: 'PERMISSION_DENIED',
  },
];
