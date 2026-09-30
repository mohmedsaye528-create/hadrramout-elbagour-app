import React, { createContext, useContext, useEffect, useState } from 'react';
import { User, onAuthStateChanged } from 'firebase/auth';
import {
  collection,
  doc,
  onSnapshot,
  query,
  where,
  setDoc,
  updateDoc,
  deleteDoc,
  serverTimestamp,
  writeBatch,
  getDocs,
} from 'firebase/firestore';
import {
  auth,
  db,
  BOOTSTRAPPED_ADMIN_EMAIL,
  OperationType,
  handleFirestoreError,
  clampString,
  sanitizeId,
  isValidPhoneFormat,
} from '../lib/firebase';
import {
  CategoryData,
  GalleryItemData,
  INITIAL_CATEGORIES,
  INITIAL_GALLERY,
  INITIAL_MENU_ITEMS,
  INITIAL_SETTINGS,
  MenuItemData,
  OrderData,
  OrderTrackingData,
  ReservationData,
  RestaurantSettingsData,
  ReviewData,
} from '../data/initialData';

export type Language = 'ar' | 'en';

export type PageView =
  | 'home'
  | 'menu'
  | 'product-details'
  | 'cart'
  | 'checkout'
  | 'reservations'
  | 'about'
  | 'gallery'
  | 'contact'
  | 'order-tracking'
  | 'admin-login'
  | 'admin-dashboard';

export interface CartItem {
  item: MenuItemData;
  quantity: number;
  notes?: string;
}

export interface ToastMessage {
  id: string;
  text: string;
  type: 'success' | 'error' | 'info';
}

interface AppContextType {
  lang: Language;
  setLang: (lang: Language) => void;
  t: (ar: string, en: string) => string;
  currentPage: PageView;
  navigateTo: (page: PageView, options?: { categoryId?: string; productId?: string; trackingCode?: string }) => void;
  selectedCategoryId: string;
  setSelectedCategoryId: (id: string) => void;
  selectedProductId: string | null;
  setSelectedProductId: (id: string | null) => void;
  activeTrackingCode: string;
  setActiveTrackingCode: (code: string) => void;

  // Auth & Admin
  user: User | null;
  authLoading: boolean;
  isAdmin: boolean;

  // Data
  settings: RestaurantSettingsData;
  categories: CategoryData[];
  menuItems: MenuItemData[];
  galleryItems: GalleryItemData[];
  reviews: ReviewData[];
  orders: OrderData[];
  reservations: ReservationData[];
  recentOrderCodes: string[];
  dataLoading: boolean;

  // Cart
  cart: CartItem[];
  isCartDrawerOpen: boolean;
  setIsCartDrawerOpen: (open: boolean) => void;
  addToCart: (item: MenuItemData, quantity?: number, notes?: string) => void;
  updateCartQuantity: (itemId: string, quantity: number) => void;
  removeFromCart: (itemId: string) => void;
  clearCart: () => void;
  cartTotal: number;
  cartCount: number;
  hasUnpricedCartItems: boolean;

  // Customer Actions
  submitOrder: (orderInput: {
    customerName: string;
    customerPhone: string;
    customerAddress: string;
    notes: string;
    deliveryMethod: 'pickup' | 'delivery';
  }) => Promise<{ orderId: string; orderNumber: string }>;
  submitReservation: (resInput: {
    customerName: string;
    customerPhone: string;
    guests: number;
    date: string;
    time: string;
    notes: string;
  }) => Promise<{ reservationId: string; reservationNumber: string }>;
  submitReview: (revInput: {
    authorName: string;
    rating: number;
    comment: string;
  }) => Promise<void>;
  lookupOrderTracking: (codeOrId: string) => Promise<OrderTrackingData | null>;

  // Admin Actions
  seedDatabaseIfNeeded: () => Promise<void>;
  saveMenuItem: (item: Omit<MenuItemData, 'id'> & { id?: string }) => Promise<void>;
  deleteMenuItem: (id: string) => Promise<void>;
  saveCategory: (cat: Omit<CategoryData, 'id'> & { id?: string }) => Promise<void>;
  deleteCategory: (id: string) => Promise<void>;
  updateOrderStatus: (order: OrderData, newStatus: OrderData['status'], newTotal?: number) => Promise<void>;
  updateReservationStatus: (res: ReservationData, newStatus: ReservationData['status']) => Promise<void>;
  toggleReviewApproval: (review: ReviewData, isApproved: boolean) => Promise<void>;
  deleteReview: (id: string) => Promise<void>;
  saveGalleryItem: (item: Omit<GalleryItemData, 'id'> & { id?: string }) => Promise<void>;
  deleteGalleryItem: (id: string) => Promise<void>;
  saveSettings: (newSettings: RestaurantSettingsData) => Promise<void>;

