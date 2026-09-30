import React from 'react';
import { Phone, MapPin, Clock, ShieldCheck, PackageSearch } from 'lucide-react';
import { useApp } from '../context/AppContext';
import { getRestaurantOpenStatus } from '../data/initialData';

export const Footer: React.FC = () => {
  const { lang, t, settings, navigateTo, isAdmin } = useApp();
  const { isOpen } = getRestaurantOpenStatus();

  return (
    <footer className="bg-[#0D0A08] border-t border-[#D4AF37]/15 pt-14 pb-20 md:pb-12 text-[#A69B8D]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10 pb-12 border-b border-[#D4AF37]/10">
          {/* Column 1: Brand Identity */}
          <div className="space-y-4">
            <h3
              className={`text-2xl font-bold text-[#D4AF37] ${
                lang === 'ar' ? 'font-display-ar' : 'font-display-en'
              }`}
            >
              {t('مطعم حضرموت الباجور', 'Hadramout El-Bagour')}
            </h3>
            <p className="text-sm leading-relaxed text-[#F5EFE6]/75">
              {t(
                'مذاق شرقي أصيل بتجربة تستحق التكرار. نقدم تشكيلة متنوعة من المشويات على الفحم، المندي، الكفتة، الوجبات العائلية، وتجهيز العزومات وعشاء العروسة في مدينة الباجور.',
                'Authentic Oriental taste in El-Bagour. Serving charcoal grills, traditional Mandi, Kofta, generous family platters, and banquet catering.'
              )}
            </p>
            <div className="text-xs text-[#A69B8D] flex items-center gap-2">
              <span>{t('التقييم العام:', 'Overall Rating:')}</span>
              <span className="font-mono-num font-semibold text-[#D4AF37]">4.1 / 5</span>
              <span aria-hidden="true">·</span>
              <span>{t('580 تقييمًا', '580 reviews')}</span>
            </div>
          </div>

          {/* Column 2: Quick Links */}
          <div className="space-y-4">
            <h4 className="text-sm font-semibold text-[#F5EFE6] tracking-wide">
              {t('روابط سريعة', 'Quick Links')}
            </h4>
            <ul className="space-y-2.5 text-sm">
              <li>
                <button
                  type="button"
                  onClick={() => navigateTo('home')}
                  className="hover:text-[#D4AF37] transition-colors cursor-pointer"
                >
                  {t('الرئيسية', 'Home')}
                </button>
              </li>
              <li>
                <button
                  type="button"
                  onClick={() => navigateTo('about')}
                  className="hover:text-[#D4AF37] transition-colors cursor-pointer"
                >
                  {t('من نحن', 'About Us')}
                </button>
              </li>
              <li>
                <button
                  type="button"
                  onClick={() => navigateTo('menu')}
                  className="hover:text-[#D4AF37] transition-colors cursor-pointer"
                >
                  {t('المنيو', 'Menu')}
                </button>
              </li>
              <li>
                <button
                  type="button"
                  onClick={() => navigateTo('cart')}
                  className="hover:text-[#D4AF37] transition-colors cursor-pointer"
                >
                  {t('الطلبات والسلة', 'Orders & Cart')}
                </button>
              </li>
              <li>
                <button
                  type="button"
                  onClick={() => navigateTo('reservations')}
                  className="hover:text-[#D4AF37] transition-colors cursor-pointer"
                >
                  {t('احجز طاولتك', 'Table Reservations')}
                </button>
              </li>
              <li>
                <button
                  type="button"
                  onClick={() => navigateTo('order-tracking')}
                  className="inline-flex items-center gap-1.5 hover:text-[#D4AF37] transition-colors cursor-pointer"
                >
                  <PackageSearch className="w-3.5 h-3.5 text-[#D4AF37]" />
                  <span>{t('تتبع الطلب', 'Track Order')}</span>
                </button>
              </li>
              <li>
                <button
                  type="button"
                  onClick={() => navigateTo('contact')}
                  className="hover:text-[#D4AF37] transition-colors cursor-pointer"
                >
                  {t('تواصل معنا', 'Contact Us')}
                </button>
              </li>
            </ul>
          </div>

          {/* Column 3: Contact Info */}
          <div className="space-y-4">
            <h4 className="text-sm font-semibold text-[#F5EFE6] tracking-wide">
              {t('بيانات التواصل', 'Contact Information')}
            </h4>
            <div className="space-y-3 text-sm">
              <div className="flex items-start gap-2.5">
                <MapPin className="w-4 h-4 text-[#D4AF37] shrink-0 mt-1" />
                <span>{t(settings.addressAr, settings.addressEn)}</span>
              </div>
              <div className="flex items-center gap-2.5">
                <Phone className="w-4 h-4 text-[#D4AF37] shrink-0" />
                <a
                  href={`tel:${settings.phone}`}
                  className="font-mono-num text-[#F5EFE6] hover:text-[#D4AF37] transition-colors"
                  dir="ltr"
                >
                  {settings.phone}
                </a>
              </div>
            </div>

            {/* Social Media - Only rendered if official URLs are set in Admin */}
            {(settings.facebookUrl || settings.instagramUrl) && (
              <div className="pt-2 space-y-2">
                <span className="text-xs text-[#A69B8D] block">
                  {t('الحسابات الرسمية:', 'Official Accounts:')}
                </span>
                <div className="flex items-center gap-3 text-xs">
                  {settings.facebookUrl && (
                    <a
                      href={settings.facebookUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-[#D4AF37] hover:underline"
                    >
                      Facebook
                    </a>
                  )}
                  {settings.instagramUrl && (
                    <a
                      href={settings.instagramUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-[#D4AF37] hover:underline"
                    >
                      Instagram
                    </a>
                  )}
                </div>
              </div>
            )}
          </div>

          {/* Column 4: Working Hours */}
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h4 className="text-sm font-semibold text-[#F5EFE6] tracking-wide">
                {t('مواعيد العمل', 'Working Hours')}
              </h4>
              <span
                className={`text-xs font-semibold ${
                  isOpen ? 'text-emerald-400' : 'text-amber-400'
                }`}
              >
                {isOpen ? t('مفتوح الآن', 'Open Now') : t('مغلق الآن', 'Closed Now')}
              </span>
            </div>
            <div className="space-y-2 text-xs leading-relaxed">
              <div className="flex items-start gap-2">
                <Clock className="w-4 h-4 text-[#D4AF37] shrink-0 mt-0.5" />
                <div>
                  <p className="text-[#F5EFE6] font-medium">
                    {t('السبت – الخميس:', 'Saturday – Thursday:')}
                  </p>
                  <p>{t('10:01 صباحًا – 12:00 منتصف الليل', '10:01 AM – 12:00 Midnight')}</p>
                </div>
              </div>
              <div className="flex items-start gap-2">
                <Clock className="w-4 h-4 text-[#D4AF37] shrink-0 mt-0.5" />
                <div>
                  <p className="text-[#F5EFE6] font-medium">{t('الجمعة:', 'Friday:')}</p>
                  <p>{t('10:01 صباحًا – 3:01 صباحًا', '10:01 AM – 3:01 AM')}</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Copyright & Admin Access */}
        <div className="pt-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs">
          <p>
            © {new Date().getFullYear()} {t('مطعم حضرموت الباجور. جميع الحقوق محفوظة.', 'Hadramout El-Bagour Restaurant. All rights reserved.')}
          </p>
          <button
            type="button"
            onClick={() => navigateTo(isAdmin ? 'admin-dashboard' : 'admin-login')}
            className="inline-flex items-center gap-1.5 text-[#A69B8D] hover:text-[#D4AF37] transition-colors cursor-pointer"
          >
            <ShieldCheck className="w-3.5 h-3.5" />
            <span>{t('بوابة الإدارة', 'Admin Portal')}</span>
          </button>
        </div>
      </div>
    </footer>
  );
};
