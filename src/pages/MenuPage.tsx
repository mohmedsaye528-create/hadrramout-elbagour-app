import React, { useState, useMemo } from 'react';
import {
  Search,
  Plus,
  Minus,
  ShoppingBag,
  ArrowRight,
  ArrowLeft,
  UtensilsCrossed,
  MessageCircle,
  X,
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import { ResilientImage } from '../components/ResilientImage';
import { CategoryIcon } from './HomePage';

export const MenuPage: React.FC = () => {
  const {
    lang,
    t,
    categories,
    menuItems,
    selectedCategoryId,
    setSelectedCategoryId,
    navigateTo,
    addToCart,
    isAdmin,
  } = useApp();

  const [searchQuery, setSearchQuery] = useState('');
  const [badgeFilter, setBadgeFilter] = useState<'all' | 'popular' | 'new' | 'offer'>('all');

  const visibleCategories = categories.filter((c) => c.isVisible);
  const visibleItems = menuItems.filter((m) => m.isVisible);

  // Only show badge filter tabs if at least one visible item has that badge enabled from Admin
  const hasPopularItems = visibleItems.some((m) => m.isPopular);
  const hasNewItems = visibleItems.some((m) => m.isNew);
  const hasOfferItems = visibleItems.some((m) => m.isSpecialOffer);

  const filteredItems = useMemo(() => {
    return visibleItems.filter((item) => {
      if (selectedCategoryId !== 'all' && item.categoryId !== selectedCategoryId) {
        return false;
      }
      if (badgeFilter === 'popular' && !item.isPopular) return false;
      if (badgeFilter === 'new' && !item.isNew) return false;
      if (badgeFilter === 'offer' && !item.isSpecialOffer) return false;

      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        const matchAr = item.nameAr.toLowerCase().includes(q) || item.descriptionAr.toLowerCase().includes(q);
        const matchEn = item.nameEn.toLowerCase().includes(q) || item.descriptionEn.toLowerCase().includes(q);
        return matchAr || matchEn;
      }
      return true;
    });
  }, [visibleItems, selectedCategoryId, badgeFilter, searchQuery]);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-14 space-y-8">
      {/* Page Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 border-b border-[#D4AF37]/15 pb-8">
        <div className="space-y-2">
          <span className="text-xs font-medium text-[#D4AF37]">
            {t('مطعم حضرموت الباجور', 'Hadramout El-Bagour')}
          </span>
          <h1
            className={`text-3xl sm:text-5xl font-bold text-[#F5EFE6] ${
              lang === 'ar' ? 'font-display-ar' : 'font-display-en'
            }`}
          >
            {t('منيو المأكولات الشرقية', 'Oriental Cuisine Menu')}
          </h1>
          <p className="text-sm text-[#A69B8D] max-w-xl">
            {t(
              'تصفح أقسام المشويات والمندي والكفتة والوجبات العائلية والعزومات وعشاء العروسة والبيتزا، وأضف اختياراتك مباشرة إلى طلبك.',
              'Browse our charcoal grills, Mandi, Kofta, family meals, banquets, and oven-baked pizza, and add items directly to your order.'
            )}
          </p>
        </div>

        {/* Search Input */}
        <div className="relative w-full md:w-80">
          <Search className="w-4 h-4 text-[#D4AF37] absolute top-1/2 -translate-y-1/2 start-3.5 pointer-events-none" />
          <input
            type="search"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder={t('ابحث عن طبق في المنيو...', 'Search menu dishes...')}
            className="w-full ps-10 pe-9 py-2.5 text-sm bg-[#1C1714] border border-[#D4AF37]/25 rounded-xl text-[#F5EFE6] placeholder:text-[#A69B8D] focus:outline-none focus:border-[#D4AF37]"
          />
          {searchQuery && (
            <button
              type="button"
              onClick={() => setSearchQuery('')}
              aria-label={t('مسح البحث', 'Clear search')}
              className="absolute top-1/2 -translate-y-1/2 end-3 text-[#A69B8D] hover:text-[#F5EFE6] cursor-pointer"
            >
              <X className="w-4 h-4" />
            </button>
          )}
        </div>
      </div>

      {/* Interactive Category Filter Controls */}
      <div className="space-y-4">
        <div
          role="tablist"
          aria-label={t('تصنيفات المنيو', 'Menu Categories')}
          className="flex items-center gap-2 overflow-x-auto pb-2 no-scrollbar"
        >
          <button
            type="button"
            role="tab"
            aria-selected={selectedCategoryId === 'all'}
            onClick={() => setSelectedCategoryId('all')}
            className={`px-4 py-2 text-xs sm:text-sm font-semibold rounded-xl transition-colors whitespace-nowrap shrink-0 cursor-pointer ${
              selectedCategoryId === 'all'
                ? 'bg-[#D4AF37] text-[#120F0D] shadow-sm'
                : 'bg-[#1C1714] text-[#F5EFE6]/80 hover:text-[#F5EFE6] border border-[#D4AF37]/15'
            }`}
          >
            {t('جميع الأقسام', 'All Categories')}
          </button>

          {visibleCategories.map((cat) => {
            const active = selectedCategoryId === cat.id;
            return (
              <button
                key={cat.id}
                type="button"
                role="tab"
                aria-selected={active}
                onClick={() => setSelectedCategoryId(cat.id)}
                className={`inline-flex items-center gap-2 px-4 py-2 text-xs sm:text-sm font-semibold rounded-xl transition-colors whitespace-nowrap shrink-0 cursor-pointer ${
                  active
                    ? 'bg-[#D4AF37] text-[#120F0D] shadow-sm'
                    : 'bg-[#1C1714] text-[#F5EFE6]/80 hover:text-[#F5EFE6] border border-[#D4AF37]/15'
                }`}
              >
                <CategoryIcon name={cat.iconName} className="w-3.5 h-3.5" />
                <span>{t(cat.nameAr, cat.nameEn)}</span>
              </button>
            );
          })}
        </div>

        {/* Admin-controlled Special Filter Tabs (Only shown if Admin has enabled badges on items) */}
        {(hasPopularItems || hasNewItems || hasOfferItems) && (
          <div className="flex flex-wrap items-center gap-2 pt-1">
            <span className="text-xs text-[#A69B8D] me-1">
              {t('تصفية سريعة:', 'Quick filter:')}
            </span>
            <button
              type="button"
              onClick={() => setBadgeFilter('all')}
              className={`px-3 py-1 text-xs font-medium rounded-lg transition-colors cursor-pointer ${
                badgeFilter === 'all'
                  ? 'bg-[#251E1A] text-[#D4AF37] border border-[#D4AF37]/40'
                  : 'text-[#A69B8D] hover:text-[#F5EFE6]'
              }`}
            >
              {t('الكل', 'All')}
            </button>
            {hasPopularItems && (
              <button
                type="button"
                onClick={() => setBadgeFilter('popular')}
                className={`px-3 py-1 text-xs font-medium rounded-lg transition-colors cursor-pointer ${
                  badgeFilter === 'popular'
                    ? 'bg-[#251E1A] text-[#D4AF37] border border-[#D4AF37]/40'
                    : 'text-[#A69B8D] hover:text-[#F5EFE6]'
                }`}
              >
                {t('الأكثر طلبًا', 'Most Popular')}
              </button>
            )}
            {hasNewItems && (
              <button
                type="button"
                onClick={() => setBadgeFilter('new')}
                className={`px-3 py-1 text-xs font-medium rounded-lg transition-colors cursor-pointer ${
                  badgeFilter === 'new'
                    ? 'bg-[#251E1A] text-[#D4AF37] border border-[#D4AF37]/40'
                    : 'text-[#A69B8D] hover:text-[#F5EFE6]'
                }`}
              >
                {t('جديد', 'New')}
              </button>
            )}
            {hasOfferItems && (
              <button
                type="button"
                onClick={() => setBadgeFilter('offer')}
                className={`px-3 py-1 text-xs font-medium rounded-lg transition-colors cursor-pointer ${
                  badgeFilter === 'offer'
                    ? 'bg-[#251E1A] text-[#D4AF37] border border-[#D4AF37]/40'
                    : 'text-[#A69B8D] hover:text-[#F5EFE6]'
                }`}
              >
                {t('عرض خاص', 'Special Offer')}
              </button>
            )}
          </div>
        )}
      </div>

      {/* Menu Grid or Empty State */}
      {filteredItems.length === 0 ? (
        <div className="bg-[#1C1714] border border-[#D4AF37]/15 rounded-3xl p-12 text-center space-y-4">
          <UtensilsCrossed className="w-10 h-10 text-[#D4AF37]/40 mx-auto" />
          <h3 className="text-lg font-bold text-[#F5EFE6]">
            {t('لا توجد أصناف مطابقة لبحثك حاليًا', 'No dishes match your current filter')}
          </h3>
          <p className="text-xs sm:text-sm text-[#A69B8D] max-w-md mx-auto">
            {t(
              'جرب اختيار قسم آخر أو مسح كلمة البحث، أو تواصل معنا مباشرة لطلب صنف مخصوص.',
              'Try selecting another category, clearing your search query, or contacting us directly.'
            )}
          </p>
          <button
            type="button"
            onClick={() => {
              setSelectedCategoryId('all');
              setBadgeFilter('all');
              setSearchQuery('');
            }}
            className="px-5 py-2.5 text-xs font-bold text-[#120F0D] bg-[#D4AF37] hover:bg-[#E5C349] rounded-xl cursor-pointer"
          >
            {t('عرض جميع الأصناف', 'Show All Dishes')}
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-7">
          {filteredItems.map((item) => {
            const category = categories.find((c) => c.id === item.categoryId);
            return (
              <article
                key={item.id}
                className="bg-[#1C1714] border border-[#D4AF37]/15 rounded-2xl overflow-hidden flex flex-col justify-between transition-transform duration-150 hover:-translate-y-0.5"
              >
                <div>
                  <button
                    type="button"
                    onClick={() => navigateTo('product-details', { productId: item.id })}
                    className="block w-full aspect-[4/3] overflow-hidden bg-[#120F0D] cursor-pointer"
                  >
                    <ResilientImage
                      src={item.imageUrl}
                      alt={t(item.nameAr, item.nameEn)}
                      className="w-full h-full object-cover hover:scale-103 transition-transform duration-300"
                    />
                  </button>

                  <div className="p-5 space-y-2.5">
                    {/* Unboxed Metadata */}
                    <div className="flex flex-wrap items-center gap-2 text-xs text-[#A69B8D]">
                      <span>
                        {category
                          ? t(category.nameAr, category.nameEn)
                          : t('أطباق شرقية', 'Oriental')}
                      </span>
                      {item.isPopular && (
                        <>
                          <span aria-hidden="true">·</span>
                          <span className="text-[#D4AF37] font-semibold">
                            {t('الأكثر طلبًا', 'Most Popular')}
                          </span>
                        </>
                      )}
                      {item.isNew && (
                        <>
                          <span aria-hidden="true">·</span>
                          <span className="text-emerald-400 font-semibold">
                            {t('جديد', 'New')}
                          </span>
                        </>
                      )}
                      {item.isSpecialOffer && (
                        <>
                          <span aria-hidden="true">·</span>
                          <span className="text-amber-400 font-semibold">
                            {t('عرض خاص', 'Special Offer')}
                          </span>
                        </>
                      )}
                    </div>

                    <button
                      type="button"
                      onClick={() => navigateTo('product-details', { productId: item.id })}
                      className="text-start block cursor-pointer"
                    >
                      <h2 className="text-lg font-bold text-[#F5EFE6] hover:text-[#D4AF37] transition-colors">
                        {t(item.nameAr, item.nameEn)}
                      </h2>
                    </button>

                    <p className="text-xs sm:text-sm text-[#A69B8D] line-clamp-2 leading-relaxed">
                      {t(item.descriptionAr, item.descriptionEn)}
                    </p>
                  </div>
                </div>

                <div className="px-5 pb-5 pt-3 border-t border-[#D4AF37]/10 flex items-center justify-between gap-3">
                  <div>
                    {item.price > 0 ? (
                      <span className="font-mono-num text-base font-bold text-[#D4AF37]">
                        {item.price} {t('ج.م', 'EGP')}
                      </span>
                    ) : (
                      <div className="space-y-0.5">
                        <span className="text-xs font-medium text-[#D4AF37]/90 block">
                          {t('السعر يحدد عند الطلب', 'Price upon request')}
                        </span>
                        {isAdmin && (
                          <button
                            type="button"
                            onClick={() => navigateTo('admin-dashboard')}
                            className="text-[11px] text-[#A69B8D] underline hover:text-[#F5EFE6] cursor-pointer"
                          >
                            {t('تعديل السعر من الإدارة', 'Set price in Admin')}
                          </button>
                        )}
                      </div>
                    )}
                  </div>

                  <button
                    type="button"
                    onClick={() => addToCart(item, 1)}
                    className="inline-flex items-center gap-1.5 px-4 py-2 text-xs font-bold text-[#120F0D] bg-[#D4AF37] hover:bg-[#E5C349] rounded-lg transition-colors whitespace-nowrap shrink-0 cursor-pointer"
                  >
                    <Plus className="w-3.5 h-3.5" />
                    <span>{t('أضف إلى الطلب', 'Add to Order')}</span>
                  </button>
                </div>
              </article>
            );
          })}
        </div>
      )}
    </div>
  );
};