  // Toasts
  toasts: ToastMessage[];
  showToast: (text: string, type?: 'success' | 'error' | 'info') => void;
  dismissToast: (id: string) => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [lang, setLangState] = useState<Language>('ar');
  const [currentPage, setCurrentPage] = useState<PageView>('home');
  const [selectedCategoryId, setSelectedCategoryId] = useState<string>('all');
  const [selectedProductId, setSelectedProductId] = useState<string | null>(null);
  const [activeTrackingCode, setActiveTrackingCode] = useState<string>('');

  const [user, setUser] = useState<User | null>(null);
  const [authLoading, setAuthLoading] = useState<boolean>(true);
  const [isAdmin, setIsAdmin] = useState<boolean>(false);

  const [settings, setSettings] = useState<RestaurantSettingsData>(INITIAL_SETTINGS);
  const [categories, setCategories] = useState<CategoryData[]>(INITIAL_CATEGORIES);
  const [menuItems, setMenuItems] = useState<MenuItemData[]>(INITIAL_MENU_ITEMS);
  const [galleryItems, setGalleryItems] = useState<GalleryItemData[]>(INITIAL_GALLERY);
  const [reviews, setReviews] = useState<ReviewData[]>([]);
  const [orders, setOrders] = useState<OrderData[]>([]);
  const [reservations, setReservations] = useState<ReservationData[]>([]);
  const [dataLoading, setDataLoading] = useState<boolean>(true);

