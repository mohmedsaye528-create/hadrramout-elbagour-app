import React, { useState } from 'react';
import {
  ShieldCheck,
  LogOut,
  Plus,
  Trash2,
  Edit3,
  CheckCircle2,
  Eye,
  EyeOff,
  Database,
  UtensilsCrossed,
  ShoppingBag,
  Calendar,
  Star,
  Image as ImageIcon,
  Settings,
  MessageCircle,
  Phone,
  Save,
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import { signInWithGoogle, signOutUser, BOOTSTRAPPED_ADMIN_EMAIL } from '../lib/firebase';
import {
  GENERATED_IMAGES,
  MenuItemData,
  GalleryItemData,
  OrderData,
  ReservationData,
} from '../data/initialData';
import { ResilientImage } from '../components/ResilientImage';

export const AdminLoginPage: React.FC = () => {
  const { lang, t, user, isAdmin, navigateTo, showToast } = useApp();
  const [signingIn, setSigningIn] = useState(false);

  const handleLogin = async () => {
    setSigningIn(true);
    try {
      await signInWithGoogle();
      showToast(t('تم تسجيل الدخول بنجاح', 'Signed in successfully'), 'success');
      navigateTo('admin-dashboard');
    } catch (err: any) {
      showToast(err?.message || t('تعذر تسجيل الدخول', 'Sign-in failed'), 'error');
    } finally {
      setSigningIn(false);
    }
  };

  if (isAdmin) {
    return <AdminDashboardPage />;
  }

  return (
    <div className="max-w-md mx-auto px-4 py-16">
      <div className="bg-[#1C1714] border border-[#D4AF37]/25 rounded-3xl p-8 text-center space-y-6">
        <div className="w-14 h-14 rounded-2xl bg-[#120F0D] border border-[#D4AF37]/30 flex items-center justify-center mx-auto text-[#D4AF37]">
          <ShieldCheck className="w-7 h-7" />
        </div>

        <div className="space-y-2">
          <h1
            className={`text-2xl sm:text-3xl font-bold text-[#F5EFE6] ${
              lang === 'ar' ? 'font-display-ar' : 'font-display-en'
            }`}
          >
            {t('لوحة تحكم مطعم حضرموت الباجور', 'Hadramout El-Bagour Admin')}
          </h1>
          <p className="text-xs sm:text-sm text-[#A69B8D]">
            {t(
              'يرجى تسجيل الدخول بحساب المسؤول المعتمد لإدارة المنيو، الأسعار، الطلبات، الحجوزات، ومحتوى الموقع.',
              'Sign in with the authorized administrator Google account to manage the menu, prices, orders, and reservations.'
            )}
          </p>
        </div>

        {user && !isAdmin && (
          <div className="p-4 rounded-xl bg-red-950/50 border border-red-500/40 text-xs text-red-200 space-y-2">
            <p>
              {t(
                `الحساب الحالي (${user.email}) غير مصرح له بصلاحيات المسؤول.`,
                `Current account (${user.email}) is not authorized as an administrator.`
              )}
            </p>
            <p className="font-mono-num text-[11px] text-red-300">
              {t('البريد المعتمد:', 'Authorized Admin:')} {BOOTSTRAPPED_ADMIN_EMAIL}
            </p>
            <button
              type="button"
              onClick={() => signOutUser()}
              className="underline font-semibold cursor-pointer"
            >
              {t('تسجيل الخروج وتبديل الحساب', 'Sign out and switch account')}
            </button>
          </div>
        )}

        <button
          type="button"
          onClick={handleLogin}
          disabled={signingIn}
          className="w-full py-3.5 px-6 text-sm font-bold text-[#120F0D] bg-[#D4AF37] hover:bg-[#E5C349] rounded-xl transition-colors disabled:opacity-50 cursor-pointer"
        >
          {signingIn
            ? t('جاري التحقق...', 'Signing in...')
            : t('تسجيل الدخول عبر Google', 'Sign in with Google')}
        </button>
      </div>
    </div>
  );
};

export const AdminDashboardPage: React.FC = () => {
  const {
    lang,
    t,
    user,
    isAdmin,
    navigateTo,
    categories,
    menuItems,
    orders,
    reservations,
    reviews,
    galleryItems,
    settings,
    seedDatabaseIfNeeded,
    saveMenuItem,
    deleteMenuItem,
    updateOrderStatus,
    updateReservationStatus,
    toggleReviewApproval,
    deleteReview,
    saveGalleryItem,
    deleteGalleryItem,
    saveSettings,
  } = useApp();

  const [activeTab, setActiveTab] = useState<
    'menu' | 'orders' | 'reservations' | 'reviews-gallery' | 'settings'
  >('menu');

  // Menu Item Form Modal/Panel State
  const [editingItem, setEditingItem] = useState<
    (Omit<MenuItemData, 'id'> & { id?: string }) | null
  >(null);
  const [quickPrices, setQuickPrices] = useState<Record<string, string>>({});

  // Gallery Form State
  const [newGalleryTitleAr, setNewGalleryTitleAr] = useState('');
  const [newGalleryTitleEn, setNewGalleryTitleEn] = useState('');
  const [newGalleryCategory, setNewGalleryCategory] =
    useState<GalleryItemData['category']>('dishes');
  const [newGalleryUrl, setNewGalleryUrl] = useState(GENERATED_IMAGES.heroFeast);
  const [newGalleryIsPlaceholder, setNewGalleryIsPlaceholder] = useState(false);

  // Settings Form State
  const [settingsForm, setSettingsForm] = useState(settings);

  if (!isAdmin) {
    return <AdminLoginPage />;
  }

  const handleQuickPriceSave = async (item: MenuItemData) => {
    const rawVal = quickPrices[item.id];
    if (rawVal === undefined) return;
    const numPrice = Math.max(0, Number(rawVal) || 0);
    await saveMenuItem({ ...item, price: numPrice });
  };

  const handleSaveMenuForm = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingItem) return;
    await saveMenuItem(editingItem);
    setEditingItem(null);
  };

  const handleAddGallery = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newGalleryTitleAr.trim() || !newGalleryUrl.trim()) return;
    await saveGalleryItem({
      titleAr: newGalleryTitleAr,
      titleEn: newGalleryTitleEn || newGalleryTitleAr,
      category: newGalleryCategory,
      imageUrl: newGalleryUrl,
      isPlaceholder: newGalleryIsPlaceholder,
      isVisible: true,
      sortOrder: galleryItems.length + 1,
    });
    setNewGalleryTitleAr('');
    setNewGalleryTitleEn('');
  };

  const handleSaveSettingsForm = async (e: React.FormEvent) => {
    e.preventDefault();
    await saveSettings(settingsForm);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12 space-y-8">
      {/* Admin Top Header */}
      <div className="bg-[#1C1714] border border-[#D4AF37]/25 rounded-3xl p-6 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="space-y-1">
          <div className="flex items-center gap-2 text-xs text-[#D4AF37]">
            <ShieldCheck className="w-4 h-4" />
            <span>{t('لوحة الإدارة المعتمدة', 'Authorized Admin Dashboard')}</span>
            <span aria-hidden="true">·</span>
            <span className="font-mono-num">{user?.email}</span>
          </div>
          <h1
            className={`text-2xl sm:text-3xl font-bold text-[#F5EFE6] ${
              lang === 'ar' ? 'font-display-ar' : 'font-display-en'
            }`}
          >
            {t('إدارة مطعم حضرموت الباجور', 'Hadramout El-Bagour Management')}
          </h1>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          <button
            type="button"
            onClick={seedDatabaseIfNeeded}
            className="inline-flex items-center gap-2 px-4 py-2 text-xs font-semibold text-[#D4AF37] bg-[#120F0D] hover:bg-[#251E1A] border border-[#D4AF37]/30 rounded-xl transition-colors cursor-pointer"
          >
            <Database className="w-3.5 h-3.5" />
            <span>{t('مزامنة البيانات الأساسية', 'Sync Baseline Data')}</span>
          </button>

          <button
            type="button"
            onClick={async () => {
              await signOutUser();
              navigateTo('home');
            }}
            className="inline-flex items-center gap-1.5 px-4 py-2 text-xs font-semibold text-red-300 bg-red-950/40 hover:bg-red-900/50 border border-red-500/30 rounded-xl transition-colors cursor-pointer"
          >
            <LogOut className="w-3.5 h-3.5" />
            <span>{t('تسجيل الخروج', 'Sign Out')}</span>
          </button>
        </div>
      </div>

      {/* Navigation Tabs */}
      <div className="flex items-center gap-2 overflow-x-auto pb-2">
        <button
          type="button"
          onClick={() => setActiveTab('menu')}
          className={`inline-flex items-center gap-2 px-4 py-2.5 text-xs sm:text-sm font-bold rounded-xl whitespace-nowrap cursor-pointer ${
            activeTab === 'menu'
              ? 'bg-[#D4AF37] text-[#120F0D]'
              : 'bg-[#1C1714] text-[#F5EFE6]/80 border border-[#D4AF37]/15'
          }`}
        >
          <UtensilsCrossed className="w-4 h-4" />
          <span>{t('إدارة المنيو والأسعار', 'Menu & Prices')}</span>
          <span className="font-mono-num text-xs">({menuItems.length})</span>
        </button>

        <button
          type="button"
          onClick={() => setActiveTab('orders')}
          className={`inline-flex items-center gap-2 px-4 py-2.5 text-xs sm:text-sm font-bold rounded-xl whitespace-nowrap cursor-pointer ${
            activeTab === 'orders'
              ? 'bg-[#D4AF37] text-[#120F0D]'
              : 'bg-[#1C1714] text-[#F5EFE6]/80 border border-[#D4AF37]/15'
          }`}
        >
          <ShoppingBag className="w-4 h-4" />
          <span>{t('الطلبات', 'Orders')}</span>
          <span className="font-mono-num text-xs">({orders.length})</span>
        </button>

        <button
          type="button"
          onClick={() => setActiveTab('reservations')}
          className={`inline-flex items-center gap-2 px-4 py-2.5 text-xs sm:text-sm font-bold rounded-xl whitespace-nowrap cursor-pointer ${
            activeTab === 'reservations'
              ? 'bg-[#D4AF37] text-[#120F0D]'
              : 'bg-[#1C1714] text-[#F5EFE6]/80 border border-[#D4AF37]/15'
          }`}
        >
          <Calendar className="w-4 h-4" />
          <span>{t('الحجوزات', 'Reservations')}</span>
          <span className="font-mono-num text-xs">({reservations.length})</span>
        </button>

        <button
          type="button"
          onClick={() => setActiveTab('reviews-gallery')}
          className={`inline-flex items-center gap-2 px-4 py-2.5 text-xs sm:text-sm font-bold rounded-xl whitespace-nowrap cursor-pointer ${
            activeTab === 'reviews-gallery'
              ? 'bg-[#D4AF37] text-[#120F0D]'
              : 'bg-[#1C1714] text-[#F5EFE6]/80 border border-[#D4AF37]/15'
          }`}
        >
          <ImageIcon className="w-4 h-4" />
          <span>{t('التقييمات والمعرض', 'Reviews & Gallery')}</span>
        </button>

        <button
          type="button"
          onClick={() => {
            setSettingsForm(settings);
            setActiveTab('settings');
          }}
          className={`inline-flex items-center gap-2 px-4 py-2.5 text-xs sm:text-sm font-bold rounded-xl whitespace-nowrap cursor-pointer ${
            activeTab === 'settings'
              ? 'bg-[#D4AF37] text-[#120F0D]'
              : 'bg-[#1C1714] text-[#F5EFE6]/80 border border-[#D4AF37]/15'
          }`}
        >
          <Settings className="w-4 h-4" />
          <span>{t('إدارة المحتوى والبيانات', 'Site Content & Settings')}</span>
        </button>
      </div>

      {/* TAB 1: MENU MANAGEMENT */}
      {activeTab === 'menu' && (
        <div className="space-y-6">
          <div className="flex flex-wrap items-center justify-between gap-4">
            <div>
              <h2 className="text-xl font-bold text-[#F5EFE6]">
                {t('أصناف المنيو والأسعار', 'Menu Items & Pricing')}
              </h2>
              <p className="text-xs text-[#A69B8D]">
                {t(
                  'أضف أصنافًا جديدة، عدّل الأسعار مباشرة، أو حدد علامات (الأكثر طلبًا / جديد / عرض خاص). السعر 0 يعني "يحدد عند الطلب".',
                  'Add new dishes, update prices inline, or toggle Popular/New/Special Offer badges. Price 0 means "Price upon request".'
                )}
              </p>
            </div>

            <button
              type="button"
              onClick={() =>
                setEditingItem({
                  nameAr: '',
                  nameEn: '',
                  descriptionAr: '',
                  descriptionEn: '',
                  categoryId: categories[0]?.id || 'grills',
                  price: 0,
                  imageUrl: GENERATED_IMAGES.mixedGrills,
                  isVisible: true,
                  isFeatured: false,
                  isPopular: false,
                  isNew: false,
                  isSpecialOffer: false,
                  sortOrder: menuItems.length + 1,
                })
              }
              className="inline-flex items-center gap-2 px-5 py-2.5 text-xs sm:text-sm font-bold text-[#120F0D] bg-[#D4AF37] hover:bg-[#E5C349] rounded-xl cursor-pointer"
            >
              <Plus className="w-4 h-4" />
              <span>{t('إضافة صنف جديد للمنيو', 'Add New Dish')}</span>
            </button>
          </div>

          {/* Add / Edit Item Form */}
          {editingItem && (
            <form
              onSubmit={handleSaveMenuForm}
              className="bg-[#1C1714] border border-[#D4AF37]/30 rounded-3xl p-6 space-y-5"
            >
              <h3 className="text-lg font-bold text-[#D4AF37]">
                {editingItem.id
                  ? t('تعديل بيانات الصنف', 'Edit Dish')
                  : t('إضافة صنف جديد', 'Add New Dish')}
              </h3>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                <div>
                  <label className="block text-xs text-[#A69B8D] mb-1">
                    {t('اسم الطبق (عربي) *', 'Dish Name (Arabic) *')}
                  </label>
                  <input
                    type="text"
                    required
                    maxLength={120}
                    value={editingItem.nameAr}
                    onChange={(e) => setEditingItem({ ...editingItem, nameAr: e.target.value })}
                    className="w-full px-3.5 py-2 text-sm bg-[#120F0D] border border-[#D4AF37]/20 rounded-xl text-[#F5EFE6]"
                  />
                </div>

                <div>
                  <label className="block text-xs text-[#A69B8D] mb-1">
                    {t('اسم الطبق (إنجليزي)', 'Dish Name (English)')}
                  </label>
                  <input
                    type="text"
                    maxLength={120}
                    value={editingItem.nameEn}
                    onChange={(e) => setEditingItem({ ...editingItem, nameEn: e.target.value })}
                    placeholder={editingItem.nameAr}
                    className="w-full px-3.5 py-2 text-sm bg-[#120F0D] border border-[#D4AF37]/20 rounded-xl text-[#F5EFE6]"
                  />
                </div>

                <div>
                  <label className="block text-xs text-[#A69B8D] mb-1">
                    {t('القسم *', 'Category *')}
                  </label>
                  <select
                    value={editingItem.categoryId}
                    onChange={(e) =>
                      setEditingItem({ ...editingItem, categoryId: e.target.value })
                    }
                    className="w-full px-3.5 py-2 text-sm bg-[#120F0D] border border-[#D4AF37]/20 rounded-xl text-[#F5EFE6]"
                  >
                    {categories.map((c) => (
                      <option key={c.id} value={c.id}>
                        {t(c.nameAr, c.nameEn)}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-xs text-[#A69B8D] mb-1">
                    {t('السعر بالجنيه (0 = يحدد عند الطلب)', 'Price in EGP (0 = On Request)')}
                  </label>
                  <input
                    type="number"
                    min={0}
                    max={1000000}
                    value={editingItem.price}
                    onChange={(e) =>
                      setEditingItem({ ...editingItem, price: Number(e.target.value) })
                    }
                    className="w-full px-3.5 py-2 text-sm font-mono-num bg-[#120F0D] border border-[#D4AF37]/20 rounded-xl text-[#F5EFE6]"
                  />
                </div>

                <div className="sm:col-span-2">
                  <label className="block text-xs text-[#A69B8D] mb-1">
                    {t('رابط الصورة أو اختيار صورة جاهزة', 'Image URL or Preset')}
                  </label>
                  <div className="flex gap-2">
                    <input
                      type="text"
                      required
                      maxLength={500}
                      value={editingItem.imageUrl}
                      onChange={(e) =>
                        setEditingItem({ ...editingItem, imageUrl: e.target.value })
                      }
                      className="flex-1 px-3.5 py-2 text-xs font-mono-num bg-[#120F0D] border border-[#D4AF37]/20 rounded-xl text-[#F5EFE6]"
                    />
                    <select
                      onChange={(e) => {
                        if (e.target.value) {
                          setEditingItem({ ...editingItem, imageUrl: e.target.value });
                        }
                      }}
                      value=""
                      className="px-3 py-2 text-xs bg-[#251E1A] border border-[#D4AF37]/20 rounded-xl text-[#D4AF37]"
                    >
                      <option value="">{t('اختر صورة...', 'Presets...')}</option>
                      <option value={GENERATED_IMAGES.mixedGrills}>{t('مشويات وكفتة', 'Grills')}</option>
                      <option value={GENERATED_IMAGES.mandiPlatter}>{t('مندي وأرز', 'Mandi')}</option>
                      <option value={GENERATED_IMAGES.familyFeast}>{t('وجبات عائلية', 'Family')}</option>
                      <option value={GENERATED_IMAGES.heroFeast}>{t('سفرة شرقية', 'Oriental Feast')}</option>
                      <option value={GENERATED_IMAGES.orientalPizza}>{t('بيتزا', 'Pizza')}</option>
                    </select>
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs text-[#A69B8D] mb-1">
                    {t('الوصف المختصر (عربي) *', 'Description (Arabic) *')}
                  </label>
                  <textarea
                    required
                    rows={2}
                    maxLength={600}
                    value={editingItem.descriptionAr}
                    onChange={(e) =>
                      setEditingItem({ ...editingItem, descriptionAr: e.target.value })
                    }
                    className="w-full px-3.5 py-2 text-sm bg-[#120F0D] border border-[#D4AF37]/20 rounded-xl text-[#F5EFE6]"
                  />
                </div>

                <div>
                  <label className="block text-xs text-[#A69B8D] mb-1">
                    {t('الوصف المختصر (إنجليزي)', 'Description (English)')}
                  </label>
                  <textarea
                    rows={2}
                    maxLength={600}
                    value={editingItem.descriptionEn}
                    onChange={(e) =>
                      setEditingItem({ ...editingItem, descriptionEn: e.target.value })
                    }
                    placeholder={editingItem.descriptionAr}
                    className="w-full px-3.5 py-2 text-sm bg-[#120F0D] border border-[#D4AF37]/20 rounded-xl text-[#F5EFE6]"
                  />
                </div>
              </div>

              {/* Checkboxes for Badges & Visibility */}
              <div className="flex flex-wrap items-center gap-5 pt-2 text-xs text-[#F5EFE6]">
                <label className="inline-flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={editingItem.isVisible}
                    onChange={(e) =>
                      setEditingItem({ ...editingItem, isVisible: e.target.checked })
                    }
                  />
                  <span>{t('متاح وظاهر في المنيو', 'Visible on Menu')}</span>
                </label>

                <label className="inline-flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={editingItem.isPopular}
                    onChange={(e) =>
                      setEditingItem({ ...editingItem, isPopular: e.target.checked })
                    }
                  />
                  <span>{t('علامة: الأكثر طلبًا', 'Badge: Most Popular')}</span>
                </label>

                <label className="inline-flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={editingItem.isFeatured}
                    onChange={(e) =>
                      setEditingItem({ ...editingItem, isFeatured: e.target.checked })
                    }
                  />
                  <span>{t('علامة: مميز (Featured)', 'Badge: Featured')}</span>
                </label>

                <label className="inline-flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={editingItem.isNew}
                    onChange={(e) =>
                      setEditingItem({ ...editingItem, isNew: e.target.checked })
                    }
                  />
                  <span>{t('علامة: جديد', 'Badge: New')}</span>
                </label>

                <label className="inline-flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={editingItem.isSpecialOffer}
                    onChange={(e) =>
                      setEditingItem({ ...editingItem, isSpecialOffer: e.target.checked })
                    }
                  />
                  <span>{t('علامة: عرض خاص', 'Badge: Special Offer')}</span>
                </label>
              </div>

              <div className="flex items-center gap-3 pt-2">
                <button
                  type="submit"
                  className="px-6 py-2.5 text-xs font-bold text-[#120F0D] bg-[#D4AF37] hover:bg-[#E5C349] rounded-xl cursor-pointer"
                >
                  {t('حفظ الصنف', 'Save Dish')}
                </button>
                <button
                  type="button"
                  onClick={() => setEditingItem(null)}
                  className="px-4 py-2.5 text-xs text-[#A69B8D] hover:text-[#F5EFE6] cursor-pointer"
                >
                  {t('إلغاء', 'Cancel')}
                </button>
              </div>
            </form>
          )}

          {/* Menu Items Table/List */}
          <div className="grid grid-cols-1 gap-4">
            {menuItems.map((item) => {
              const cat = categories.find((c) => c.id === item.categoryId);
              return (
                <div
                  key={item.id}
                  className={`bg-[#1C1714] border rounded-2xl p-4 flex flex-col lg:flex-row lg:items-center justify-between gap-4 ${
                    item.isVisible ? 'border-[#D4AF37]/15' : 'border-red-500/20 opacity-65'
                  }`}
                >
                  <div className="flex items-center gap-4">
                    <div className="w-16 h-16 rounded-xl overflow-hidden bg-[#120F0D] shrink-0">
                      <ResilientImage src={item.imageUrl} alt={item.nameAr} />
                    </div>
                    <div>
                      <div className="flex flex-wrap items-center gap-2 text-xs text-[#A69B8D]">
                        <span>{cat ? t(cat.nameAr, cat.nameEn) : item.categoryId}</span>
                        {!item.isVisible && (
                          <span className="text-red-400 font-semibold">
                            · {t('مخفي مؤقتًا', 'Hidden')}
                          </span>
                        )}
                        {item.isPopular && (
                          <span className="text-[#D4AF37]">
                            · {t('الأكثر طلبًا', 'Popular')}
                          </span>
                        )}
                        {item.isNew && (
                          <span className="text-emerald-400">· {t('جديد', 'New')}</span>
                        )}
                        {item.isSpecialOffer && (
                          <span className="text-amber-400">· {t('عرض خاص', 'Offer')}</span>
                        )}
                      </div>
                      <h3 className="text-base font-bold text-[#F5EFE6]">
                        {t(item.nameAr, item.nameEn)}
                      </h3>
                      <p className="text-xs text-[#A69B8D] line-clamp-1">
                        {t(item.descriptionAr, item.descriptionEn)}
                      </p>
                    </div>
                  </div>

                  {/* Quick Inline Price & Actions */}
                  <div className="flex flex-wrap items-center gap-3 pt-3 lg:pt-0 border-t lg:border-t-0 border-[#D4AF37]/10">
                    <div className="flex items-center gap-1.5">
                      <input
                        type="number"
                        min={0}
                        placeholder={String(item.price)}
                        value={
                          quickPrices[item.id] !== undefined
                            ? quickPrices[item.id]
                            : String(item.price)
                        }
                        onChange={(e) =>
                          setQuickPrices({ ...quickPrices, [item.id]: e.target.value })
                        }
                        className="w-24 px-2.5 py-1.5 text-xs font-mono-num bg-[#120F0D] border border-[#D4AF37]/25 rounded-lg text-[#F5EFE6]"
                      />
                      <span className="text-xs text-[#A69B8D]">{t('ج.م', 'EGP')}</span>
                      <button
                        type="button"
                        onClick={() => handleQuickPriceSave(item)}
                        className="px-2.5 py-1.5 text-xs font-bold bg-[#D4AF37]/20 text-[#D4AF37] hover:bg-[#D4AF37] hover:text-[#120F0D] rounded-lg transition-colors cursor-pointer"
                      >
                        {t('حفظ السعر', 'Set Price')}
                      </button>
                    </div>

                    <button
                      type="button"
                      onClick={() => saveMenuItem({ ...item, isVisible: !item.isVisible })}
                      className="p-2 text-xs text-[#A69B8D] hover:text-[#F5EFE6] bg-[#120F0D] rounded-lg border border-[#D4AF37]/15 cursor-pointer"
                      title={t('إظهار / إخفاء مؤقتًا', 'Toggle visibility')}
                    >
                      {item.isVisible ? (
                        <Eye className="w-4 h-4 text-emerald-400" />
                      ) : (
                        <EyeOff className="w-4 h-4 text-red-400" />
                      )}
                    </button>

                    <button
                      type="button"
                      onClick={() => setEditingItem(item)}
                      className="p-2 text-xs text-[#D4AF37] hover:bg-[#251E1A] bg-[#120F0D] rounded-lg border border-[#D4AF37]/20 cursor-pointer"
                      title={t('تعديل كامل', 'Edit item')}
                    >
                      <Edit3 className="w-4 h-4" />
                    </button>

                    <button
                      type="button"
                      onClick={() => deleteMenuItem(item.id)}
                      className="p-2 text-xs text-red-400 hover:bg-red-950/50 bg-[#120F0D] rounded-lg border border-red-500/20 cursor-pointer"
                      title={t('حذف الصنف', 'Delete item')}
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* TAB 2: ORDERS MANAGEMENT */}
      {activeTab === 'orders' && (
        <div className="space-y-4">
          <h2 className="text-xl font-bold text-[#F5EFE6]">
            {t('إدارة طلبات العملاء', 'Customer Orders Management')}
          </h2>

          {orders.length === 0 ? (
            <div className="bg-[#1C1714] border border-[#D4AF37]/15 rounded-2xl p-10 text-center text-sm text-[#A69B8D]">
              {t('لا توجد طلبات مسجلة حتى الآن.', 'No orders received yet.')}
            </div>
          ) : (
            <div className="space-y-4">
              {orders.map((ord) => {
                const statusOptions: { value: OrderData['status']; labelAr: string; labelEn: string }[] = [
                  { value: 'new', labelAr: 'جديد', labelEn: 'New' },
                  { value: 'confirmed', labelAr: 'تم التأكيد', labelEn: 'Confirmed' },
                  { value: 'preparing', labelAr: 'قيد التحضير', labelEn: 'Preparing' },
                  { value: 'ready', labelAr: 'جاهز', labelEn: 'Ready' },
                  { value: 'delivered', labelAr: 'تم التسليم', labelEn: 'Delivered' },
                  { value: 'cancelled', labelAr: 'ملغي', labelEn: 'Cancelled' },
                ];

                return (
                  <div
                    key={ord.id}
                    className="bg-[#1C1714] border border-[#D4AF37]/20 rounded-2xl p-5 space-y-4"
                  >
                    <div className="flex flex-wrap items-center justify-between gap-4 border-b border-[#D4AF37]/10 pb-3">
                      <div className="flex items-center gap-3">
                        <span className="font-mono-num text-base font-bold text-[#D4AF37]">
                          {ord.orderNumber}
                        </span>
                        <span className="text-xs text-[#A69B8D]">
                          ·{' '}
                          {ord.deliveryMethod === 'delivery'
                            ? t('توصيل', 'Delivery')
                            : t('استلام من المطعم', 'Pickup')}
                        </span>
                      </div>

                      <div className="flex items-center gap-2">
                        <span className="text-xs text-[#A69B8D]">
                          {t('حالة الطلب:', 'Status:')}
                        </span>
                        <select
                          value={ord.status}
                          onChange={(e) =>
                            updateOrderStatus(ord, e.target.value as OrderData['status'])
                          }
                          className="px-3 py-1.5 text-xs font-bold bg-[#120F0D] border border-[#D4AF37]/30 rounded-lg text-[#D4AF37]"
                        >
                          {statusOptions.map((st) => (
                            <option key={st.value} value={st.value}>
                              {t(st.labelAr, st.labelEn)}
                            </option>
                          ))}
                        </select>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs sm:text-sm">
                      <div className="space-y-1">
                        <p className="text-[#A69B8D]">{t('بيانات العميل:', 'Customer:')}</p>
                        <p className="font-bold text-[#F5EFE6]">{ord.customerName}</p>
                        <a
                          href={`tel:${ord.customerPhone}`}
                          dir="ltr"
                          className="font-mono-num text-[#D4AF37] block hover:underline"
                        >
                          {ord.customerPhone}
                        </a>
                        <p className="text-[#F5EFE6]/85">{ord.customerAddress}</p>
                      </div>

                      <div className="space-y-1">
                        <p className="text-[#A69B8D]">{t('المنتجات المطلوبة:', 'Ordered Items:')}</p>
                        <ul className="space-y-1 text-[#F5EFE6]">
                          {ord.items.map((line, i) => (
                            <li key={i}>• {line}</li>
                          ))}
                        </ul>
                        {ord.notes && (
                          <p className="text-xs text-amber-300 pt-1">
                            {t('ملاحظات:', 'Notes:')} {ord.notes}
                          </p>
                        )}
                      </div>

                      <div className="space-y-2 flex flex-col justify-between">
                        <div>
                          <p className="text-[#A69B8D]">{t('الإجمالي:', 'Total:')}</p>
                          <p className="font-mono-num text-lg font-bold text-[#D4AF37]">
                            {ord.totalAmount > 0
                              ? `${ord.totalAmount} ${t('ج.م', 'EGP')}`
                              : t('يحدد مع العميل', 'Custom Price')}
                          </p>
                        </div>

                        <div className="flex items-center gap-2">
                          <a
                            href={`tel:${ord.customerPhone}`}
                            className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold bg-[#251E1A] text-[#F5EFE6] rounded-lg"
                          >
                            <Phone className="w-3.5 h-3.5 text-[#D4AF37]" />
                            <span>{t('اتصال', 'Call')}</span>
                          </a>
                          <a
                            href={`https://wa.me/2${ord.customerPhone.replace(/[^0-9]/g, '').replace(/^0/, '')}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold bg-[#1E8E3E] text-white rounded-lg"
                          >
                            <MessageCircle className="w-3.5 h-3.5" />
                            <span>WhatsApp</span>
                          </a>
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      )}

      {/* TAB 3: RESERVATIONS MANAGEMENT */}
      {activeTab === 'reservations' && (
        <div className="space-y-4">
          <h2 className="text-xl font-bold text-[#F5EFE6]">
            {t('إدارة حجوزات الطاولات', 'Table Reservations Management')}
          </h2>

          {reservations.length === 0 ? (
            <div className="bg-[#1C1714] border border-[#D4AF37]/15 rounded-2xl p-10 text-center text-sm text-[#A69B8D]">
              {t('لا توجد طلبات حجز طاولات حاليًا.', 'No table reservations yet.')}
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {reservations.map((res) => {
                const resStatuses: {
                  value: ReservationData['status'];
                  labelAr: string;
                  labelEn: string;
                }[] = [
                  { value: 'new', labelAr: 'جديد', labelEn: 'New' },
                  { value: 'confirmed', labelAr: 'مؤكد', labelEn: 'Confirmed' },
                  { value: 'completed', labelAr: 'مكتمل', labelEn: 'Completed' },
                  { value: 'cancelled', labelAr: 'ملغي', labelEn: 'Cancelled' },
                ];

                return (
                  <div
                    key={res.id}
                    className="bg-[#1C1714] border border-[#D4AF37]/20 rounded-2xl p-5 space-y-3"
                  >
                    <div className="flex items-center justify-between border-b border-[#D4AF37]/10 pb-2.5">
                      <span className="font-mono-num text-sm font-bold text-[#D4AF37]">
                        {res.reservationNumber}
                      </span>
                      <select
                        value={res.status}
                        onChange={(e) =>
                          updateReservationStatus(
                            res,
                            e.target.value as ReservationData['status']
                          )
                        }
                        className="px-3 py-1 text-xs font-bold bg-[#120F0D] border border-[#D4AF37]/30 rounded-lg text-[#D4AF37]"
                      >
                        {resStatuses.map((s) => (
                          <option key={s.value} value={s.value}>
                            {t(s.labelAr, s.labelEn)}
                          </option>
                        ))}
                      </select>
                    </div>

                    <div className="text-xs sm:text-sm space-y-1">
                      <p className="font-bold text-[#F5EFE6]">{res.customerName}</p>
                      <p className="font-mono-num text-[#D4AF37]" dir="ltr">
                        {res.customerPhone}
                      </p>
                      <p className="text-[#F5EFE6]/85">
                        {t('التاريخ:', 'Date:')} <span className="font-mono-num">{res.date}</span> ·{' '}
                        {t('الوقت:', 'Time:')} <span className="font-mono-num">{res.time}</span> ·{' '}
                        {t('عدد الأفراد:', 'Guests:')}{' '}
                        <span className="font-mono-num font-bold">{res.guests}</span>
                      </p>
                      {res.notes && (
                        <p className="text-amber-300">
                          {t('ملاحظات:', 'Notes:')} {res.notes}
                        </p>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      )}

      {/* TAB 4: REVIEWS & GALLERY MANAGEMENT */}
      {activeTab === 'reviews-gallery' && (
        <div className="space-y-10">
          {/* Reviews Moderation */}
          <div className="space-y-4">
            <h2 className="text-xl font-bold text-[#F5EFE6]">
              {t('إدارة تقييمات العملاء', 'Customer Reviews Moderation')}
            </h2>
            {reviews.length === 0 ? (
              <p className="text-xs text-[#A69B8D]">
                {t('لا توجد تقييمات مضافة من العملاء بعد.', 'No customer reviews submitted yet.')}
              </p>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {reviews.map((rev) => (
                  <div
                    key={rev.id}
                    className="bg-[#1C1714] border border-[#D4AF37]/15 rounded-2xl p-4 flex items-start justify-between gap-4"
                  >
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <span className="font-bold text-sm text-[#F5EFE6]">
                          {rev.authorName}
                        </span>
                        <span className="font-mono-num text-xs text-[#D4AF37]">
                          ({rev.rating} / 5)
                        </span>
                      </div>
                      <p className="text-xs text-[#F5EFE6]/80">"{rev.comment}"</p>
                    </div>
                    <div className="flex items-center gap-2 shrink-0">
                      <button
                        type="button"
                        onClick={() => toggleReviewApproval(rev, !rev.isApproved)}
                        className={`px-3 py-1 text-xs font-bold rounded-lg cursor-pointer ${
                          rev.isApproved
                            ? 'bg-emerald-950/60 text-emerald-300 border border-emerald-500/30'
                            : 'bg-[#D4AF37] text-[#120F0D]'
                        }`}
                      >
                        {rev.isApproved
                          ? t('معتمد (إخفاء)', 'Approved (Hide)')
                          : t('اعتماد للعرض', 'Approve')}
                      </button>
                      <button
                        type="button"
                        onClick={() => deleteReview(rev.id)}
                        className="p-1.5 text-red-400 hover:bg-red-950/40 rounded-lg cursor-pointer"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Gallery Management */}
          <div className="space-y-4 pt-6 border-t border-[#D4AF37]/15">
            <h2 className="text-xl font-bold text-[#F5EFE6]">
              {t('إدارة معرض الصور', 'Photo Gallery Management')}
            </h2>

            <form
              onSubmit={handleAddGallery}
              className="bg-[#1C1714] border border-[#D4AF37]/20 rounded-2xl p-5 grid grid-cols-1 sm:grid-cols-4 gap-4 items-end"
            >
              <div>
                <label className="block text-xs text-[#A69B8D] mb-1">
                  {t('عنوان الصورة (عربي)', 'Title (Arabic)')}
                </label>
                <input
                  type="text"
                  required
                  value={newGalleryTitleAr}
                  onChange={(e) => setNewGalleryTitleAr(e.target.value)}
                  className="w-full px-3 py-2 text-xs bg-[#120F0D] border border-[#D4AF37]/20 rounded-xl text-[#F5EFE6]"
                />
              </div>
              <div>
                <label className="block text-xs text-[#A69B8D] mb-1">
                  {t('القسم', 'Category')}
                </label>
                <select
                  value={newGalleryCategory}
                  onChange={(e) =>
                    setNewGalleryCategory(e.target.value as GalleryItemData['category'])
                  }
                  className="w-full px-3 py-2 text-xs bg-[#120F0D] border border-[#D4AF37]/20 rounded-xl text-[#F5EFE6]"
                >
                  <option value="dishes">{t('أطباق', 'Dishes')}</option>
                  <option value="grills">{t('مشويات', 'Grills')}</option>
                  <option value="mandi">{t('مندي', 'Mandi')}</option>
                  <option value="family">{t('الوجبات العائلية', 'Family Meals')}</option>
                  <option value="ambiance">{t('أجواء المطعم', 'Ambiance')}</option>
                </select>
              </div>
              <div>
                <label className="block text-xs text-[#A69B8D] mb-1">
                  {t('رابط الصورة', 'Image URL')}
                </label>
                <input
                  type="text"
                  required
                  value={newGalleryUrl}
                  onChange={(e) => setNewGalleryUrl(e.target.value)}
                  className="w-full px-3 py-2 text-xs font-mono-num bg-[#120F0D] border border-[#D4AF37]/20 rounded-xl text-[#F5EFE6]"
                />
              </div>
              <button
                type="submit"
                className="px-4 py-2 text-xs font-bold text-[#120F0D] bg-[#D4AF37] rounded-xl cursor-pointer"
              >
                {t('إضافة للمعرض', 'Add to Gallery')}
              </button>
            </form>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              {galleryItems.map((gal) => (
                <div
                  key={gal.id}
                  className="bg-[#1C1714] border border-[#D4AF37]/15 rounded-2xl p-3 flex items-center justify-between gap-3"
                >
                  <div className="flex items-center gap-3 min-w-0">
                    <div className="w-14 h-14 rounded-lg overflow-hidden bg-[#120F0D] shrink-0">
                      <ResilientImage src={gal.imageUrl} alt={gal.titleAr} />
                    </div>
                    <div className="min-w-0">
                      <p className="text-xs font-bold text-[#F5EFE6] truncate">
                        {t(gal.titleAr, gal.titleEn)}
                      </p>
                      <p className="text-[11px] text-[#A69B8D]">{gal.category}</p>
                    </div>
                  </div>
                  <button
                    type="button"
                    onClick={() => deleteGalleryItem(gal.id)}
                    className="p-1.5 text-red-400 hover:bg-red-950/40 rounded-lg shrink-0 cursor-pointer"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* TAB 5: CONTENT & SETTINGS MANAGEMENT */}
      {activeTab === 'settings' && (
        <form
          onSubmit={handleSaveSettingsForm}
          className="bg-[#1C1714] border border-[#D4AF37]/20 rounded-3xl p-6 sm:p-8 space-y-6"
        >
          <div className="flex items-center justify-between border-b border-[#D4AF37]/12 pb-4">
            <h2 className="text-xl font-bold text-[#F5EFE6]">
              {t('إدارة نصوص الموقع وبيانات التواصل', 'Manage Website Content & Contact Info')}
            </h2>
            <button
              type="submit"
              className="inline-flex items-center gap-2 px-5 py-2.5 text-xs sm:text-sm font-bold text-[#120F0D] bg-[#D4AF37] hover:bg-[#E5C349] rounded-xl cursor-pointer"
            >
              <Save className="w-4 h-4" />
              <span>{t('حفظ التعديلات', 'Save Changes')}</span>
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs text-[#A69B8D] mb-1">
                {t('عنوان الصفحة الرئيسية (عربي)', 'Hero Title (Arabic)')}
              </label>
              <input
                type="text"
                value={settingsForm.heroTitleAr}
                onChange={(e) =>
                  setSettingsForm({ ...settingsForm, heroTitleAr: e.target.value })
                }
                className="w-full px-3.5 py-2 text-sm bg-[#120F0D] border border-[#D4AF37]/20 rounded-xl text-[#F5EFE6]"
              />
            </div>

            <div>
              <label className="block text-xs text-[#A69B8D] mb-1">
                {t('العنوان الفرعي (عربي)', 'Hero Subtitle (Arabic)')}
              </label>
              <input
                type="text"
                value={settingsForm.heroSubtitleAr}
                onChange={(e) =>
                  setSettingsForm({ ...settingsForm, heroSubtitleAr: e.target.value })
                }
                className="w-full px-3.5 py-2 text-sm bg-[#120F0D] border border-[#D4AF37]/20 rounded-xl text-[#F5EFE6]"
              />
            </div>

            <div>
              <label className="block text-xs text-[#A69B8D] mb-1">
                {t('رقم الهاتف الرسمي', 'Official Phone')}
              </label>
              <input
                type="text"
                dir="ltr"
                value={settingsForm.phone}
                onChange={(e) => setSettingsForm({ ...settingsForm, phone: e.target.value })}
                className="w-full px-3.5 py-2 text-sm font-mono-num bg-[#120F0D] border border-[#D4AF37]/20 rounded-xl text-[#F5EFE6]"
              />
            </div>

            <div>
              <label className="block text-xs text-[#A69B8D] mb-1">
                {t('رقم واتساب الطلبات', 'WhatsApp Number')}
              </label>
              <input
                type="text"
                dir="ltr"
                value={settingsForm.whatsapp}
                onChange={(e) =>
                  setSettingsForm({ ...settingsForm, whatsapp: e.target.value })
                }
                className="w-full px-3.5 py-2 text-sm font-mono-num bg-[#120F0D] border border-[#D4AF37]/20 rounded-xl text-[#F5EFE6]"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs text-[#A69B8D] mb-1">
              {t('نبذة عن المطعم (عربي)', 'About Us Content (Arabic)')}
            </label>
            <textarea
              rows={3}
              value={settingsForm.aboutTextAr}
              onChange={(e) =>
                setSettingsForm({ ...settingsForm, aboutTextAr: e.target.value })
              }
              className="w-full px-3.5 py-2 text-sm bg-[#120F0D] border border-[#D4AF37]/20 rounded-xl text-[#F5EFE6]"
            />
          </div>

          <div>
            <label className="block text-xs text-[#A69B8D] mb-1">
              {t('نص قسم العزومات والمناسبات (عربي)', 'Banquets Section Text (Arabic)')}
            </label>
            <textarea
              rows={2}
              value={settingsForm.banquetTextAr}
              onChange={(e) =>
                setSettingsForm({ ...settingsForm, banquetTextAr: e.target.value })
              }
              className="w-full px-3.5 py-2 text-sm bg-[#120F0D] border border-[#D4AF37]/20 rounded-xl text-[#F5EFE6]"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs text-[#A69B8D] mb-1">
                {t('رابط فيسبوك الرسمي (اتركه فارغًا إذا لم يتوفر)', 'Facebook URL (Optional)')}
              </label>
              <input
                type="url"
                dir="ltr"
                value={settingsForm.facebookUrl}
                onChange={(e) =>
                  setSettingsForm({ ...settingsForm, facebookUrl: e.target.value })
                }
                placeholder="https://facebook.com/..."
                className="w-full px-3.5 py-2 text-xs font-mono-num bg-[#120F0D] border border-[#D4AF37]/20 rounded-xl text-[#F5EFE6]"
              />
            </div>

            <div>
              <label className="block text-xs text-[#A69B8D] mb-1">
                {t('رابط إنستجرام الرسمي (اتركه فارغًا إذا لم يتوفر)', 'Instagram URL (Optional)')}
              </label>
              <input
                type="url"
                dir="ltr"
                value={settingsForm.instagramUrl}
                onChange={(e) =>
                  setSettingsForm({ ...settingsForm, instagramUrl: e.target.value })
                }
                placeholder="https://instagram.com/..."
                className="w-full px-3.5 py-2 text-xs font-mono-num bg-[#120F0D] border border-[#D4AF37]/20 rounded-xl text-[#F5EFE6]"
              />
            </div>
          </div>
        </form>
      )}
    </div>
  );
};