export const ProductDetailsPage: React.FC = () => {
  const {
    lang,
    t,
    menuItems,
    categories,
    selectedProductId,
    navigateTo,
    addToCart,
    settings,
  } = useApp();

  const [quantity, setQuantity] = useState(1);
  const [notes, setNotes] = useState('');

  const product =
    menuItems.find((m) => m.id === selectedProductId) || menuItems[0];

  if (!product) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-16 text-center space-y-4">
        <p className="text-lg text-[#F5EFE6]">{t('الصنف غير موجود', 'Product not found')}</p>
        <button
          type="button"
          onClick={() => navigateTo('menu')}
          className="px-5 py-2.5 bg-[#D4AF37] text-[#120F0D] font-bold rounded-xl text-sm cursor-pointer"
        >
          {t('العودة إلى المنيو', 'Back to Menu')}
        </button>
      </div>
    );
  }

  const category = categories.find((c) => c.id === product.categoryId);
  const relatedItems = menuItems
    .filter((m) => m.isVisible && m.categoryId === product.categoryId && m.id !== product.id)
    .slice(0, 3);

  const cleanWhatsapp = (settings.whatsapp || '01080240315').replace(/[^0-9]/g, '');
  const intlWhatsapp = cleanWhatsapp.startsWith('0') ? `2${cleanWhatsapp}` : cleanWhatsapp;
  const inquireUrl = `https://wa.me/${intlWhatsapp}?text=${encodeURIComponent(
    lang === 'ar'
      ? `مرحبًا مطعم حضرموت الباجور، أود الاستفسار عن صنف: ${product.nameAr}`
      : `Hello Hadramout El-Bagour, I would like to inquire about: ${product.nameEn}`
  )}`;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-14 space-y-14">
      {/* Back Button */}
      <div>
        <button
          type="button"
          onClick={() => navigateTo('menu')}
          className="inline-flex items-center gap-2 text-xs sm:text-sm font-medium text-[#A69B8D] hover:text-[#D4AF37] transition-colors cursor-pointer"
        >
          {lang === 'ar' ? <ArrowRight className="w-4 h-4" /> : <ArrowLeft className="w-4 h-4" />}
          <span>{t('العودة إلى المنيو', 'Back to Menu')}</span>
        </button>
      </div>

      {/* Contiguous Purchase Module (PDP) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-start">
        {/* Product Image */}
        <div className="lg:col-span-7 rounded-3xl overflow-hidden border border-[#D4AF37]/20 bg-[#1C1714] aspect-[4/3]">
          <ResilientImage
            src={product.imageUrl}
            alt={t(product.nameAr, product.nameEn)}
            priority={true}
            className="w-full h-full object-cover"
          />
        </div>

        {/* Purchase Details */}
        <div className="lg:col-span-5 bg-[#1C1714] border border-[#D4AF37]/15 rounded-3xl p-6 sm:p-8 space-y-6">
          <div className="space-y-2">
            <div className="flex items-center gap-2 text-xs text-[#D4AF37]">
              <span>
                {category ? t(category.nameAr, category.nameEn) : t('المأكولات الشرقية', 'Oriental')}
              </span>
              {product.isPopular && (
                <>
                  <span aria-hidden="true">·</span>
                  <span>{t('الأكثر طلبًا', 'Most Popular')}</span>
                </>
              )}
            </div>

            <h1
              className={`text-2xl sm:text-4xl font-bold text-[#F5EFE6] ${
                lang === 'ar' ? 'font-display-ar' : 'font-display-en'
              }`}
            >
              {t(product.nameAr, product.nameEn)}
            </h1>

            <div className="pt-1">
              {product.price > 0 ? (
                <span className="font-mono-num text-2xl font-bold text-[#D4AF37]">
                  {product.price} {t('ج.م', 'EGP')}
                </span>
              ) : (
                <span className="text-sm font-semibold text-[#D4AF37]">
                  {t(
                    'السعر يحدد حسب الحجم والاختيار عند تأكيد الطلب (قابل للتعديل من الإدارة)',
                    'Price determined by portion selection upon confirmation'
                  )}
                </span>
              )}
            </div>
          </div>

          <p className="text-sm sm:text-base text-[#F5EFE6]/85 leading-relaxed border-t border-[#D4AF37]/12 pt-4">
            {t(product.descriptionAr, product.descriptionEn)}
          </p>

          {/* Quantity & Notes */}
          <div className="space-y-4 pt-2">
            <div>
              <label className="block text-xs text-[#A69B8D] mb-2">
                {t('الكمية المطلوبة', 'Quantity')}
              </label>
              <div className="inline-flex items-center gap-4 bg-[#120F0D] border border-[#D4AF37]/25 rounded-xl px-4 py-2">
                <button
                  type="button"
                  onClick={() => setQuantity(Math.max(1, quantity - 1))}
                  className="text-[#F5EFE6] hover:text-[#D4AF37] p-1 cursor-pointer"
                >
                  <Minus className="w-4 h-4" />
                </button>
                <span className="font-mono-num text-base font-bold min-w-[2rem] text-center">
                  {quantity}
                </span>
                <button
                  type="button"
                  onClick={() => setQuantity(Math.min(50, quantity + 1))}
                  className="text-[#F5EFE6] hover:text-[#D4AF37] p-1 cursor-pointer"
                >
                  <Plus className="w-4 h-4" />
                </button>
              </div>
            </div>

            <div>
              <label className="block text-xs text-[#A69B8D] mb-1.5">
                {t('ملاحظات خاصة على الطبق (اختياري)', 'Special preparation notes (optional)')}
              </label>
              <input
                type="text"
                maxLength={120}
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                placeholder={t(
                  'مثال: بدون شطة، تحديد الحجم أو الإضافات...',
                  'e.g., mild spice, portion preference...'
                )}
                className="w-full px-3.5 py-2.5 text-sm bg-[#120F0D] border border-[#D4AF37]/20 rounded-xl text-[#F5EFE6] placeholder:text-[#A69B8D] focus:outline-none focus:border-[#D4AF37]"
              />
            </div>
          </div>

          {/* Primary Actions */}
          <div className="space-y-3 pt-2">
            <button
              type="button"
              onClick={() => {
                addToCart(product, quantity, notes);
                setNotes('');
              }}
              className="w-full flex items-center justify-center gap-2 px-6 py-3.5 text-sm sm:text-base font-bold text-[#120F0D] bg-[#D4AF37] hover:bg-[#E5C349] rounded-xl transition-colors cursor-pointer"
            >
              <ShoppingBag className="w-4 h-4" />
              <span>{t('أضف إلى الطلب', 'Add to Order')}</span>
            </button>

            <a
              href={inquireUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="w-full flex items-center justify-center gap-2 px-6 py-3 text-xs sm:text-sm font-semibold text-[#F5EFE6] bg-[#251E1A] hover:bg-[#2F2621] border border-[#D4AF37]/25 rounded-xl transition-colors"
            >
              <MessageCircle className="w-4 h-4 text-[#D4AF37]" />
              <span>{t('استفسر عن الصنف عبر واتساب', 'Inquire via WhatsApp')}</span>
            </a>
          </div>
        </div>
      </div>

      {/* Related Dishes */}
      {relatedItems.length > 0 && (
        <div className="space-y-6 pt-8 border-t border-[#D4AF37]/15">
          <h2
            className={`text-2xl font-bold text-[#F5EFE6] ${
              lang === 'ar' ? 'font-display-ar' : 'font-display-en'
            }`}
          >
            {t('أصناف أخرى في نفس القسم', 'More in This Category')}
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
            {relatedItems.map((rel) => (
              <div
                key={rel.id}
                onClick={() => navigateTo('product-details', { productId: rel.id })}
                className="bg-[#1C1714] border border-[#D4AF37]/14 rounded-2xl p-4 flex items-center gap-4 hover:border-[#D4AF37]/40 transition-colors cursor-pointer"
              >
                <div className="w-20 h-20 rounded-xl overflow-hidden shrink-0 bg-[#120F0D]">
                  <ResilientImage src={rel.imageUrl} alt={t(rel.nameAr, rel.nameEn)} />
                </div>
                <div>
                  <h3 className="text-sm font-bold text-[#F5EFE6]">
                    {t(rel.nameAr, rel.nameEn)}
                  </h3>
                  <p className="text-xs text-[#D4AF37] mt-1">
                    {rel.price > 0
                      ? `${rel.price} ${t('ج.م', 'EGP')}`
                      : t('السعر يحدد عند الطلب', 'Price upon request')}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