  const [cart, setCart] = useState<CartItem[]>(() => {
    try {
      const saved = localStorage.getItem('hb_cart');
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });
  const [recentOrderCodes, setRecentOrderCodes] = useState<string[]>(() => {
    try {
      const saved = localStorage.getItem('hb_recent_orders');
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });
  const [isCartDrawerOpen, setIsCartDrawerOpen] = useState<boolean>(false);
  const [toasts, setToasts] = useState<ToastMessage[]>([]);

  const setLang = (newLang: Language) => {
    setLangState(newLang);
    document.documentElement.lang = newLang;
    document.documentElement.dir = newLang === 'ar' ? 'rtl' : 'ltr';
  };

  useEffect(() => {
    document.documentElement.lang = lang;
    document.documentElement.dir = lang === 'ar' ? 'rtl' : 'ltr';
  }, [lang]);

  useEffect(() => {
    try {
      localStorage.setItem('hb_cart', JSON.stringify(cart));
    } catch {
      // ignore storage errors
    }
  }, [cart]);

  const t = (ar: string, en: string) => (lang === 'ar' ? ar : en);

  const showToast = (text: string, type: 'success' | 'error' | 'info' = 'success') => {
    const id = `${Date.now()}_${Math.random().toString(36).slice(2, 7)}`;
    setToasts((prev) => [...prev, { id, text, type }]);
    setTimeout(() => {
      setToasts((prev) => prev.filter((item) => item.id !== id));
    }, 4000);
  };

  const dismissToast = (id: string) => {
    setToasts((prev) => prev.filter((item) => item.id !== id));
  };

  const navigateTo = (
    page: PageView,
    options?: { categoryId?: string; productId?: string; trackingCode?: string }
  ) => {
    if (options?.categoryId !== undefined) {
      setSelectedCategoryId(options.categoryId);
    }
    if (options?.productId !== undefined) {
      setSelectedProductId(options.productId);
    }
    if (options?.trackingCode !== undefined) {
      setActiveTrackingCode(options.trackingCode);
    }
    setCurrentPage(page);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Auth listener
  useEffect(() => {
    const unsub = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
      const adminMatch =
        !!currentUser &&
        currentUser.emailVerified &&
        currentUser.email?.toLowerCase() === BOOTSTRAPPED_ADMIN_EMAIL.toLowerCase();
      setIsAdmin(adminMatch);
      setAuthLoading(false);
    });
    return () => unsub();
  }, []);

  // Public & Admin Firestore Listeners
  useEffect(() => {
    setDataLoading(true);

    // 1. Settings listener
    const unsubSettings = onSnapshot(
      doc(db, 'settings', 'general'),
      (snap) => {
        if (snap.exists()) {
          const data = snap.data() as RestaurantSettingsData;
          setSettings({ ...INITIAL_SETTINGS, ...data });
        }
      },
      (err) => {
        console.warn('Settings read notice:', err);
      }
    );

    // 2. Categories listener
    const catQuery = isAdmin
      ? collection(db, 'categories')
      : query(collection(db, 'categories'), where('isVisible', '==', true));

    const unsubCategories = onSnapshot(
      catQuery,
      (snap) => {
        if (!snap.empty) {
          const list: CategoryData[] = snap.docs.map((d) => ({
            ...(d.data() as Omit<CategoryData, 'id'>),
            id: d.id,
          }));
          list.sort((a, b) => a.sortOrder - b.sortOrder);
          setCategories(list);
        } else {
          setCategories(INITIAL_CATEGORIES);
        }
      },
      (err) => {
        handleFirestoreError(err, OperationType.LIST, 'categories');
      }
    );

    // 3. Menu Items listener
    const menuQuery = isAdmin
      ? collection(db, 'menuItems')
      : query(collection(db, 'menuItems'), where('isVisible', '==', true));

    const unsubMenu = onSnapshot(
      menuQuery,
      (snap) => {
        if (!snap.empty) {
          const list: MenuItemData[] = snap.docs.map((d) => ({
            ...(d.data() as Omit<MenuItemData, 'id'>),
            id: d.id,
          }));
          list.sort((a, b) => a.sortOrder - b.sortOrder);
          setMenuItems(list);
        } else {
          setMenuItems(INITIAL_MENU_ITEMS);
        }
        setDataLoading(false);
      },
      (err) => {
        setDataLoading(false);
        handleFirestoreError(err, OperationType.LIST, 'menuItems');
      }
    );

    // 4. Gallery listener
    const galQuery = isAdmin
      ? collection(db, 'gallery')
      : query(collection(db, 'gallery'), where('isVisible', '==', true));

    const unsubGallery = onSnapshot(
      galQuery,
      (snap) => {
        if (!snap.empty) {
          const list: GalleryItemData[] = snap.docs.map((d) => ({
            ...(d.data() as Omit<GalleryItemData, 'id'>),
            id: d.id,
          }));
          list.sort((a, b) => a.sortOrder - b.sortOrder);
          setGalleryItems(list);
        } else {
          setGalleryItems(INITIAL_GALLERY);
        }
      },
      (err) => {
        handleFirestoreError(err, OperationType.LIST, 'gallery');
      }
    );

    // 5. Reviews listener
    const revQuery = isAdmin
      ? collection(db, 'reviews')
      : query(collection(db, 'reviews'), where('isApproved', '==', true));

    const unsubReviews = onSnapshot(
      revQuery,
      (snap) => {
        const list: ReviewData[] = snap.docs.map((d) => ({
          ...(d.data() as Omit<ReviewData, 'id'>),
          id: d.id,
        }));
        setReviews(list);
      },
      (err) => {
        handleFirestoreError(err, OperationType.LIST, 'reviews');
      }
    );

    return () => {
      unsubSettings();
      unsubCategories();
      unsubMenu();
      unsubGallery();
      unsubReviews();
    };
  }, [isAdmin]);

  // Admin-only listeners for Orders & Reservations
  useEffect(() => {
    if (!isAdmin) {
      setOrders([]);
      setReservations([]);
      return;
    }

    const unsubOrders = onSnapshot(
      collection(db, 'orders'),
      (snap) => {
        const list: OrderData[] = snap.docs.map((d) => ({
          ...(d.data() as Omit<OrderData, 'id'>),
          id: d.id,
        }));
        list.sort((a, b) => {
          const tA = a.createdAt?.toMillis?.() || 0;
          const tB = b.createdAt?.toMillis?.() || 0;
          return tB - tA;
        });
        setOrders(list);
      },
      (err) => {
        handleFirestoreError(err, OperationType.LIST, 'orders');
      }
    );

    const unsubReservations = onSnapshot(
      collection(db, 'reservations'),
      (snap) => {
        const list: ReservationData[] = snap.docs.map((d) => ({
          ...(d.data() as Omit<ReservationData, 'id'>),
          id: d.id,
        }));
        list.sort((a, b) => {
          const tA = a.createdAt?.toMillis?.() || 0;
          const tB = b.createdAt?.toMillis?.() || 0;
          return tB - tA;
        });
        setReservations(list);
      },
      (err) => {
        handleFirestoreError(err, OperationType.LIST, 'reservations');
      }
    );

    return () => {
      unsubOrders();
      unsubReservations();
    };
  }, [isAdmin]);

  // Cart Functions
  const addToCart = (item: MenuItemData, quantity = 1, notes = '') => {
    setCart((prev) => {
      const existingIndex = prev.findIndex((c) => c.item.id === item.id);
      if (existingIndex > -1) {
        const updated = [...prev];
        updated[existingIndex] = {
          ...updated[existingIndex],
          quantity: Math.min(updated[existingIndex].quantity + quantity, 50),
          notes: notes || updated[existingIndex].notes,
        };
        return updated;
      }
      return [...prev, { item, quantity: Math.min(quantity, 50), notes }];
    });
    showToast(
      lang === 'ar'
        ? `تمت إضافة "${item.nameAr}" إلى سلة الطلبات`
        : `Added "${item.nameEn}" to your order`,
      'success'
    );
  };

  const updateCartQuantity = (itemId: string, quantity: number) => {
    if (quantity <= 0) {
      removeFromCart(itemId);
      return;
    }
    setCart((prev) =>
      prev.map((c) => (c.item.id === itemId ? { ...c, quantity: Math.min(quantity, 50) } : c))
    );
  };

  const removeFromCart = (itemId: string) => {
    setCart((prev) => prev.filter((c) => c.item.id !== itemId));
  };

  const clearCart = () => {
    setCart([]);
  };

  const cartTotal = cart.reduce((sum, c) => sum + (c.item.price > 0 ? c.item.price * c.quantity : 0), 0);
  const cartCount = cart.reduce((sum, c) => sum + c.quantity, 0);
  const hasUnpricedCartItems = cart.some((c) => !c.item.price || c.item.price <= 0);

  // Customer Order Submission (Atomic Batch write to `orders` and `orderTracking`)
  const submitOrder = async (orderInput: {
    customerName: string;
    customerPhone: string;
    customerAddress: string;
    notes: string;
    deliveryMethod: 'pickup' | 'delivery';
  }) => {
    if (cart.length === 0) {
      throw new Error(t('سلة الطلبات فارغة', 'Your cart is empty'));
    }
    if (!isValidPhoneFormat(orderInput.customerPhone)) {
      throw new Error(t('يرجى إدخال رقم هاتف صحيح', 'Please enter a valid phone number'));
    }

    const orderNumber = `HB-${Math.floor(100000 + Math.random() * 900000)}`;
    const orderId = sanitizeId(orderNumber);

    const formattedItems = cart.slice(0, 25).map((c) => {
      const pricePart = c.item.price > 0 ? `${c.item.price * c.quantity} EGP` : 'سعر حسب الاختيار';
      const notePart = c.notes ? ` (${c.notes.slice(0, 60)})` : '';
      return clampString(`${c.quantity}x ${c.item.nameAr} - ${pricePart}${notePart}`, 1, 300);
    });

    const itemsSummaryAr = clampString(
      cart.map((c) => `${c.quantity}× ${c.item.nameAr}`).join(' ، '),
      1,
      600
    );
    const itemsSummaryEn = clampString(
      cart.map((c) => `${c.quantity}x ${c.item.nameEn}`).join(', '),
      1,
      600
    );

    const customerUid = user && user.emailVerified ? user.uid : 'guest';
    const addressText =
      orderInput.deliveryMethod === 'pickup' && !orderInput.customerAddress.trim()
        ? 'استلام من مقر المطعم - الباجور'
        : clampString(orderInput.customerAddress, 2, 300, 'مدينة الباجور');

    const orderPayload = {
      orderNumber,
      customerName: clampString(orderInput.customerName, 2, 100),
      customerPhone: orderInput.customerPhone.trim().slice(0, 20),
      customerAddress: addressText,
      notes: (orderInput.notes || '').trim().slice(0, 500),
      deliveryMethod: orderInput.deliveryMethod,
      paymentMethod: 'cod' as const,
      items: formattedItems,
      totalAmount: Math.max(0, Math.round(cartTotal)),
      hasUnpricedItems: hasUnpricedCartItems,
      status: 'new' as const,
      customerUid,
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp(),
    };

    const trackingPayload = {
      orderNumber,
      status: 'new' as const,
      deliveryMethod: orderInput.deliveryMethod,
      totalAmount: Math.max(0, Math.round(cartTotal)),
      hasUnpricedItems: hasUnpricedCartItems,
      itemCount: Math.max(1, Math.min(200, cartCount)),
      itemsSummaryAr,
      itemsSummaryEn,
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp(),
    };

    try {
      const batch = writeBatch(db);
      batch.set(doc(db, 'orders', orderId), orderPayload);
      batch.set(doc(db, 'orderTracking', orderId), trackingPayload);
      await batch.commit();

      const updatedCodes = [orderNumber, ...recentOrderCodes.filter((c) => c !== orderNumber)].slice(0, 10);
      setRecentOrderCodes(updatedCodes);
      try {
        localStorage.setItem('hb_recent_orders', JSON.stringify(updatedCodes));
      } catch {
        // ignore
      }
      setActiveTrackingCode(orderNumber);
      showToast(
        t(`تم تسجيل طلبك بنجاح برقم ${orderNumber}`, `Order ${orderNumber} placed successfully!`),
        'success'
      );
      return { orderId, orderNumber };
    } catch (err) {
      handleFirestoreError(err, OperationType.WRITE, `orders/${orderId}`);
    }
  };

  // Customer Table Reservation Submission
  const submitReservation = async (resInput: {
    customerName: string;
    customerPhone: string;
    guests: number;
    date: string;
    time: string;
    notes: string;
  }) => {
    if (!isValidPhoneFormat(resInput.customerPhone)) {
      throw new Error(t('يرجى إدخال رقم هاتف صحيح', 'Please enter a valid phone number'));
    }
    const reservationNumber = `RES-${Math.floor(100000 + Math.random() * 900000)}`;
    const reservationId = sanitizeId(reservationNumber);
    const customerUid = user && user.emailVerified ? user.uid : 'guest';

    const payload = {
      reservationNumber,
      customerName: clampString(resInput.customerName, 2, 100),
      customerPhone: resInput.customerPhone.trim().slice(0, 20),
      guests: Math.max(1, Math.min(150, Math.round(Number(resInput.guests) || 2))),
      date: resInput.date.trim().slice(0, 20),
      time: clampString(resInput.time, 3, 20, '08:00 PM'),
      notes: (resInput.notes || '').trim().slice(0, 500),
      status: 'new' as const,
      customerUid,
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp(),
    };

    try {
      await setDoc(doc(db, 'reservations', reservationId), payload);
      showToast(
        t(
          'تم استلام طلب الحجز، وسيتم التواصل معك لتأكيد الحجز.',
          'Reservation request received. We will contact you shortly to confirm.'
        ),
        'success'
      );
      return { reservationId, reservationNumber };
    } catch (err) {
      handleFirestoreError(err, OperationType.CREATE, `reservations/${reservationId}`);
    }
  };

  // Customer Review Submission
  const submitReview = async (revInput: {
    authorName: string;
    rating: number;
    comment: string;
  }) => {
    const reviewId = sanitizeId(`rev_${Date.now()}_${Math.floor(Math.random() * 1000)}`);
    const authorUid = user && user.emailVerified ? user.uid : 'guest';
    const payload = {
      authorName: clampString(revInput.authorName, 2, 80),
      rating: Math.max(1, Math.min(5, Math.round(revInput.rating))),
      comment: clampString(revInput.comment, 2, 600),
      isApproved: isAdmin ? true : false,
      authorUid,
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp(),
    };

    try {
      await setDoc(doc(db, 'reviews', reviewId), payload);
      showToast(
        t(
          'شكرًا لتقييمك! تم إرسال رأيك للمراجعة من إدارة المطعم.',
          'Thank you! Your review has been submitted for moderation.'
        ),
        'success'
      );
    } catch (err) {
      handleFirestoreError(err, OperationType.CREATE, `reviews/${reviewId}`);
    }
  };

  // Order Tracking Lookup
  const lookupOrderTracking = async (codeOrId: string): Promise<OrderTrackingData | null> => {
    const cleaned = sanitizeId(codeOrId.toUpperCase());
    try {
      const q = query(collection(db, 'orderTracking'), where('orderNumber', '==', cleaned));
      const snap = await getDocs(q);
      if (!snap.empty) {
        const d = snap.docs[0];
        return { ...(d.data() as Omit<OrderTrackingData, 'id'>), id: d.id };
      }
      return null;
    } catch (err) {
      handleFirestoreError(err, OperationType.GET, `orderTracking/${cleaned}`);
    }
  };

  // Admin: Seed initial authentic data to Firestore if empty
  const seedDatabaseIfNeeded = async () => {
    if (!isAdmin) return;
    try {
      const batch = writeBatch(db);
      for (const cat of INITIAL_CATEGORIES) {
        const { id, ...rest } = cat;
        batch.set(doc(db, 'categories', sanitizeId(id)), {
          ...rest,
          createdAt: serverTimestamp(),
          updatedAt: serverTimestamp(),
        });
      }
      for (const item of INITIAL_MENU_ITEMS) {
        const { id, ...rest } = item;
        batch.set(doc(db, 'menuItems', sanitizeId(id)), {
          ...rest,
          createdAt: serverTimestamp(),
          updatedAt: serverTimestamp(),
        });
      }
      for (const gal of INITIAL_GALLERY) {
        const { id, ...rest } = gal;
        batch.set(doc(db, 'gallery', sanitizeId(id)), {
          ...rest,
          createdAt: serverTimestamp(),
          updatedAt: serverTimestamp(),
        });
      }
      batch.set(doc(db, 'settings', 'general'), {
        ...INITIAL_SETTINGS,
        updatedAt: serverTimestamp(),
      });
      await batch.commit();
      showToast(
        t('تمت مزامنة البيانات الأساسية في قاعدة البيانات بنجاح', 'Baseline database synchronized successfully'),
        'success'
      );
    } catch (err) {
      handleFirestoreError(err, OperationType.WRITE, 'seedDatabase');
    }
  };

  // Admin: Save Menu Item
  const saveMenuItem = async (item: Omit<MenuItemData, 'id'> & { id?: string }) => {
    const isExisting = item.id && menuItems.some((m) => m.id === item.id);
    const docId = sanitizeId(item.id || `item_${Date.now()}`);

    const cleanData = {
      nameAr: clampString(item.nameAr, 1, 120),
      nameEn: clampString(item.nameEn || item.nameAr, 1, 120),
      descriptionAr: clampString(item.descriptionAr, 1, 600),
      descriptionEn: clampString(item.descriptionEn || item.descriptionAr, 1, 600),
      categoryId: sanitizeId(item.categoryId).slice(0, 64),
      price: Math.max(0, Math.min(1000000, Number(item.price) || 0)),
      imageUrl: clampString(item.imageUrl, 1, 500),
      isVisible: Boolean(item.isVisible),
      isFeatured: Boolean(item.isFeatured),
      isPopular: Boolean(item.isPopular),
      isNew: Boolean(item.isNew),
      isSpecialOffer: Boolean(item.isSpecialOffer),
      sortOrder: Math.max(0, Math.min(10000, Number(item.sortOrder) || 1)),
      updatedAt: serverTimestamp(),
    };

    try {
      if (isExisting) {
        try {
          await updateDoc(doc(db, 'menuItems', docId), cleanData);
        } catch {
          await setDoc(doc(db, 'menuItems', docId), {
            ...cleanData,
            createdAt: serverTimestamp(),
          });
        }
      } else {
        await setDoc(doc(db, 'menuItems', docId), {
          ...cleanData,
          createdAt: serverTimestamp(),
        });
      }
      showToast(t('تم حفظ الصنف بنجاح', 'Menu item saved successfully'), 'success');
    } catch (err) {
      handleFirestoreError(err, OperationType.WRITE, `menuItems/${docId}`);
    }
  };

  const deleteMenuItem = async (id: string) => {
    try {
      await deleteDoc(doc(db, 'menuItems', sanitizeId(id)));
      showToast(t('تم حذف الصنف', 'Menu item deleted'), 'info');
    } catch (err) {
      handleFirestoreError(err, OperationType.DELETE, `menuItems/${id}`);
    }
  };

  const saveCategory = async (cat: Omit<CategoryData, 'id'> & { id?: string }) => {
    const isExisting = cat.id && categories.some((c) => c.id === cat.id);
    const docId = sanitizeId(cat.id || `cat_${Date.now()}`);
    const cleanData = {
      nameAr: clampString(cat.nameAr, 1, 80),
      nameEn: clampString(cat.nameEn || cat.nameAr, 1, 80),
      descriptionAr: clampString(cat.descriptionAr, 1, 300),
      descriptionEn: clampString(cat.descriptionEn || cat.descriptionAr, 1, 300),
      imageUrl: clampString(cat.imageUrl, 1, 500),
      iconName: clampString(cat.iconName || 'UtensilsCrossed', 1, 40),
      sortOrder: Math.max(0, Math.min(10000, Number(cat.sortOrder) || 1)),
      isVisible: Boolean(cat.isVisible),
      updatedAt: serverTimestamp(),
    };

    try {
      if (isExisting) {
        try {
          await updateDoc(doc(db, 'categories', docId), cleanData);
        } catch {
          await setDoc(doc(db, 'categories', docId), {
            ...cleanData,
            createdAt: serverTimestamp(),
          });
        }
      } else {
        await setDoc(doc(db, 'categories', docId), {
          ...cleanData,
          createdAt: serverTimestamp(),
        });
      }
      showToast(t('تم حفظ القسم بنجاح', 'Category saved successfully'), 'success');
    } catch (err) {
      handleFirestoreError(err, OperationType.WRITE, `categories/${docId}`);
    }
  };

  const deleteCategory = async (id: string) => {
    try {
      await deleteDoc(doc(db, 'categories', sanitizeId(id)));
      showToast(t('تم حذف القسم', 'Category deleted'), 'info');
    } catch (err) {
      handleFirestoreError(err, OperationType.DELETE, `categories/${id}`);
    }
  };

  const updateOrderStatus = async (
    order: OrderData,
    newStatus: OrderData['status'],
    newTotal?: number
  ) => {
    const docId = sanitizeId(order.id);
    try {
      const batch = writeBatch(db);
      if (newTotal !== undefined && newTotal !== order.totalAmount) {
        batch.update(doc(db, 'orders', docId), {
          status: newStatus,
          totalAmount: Math.max(0, Math.round(newTotal)),
          hasUnpricedItems: false,
          notes: order.notes || '',
          updatedAt: serverTimestamp(),
        });
        batch.update(doc(db, 'orderTracking', docId), {
          status: newStatus,
          totalAmount: Math.max(0, Math.round(newTotal)),
          hasUnpricedItems: false,
          updatedAt: serverTimestamp(),
        });
      } else {
        batch.update(doc(db, 'orders', docId), {
          status: newStatus,
          updatedAt: serverTimestamp(),
        });
        batch.update(doc(db, 'orderTracking', docId), {
          status: newStatus,
          updatedAt: serverTimestamp(),
        });
      }
      await batch.commit();
      showToast(t('تم تحديث حالة الطلب', 'Order status updated'), 'success');
    } catch (err) {
      handleFirestoreError(err, OperationType.UPDATE, `orders/${docId}`);
    }
  };

  const updateReservationStatus = async (
    res: ReservationData,
    newStatus: ReservationData['status']
  ) => {
    const docId = sanitizeId(res.id);
    try {
      await updateDoc(doc(db, 'reservations', docId), {
        status: newStatus,
        updatedAt: serverTimestamp(),
      });
      showToast(t('تم تحديث حالة الحجز', 'Reservation status updated'), 'success');
    } catch (err) {
      handleFirestoreError(err, OperationType.UPDATE, `reservations/${docId}`);
    }
  };

  const toggleReviewApproval = async (review: ReviewData, isApproved: boolean) => {
    const docId = sanitizeId(review.id);
    try {
      await updateDoc(doc(db, 'reviews', docId), {
        isApproved,
        updatedAt: serverTimestamp(),
      });
      showToast(
        isApproved ? t('تم اعتماد التقييم للعرض', 'Review approved') : t('تم إخفاء التقييم', 'Review hidden'),
        'success'
      );
    } catch (err) {
      handleFirestoreError(err, OperationType.UPDATE, `reviews/${docId}`);
    }
  };

  const deleteReview = async (id: string) => {
    try {
      await deleteDoc(doc(db, 'reviews', sanitizeId(id)));
      showToast(t('تم حذف التقييم', 'Review deleted'), 'info');
    } catch (err) {
      handleFirestoreError(err, OperationType.DELETE, `reviews/${id}`);
    }
  };

  const saveGalleryItem = async (item: Omit<GalleryItemData, 'id'> & { id?: string }) => {
    const isExisting = item.id && galleryItems.some((g) => g.id === item.id);
    const docId = sanitizeId(item.id || `gal_${Date.now()}`);
    const cleanData = {
      titleAr: clampString(item.titleAr, 1, 120),
      titleEn: clampString(item.titleEn || item.titleAr, 1, 120),
      category: item.category,
      imageUrl: clampString(item.imageUrl, 1, 500),
      isPlaceholder: Boolean(item.isPlaceholder),
      isVisible: Boolean(item.isVisible),
      sortOrder: Math.max(0, Math.min(10000, Number(item.sortOrder) || 1)),
      updatedAt: serverTimestamp(),
    };

    try {
      if (isExisting) {
        try {
          await updateDoc(doc(db, 'gallery', docId), cleanData);
        } catch {
          await setDoc(doc(db, 'gallery', docId), {
            ...cleanData,
            createdAt: serverTimestamp(),
          });
        }
      } else {
        await setDoc(doc(db, 'gallery', docId), {
          ...cleanData,
          createdAt: serverTimestamp(),
        });
      }
      showToast(t('تم حفظ الصورة في المعرض', 'Gallery image saved'), 'success');
    } catch (err) {
      handleFirestoreError(err, OperationType.WRITE, `gallery/${docId}`);
    }
  };

  const deleteGalleryItem = async (id: string) => {
    try {
      await deleteDoc(doc(db, 'gallery', sanitizeId(id)));
      showToast(t('تم حذف الصورة من المعرض', 'Gallery image deleted'), 'info');
    } catch (err) {
      handleFirestoreError(err, OperationType.DELETE, `gallery/${id}`);
    }
  };

  const saveSettings = async (newSettings: RestaurantSettingsData) => {
    const cleanData = {
      heroTitleAr: clampString(newSettings.heroTitleAr, 1, 150),
      heroTitleEn: clampString(newSettings.heroTitleEn, 1, 150),
      heroSubtitleAr: clampString(newSettings.heroSubtitleAr, 1, 200),
      heroSubtitleEn: clampString(newSettings.heroSubtitleEn, 1, 200),
      heroDescAr: clampString(newSettings.heroDescAr, 1, 500),
      heroDescEn: clampString(newSettings.heroDescEn, 1, 500),
      aboutTextAr: clampString(newSettings.aboutTextAr, 1, 1500),
      aboutTextEn: clampString(newSettings.aboutTextEn, 1, 1500),
      banquetTextAr: clampString(newSettings.banquetTextAr, 1, 1000),
      banquetTextEn: clampString(newSettings.banquetTextEn, 1, 1000),
      phone: clampString(newSettings.phone, 5, 30),
      whatsapp: clampString(newSettings.whatsapp, 5, 30),
      addressAr: clampString(newSettings.addressAr, 5, 300),
      addressEn: clampString(newSettings.addressEn, 5, 300),
      priceRangeNoteAr: clampString(newSettings.priceRangeNoteAr, 1, 200),
      priceRangeNoteEn: clampString(newSettings.priceRangeNoteEn, 1, 200),
      facebookUrl: (newSettings.facebookUrl || '').trim().slice(0, 300),
      instagramUrl: (newSettings.instagramUrl || '').trim().slice(0, 300),
      updatedAt: serverTimestamp(),
    };

    try {
      await setDoc(doc(db, 'settings', 'general'), cleanData);
      showToast(t('تم تحديث إعدادات ومحتوى الموقع بنجاح', 'Site settings updated successfully'), 'success');
    } catch (err) {
      handleFirestoreError(err, OperationType.WRITE, 'settings/general');
    }
  };

  return (
    <AppContext.Provider
      value={{
        lang,
        setLang,
        t,
        currentPage,
        navigateTo,
        selectedCategoryId,
        setSelectedCategoryId,
        selectedProductId,
        setSelectedProductId,
        activeTrackingCode,
        setActiveTrackingCode,
        user,
        authLoading,
        isAdmin,
        settings,
        categories,
        menuItems,
        galleryItems,
        reviews,
        orders,
        reservations,
        recentOrderCodes,
        dataLoading,
        cart,
        isCartDrawerOpen,
        setIsCartDrawerOpen,
        addToCart,
        updateCartQuantity,
        removeFromCart,
        clearCart,
        cartTotal,
        cartCount,
        hasUnpricedCartItems,
        submitOrder,
        submitReservation,
        submitReview,
        lookupOrderTracking,
        seedDatabaseIfNeeded,
        saveMenuItem,
        deleteMenuItem,
        saveCategory,
        deleteCategory,
        updateOrderStatus,
        updateReservationStatus,
        toggleReviewApproval,
        deleteReview,
        saveGalleryItem,
        deleteGalleryItem,
        saveSettings,
        toasts,
        showToast,
        dismissToast,
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const ctx = useContext(AppContext);
  if (!ctx) throw new Error('useApp must be used within AppProvider');
  return ctx;
};
