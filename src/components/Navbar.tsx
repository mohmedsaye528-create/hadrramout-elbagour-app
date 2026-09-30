import React, { useState } from 'react';
import { ShoppingBag, Menu as MenuIcon, X, Globe, ShieldCheck, PackageSearch } from 'lucide-react';
import { useApp, PageView } from '../context/AppContext';

export const Navbar: React.FC = () => {
  const {
    lang,
    setLang,
    t,
    currentPage,
    navigateTo,
    cartCount,
    setIsCartDrawerOpen,
    isAdmin,
  } = useApp();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const navItems: { id: PageView; labelAr: string; labelEn: string }[] = [
    { id: 'home', labelAr: 'الرئيسية', labelEn: 'Home' },
    { id: 'menu', labelAr: 'المنيو', labelEn: 'Menu' },
    { id: 'reservations', labelAr: 'احجز طاولة', labelEn: 'Reservations' },
    { id: 'gallery', labelAr: 'معرض الصور', labelEn: 'Gallery' },
    { id: 'contact', labelAr: 'تواصل معنا', labelEn: 'Contact' },
  ];

  const handleNav = (page: PageView) => {
    navigateTo(page);
    setMobileMenuOpen(false);
  };

  return (
    <header className="sticky top-0 z-40 h-14 md:h-20 bg-[#120F0D]/95 backdrop-blur-md border-b border-[#D4AF37]/15">
      <div className="max-w-7xl mx-auto h-full px-4 sm:px-6 lg:px-8 flex items-center justify-between gap-4">
        {/* Zone 1: Single text element wordmark */}
        <button
          type="button"
          onClick={() => handleNav('home')}
          className={`text-xl md:text-2xl font-bold tracking-tight text-[#D4AF37] hover:text-[#E5C349] transition-colors whitespace-nowrap shrink-0 cursor-pointer focus-visible:outline-2 focus-visible:outline-[#D4AF37] ${
            lang === 'ar' ? 'font-display-ar' : 'font-display-en'
          }`}
        >
          {t('مطعم حضرموت الباجور', 'Hadramout El-Bagour')}
        </button>

        {/* Zone 2: 5 clean text navigation links */}
        <nav
          aria-label={t('التنقل الرئيسي', 'Main Navigation')}
          className="hidden lg:flex items-center gap-7 text-sm font-medium text-[#F5EFE6]/80"
        >
          {navItems.map((item) => {
            const isActive = currentPage === item.id;
            return (
              <button
                key={item.id}
                type="button"
                onClick={() => handleNav(item.id)}
                className={`relative py-1 whitespace-nowrap shrink-0 transition-colors cursor-pointer ${
                  isActive
                    ? 'text-[#D4AF37] font-semibold after:absolute after:bottom-0 after:inset-x-0 after:h-[2px] after:bg-[#D4AF37]'
                    : 'hover:text-[#F5EFE6]'
                }`}
              >
                {t(item.labelAr, item.labelEn)}
              </button>
            );
          })}
        </nav>

        {/* Zone 3: Primary actions (Language toggle, Cart, Order CTA) */}
        <div className="flex items-center gap-2.5 sm:gap-3 shrink-0">
          <button
            type="button"
            onClick={() => setLang(lang === 'ar' ? 'en' : 'ar')}
            aria-label={t('تغيير اللغة إلى الإنجليزية', 'Switch language to Arabic')}
            className="inline-flex items-center gap-1.5 px-2.5 py-1.5 text-xs font-medium text-[#F5EFE6]/85 hover:text-[#D4AF37] border border-[#D4AF37]/20 rounded-lg transition-colors whitespace-nowrap shrink-0 cursor-pointer"
          >
            <Globe className="w-3.5 h-3.5 text-[#D4AF37]" />
            <span>{lang === 'ar' ? 'EN' : 'عربي'}</span>
          </button>

          <button
            type="button"
            onClick={() => setIsCartDrawerOpen(true)}
            aria-label={t('سلة الطلبات', 'Shopping Cart')}
            className="relative inline-flex items-center gap-2 px-3 py-1.5 text-xs sm:text-sm font-medium text-[#F5EFE6] bg-[#1C1714] hover:bg-[#251E1A] border border-[#D4AF37]/25 rounded-lg transition-colors whitespace-nowrap shrink-0 cursor-pointer"
          >
            <ShoppingBag className="w-4 h-4 text-[#D4AF37]" />
            <span className="hidden sm:inline">{t('الطلب', 'Order')}</span>
            <span className="font-mono-num text-xs font-semibold text-[#D4AF37]">
              ({cartCount})
            </span>
          </button>

          <button
            type="button"
            onClick={() => handleNav('menu')}
            className="hidden sm:inline-flex items-center justify-center px-4 py-2 text-xs sm:text-sm font-semibold text-[#120F0D] bg-[#D4AF37] hover:bg-[#E5C349] rounded-lg transition-colors whitespace-nowrap shrink-0 cursor-pointer"
          >
            {t('اطلب الآن', 'Order Now')}
          </button>

          {/* Mobile Drawer Trigger */}
          <button
            type="button"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            aria-label={t('القائمة الجانبية', 'Toggle Menu')}
            className="lg:hidden p-2 text-[#F5EFE6] hover:text-[#D4AF37] rounded-lg border border-[#D4AF37]/20 cursor-pointer"
          >
            {mobileMenuOpen ? <X className="w-5 h-5" /> : <MenuIcon className="w-5 h-5" />}
          </button>
        </div>
      </div>

      {/* Mobile Navigation Dropdown */}
      {mobileMenuOpen && (
        <div className="lg:hidden bg-[#181310] border-b border-[#D4AF37]/20 px-4 pt-3 pb-5 space-y-2 shadow-2xl">
          <div className="grid grid-cols-2 gap-2">
            {navItems.map((item) => (
              <button
                key={item.id}
                type="button"
                onClick={() => handleNav(item.id)}
                className={`text-start px-3.5 py-2.5 rounded-lg text-sm font-medium transition-colors ${
                  currentPage === item.id
                    ? 'bg-[#D4AF37]/15 text-[#D4AF37] border border-[#D4AF37]/30'
                    : 'text-[#F5EFE6]/85 hover:bg-[#251E1A]'
                }`}
              >
                {t(item.labelAr, item.labelEn)}
              </button>
            ))}
            <button
              type="button"
              onClick={() => handleNav('about')}
              className={`text-start px-3.5 py-2.5 rounded-lg text-sm font-medium transition-colors ${
                currentPage === 'about'
                  ? 'bg-[#D4AF37]/15 text-[#D4AF37] border border-[#D4AF37]/30'
                  : 'text-[#F5EFE6]/85 hover:bg-[#251E1A]'
              }`}
            >
              {t('عن المطعم', 'About Us')}
            </button>
            <button
              type="button"
              onClick={() => handleNav('order-tracking')}
              className={`inline-flex items-center gap-2 text-start px-3.5 py-2.5 rounded-lg text-sm font-medium transition-colors ${
                currentPage === 'order-tracking'
                  ? 'bg-[#D4AF37]/15 text-[#D4AF37] border border-[#D4AF37]/30'
                  : 'text-[#F5EFE6]/85 hover:bg-[#251E1A]'
              }`}
            >
              <PackageSearch className="w-4 h-4 text-[#D4AF37]" />
              <span>{t('تتبع الطلب', 'Track Order')}</span>
            </button>
            <button
              type="button"
              onClick={() => handleNav(isAdmin ? 'admin-dashboard' : 'admin-login')}
              className="inline-flex items-center gap-2 text-start px-3.5 py-2.5 rounded-lg text-sm font-medium text-[#A69B8D] hover:text-[#D4AF37] hover:bg-[#251E1A] transition-colors"
            >
              <ShieldCheck className="w-4 h-4 text-[#D4AF37]" />
              <span>{t('لوحة التحكم', 'Admin Panel')}</span>
            </button>
          </div>
        </div>
      )}
    </header>
  );
};
