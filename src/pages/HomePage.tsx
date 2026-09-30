import React, { useState } from 'react';
import {
  UtensilsCrossed,
  Flame,
  Users,
  Crown,
  Sparkles,
  Soup,
  Pizza,
  ChefHat,
  CupSoda,
  CakeSlice,
  Phone,
  MessageCircle,
  MapPin,
  Clock,
  Star,
  CheckCircle2,
  Truck,
  ShoppingBag,
  Calendar,
  ExternalLink,
  Plus,
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import { ResilientImage } from '../components/ResilientImage';
import {
  GENERATED_IMAGES,
  WORKING_HOURS,
  getRestaurantOpenStatus,
} from '../data/initialData';

export const CategoryIcon: React.FC<{ name: string; className?: string }> = ({
  name,
  className = 'w-5 h-5',
}) => {
  switch (name) {
    case 'Flame':
      return <Flame className={className} />;
    case 'Users':
      return <Users className={className} />;
    case 'Crown':
      return <Crown className={className} />;
    case 'Sparkles':
      return <Sparkles className={className} />;
    case 'Soup':
      return <Soup className={className} />;
    case 'Pizza':
      return <Pizza className={className} />;
    case 'ChefHat':
      return <ChefHat className={className} />;
    case 'CupSoda':
      return <CupSoda className={className} />;
    case 'CakeSlice':
      return <CakeSlice className={className} />;
    default:
      return <UtensilsCrossed className={className} />;
  }
};

export const HomePage: React.FC = () => {
  const {
    lang,
    t,
    settings,
    categories,
    menuItems,
    reviews,
    navigateTo,
    addToCart,
    submitReview,
  } = useApp();

  const { isOpen, currentDayIndex } = getRestaurantOpenStatus();

  const [reviewAuthor, setReviewAuthor] = useState('');
  const [reviewRating, setReviewRating] = useState(5);
  const [reviewComment, setReviewComment] = useState('');
  const [submittingReview, setSubmittingReview] = useState(false);
  const [showReviewForm, setShowReviewForm] = useState(false);

  const visibleCategories = categories.filter((c) => c.isVisible);
  const visibleMenuItems = menuItems.filter((m) => m.isVisible).slice(0, 6);
  const approvedReviews = reviews.filter((r) => r.isApproved);

  const cleanWhatsapp = (settings.whatsapp || '01080240315').replace(/[^0-9]/g, '');
  const intlWhatsapp = cleanWhatsapp.startsWith('0') ? `2${cleanWhatsapp}` : cleanWhatsapp;

  const banquetWhatsappUrl = `https://wa.me/${intlWhatsapp}?text=${encodeURIComponent(
    lang === 'ar'
      ? 'مرحبًا مطعم حضرموت الباجور، أود الاستفسار عن تجهيز العزومات والوجبات العائلية وعشاء العروسة.'
      : 'Hello Hadramout El-Bagour Restaurant, I would like to inquire about banquet catering and family meals.'
  )}`;

  const mapsDirectionsUrl = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(
    'مطعم حضرموت الباجور مدينة الباجور المنوفية مصر'
  )}`;

  const handleReviewSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!reviewAuthor.trim() || !reviewComment.trim()) return;
    setSubmittingReview(true);
    try {
      await submitReview({
        authorName: reviewAuthor,
        rating: reviewRating,
        comment: reviewComment,
      });
      setReviewAuthor('');
      setReviewComment('');
      setReviewRating(5);
      setShowReviewForm(false);
    } finally {
      setSubmittingReview(false);
    }
  };

  return (
    <div className="space-y-20 md:space-y-28 pb-12">
      {/* 1. HERO SECTION */}
      <section className="relative min-h-[82vh] flex items-center overflow-hidden border-b border-[#D4AF37]/15">
        <div className="absolute inset-0 z-0">
          <ResilientImage
            src={GENERATED_IMAGES.heroFeast}
            alt={t('مطعم حضرموت الباجور - مأكولات شرقية ومشويات', 'Hadramout El-Bagour Oriental Feast')}
            priority={true}
            className="w-full h-full object-cover object-center scale-102 transition-transform duration-700"
          />
          {/* Measured Scrim for WCAG AA contrast across all frames */}
          <div className="absolute inset-0 bg-gradient-to-t from-[#120F0D] via-[#120F0D]/80 to-[#120F0D]/55" />
          <div className="absolute inset-0 bg-gradient-to-r from-[#120F0D]/90 via-[#120F0D]/60 to-transparent" />
        </div>

        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 md:py-24 w-full">
          <div className="max-w-2xl space-y-6">
            {/* Unboxed Kicker Metadata */}
            <div className="flex flex-wrap items-center gap-2 text-xs sm:text-sm font-medium text-[#D4AF37]">
              <span>{t('مطعم مأكولات شرقية', 'Oriental Cuisine Restaurant')}</span>
              <span aria-hidden="true">·</span>
              <span>{t('مدينة الباجور، المنوفية', 'El-Bagour, Menofia')}</span>
              <span aria-hidden="true">·</span>
              <span className={isOpen ? 'text-emerald-400' : 'text-amber-400'}>
                {isOpen ? t('مفتوح الآن', 'Open Now') : t('مغلق الآن', 'Closed Now')}
              </span>
            </div>

            {/* Restaurant Name */}
            <h1
              className={`text-4xl sm:text-5xl lg:text-6xl font-bold text-[#F5EFE6] leading-tight text-balance ${
                lang === 'ar' ? 'font-display-ar' : 'font-display-en'
              }`}
            >
              {t(settings.heroTitleAr, settings.heroTitleEn)}
            </h1>

            {/* Subtitle */}
            <p className="text-xl sm:text-2xl font-semibold text-[#D4AF37] text-balance">
              {t(settings.heroSubtitleAr, settings.heroSubtitleEn)}
            </p>

            {/* Description */}
            <p className="text-base sm:text-lg text-[#F5EFE6]/85 leading-relaxed max-w-xl">
              {t(settings.heroDescAr, settings.heroDescEn)}
            </p>

            {/* Primary CTA Buttons */}
            <div className="pt-2 flex flex-wrap items-center gap-3.5">
              <button
                type="button"
                onClick={() => navigateTo('menu')}
                className="px-6 py-3.5 text-sm sm:text-base font-bold text-[#120F0D] bg-[#D4AF37] hover:bg-[#E5C349] rounded-xl shadow-lg transition-all duration-150 hover:-translate-y-0.5 whitespace-nowrap cursor-pointer"
              >
                {t('استعرض المنيو', 'Explore Menu')}
              </button>

              <button
                type="button"
                onClick={() => navigateTo('checkout')}
                className="px-6 py-3.5 text-sm sm:text-base font-semibold text-[#F5EFE6] bg-[#1C1714]/90 hover:bg-[#251E1A] border border-[#D4AF37]/40 rounded-xl transition-all duration-150 hover:-translate-y-0.5 whitespace-nowrap cursor-pointer"
              >
                {t('اطلب الآن', 'Order Now')}
              </button>

              <button
                type="button"
                onClick={() => navigateTo('reservations')}
                className="px-6 py-3.5 text-sm sm:text-base font-semibold text-[#F5EFE6]/90 hover:text-[#D4AF37] bg-transparent hover:bg-[#1C1714]/60 border border-[#F5EFE6]/20 rounded-xl transition-colors whitespace-nowrap cursor-pointer"
              >
                {t('احجز طاولة', 'Book a Table')}
              </button>
            </div>

            {/* Proof Metrics Adjacency (Rating + Services) */}
            <div className="pt-6 border-t border-[#D4AF37]/15 flex flex-wrap items-center gap-x-6 gap-y-2 text-xs sm:text-sm text-[#A69B8D]">
              <div className="flex items-center gap-1.5">
                <Star className="w-4 h-4 text-[#D4AF37] fill-[#D4AF37]" />
                <span className="font-mono-num font-bold text-[#F5EFE6]">4.1 / 5</span>
                <span>({t('580 تقييمًا', '580 reviews')})</span>
              </div>
              <span aria-hidden="true">·</span>
              <span>{t('الجلوس داخل المطعم', 'Dine-in')}</span>
              <span aria-hidden="true">·</span>
              <span>{t('استلام من المطعم', 'Takeaway')}</span>
              <span aria-hidden="true">·</span>
              <span>{t('توصيل بدون تلامس', 'Contactless Delivery')}</span>
            </div>
          </div>
        </div>
      </section>

      {/* 2. CATEGORIES SECTION */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8" id="categories">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-10">
          <div className="space-y-2">
            <span className="text-xs font-medium text-[#D4AF37]">
              {t('تشكيلة المأكولات الشرقية', 'Oriental Culinary Selection')}
            </span>
            <h2
              className={`text-3xl sm:text-4xl font-bold text-[#F5EFE6] text-balance ${
                lang === 'ar' ? 'font-display-ar' : 'font-display-en'
              }`}
            >
              {t('الأقسام الرئيسية للمنيو', 'Main Menu Categories')}
            </h2>
          </div>
          <p className="text-sm text-[#A69B8D] max-w-md">
            {t(
              'اختر القسم المفضل لديك للانتقال مباشرة إلى الأصناف المتاحة في المنيو.',
              'Select a category below to jump directly to its dishes on our menu.'
            )}
          </p>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4 sm:gap-5">
          {visibleCategories.map((cat) => (
            <button
              key={cat.id}
              type="button"
              onClick={() => navigateTo('menu', { categoryId: cat.id })}
              className="group text-start bg-[#1C1714] hover:bg-[#251E1A] border border-[#D4AF37]/14 hover:border-[#D4AF37]/40 rounded-2xl overflow-hidden transition-all duration-150 hover:-translate-y-0.5 cursor-pointer flex flex-col"
            >
              <div className="relative aspect-[4/3] w-full overflow-hidden bg-[#120F0D]">
                <ResilientImage
                  src={cat.imageUrl}
                  alt={t(cat.nameAr, cat.nameEn)}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#1C1714] via-transparent to-transparent opacity-80" />
                <div className="absolute bottom-2.5 start-2.5 w-8 h-8 rounded-lg bg-[#120F0D]/85 border border-[#D4AF37]/30 flex items-center justify-center text-[#D4AF37]">
                  <CategoryIcon name={cat.iconName} className="w-4 h-4" />
                </div>
              </div>
              <div className="p-3.5 flex-1 flex flex-col justify-between">
                <div>
                  <h3 className="text-sm sm:text-base font-bold text-[#F5EFE6] group-hover:text-[#D4AF37] transition-colors">
                    {t(cat.nameAr, cat.nameEn)}
                  </h3>
                  <p className="text-xs text-[#A69B8D] line-clamp-2 mt-1">
                    {t(cat.descriptionAr, cat.descriptionEn)}
                  </p>
                </div>
              </div>
            </button>
          ))}
        </div>
      </section>

      {/* 3. FEATURED MENU PREVIEW SECTION */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-10">
          <div className="space-y-2">
            <span className="text-xs font-medium text-[#D4AF37]">
              {t('من مطبخنا الشرقي', 'From Our Oriental Kitchen')}
            </span>
            <h2
              className={`text-3xl sm:text-4xl font-bold text-[#F5EFE6] text-balance ${
                lang === 'ar' ? 'font-display-ar' : 'font-display-en'
              }`}
            >
              {t('مختارات من المنيو', 'Menu Highlights')}
            </h2>
          </div>
          <button
            type="button"
            onClick={() => navigateTo('menu', { categoryId: 'all' })}
            className="px-5 py-2.5 text-xs sm:text-sm font-semibold text-[#D4AF37] hover:text-[#120F0D] bg-transparent hover:bg-[#D4AF37] border border-[#D4AF37]/40 rounded-xl transition-colors whitespace-nowrap self-start sm:self-auto cursor-pointer"
          >
            {t('عرض المنيو بالكامل', 'View Full Menu')}
          </button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {visibleMenuItems.map((item) => {
            const category = categories.find((c) => c.id === item.categoryId);
            return (
              <div
                key={item.id}
                className="bg-[#1C1714] border border-[#D4AF37]/14 rounded-2xl overflow-hidden flex flex-col justify-between transition-transform duration-150 hover:-translate-y-0.5"
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

                  <div className="p-5 space-y-2">
                    {/* Clean unboxed metadata (Zero-Pill Discipline) */}
                    <div className="flex items-center gap-2 text-xs text-[#A69B8D]">
                      <span>
                        {category
                          ? t(category.nameAr, category.nameEn)
                          : t('أطباق شرقية', 'Oriental')}
                      </span>
                      {item.isPopular && (
                        <>
                          <span aria-hidden="true">·</span>
                          <span className="text-[#D4AF37] font-medium">
                            {t('الأكثر طلبًا', 'Most Popular')}
                          </span>
                        </>
                      )}
                      {item.isNew && (
                        <>
                          <span aria-hidden="true">·</span>
                          <span className="text-emerald-400 font-medium">
                            {t('جديد', 'New')}
                          </span>
                        </>
                      )}
                      {item.isSpecialOffer && (
                        <>
                          <span aria-hidden="true">·</span>
                          <span className="text-amber-400 font-medium">
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
                      <h3 className="text-lg font-bold text-[#F5EFE6] hover:text-[#D4AF37] transition-colors">
                        {t(item.nameAr, item.nameEn)}
                      </h3>
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
                      <span className="text-xs font-medium text-[#D4AF37]/90">
                        {t('السعر حسب الاختيار / يحدد عند الطلب', 'Price upon request')}
                      </span>
                    )}
                  </div>

                  <button
                    type="button"
                    onClick={() => addToCart(item, 1)}
                    className="inline-flex items-center gap-1.5 px-3.5 py-2 text-xs font-semibold text-[#120F0D] bg-[#D4AF37] hover:bg-[#E5C349] rounded-lg transition-colors whitespace-nowrap shrink-0 cursor-pointer"
                  >
                    <Plus className="w-3.5 h-3.5" />
                    <span>{t('أضف إلى الطلب', 'Add to Order')}</span>
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* 4. ABOUT SECTION (عن حضرموت الباجور) */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8" id="about-section">
        <div className="bg-[#1C1714] border border-[#D4AF37]/15 rounded-3xl p-6 sm:p-10 lg:p-12 grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center">
          <div className="lg:col-span-7 space-y-5">
            <span className="text-xs font-medium text-[#D4AF37]">
              {t('تعرف على مطعمنا', 'About Our Restaurant')}
            </span>
            <h2
              className={`text-3xl sm:text-4xl font-bold text-[#F5EFE6] text-balance ${
                lang === 'ar' ? 'font-display-ar' : 'font-display-en'
              }`}
            >
              {t('عن حضرموت الباجور', 'About Hadramout El-Bagour')}
            </h2>
            <p className="text-sm sm:text-base text-[#F5EFE6]/85 leading-relaxed">
              {t(settings.aboutTextAr, settings.aboutTextEn)}
            </p>

            {/* 3 Services Highlight */}
            <div className="pt-4 grid grid-cols-1 sm:grid-cols-3 gap-4 border-t border-[#D4AF37]/12">
              <div className="flex items-center gap-3">
                <UtensilsCrossed className="w-5 h-5 text-[#D4AF37] shrink-0" />
                <div>
                  <h3 className="text-sm font-semibold text-[#F5EFE6]">
                    {t('الجلوس داخل المطعم', 'Dine-In Service')}
                  </h3>
                  <p className="text-xs text-[#A69B8D]">
                    {t('أجواء مريحة للأفراد والعائلات', 'Welcoming family seating')}
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <ShoppingBag className="w-5 h-5 text-[#D4AF37] shrink-0" />
                <div>
                  <h3 className="text-sm font-semibold text-[#F5EFE6]">
                    {t('استلام من المطعم (Takeaway)', 'Takeaway Pickup')}
                  </h3>
                  <p className="text-xs text-[#A69B8D]">
                    {t('تجهيز سريع وتغليف محكم', 'Fast preparation & packaging')}
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <Truck className="w-5 h-5 text-[#D4AF37] shrink-0" />
                <div>
                  <h3 className="text-sm font-semibold text-[#F5EFE6]">
                    {t('توصيل بدون تلامس', 'Contactless Delivery')}
                  </h3>
                  <p className="text-xs text-[#A69B8D]">
                    {t('إلى باب منزلك بأعلى عناية', 'Safe doorstep delivery')}
                  </p>
                </div>
              </div>
            </div>
          </div>

          <div className="lg:col-span-5">
            <div className="aspect-[4/3] rounded-2xl overflow-hidden border border-[#D4AF37]/20 bg-[#120F0D]">
              <ResilientImage
                src={GENERATED_IMAGES.mandiPlatter}
                alt={t('أطباق حضرموت الباجور الشرقية', 'Hadramout El-Bagour Dishes')}
                className="w-full h-full object-cover"
              />
            </div>
          </div>
        </div>
      </section>

      {/* 5. BANQUETS & FAMILY MEALS SECTION (للعزومات والمناسبات) */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="relative rounded-3xl overflow-hidden border border-[#D4AF37]/25 bg-[#181310]">
          <div className="grid grid-cols-1 lg:grid-cols-12 items-center">
            <div className="lg:col-span-6 p-6 sm:p-10 lg:p-12 space-y-6">
              <div className="flex items-center gap-2 text-xs font-medium text-[#D4AF37]">
                <span>{t('الوجبات العائلية', 'Family Meals')}</span>
                <span aria-hidden="true">·</span>
                <span>{t('العزومات', 'Banquets')}</span>
                <span aria-hidden="true">·</span>
                <span>{t('عشاء العروسة', "Bride's Dinner")}</span>
              </div>

              <h2
                className={`text-3xl sm:text-4xl font-bold text-[#F5EFE6] text-balance ${
                  lang === 'ar' ? 'font-display-ar' : 'font-display-en'
                }`}
              >
                {t('للعزومات والمناسبات', 'For Banquets & Special Occasions')}
              </h2>

              <p className="text-sm sm:text-base text-[#F5EFE6]/85 leading-relaxed">
                {t(settings.banquetTextAr, settings.banquetTextEn)}
              </p>

              <ul className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs sm:text-sm text-[#F5EFE6]/90">
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-[#D4AF37] shrink-0" />
                  <span>{t('تشكيلات الوجبات العائلية المتنوعة', 'Diverse Family Meal Platters')}</span>
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-[#D4AF37] shrink-0" />
                  <span>{t('صواني العزومات والولائم الشرقية', 'Oriental Banquet Trays')}</span>
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-[#D4AF37] shrink-0" />
                  <span>{t('تجهيزات خاصة لعشاء العروسة', "Bride's Dinner Special Catering")}</span>
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-[#D4AF37] shrink-0" />
                  <span>{t('تجمعات العائلات والمناسبات', 'Family Gatherings & Events')}</span>
                </li>
              </ul>

              <div className="pt-2 flex flex-wrap items-center gap-3">
                <a
                  href={banquetWhatsappUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 px-6 py-3.5 text-sm font-bold text-[#120F0D] bg-[#D4AF37] hover:bg-[#E5C349] rounded-xl transition-colors whitespace-nowrap"
                >
                  <MessageCircle className="w-4 h-4" />
                  <span>{t('تواصل معنا للعزومات', 'Contact Us for Banquets')}</span>
                </a>

                <button
                  type="button"
                  onClick={() => navigateTo('menu', { categoryId: 'banquets' })}
                  className="px-5 py-3.5 text-sm font-semibold text-[#F5EFE6] bg-[#251E1A] hover:bg-[#2F2621] border border-[#D4AF37]/25 rounded-xl transition-colors whitespace-nowrap cursor-pointer"
                >
                  {t('استعرض قسم العزومات', 'View Banquet Menu')}
                </button>
              </div>
            </div>

            <div className="lg:col-span-6 h-full min-h-[280px] lg:min-h-[420px] relative">
              <ResilientImage
                src={GENERATED_IMAGES.familyFeast}
                alt={t('للعزومات والمناسبات في حضرموت الباجور', 'Banquets and Family Gatherings')}
                className="w-full h-full object-cover"
              />
            </div>
          </div>
        </div>
      </section>

      {/* 6. CUSTOMER REVIEWS SECTION (آراء عملائنا) */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-[#1C1714] border border-[#D4AF37]/15 rounded-3xl p-6 sm:p-10 space-y-8">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 border-b border-[#D4AF37]/12 pb-8">
            <div className="space-y-2">
              <span className="text-xs font-medium text-[#D4AF37]">
                {t('ثقة عملائنا في الباجور والمنوفية', 'Customer Trust in El-Bagour')}
              </span>
              <h2
                className={`text-3xl sm:text-4xl font-bold text-[#F5EFE6] ${
                  lang === 'ar' ? 'font-display-ar' : 'font-display-en'
                }`}
              >
                {t('آراء عملائنا', 'Customer Reviews')}
              </h2>
              <p className="text-xs sm:text-sm text-[#A69B8D]">
                {t(
                  'التقييم العام للمطعم بناءً على التقييمات المتوفرة من عملائنا.',
                  'Overall restaurant rating based on verified customer ratings.'
                )}
              </p>
            </div>

            {/* Verified 4.1 / 5 (580 reviews) Display */}
            <div className="flex items-center gap-5 bg-[#120F0D] border border-[#D4AF37]/20 rounded-2xl px-6 py-4">
              <div className="text-center">
                <div className="font-mono-num text-3xl sm:text-4xl font-bold text-[#D4AF37]">
                  4.1 <span className="text-lg text-[#A69B8D]">/ 5</span>
                </div>
                <div className="flex items-center justify-center gap-1 my-1.5" aria-label="4.1 out of 5 stars">
                  {[1, 2, 3, 4].map((s) => (
                    <Star key={s} className="w-4 h-4 text-[#D4AF37] fill-[#D4AF37]" />
                  ))}
                  <Star className="w-4 h-4 text-[#D4AF37]/40 fill-[#D4AF37]/40" />
                </div>
                <p className="text-xs text-[#A69B8D] font-mono-num">
                  {t('بناءً على 580 تقييمًا', 'Based on 580 reviews')}
                </p>
              </div>

              <div className="h-12 w-[1px] bg-[#D4AF37]/15" />

              <button
                type="button"
                onClick={() => setShowReviewForm(!showReviewForm)}
                className="px-4 py-2.5 text-xs sm:text-sm font-semibold text-[#120F0D] bg-[#D4AF37] hover:bg-[#E5C349] rounded-xl transition-colors whitespace-nowrap cursor-pointer"
              >
                {t('أضف تقييمك', 'Add Your Review')}
              </button>
            </div>
          </div>

          {/* Submit Review Form */}
          {showReviewForm && (
            <form
              onSubmit={handleReviewSubmit}
              className="bg-[#120F0D] border border-[#D4AF37]/20 rounded-2xl p-5 space-y-4 max-w-xl"
            >
              <h3 className="text-base font-bold text-[#F5EFE6]">
                {t('شاركنا تجربتك في مطعم حضرموت الباجور', 'Share your experience with us')}
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs text-[#A69B8D] mb-1">
                    {t('الاسم', 'Your Name')}
                  </label>
                  <input
                    type="text"
                    required
                    minLength={2}
                    maxLength={80}
                    value={reviewAuthor}
                    onChange={(e) => setReviewAuthor(e.target.value)}
                    className="w-full px-3.5 py-2 text-sm bg-[#1C1714] border border-[#D4AF37]/20 rounded-lg text-[#F5EFE6] focus:outline-none focus:border-[#D4AF37]"
                  />
                </div>
                <div>
                  <label className="block text-xs text-[#A69B8D] mb-1">
                    {t('التقييم (من 1 إلى 5)', 'Rating (1 to 5)')}
                  </label>
                  <select
                    value={reviewRating}
                    onChange={(e) => setReviewRating(Number(e.target.value))}
                    className="w-full px-3.5 py-2 text-sm bg-[#1C1714] border border-[#D4AF37]/20 rounded-lg text-[#F5EFE6] focus:outline-none focus:border-[#D4AF37]"
                  >
                    <option value={5}>5 - {t('ممتاز', 'Excellent')}</option>
                    <option value={4}>4 - {t('جيد جدًا', 'Very Good')}</option>
                    <option value={3}>3 - {t('جيد', 'Good')}</option>
                    <option value={2}>2 - {t('مقبول', 'Fair')}</option>
                    <option value={1}>1 - {t('ضعيف', 'Poor')}</option>
                  </select>
                </div>
              </div>
              <div>
                <label className="block text-xs text-[#A69B8D] mb-1">
                  {t('رأيك في الطعام والخدمة', 'Your Review')}
                </label>
                <textarea
                  required
                  minLength={2}
                  maxLength={600}
                  rows={3}
                  value={reviewComment}
                  onChange={(e) => setReviewComment(e.target.value)}
                  className="w-full px-3.5 py-2 text-sm bg-[#1C1714] border border-[#D4AF37]/20 rounded-lg text-[#F5EFE6] focus:outline-none focus:border-[#D4AF37]"
                />
              </div>
              <div className="flex items-center gap-3">
                <button
                  type="submit"
                  disabled={submittingReview}
                  className="px-5 py-2 text-xs font-bold text-[#120F0D] bg-[#D4AF37] hover:bg-[#E5C349] rounded-lg disabled:opacity-50 cursor-pointer"
                >
                  {submittingReview
                    ? t('جاري الإرسال...', 'Submitting...')
                    : t('إرسال التقييم', 'Submit Review')}
                </button>
                <button
                  type="button"
                  onClick={() => setShowReviewForm(false)}
                  className="px-4 py-2 text-xs text-[#A69B8D] hover:text-[#F5EFE6] cursor-pointer"
                >
                  {t('إلغاء', 'Cancel')}
                </button>
              </div>
            </form>
          )}

          {/* Approved Customer Reviews List (No fake reviews invented) */}
          {approvedReviews.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
              {approvedReviews.map((rev) => (
                <div
                  key={rev.id}
                  className="bg-[#120F0D] border border-[#D4AF37]/14 rounded-2xl p-5 space-y-3"
                >
                  <div className="flex items-center justify-between">
                    <span className="font-semibold text-sm text-[#F5EFE6]">
                      {rev.authorName}
                    </span>
                    <div className="flex items-center gap-0.5">
                      {Array.from({ length: rev.rating }).map((_, idx) => (
                        <Star
                          key={idx}
                          className="w-3.5 h-3.5 text-[#D4AF37] fill-[#D4AF37]"
                        />
                      ))}
                    </div>
                  </div>
                  <p className="text-xs sm:text-sm text-[#F5EFE6]/80 leading-relaxed">
                    "{rev.comment}"
                  </p>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-xs sm:text-sm text-[#A69B8D]">
              {t(
                'التقييم العام 4.1 / 5 مبني على 580 تقييمًا من عملاء المطعم. يمكنك إضافة تقييمك الخاص أو إدارة التقييمات المعتمدة من لوحة التحكم.',
                'The 4.1 / 5 rating is based on 580 customer ratings. You can submit your own review above or manage verified reviews in the Admin Dashboard.'
              )}
            </p>
          )}
        </div>
      </section>

      {/* 7. ESSENTIAL INFO, WORKING HOURS & LOCATION SECTION */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          {/* Working Hours Table */}
          <div className="lg:col-span-6 bg-[#1C1714] border border-[#D4AF37]/15 rounded-3xl p-6 sm:p-8 space-y-6">
            <div className="flex items-center justify-between border-b border-[#D4AF37]/12 pb-4">
              <div className="flex items-center gap-2.5">
                <Clock className="w-5 h-5 text-[#D4AF37]" />
                <h2
                  className={`text-2xl font-bold text-[#F5EFE6] ${
                    lang === 'ar' ? 'font-display-ar' : 'font-display-en'
                  }`}
                >
                  {t('مواعيد العمل', 'Working Hours')}
                </h2>
              </div>
              <span
                className={`text-xs font-bold ${
                  isOpen ? 'text-emerald-400' : 'text-amber-400'
                }`}
              >
                {isOpen ? t('● مفتوح الآن', '● Open Now') : t('● مغلق الآن', '● Closed Now')}
              </span>
            </div>

            <div className="divide-y divide-[#D4AF37]/10 text-sm">
              {WORKING_HOURS.map((wh) => {
                const isToday = wh.dayIndex === currentDayIndex;
                return (
                  <div
                    key={wh.dayIndex}
                    className={`py-2.5 flex items-center justify-between gap-4 ${
                      isToday ? 'text-[#D4AF37] font-semibold' : 'text-[#F5EFE6]/85'
                    }`}
                  >
                    <span>
                      {t(wh.dayAr, wh.dayEn)}{' '}
                      {isToday && (
                        <span className="text-xs font-normal text-[#D4AF37]/80">
                          ({t('اليوم', 'Today')})
                        </span>
                      )}
                    </span>
                    <span className="font-mono-num text-xs sm:text-sm">
                      {t(wh.hoursAr, wh.hoursEn)}
                    </span>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Location & Essential Information */}
          <div className="lg:col-span-6 bg-[#1C1714] border border-[#D4AF37]/15 rounded-3xl p-6 sm:p-8 flex flex-col justify-between space-y-6">
            <div className="space-y-5">
              <div className="flex items-center gap-2.5 border-b border-[#D4AF37]/12 pb-4">
                <MapPin className="w-5 h-5 text-[#D4AF37]" />
                <h2
                  className={`text-2xl font-bold text-[#F5EFE6] ${
                    lang === 'ar' ? 'font-display-ar' : 'font-display-en'
                  }`}
                >
                  {t('موقعنا والمعلومات الأساسية', 'Our Location & Essential Info')}
                </h2>
              </div>

              <div className="space-y-4 text-sm">
                <div>
                  <span className="text-xs text-[#A69B8D] block mb-1">
                    {t('العنوان المؤكد', 'Verified Address')}
                  </span>
                  <p className="text-base font-semibold text-[#F5EFE6]">
                    {t(settings.addressAr, settings.addressEn)}
                  </p>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
                  <div>
                    <span className="text-xs text-[#A69B8D] block mb-1">
                      {t('رقم الهاتف والواتساب', 'Phone & WhatsApp')}
                    </span>
                    <a
                      href={`tel:${settings.phone}`}
                      dir="ltr"
                      className="font-mono-num text-base font-bold text-[#D4AF37] hover:underline"
                    >
                      {settings.phone}
                    </a>
                  </div>

                  <div>
                    <span className="text-xs text-[#A69B8D] block mb-1">
                      {t('التقييم العام', 'Overall Rating')}
                    </span>
                    <p className="font-mono-num text-base font-bold text-[#F5EFE6]">
                      4.1 / 5{' '}
                      <span className="text-xs font-normal text-[#A69B8D]">
                        ({t('580 تقييمًا', '580 reviews')})
                      </span>
                    </p>
                  </div>
                </div>

                <div className="pt-2">
                  <span className="text-xs text-[#A69B8D] block mb-1">
                    {t('الفئة السعرية', 'Price Range Info')}
                  </span>
                  <p className="text-xs sm:text-sm text-[#F5EFE6]/80">
                    {t(settings.priceRangeNoteAr, settings.priceRangeNoteEn)}
                  </p>
                </div>
              </div>
            </div>

            <div className="pt-4 border-t border-[#D4AF37]/12 flex flex-wrap items-center gap-3">
              <a
                href={mapsDirectionsUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 px-5 py-3 text-xs sm:text-sm font-bold text-[#120F0D] bg-[#D4AF37] hover:bg-[#E5C349] rounded-xl transition-colors whitespace-nowrap"
              >
                <MapPin className="w-4 h-4" />
                <span>{t('احصل على الاتجاهات', 'Get Directions')}</span>
                <ExternalLink className="w-3.5 h-3.5" />
              </a>

              <a
                href={`tel:${settings.phone}`}
                className="inline-flex items-center gap-2 px-5 py-3 text-xs sm:text-sm font-semibold text-[#F5EFE6] bg-[#251E1A] hover:bg-[#2F2621] border border-[#D4AF37]/25 rounded-xl transition-colors whitespace-nowrap"
              >
                <Phone className="w-4 h-4 text-[#D4AF37]" />
                <span>{t('اتصل بنا', 'Call Us')}</span>
              </a>

              <button
                type="button"
                onClick={() => navigateTo('reservations')}
                className="inline-flex items-center gap-2 px-5 py-3 text-xs sm:text-sm font-semibold text-[#F5EFE6] bg-transparent hover:bg-[#251E1A] border border-[#D4AF37]/20 rounded-xl transition-colors whitespace-nowrap cursor-pointer"
              >
                <Calendar className="w-4 h-4 text-[#D4AF37]" />
                <span>{t('احجز طاولتك', 'Book a Table')}</span>
              </button>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};
