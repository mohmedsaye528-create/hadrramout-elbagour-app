import React from 'react';
import {
  Home,
  UtensilsCrossed,
  ShoppingBag,
  Calendar,
  Phone,
  MessageCircle,
  X,
  Plus,
  Minus,
  Trash2,
  ArrowRight,
  ArrowLeft,
  CheckCircle2,
  AlertCircle,
  Info,
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import { ResilientImage } from './ResilientImage';

export const FloatingActions: React.FC = () => {
  const {
    lang,
    t,
    currentPage,
    navigateTo,
    settings,
    cart,
    cartCount,
    cartTotal,
    hasUnpricedCartItems,
    isCartDrawerOpen,
    setIsCartDrawerOpen,
    updateCartQuantity,
    removeFromCart,
    toasts,
    dismissToast,
  } = useApp();

  const cleanWhatsapp = (settings.whatsapp || '01080240315').replace(/[^0-9]/g, '');
  const intlWhatsapp = cleanWhatsapp.startsWith('0')
    ? `2${cleanWhatsapp}`
    : cleanWhatsapp;

  const defaultWaMessage = encodeURIComponent(
    lang === 'ar'
      ? 'مرحبًا مطعم حضرموت الباجور، أود الاستفسار عن المنيو والطلب.'
      : 'Hello Hadramout El-Bagour Restaurant, I would like to inquire about your menu and ordering.'
  );

  return (
    <>
      {/* Toast Notifications */}
      <div
        aria-live="polite"
        className="fixed top-16 md:top-24 end-4 z-50 flex flex-col gap-2 max-w-sm w-full pointer-events-none px-2 sm:px-0"
      >
        {toasts.map((toast) => (
          <div
            key={toast.id}
            className={`pointer-events-auto flex items-center justify-between gap-3 px-4 py-3 rounded-xl shadow-xl border backdrop-blur-md transition-all duration-200 ${
              toast.type === 'error'
                ? 'bg-[#2A1212]/95 border-red-500/40 text-red-100'
                : toast.type === 'info'
                ? 'bg-[#1C1714]/95 border-[#D4AF37]/40 text-[#F5EFE6]'
                : 'bg-[#14261C]/95 border-emerald-500/40 text-emerald-50'
            }`}
          >
            <div className="flex items-center gap-2.5 text-xs sm:text-sm font-medium">
              {toast.type === 'error' ? (
                <AlertCircle className="w-4 h-4 text-red-400 shrink-0" />
              ) : toast.type === 'info' ? (
                <Info className="w-4 h-4 text-[#D4AF37] shrink-0" />
              ) : (
                <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
              )}
              <span>{toast.text}</span>
            </div>
            <button
              type="button"
              onClick={() => dismissToast(toast.id)}
              className="text-current opacity-70 hover:opacity-100 p-1 cursor-pointer"
              aria-label={t('إغلاق التنبيه', 'Dismiss notification')}
            >
              <X className="w-3.5 h-3.5" />
            </button>
          </div>
        ))}
      </div>

      {/* Slide-Over Cart Drawer */}
      {isCartDrawerOpen && (
        <div className="fixed inset-0 z-50 overflow-hidden">
          <div
            onClick={() => setIsCartDrawerOpen(false)}
            className="fixed inset-0 bg-black/75 backdrop-blur-xs transition-opacity"
            aria-hidden="true"
          />
          <div className="fixed inset-y-0 end-0 max-w-full flex ps-10">
            <div className="w-screen max-w-md bg-[#181310] border-s border-[#D4AF37]/20 shadow-2xl flex flex-col justify-between">
              {/* Drawer Header */}
              <div className="p-5 border-b border-[#D4AF37]/15 flex items-center justify-between">
                <div className="flex items-center gap-2.5">
                  <ShoppingBag className="w-5 h-5 text-[#D4AF37]" />
                  <h2 className="text-lg font-bold text-[#F5EFE6]">
                    {t('سلة الطلبات', 'Your Order Cart')}
                  </h2>
                  <span className="text-xs font-mono-num text-[#A69B8D]">
                    ({cartCount})
                  </span>
                </div>
                <button
                  type="button"
                  onClick={() => setIsCartDrawerOpen(false)}
                  className="p-2 text-[#A69B8D] hover:text-[#F5EFE6] rounded-lg hover:bg-[#251E1A] transition-colors cursor-pointer"
                  aria-label={t('إغلاق السلة', 'Close cart')}
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Drawer Body */}
              <div className="flex-1 overflow-y-auto p-5 space-y-4">
                {cart.length === 0 ? (
                  <div className="h-full flex flex-col items-center justify-center text-center py-12">
                    <ShoppingBag className="w-12 h-12 text-[#D4AF37]/30 mb-3" />
                    <p className="text-base font-medium text-[#F5EFE6] mb-1">
                      {t('سلة الطلبات فارغة حاليًا', 'Your order cart is currently empty')}
                    </p>
                    <p className="text-xs text-[#A69B8D] max-w-xs mb-6">
                      {t(
                        'تصفح المنيو واختر أطباقك الشرقية المفضلة من المشويات والمندي والوجبات العائلية.',
                        'Browse our menu and add your favorite Oriental grills, Mandi, and family platters.'
                      )}
                    </p>
                    <button
                      type="button"
                      onClick={() => {
                        setIsCartDrawerOpen(false);
                        navigateTo('menu');
                      }}
                      className="px-5 py-2.5 bg-[#D4AF37] hover:bg-[#E5C349] text-[#120F0D] font-semibold text-sm rounded-lg transition-colors cursor-pointer"
                    >
                      {t('تصفح المنيو', 'Explore Menu')}
                    </button>
                  </div>
                ) : (
                  cart.map(({ item, quantity, notes }) => (
                    <div
                      key={item.id}
                      className="flex gap-3.5 p-3 rounded-xl bg-[#1C1714] border border-[#D4AF37]/12"
                    >
                      <div className="w-20 h-20 rounded-lg overflow-hidden shrink-0 bg-[#120F0D]">
                        <ResilientImage
                          src={item.imageUrl}
                          alt={t(item.nameAr, item.nameEn)}
                          className="w-full h-full object-cover"
                        />
                      </div>
                      <div className="flex-1 min-w-0 flex flex-col justify-between">
                        <div>
                          <div className="flex items-start justify-between gap-2">
                            <h3 className="text-sm font-semibold text-[#F5EFE6] truncate">
                              {t(item.nameAr, item.nameEn)}
                            </h3>
                            <button
                              type="button"
                              onClick={() => removeFromCart(item.id)}
                              aria-label={t('حذف الصنف', 'Remove item')}
                              className="text-[#A69B8D] hover:text-red-400 p-1 transition-colors cursor-pointer"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </div>
                          {notes && (
                            <p className="text-xs text-[#A69B8D] truncate mt-0.5">
                              {notes}
                            </p>
                          )}
                        </div>

                        <div className="flex items-center justify-between mt-2">
                          <span className="text-xs font-mono-num font-semibold text-[#D4AF37]">
                            {item.price > 0
                              ? `${item.price * quantity} ${t('ج.م', 'EGP')}`
                              : t('السعر يحدد عند التأكيد', 'Price on confirmation')}
                          </span>

                          <div className="inline-flex items-center gap-2 bg-[#120F0D] border border-[#D4AF37]/20 rounded-lg px-2 py-1">
                            <button
                              type="button"
                              onClick={() => updateCartQuantity(item.id, quantity - 1)}
                              className="text-[#F5EFE6] hover:text-[#D4AF37] p-0.5 cursor-pointer"
                              aria-label={t('تقليل الكمية', 'Decrease quantity')}
                            >
                              <Minus className="w-3.5 h-3.5" />
                            </button>
                            <span className="text-xs font-mono-num font-semibold min-w-[1.25rem] text-center">
                              {quantity}
                            </span>
                            <button
                              type="button"
                              onClick={() => updateCartQuantity(item.id, quantity + 1)}
                              className="text-[#F5EFE6] hover:text-[#D4AF37] p-0.5 cursor-pointer"
                              aria-label={t('زيادة الكمية', 'Increase quantity')}
                            >
                              <Plus className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))
                )}
              </div>

              {/* Drawer Footer */}
              {cart.length > 0 && (
                <div className="p-5 border-t border-[#D4AF37]/15 bg-[#14100E] space-y-4">
                  <div className="space-y-1.5">
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-[#A69B8D]">
                        {t('إجمالي الأصناف المسعرة', 'Subtotal (Priced Items)')}
                      </span>
                      <span className="font-mono-num font-bold text-base text-[#D4AF37]">
                        {cartTotal > 0
                          ? `${cartTotal} ${t('ج.م', 'EGP')}`
                          : t('يحدد عند تأكيد الطلب', 'Confirmed upon order')}
                      </span>
                    </div>
                    {hasUnpricedCartItems && (
                      <p className="text-xs text-[#A69B8D]">
                        {t(
                          '* يحتوي الطلب على أصناف يتم تحديد سعرها النهائي حسب الحجم أو الاختيار عند التواصل.',
                          '* Order contains items whose final price is confirmed based on portion selection.'
                        )}
                      </p>
                    )}
                  </div>

                  <div className="grid grid-cols-2 gap-2.5">
                    <button
                      type="button"
                      onClick={() => {
                        setIsCartDrawerOpen(false);
                        navigateTo('cart');
                      }}
                      className="px-4 py-2.5 text-xs sm:text-sm font-semibold text-[#F5EFE6] bg-[#251E1A] hover:bg-[#2F2621] border border-[#D4AF37]/20 rounded-lg transition-colors whitespace-nowrap cursor-pointer"
                    >
                      {t('عرض السلة', 'View Cart')}
                    </button>
                    <button
                      type="button"
                      onClick={() => {
                        setIsCartDrawerOpen(false);
                        navigateTo('checkout');
                      }}
                      className="inline-flex items-center justify-center gap-1.5 px-4 py-2.5 text-xs sm:text-sm font-semibold text-[#120F0D] bg-[#D4AF37] hover:bg-[#E5C349] rounded-lg transition-colors whitespace-nowrap cursor-pointer"
                    >
                      <span>{t('إتمام الطلب', 'Checkout')}</span>
                      {lang === 'ar' ? (
                        <ArrowLeft className="w-4 h-4" />
                      ) : (
                        <ArrowRight className="w-4 h-4" />
                      )}
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Floating WhatsApp Button */}
      <a
        href={`https://wa.me/${intlWhatsapp}?text=${defaultWaMessage}`}
        target="_blank"
        rel="noopener noreferrer"
        aria-label={t('تواصل عبر واتساب', 'Chat on WhatsApp')}
        className="fixed bottom-18 md:bottom-6 end-4 md:end-6 z-30 inline-flex items-center gap-2 px-3.5 py-2.5 rounded-full bg-[#1E8E3E] hover:bg-[#187732] text-white shadow-lg transition-transform duration-150 hover:-translate-y-0.5 focus-visible:outline-2 focus-visible:outline-white"
      >
        <MessageCircle className="w-5 h-5 fill-current" />
        <span className="hidden sm:inline text-xs font-semibold whitespace-nowrap">
          {t('واتساب المطعم', 'WhatsApp')}
        </span>
      </a>

      {/* Mobile Sticky Bottom Action Bar (<= 15% viewport height governance) */}
      <nav
        aria-label={t('شريط الإجراءات السريعة للهاتف', 'Mobile Quick Actions')}
        className="md:hidden fixed bottom-0 inset-x-0 z-30 h-14 bg-[#14100E]/95 backdrop-blur-md border-t border-[#D4AF37]/20 grid grid-cols-5 items-center px-1"
      >
        <button
          type="button"
          onClick={() => navigateTo('home')}
          className={`flex flex-col items-center justify-center h-full gap-0.5 text-[11px] font-medium transition-colors cursor-pointer ${
            currentPage === 'home' ? 'text-[#D4AF37]' : 'text-[#A69B8D]'
          }`}
        >
          <Home className="w-4 h-4" />
          <span className="whitespace-nowrap">{t('الرئيسية', 'Home')}</span>
        </button>

        <button
          type="button"
          onClick={() => navigateTo('menu')}
          className={`flex flex-col items-center justify-center h-full gap-0.5 text-[11px] font-medium transition-colors cursor-pointer ${
            currentPage === 'menu' ? 'text-[#D4AF37]' : 'text-[#A69B8D]'
          }`}
        >
          <UtensilsCrossed className="w-4 h-4" />
          <span className="whitespace-nowrap">{t('المنيو', 'Menu')}</span>
        </button>

        <button
          type="button"
          onClick={() => navigateTo('checkout')}
          className="relative flex flex-col items-center justify-center h-full gap-0.5 text-[11px] font-semibold text-[#D4AF37] cursor-pointer"
        >
          <div className="relative">
            <ShoppingBag className="w-4 h-4" />
            {cartCount > 0 && (
              <span className="absolute -top-1.5 -end-2.5 text-[10px] font-mono-num font-bold bg-[#D4AF37] text-[#120F0D] rounded-full px-1 leading-tight">
                {cartCount}
              </span>
            )}
          </div>
          <span className="whitespace-nowrap">{t('اطلب', 'Order')}</span>
        </button>

        <button
          type="button"
          onClick={() => navigateTo('reservations')}
          className={`flex flex-col items-center justify-center h-full gap-0.5 text-[11px] font-medium transition-colors cursor-pointer ${
            currentPage === 'reservations' ? 'text-[#D4AF37]' : 'text-[#A69B8D]'
          }`}
        >
          <Calendar className="w-4 h-4" />
          <span className="whitespace-nowrap">{t('حجز', 'Book')}</span>
        </button>

        <a
          href={`tel:${settings.phone || '01080240315'}`}
          className="flex flex-col items-center justify-center h-full gap-0.5 text-[11px] font-medium text-[#A69B8D] hover:text-[#D4AF37] transition-colors"
        >
          <Phone className="w-4 h-4" />
          <span className="whitespace-nowrap">{t('اتصال', 'Call')}</span>
        </a>
      </nav>
    </>
  );
};
