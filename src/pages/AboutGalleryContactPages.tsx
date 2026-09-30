import React, { useState } from 'react';
import {
  UtensilsCrossed,
  ShoppingBag,
  Truck,
  Phone,
  MessageCircle,
  MapPin,
  Clock,
  Star,
  ExternalLink,
  X,
  Info,
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import { ResilientImage } from '../components/ResilientImage';
import {
  GENERATED_IMAGES,
  WORKING_HOURS,
  getRestaurantOpenStatus,
  GalleryItemData,
} from '../data/initialData';

export const AboutPage: React.FC = () => {
  const { lang, t, settings, navigateTo } = useApp();

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-14 space-y-16">
      <div className="border-b border-[#D4AF37]/15 pb-6 space-y-2">
        <span className="text-xs font-medium text-[#D4AF37]">
          {t('مطعم مأكولات شرقية في مدينة الباجور', 'Oriental Cuisine in El-Bagour City')}
        </span>
        <h1
          className={`text-3xl sm:text-5xl font-bold text-[#F5EFE6] ${
            lang === 'ar' ? 'font-display-ar' : 'font-display-en'
          }`}
        >
          {t('عن حضرموت الباجور', 'About Hadramout El-Bagour')}
        </h1>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-center">
        <div className="lg:col-span-6 space-y-5">
          <h2
            className={`text-2xl sm:text-3xl font-bold text-[#D4AF37] ${
              lang === 'ar' ? 'font-display-ar' : 'font-display-en'
            }`}
          >
            {t(settings.heroSubtitleAr, settings.heroSubtitleEn)}
          </h2>
          <p className="text-base text-[#F5EFE6]/85 leading-relaxed">
            {t(settings.aboutTextAr, settings.aboutTextEn)}
          </p>
          <p className="text-sm sm:text-base text-[#A69B8D] leading-relaxed">
            {t(settings.banquetTextAr, settings.banquetTextEn)}
          </p>

          <div className="pt-4 flex flex-wrap items-center gap-3.5">
            <button
              type="button"
              onClick={() => navigateTo('menu')}
              className="px-6 py-3 text-sm font-bold text-[#120F0D] bg-[#D4AF37] hover:bg-[#E5C349] rounded-xl transition-colors cursor-pointer"
            >
              {t('تصفح المنيو', 'Explore Our Menu')}
            </button>
            <button
              type="button"
              onClick={() => navigateTo('reservations')}
              className="px-6 py-3 text-sm font-semibold text-[#F5EFE6] bg-[#1C1714] hover:bg-[#251E1A] border border-[#D4AF37]/25 rounded-xl transition-colors cursor-pointer"
            >
              {t('احجز طاولتك', 'Book a Table')}
            </button>
          </div>
        </div>

        <div className="lg:col-span-6 grid grid-cols-2 gap-4">
          <div className="aspect-[4/3] rounded-2xl overflow-hidden border border-[#D4AF37]/20 bg-[#1C1714] col-span-2">
            <ResilientImage
              src={GENERATED_IMAGES.heroFeast}
              alt={t('مأكولات حضرموت الباجور الشرقية', 'Hadramout Oriental Feast')}
            />
          </div>
          <div className="aspect-[4/3] rounded-2xl overflow-hidden border border-[#D4AF37]/20 bg-[#1C1714]">
            <ResilientImage
              src={GENERATED_IMAGES.mandiPlatter}
              alt={t('المندي الشرقي', 'Traditional Mandi')}
            />
          </div>
          <div className="aspect-[4/3] rounded-2xl overflow-hidden border border-[#D4AF37]/20 bg-[#1C1714]">
            <ResilientImage
              src={GENERATED_IMAGES.mixedGrills}
              alt={t('المشويات على الفحم', 'Charcoal Grills')}
            />
          </div>
        </div>
      </div>

      {/* Services & Highlights */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-[#1C1714] border border-[#D4AF37]/15 rounded-2xl p-6 space-y-3">
          <UtensilsCrossed className="w-7 h-7 text-[#D4AF37]" />
          <h3 className="text-lg font-bold text-[#F5EFE6]">
            {t('الجلوس داخل المطعم (Dine-in)', 'Dine-In Hospitality')}
          </h3>
          <p className="text-xs sm:text-sm text-[#A69B8D] leading-relaxed">
            {t(
              'صالة طعام مجهزة لاستقبال الأفراد والعائلات والمجموعات في أجواء شرقية مريحة ومناسبة للعزومات.',
              'Welcoming dining hall suited for individuals, families, and group gatherings.'
            )}
          </p>
        </div>

        <div className="bg-[#1C1714] border border-[#D4AF37]/15 rounded-2xl p-6 space-y-3">
          <ShoppingBag className="w-7 h-7 text-[#D4AF37]" />
          <h3 className="text-lg font-bold text-[#F5EFE6]">
            {t('استلام من المطعم (Takeaway)', 'Takeaway Service')}
          </h3>
          <p className="text-xs sm:text-sm text-[#A69B8D] leading-relaxed">
            {t(
              'اطلب مسبقًا عبر الموقع أو الهاتف واستلم طلبك ساخنًا ومغلفًا بعناية من مقر المطعم في مدينة الباجور.',
              'Order ahead online or by phone and pick up your freshly prepared meal in El-Bagour.'
            )}
          </p>
        </div>

        <div className="bg-[#1C1714] border border-[#D4AF37]/15 rounded-2xl p-6 space-y-3">
          <Truck className="w-7 h-7 text-[#D4AF37]" />
          <h3 className="text-lg font-bold text-[#F5EFE6]">
            {t('توصيل بدون تلامس (Contactless Delivery)', 'Contactless Delivery')}
          </h3>
          <p className="text-xs sm:text-sm text-[#A69B8D] leading-relaxed">
            {t(
              'خدمة توصيل الطلبات والوجبات العائلية والعزومات مع الحفاظ على حرارة وجودة الأطباق.',
              'Safe and reliable delivery service for meals, family platters, and banquets.'
            )}
          </p>
        </div>
      </div>
    </div>
  );
};

export const GalleryPage: React.FC = () => {
  const { lang, t, galleryItems, isAdmin, navigateTo } = useApp();
  const [filter, setFilter] = useState<'all' | GalleryItemData['category']>('all');
  const [lightboxItem, setLightboxItem] = useState<GalleryItemData | null>(null);

  const visibleGallery = galleryItems.filter((g) => g.isVisible);
  const filteredGallery =
    filter === 'all' ? visibleGallery : visibleGallery.filter((g) => g.category === filter);

  const hasPlaceholders = filteredGallery.some((g) => g.isPlaceholder);

  const tabs: { id: 'all' | GalleryItemData['category']; labelAr: string; labelEn: string }[] = [
    { id: 'all', labelAr: 'الكل', labelEn: 'All' },
    { id: 'dishes', labelAr: 'أطباق', labelEn: 'Dishes' },
    { id: 'grills', labelAr: 'مشويات', labelEn: 'Grills' },
    { id: 'mandi', labelAr: 'مندي', labelEn: 'Mandi' },
    { id: 'family', labelAr: 'الوجبات العائلية', labelEn: 'Family Meals' },
    { id: 'ambiance', labelAr: 'أجواء المطعم', labelEn: 'Ambiance' },
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-14 space-y-8">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 border-b border-[#D4AF37]/15 pb-6">
        <div className="space-y-2">
          <span className="text-xs font-medium text-[#D4AF37]">
            {t('جولة بصرية في قائمة طعامنا', 'Visual Culinary Showcase')}
          </span>
          <h1
            className={`text-3xl sm:text-5xl font-bold text-[#F5EFE6] ${
              lang === 'ar' ? 'font-display-ar' : 'font-display-en'
            }`}
          >
            {t('معرض الصور', 'Photo Gallery')}
          </h1>
        </div>

        {isAdmin && (
          <button
            type="button"
            onClick={() => navigateTo('admin-dashboard')}
            className="px-4 py-2 text-xs font-bold text-[#120F0D] bg-[#D4AF37] rounded-xl cursor-pointer"
          >
            {t('إدارة صور المعرض من لوحة التحكم', 'Manage Gallery in Admin')}
          </button>
        )}
      </div>

      {/* Transparent Notice for Illustrative Placeholders (Section 18 Requirement) */}
      {hasPlaceholders && (
        <div className="bg-[#1C1714] border border-[#D4AF37]/20 rounded-2xl p-4 flex items-start gap-3 text-xs text-[#A69B8D]">
          <Info className="w-4 h-4 text-[#D4AF37] shrink-0 mt-0.5" />
          <p>
            {t(
              'ملاحظة: الصور المميزة بعلامة "صورة توضيحية" هي صور تعبيرية لأقسام الطعام، وهي قابلة للاستبدال بصور المطعم الفوتوغرافية المباشرة في أي وقت من خلال لوحة التحكم.',
              'Note: Images marked as illustrative represent our dish categories and can be replaced with live restaurant photography anytime via the Admin Dashboard.'
            )}
          </p>
        </div>
      )}

      {/* Filter Tabs */}
      <div className="flex items-center gap-2 overflow-x-auto pb-2">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            type="button"
            onClick={() => setFilter(tab.id)}
            className={`px-4 py-2 text-xs sm:text-sm font-semibold rounded-xl transition-colors whitespace-nowrap shrink-0 cursor-pointer ${
              filter === tab.id
                ? 'bg-[#D4AF37] text-[#120F0D]'
                : 'bg-[#1C1714] text-[#F5EFE6]/80 hover:text-[#F5EFE6] border border-[#D4AF37]/15'
            }`}
          >
            {t(tab.labelAr, tab.labelEn)}
          </button>
        ))}
      </div>

      {/* Gallery Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredGallery.map((item) => (
          <div
            key={item.id}
            onClick={() => setLightboxItem(item)}
            className="group bg-[#1C1714] border border-[#D4AF37]/15 rounded-2xl overflow-hidden cursor-pointer transition-transform duration-150 hover:-translate-y-0.5"
          >
            <div className="aspect-[4/3] overflow-hidden bg-[#120F0D]">
              <ResilientImage
                src={item.imageUrl}
                alt={t(item.titleAr, item.titleEn)}
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
              />
            </div>
            <div className="p-4 space-y-1">
              <div className="text-xs text-[#D4AF37]">
                {item.isPlaceholder
                  ? t('صورة توضيحية قابلة للاستبدال', 'Illustrative (Replaceable via Admin)')
                  : t('صورة من المطعم', 'Restaurant Photo')}
              </div>
              <h3 className="text-sm font-bold text-[#F5EFE6]">
                {t(item.titleAr, item.titleEn)}
              </h3>
            </div>
          </div>
        ))}
      </div>

      {/* Lightbox Modal */}
      {lightboxItem && (
        <div
          onClick={() => setLightboxItem(null)}
          className="fixed inset-0 z-50 bg-black/85 backdrop-blur-xs flex items-center justify-center p-4"
        >
          <div
            onClick={(e) => e.stopPropagation()}
            className="max-w-3xl w-full bg-[#1C1714] border border-[#D4AF37]/30 rounded-3xl overflow-hidden shadow-2xl"
          >
            <div className="relative aspect-[16/10] bg-[#120F0D]">
              <ResilientImage
                src={lightboxItem.imageUrl}
                alt={t(lightboxItem.titleAr, lightboxItem.titleEn)}
                className="w-full h-full object-contain"
              />
              <button
                type="button"
                onClick={() => setLightboxItem(null)}
                className="absolute top-4 end-4 p-2 rounded-full bg-black/70 text-white hover:bg-black cursor-pointer"
                aria-label={t('إغلاق', 'Close')}
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="p-5 flex items-center justify-between gap-4">
              <div>
                <h3 className="text-base font-bold text-[#F5EFE6]">
                  {t(lightboxItem.titleAr, lightboxItem.titleEn)}
                </h3>
                {lightboxItem.isPlaceholder && (
                  <p className="text-xs text-[#A69B8D] mt-0.5">
                    {t(
                      'صورة توضيحية لقسم الطعام — قابلة للاستبدال من لوحة التحكم',
                      'Illustrative category image — replaceable via Admin Dashboard'
                    )}
                  </p>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export const ContactPage: React.FC = () => {
  const { lang, t, settings } = useApp();
  const { isOpen, currentDayIndex } = getRestaurantOpenStatus();

  const cleanWhatsapp = (settings.whatsapp || '01080240315').replace(/[^0-9]/g, '');
  const intlWhatsapp = cleanWhatsapp.startsWith('0') ? `2${cleanWhatsapp}` : cleanWhatsapp;
  const mapsDirectionsUrl = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(
    'مطعم حضرموت الباجور مدينة الباجور المنوفية مصر'
  )}`;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-14 space-y-10">
      <div className="border-b border-[#D4AF37]/15 pb-6 space-y-2">
        <span className="text-xs font-medium text-[#D4AF37]">
          {t('نسعد بخدمتكم وتواصلكم', 'We Are Happy to Serve You')}
        </span>
        <h1
          className={`text-3xl sm:text-5xl font-bold text-[#F5EFE6] ${
            lang === 'ar' ? 'font-display-ar' : 'font-display-en'
          }`}
        >
          {t('تواصل معنا وموقع المطعم', 'Contact Us & Location')}
        </h1>
      </div>

      {/* Direct Contact Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-[#1C1714] border border-[#D4AF37]/15 rounded-2xl p-6 space-y-4 flex flex-col justify-between">
          <div className="space-y-2">
            <Phone className="w-6 h-6 text-[#D4AF37]" />
            <h2 className="text-lg font-bold text-[#F5EFE6]">
              {t('الاتصال المباشر', 'Direct Phone Call')}
            </h2>
            <p className="text-xs text-[#A69B8D]">
              {t('للطلبات السريعة والاستفسارات وحجز الطاولات', 'For quick orders and reservations')}
            </p>
            <p className="font-mono-num text-xl font-bold text-[#D4AF37] pt-1" dir="ltr">
              {settings.phone}
            </p>
          </div>
          <a
            href={`tel:${settings.phone}`}
            className="w-full inline-flex items-center justify-center gap-2 py-3 px-4 text-xs sm:text-sm font-bold text-[#120F0D] bg-[#D4AF37] hover:bg-[#E5C349] rounded-xl transition-colors"
          >
            <Phone className="w-4 h-4" />
            <span>{t('اتصل بنا الآن', 'Call Us Now')}</span>
          </a>
        </div>

        <div className="bg-[#1C1714] border border-[#D4AF37]/15 rounded-2xl p-6 space-y-4 flex flex-col justify-between">
          <div className="space-y-2">
            <MessageCircle className="w-6 h-6 text-[#1E8E3E]" />
            <h2 className="text-lg font-bold text-[#F5EFE6]">
              {t('واتساب الطلبات والعزومات', 'WhatsApp Orders & Banquets')}
            </h2>
            <p className="text-xs text-[#A69B8D]">
              {t('تواصل معنا مباشرة عبر واتساب لإرسال طلبك أو تنسيق عزومتك', 'Message us directly on WhatsApp')}
            </p>
            <p className="font-mono-num text-xl font-bold text-[#F5EFE6] pt-1" dir="ltr">
              {settings.whatsapp}
            </p>
          </div>
          <a
            href={`https://wa.me/${intlWhatsapp}`}
            target="_blank"
            rel="noopener noreferrer"
            className="w-full inline-flex items-center justify-center gap-2 py-3 px-4 text-xs sm:text-sm font-bold text-white bg-[#1E8E3E] hover:bg-[#187732] rounded-xl transition-colors"
          >
            <MessageCircle className="w-4 h-4 fill-current" />
            <span>{t('مراسلة عبر واتساب', 'Chat on WhatsApp')}</span>
          </a>
        </div>

        <div className="bg-[#1C1714] border border-[#D4AF37]/15 rounded-2xl p-6 space-y-4 flex flex-col justify-between">
          <div className="space-y-2">
            <MapPin className="w-6 h-6 text-[#D4AF37]" />
            <h2 className="text-lg font-bold text-[#F5EFE6]">
              {t('العنوان والموقع', 'Address & Directions')}
            </h2>
            <p className="text-sm font-medium text-[#F5EFE6]/90">
              {t(settings.addressAr, settings.addressEn)}
            </p>
            <div className="flex items-center gap-1.5 text-xs text-[#A69B8D] pt-1">
              <Star className="w-3.5 h-3.5 text-[#D4AF37] fill-[#D4AF37]" />
              <span className="font-mono-num font-bold text-[#F5EFE6]">4.1 / 5</span>
              <span>({t('580 تقييمًا', '580 reviews')})</span>
            </div>
          </div>
          <a
            href={mapsDirectionsUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="w-full inline-flex items-center justify-center gap-2 py-3 px-4 text-xs sm:text-sm font-semibold text-[#F5EFE6] bg-[#251E1A] hover:bg-[#2F2621] border border-[#D4AF37]/25 rounded-xl transition-colors"
          >
            <MapPin className="w-4 h-4 text-[#D4AF37]" />
            <span>{t('احصل على الاتجاهات', 'Get Directions')}</span>
            <ExternalLink className="w-3.5 h-3.5" />
          </a>
        </div>
      </div>

      {/* Working Hours Schedule */}
      <div className="bg-[#1C1714] border border-[#D4AF37]/15 rounded-3xl p-6 sm:p-8 space-y-6">
        <div className="flex flex-wrap items-center justify-between gap-4 border-b border-[#D4AF37]/12 pb-4">
          <div className="flex items-center gap-2.5">
            <Clock className="w-5 h-5 text-[#D4AF37]" />
            <h2 className="text-xl font-bold text-[#F5EFE6]">
              {t('جدول مواعيد العمل الرسمية', 'Official Working Hours Schedule')}
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

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {WORKING_HOURS.map((wh) => {
            const isToday = wh.dayIndex === currentDayIndex;
            return (
              <div
                key={wh.dayIndex}
                className={`p-4 rounded-2xl border ${
                  isToday
                    ? 'bg-[#D4AF37]/10 border-[#D4AF37]/40'
                    : 'bg-[#120F0D] border-[#D4AF37]/10'
                }`}
              >
                <div className="font-bold text-sm text-[#F5EFE6] mb-1">
                  {t(wh.dayAr, wh.dayEn)}
                </div>
                <div className="font-mono-num text-xs text-[#D4AF37]">
                  {t(wh.hoursAr, wh.hoursEn)}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
