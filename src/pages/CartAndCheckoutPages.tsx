import React, { useState, useEffect } from 'react';
import {
  ShoppingBag,
  Trash2,
  Plus,
  Minus,
  ArrowRight,
  ArrowLeft,
  MessageCircle,
  CheckCircle2,
  Truck,
  Store,
  Banknote,
  PackageSearch,
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import { ResilientImage } from '../components/ResilientImage';

export const CartPage: React.FC = () => {
  const {
    lang,
    t,
    cart,
    cartTotal,
    cartCount,
    hasUnpricedCartItems,
    updateCartQuantity,
    removeFromCart,
    clearCart,
    navigateTo,
  } = useApp();

  if (cart.length === 0) {
    return (
      <div className="max-w-4xl mx-auto px-4 sm:px-6 py-16 text-center space-y-5">
        <div className="w-16 h-16 rounded-2xl bg-[#1C1714] border border-[#D4AF37]/20 flex items-center justify-center mx-auto text-[#D4AF37]">
          <ShoppingBag className="w-8 h-8" />
        </div>
        <h1
          className={`text-3xl font-bold text-[#F5EFE6] ${
            lang === 'ar' ? 'font-display-ar' : 'font-display-en'
          }`}
        >
          {t('سلة الطلبات فارغة', 'Your Order Cart is Empty')}
        </h1>
        <p className="text-sm text-[#A69B8D] max-w-md mx-auto">
          {t(
            'لم تقم بإضافة أي أطباق إلى طلبك بعد. استعرض منيو حضرموت الباجور واختر أشهى المشويات والمندي والوجبات العائلية.',
            'You have not added any dishes yet. Browse our menu to select charcoal grills, Mandi, and family platters.'
          )}
        </p>
        <button
          type="button"
          onClick={() => navigateTo('menu')}
          className="px-6 py-3 bg-[#D4AF37] hover:bg-[#E5C349] text-[#120F0D] font-bold text-sm rounded-xl transition-colors cursor-pointer"
        >
          {t('استعرض المنيو الآن', 'Browse Menu Now')}
        </button>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-14 space-y-8">
      <div className="flex flex-wrap items-center justify-between gap-4 border-b border-[#D4AF37]/15 pb-6">
        <div>
          <span className="text-xs font-medium text-[#D4AF37]">
            {t('مراجعة الطلب', 'Order Review')}
          </span>
          <h1
            className={`text-3xl sm:text-4xl font-bold text-[#F5EFE6] ${
              lang === 'ar' ? 'font-display-ar' : 'font-display-en'
            }`}
          >
            {t('سلة الطلبات', 'Shopping Cart')} ({cartCount})
          </h1>
        </div>

        <button
          type="button"
          onClick={clearCart}
          className="inline-flex items-center gap-1.5 text-xs text-[#A69B8D] hover:text-red-400 transition-colors cursor-pointer"
        >
          <Trash2 className="w-4 h-4" />
          <span>{t('إفراغ السلة', 'Clear Cart')}</span>
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Cart Items List */}
        <div className="lg:col-span-8 space-y-4">
          {cart.map(({ item, quantity, notes }) => (
            <div
              key={item.id}
              className="bg-[#1C1714] border border-[#D4AF37]/15 rounded-2xl p-4 sm:p-5 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4"
            >
              <div className="flex items-center gap-4">
                <div className="w-20 h-20 sm:w-24 sm:h-24 rounded-xl overflow-hidden bg-[#120F0D] shrink-0">
                  <ResilientImage src={item.imageUrl} alt={t(item.nameAr, item.nameEn)} />
                </div>
                <div className="space-y-1">
                  <h2 className="text-base sm:text-lg font-bold text-[#F5EFE6]">
                    {t(item.nameAr, item.nameEn)}
                  </h2>
                  <p className="text-xs text-[#D4AF37] font-mono-num">
                    {item.price > 0
                      ? `${item.price} ${t('ج.م للوحدة', 'EGP each')}`
                      : t('السعر يحدد حسب الاختيار عند التأكيد', 'Price confirmed upon order')}
                  </p>
                  {notes && (
                    <p className="text-xs text-[#A69B8D]">
                      {t('ملاحظات:', 'Notes:')} {notes}
                    </p>
                  )}
                </div>
              </div>

              <div className="flex items-center justify-between sm:justify-end w-full sm:w-auto gap-5 pt-3 sm:pt-0 border-t sm:border-t-0 border-[#D4AF37]/10">
                <div className="inline-flex items-center gap-3 bg-[#120F0D] border border-[#D4AF37]/20 rounded-xl px-3 py-1.5">
                  <button
                    type="button"
                    onClick={() => updateCartQuantity(item.id, quantity - 1)}
                    className="text-[#F5EFE6] hover:text-[#D4AF37] cursor-pointer"
                  >
                    <Minus className="w-4 h-4" />
                  </button>
                  <span className="font-mono-num text-sm font-bold min-w-[1.5rem] text-center">
                    {quantity}
                  </span>
                  <button
                    type="button"
                    onClick={() => updateCartQuantity(item.id, quantity + 1)}
                    className="text-[#F5EFE6] hover:text-[#D4AF37] cursor-pointer"
                  >
                    <Plus className="w-4 h-4" />
                  </button>
                </div>

                <div className="text-end min-w-[5.5rem]">
                  <span className="font-mono-num text-sm font-bold text-[#F5EFE6] block">
                    {item.price > 0
                      ? `${item.price * quantity} ${t('ج.م', 'EGP')}`
                      : t('حسب الاختيار', 'Custom')}
                  </span>
                </div>

                <button
                  type="button"
                  onClick={() => removeFromCart(item.id)}
                  aria-label={t('حذف', 'Remove')}
                  className="text-[#A69B8D] hover:text-red-400 p-1.5 transition-colors cursor-pointer"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          ))}
        </div>

        {/* Summary Card */}
        <div className="lg:col-span-4 bg-[#1C1714] border border-[#D4AF37]/20 rounded-3xl p-6 space-y-6">
          <h2 className="text-lg font-bold text-[#F5EFE6] border-b border-[#D4AF37]/12 pb-3">
            {t('ملخص الطلب', 'Order Summary')}
          </h2>

          <div className="space-y-3 text-sm">
            <div className="flex items-center justify-between text-[#A69B8D]">
              <span>{t('عدد الوحدات', 'Total Items')}</span>
              <span className="font-mono-num font-semibold text-[#F5EFE6]">{cartCount}</span>
            </div>

            <div className="flex items-center justify-between text-[#A69B8D]">
              <span>{t('طريقة الدفع', 'Payment Method')}</span>
              <span className="text-[#F5EFE6] font-medium">
                {t('الدفع عند الاستلام', 'Cash on Delivery')}
              </span>
            </div>

            <div className="pt-3 border-t border-[#D4AF37]/12 flex items-center justify-between">
              <span className="font-bold text-[#F5EFE6]">{t('الإجمالي', 'Subtotal')}</span>
              <span className="font-mono-num text-lg font-bold text-[#D4AF37]">
                {cartTotal > 0
                  ? `${cartTotal} ${t('ج.م', 'EGP')}`
                  : t('يحدد عند التأكيد', 'Confirmed on order')}
              </span>
            </div>

            {hasUnpricedCartItems && (
              <p className="text-xs text-[#A69B8D] leading-relaxed">
                {t(
                  'ملاحظة: الأصناف التي لم يحدد لها سعر ثابت يتم تأكيد تكلفتها النهائية معك فور استلام الطلب حسب الحجم والاختيار.',
                  'Note: Items without a fixed price will have their final total confirmed with you based on portion size.'
                )}
              </p>
            )}
          </div>

          <div className="space-y-3 pt-2">
            <button
              type="button"
              onClick={() => navigateTo('checkout')}
              className="w-full flex items-center justify-center gap-2 px-6 py-3.5 text-sm font-bold text-[#120F0D] bg-[#D4AF37] hover:bg-[#E5C349] rounded-xl transition-colors cursor-pointer"
            >
              <span>{t('المتابعة لإتمام الطلب', 'Proceed to Checkout')}</span>
              {lang === 'ar' ? (
                <ArrowLeft className="w-4 h-4" />
              ) : (
                <ArrowRight className="w-4 h-4" />
              )}
            </button>

            <button
              type="button"
              onClick={() => navigateTo('menu')}
              className="w-full py-2.5 text-xs font-semibold text-[#A69B8D] hover:text-[#F5EFE6] transition-colors cursor-pointer"
            >
              {t('إضافة المزيد من الأصناف', 'Add More Dishes')}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export const CheckoutPage: React.FC = () => {
  const {
    lang,
    t,
    cart,
    cartTotal,
    cartCount,
    hasUnpricedCartItems,
    settings,
    submitOrder,
    clearCart,
    navigateTo,
    showToast,
  } = useApp();

  const [customerName, setCustomerName] = useState('');
  const [customerPhone, setCustomerPhone] = useState('');
  const [customerAddress, setCustomerAddress] = useState('');
  const [notes, setNotes] = useState('');
  const [deliveryMethod, setDeliveryMethod] = useState<'delivery' | 'pickup'>('delivery');
  const [customWaMessage, setCustomWaMessage] = useState('');
  const [isWaEdited, setIsWaEdited] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [completedOrder, setCompletedOrder] = useState<{
    orderNumber: string;
    waUrl: string;
  } | null>(null);

  // Auto-generate WhatsApp message whenever form or cart changes (unless manually edited)
  useEffect(() => {
    if (isWaEdited) return;
    const linesAr = [
      'طلب جديد - مطعم حضرموت الباجور',
      `الاسم: ${customerName || '---'}`,
      `الهاتف: ${customerPhone || '---'}`,
      `طريقة الاستلام: ${deliveryMethod === 'delivery' ? 'توصيل للمنزل' : 'استلام من المطعم'}`,
      deliveryMethod === 'delivery' ? `العنوان: ${customerAddress || '---'}` : '',
      '--- الأصناف المطلوبة ---',
      ...cart.map(
        (c) =>
          `• ${c.quantity} × ${c.item.nameAr}${
            c.item.price > 0 ? ` (${c.item.price * c.quantity} ج.م)` : ' (السعر حسب الاختيار)'
          }${c.notes ? ` - ملاحظة: ${c.notes}` : ''}`
      ),
      `الإجمالي المسعر: ${
        cartTotal > 0 ? `${cartTotal} ج.م` : 'يحدد عند تأكيد الطلب'
      }`,
      notes ? `ملاحظات العميل: ${notes}` : '',
    ]
      .filter(Boolean)
      .join('\n');

    setCustomWaMessage(linesAr);
  }, [customerName, customerPhone, customerAddress, notes, deliveryMethod, cart, cartTotal, isWaEdited]);

  const cleanWhatsapp = (settings.whatsapp || '01080240315').replace(/[^0-9]/g, '');
  const intlWhatsapp = cleanWhatsapp.startsWith('0') ? `2${cleanWhatsapp}` : cleanWhatsapp;

  const handlePlaceOrder = async (e: React.FormEvent) => {
    e.preventDefault();
    if (cart.length === 0) return;

    if (deliveryMethod === 'delivery' && customerAddress.trim().length < 2) {
      showToast(t('يرجى كتابة العنوان بالتفصيل للتوصيل', 'Please enter your delivery address'), 'error');
      return;
    }

    setSubmitting(true);
    try {
      const result = await submitOrder({
        customerName,
        customerPhone,
        customerAddress:
          deliveryMethod === 'pickup' && !customerAddress.trim()
            ? 'استلام من المطعم - الباجور'
            : customerAddress,
        notes,
        deliveryMethod,
      });

      const finalMessageWithOrderNo = `رقم الطلب: ${result.orderNumber}\n${customWaMessage}`;
      const waUrl = `https://wa.me/${intlWhatsapp}?text=${encodeURIComponent(finalMessageWithOrderNo)}`;

      setCompletedOrder({
        orderNumber: result.orderNumber,
        waUrl,
      });
      clearCart();
    } catch (err: any) {
      showToast(err?.message || t('حدث خطأ أثناء إرسال الطلب', 'Failed to submit order'), 'error');
    } finally {
      setSubmitting(false);
    }
  };

  if (completedOrder) {
    return (
      <div className="max-w-2xl mx-auto px-4 sm:px-6 py-14">
        <div className="bg-[#1C1714] border border-[#D4AF37]/30 rounded-3xl p-8 text-center space-y-6">
          <div className="w-16 h-16 rounded-full bg-emerald-500/15 border border-emerald-500/30 flex items-center justify-center mx-auto text-emerald-400">
            <CheckCircle2 className="w-9 h-9" />
          </div>

          <div className="space-y-2">
            <span className="text-xs font-medium text-[#D4AF37]">
              {t('تم حفظ الطلب في قاعدة البيانات', 'Order Saved Successfully')}
            </span>
            <h1
              className={`text-3xl font-bold text-[#F5EFE6] ${
                lang === 'ar' ? 'font-display-ar' : 'font-display-en'
              }`}
            >
              {t('شكرًا لطلبك من مطعم حضرموت الباجور', 'Thank You for Your Order!')}
            </h1>
            <p className="text-sm text-[#A69B8D]">
              {t('رقم تتبع الطلب الخاص بك:', 'Your Order Tracking Number:')}
            </p>
            <div className="inline-block font-mono-num text-xl font-bold text-[#D4AF37] bg-[#120F0D] border border-[#D4AF37]/30 px-5 py-2 rounded-xl">
              {completedOrder.orderNumber}
            </div>
          </div>

          <p className="text-xs sm:text-sm text-[#F5EFE6]/85 leading-relaxed max-w-md mx-auto">
            {t(
              'تم تسجيل طلبك لدى إدارة المطعم. يمكنك أيضًا إرسال تفاصيل الطلب مباشرة عبر واتساب لتسريع التأكيد والتواصل الفوري.',
              'Your order is registered with the restaurant. You can also send your order summary directly via WhatsApp for instant confirmation.'
            )}
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-2">
            <a
              href={completedOrder.waUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-3.5 text-sm font-bold text-white bg-[#1E8E3E] hover:bg-[#187732] rounded-xl transition-colors"
            >
              <MessageCircle className="w-4 h-4 fill-current" />
              <span>{t('إرسال الطلب عبر واتساب الآن', 'Send Order via WhatsApp')}</span>
            </a>

            <button
              type="button"
              onClick={() =>
                navigateTo('order-tracking', { trackingCode: completedOrder.orderNumber })
              }
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-3.5 text-sm font-semibold text-[#F5EFE6] bg-[#251E1A] hover:bg-[#2F2621] border border-[#D4AF37]/25 rounded-xl transition-colors cursor-pointer"
            >
              <PackageSearch className="w-4 h-4 text-[#D4AF37]" />
              <span>{t('تتبع حالة الطلب', 'Track Order Status')}</span>
            </button>
          </div>
        </div>
      </div>
    );
  }

  if (cart.length === 0) {
    return <CartPage />;
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-14 space-y-8">
      <div className="border-b border-[#D4AF37]/15 pb-6">
        <span className="text-xs font-medium text-[#D4AF37]">
          {t('الخطوة الأخيرة', 'Final Step')}
        </span>
        <h1
          className={`text-3xl sm:text-4xl font-bold text-[#F5EFE6] ${
            lang === 'ar' ? 'font-display-ar' : 'font-display-en'
          }`}
        >
          {t('إتمام الطلب وبيانات الاستلام', 'Checkout & Delivery Details')}
        </h1>
      </div>

      <form onSubmit={handlePlaceOrder} className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Customer Details Form */}
        <div className="lg:col-span-7 bg-[#1C1714] border border-[#D4AF37]/15 rounded-3xl p-6 sm:p-8 space-y-6">
          <h2 className="text-lg font-bold text-[#F5EFE6]">
            {t('1. طريقة الاستلام وبيانات العميل', '1. Receiving Method & Customer Info')}
          </h2>

          {/* Delivery vs Pickup Selector */}
          <div className="grid grid-cols-2 gap-3">
            <button
              type="button"
              onClick={() => setDeliveryMethod('delivery')}
              className={`flex items-center justify-center gap-2.5 p-3.5 rounded-xl border text-sm font-semibold transition-colors cursor-pointer ${
                deliveryMethod === 'delivery'
                  ? 'bg-[#D4AF37]/15 border-[#D4AF37] text-[#D4AF37]'
                  : 'bg-[#120F0D] border-[#D4AF37]/15 text-[#A69B8D] hover:text-[#F5EFE6]'
              }`}
            >
              <Truck className="w-4 h-4" />
              <span>{t('توصيل (Contactless Delivery)', 'Delivery')}</span>
            </button>

            <button
              type="button"
              onClick={() => setDeliveryMethod('pickup')}
              className={`flex items-center justify-center gap-2.5 p-3.5 rounded-xl border text-sm font-semibold transition-colors cursor-pointer ${
                deliveryMethod === 'pickup'
                  ? 'bg-[#D4AF37]/15 border-[#D4AF37] text-[#D4AF37]'
                  : 'bg-[#120F0D] border-[#D4AF37]/15 text-[#A69B8D] hover:text-[#F5EFE6]'
              }`}
            >
              <Store className="w-4 h-4" />
              <span>{t('استلام من المطعم (Takeaway)', 'Restaurant Pickup')}</span>
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-medium text-[#F5EFE6]/90 mb-1.5">
                {t('الاسم بالكامل *', 'Full Name *')}
              </label>
              <input
                type="text"
                required
                minLength={2}
                maxLength={100}
                value={customerName}
                onChange={(e) => setCustomerName(e.target.value)}
                placeholder={t('أدخل اسمك', 'Enter your name')}
                className="w-full px-3.5 py-2.5 text-sm bg-[#120F0D] border border-[#D4AF37]/20 rounded-xl text-[#F5EFE6] focus:outline-none focus:border-[#D4AF37]"
              />
            </div>

            <div>
              <label className="block text-xs font-medium text-[#F5EFE6]/90 mb-1.5">
                {t('رقم الهاتف *', 'Phone Number *')}
              </label>
              <input
                type="tel"
                required
                dir="ltr"
                minLength={8}
                maxLength={20}
                value={customerPhone}
                onChange={(e) => setCustomerPhone(e.target.value)}
                placeholder="010XXXXXXXX"
                className="w-full px-3.5 py-2.5 text-sm font-mono-num bg-[#120F0D] border border-[#D4AF37]/20 rounded-xl text-[#F5EFE6] focus:outline-none focus:border-[#D4AF37]"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-medium text-[#F5EFE6]/90 mb-1.5">
              {deliveryMethod === 'delivery'
                ? t('عنوان التوصيل بالتفصيل *', 'Detailed Delivery Address *')
                : t('العنوان أو ملاحظة الاستلام (اختياري)', 'Pickup Note / Area (Optional)')}
            </label>
            <input
              type="text"
              required={deliveryMethod === 'delivery'}
              maxLength={300}
              value={customerAddress}
              onChange={(e) => setCustomerAddress(e.target.value)}
              placeholder={t(
                'مثال: مدينة الباجور، شارع ...، بجوار ...',
                'e.g., El-Bagour City, Street..., near...'
              )}
              className="w-full px-3.5 py-2.5 text-sm bg-[#120F0D] border border-[#D4AF37]/20 rounded-xl text-[#F5EFE6] focus:outline-none focus:border-[#D4AF37]"
            />
          </div>

          <div>
            <label className="block text-xs font-medium text-[#F5EFE6]/90 mb-1.5">
              {t('ملاحظات إضافية على الطلب', 'Order Notes')}
            </label>
            <textarea
              rows={2}
              maxLength={500}
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder={t(
                'أي تفاصيل إضافية تخص التسوية، موعد التوصيل، أو الإضافات...',
                'Any special instructions for preparation or delivery time...'
              )}
              className="w-full px-3.5 py-2.5 text-sm bg-[#120F0D] border border-[#D4AF37]/20 rounded-xl text-[#F5EFE6] focus:outline-none focus:border-[#D4AF37]"
            />
          </div>

          {/* Payment Method Info (Cash on Delivery Default) */}
          <div className="p-4 rounded-2xl bg-[#120F0D] border border-[#D4AF37]/20 flex items-center gap-3">
            <Banknote className="w-5 h-5 text-[#D4AF37] shrink-0" />
            <div>
              <span className="text-xs font-bold text-[#F5EFE6] block">
                {t('طريقة الدفع: الدفع عند الاستلام (Cash on Delivery)', 'Payment: Cash on Delivery')}
              </span>
              <span className="text-xs text-[#A69B8D]">
                {t(
                  'يتم الدفع نقدًا عند استلام طلبك من المندوب أو من مقر المطعم.',
                  'Pay comfortably in cash upon receiving your order.'
                )}
              </span>
            </div>
          </div>

          {/* Editable WhatsApp Message Preview (Section 9 Requirement) */}
          <div className="space-y-2 pt-2 border-t border-[#D4AF37]/12">
            <div className="flex items-center justify-between">
              <label className="text-xs font-semibold text-[#D4AF37]">
                {t(
                  'رسالة الطلب عبر واتساب (يمكنك تعديلها قبل الإرسال)',
                  'WhatsApp Order Message (Editable before sending)'
                )}
              </label>
              {isWaEdited && (
                <button
                  type="button"
                  onClick={() => setIsWaEdited(false)}
                  className="text-[11px] text-[#A69B8D] underline hover:text-[#F5EFE6] cursor-pointer"
                >
                  {t('إعادة التوليد التلقائي', 'Reset auto-message')}
                </button>
              )}
            </div>
            <textarea
              rows={5}
              value={customWaMessage}
              onChange={(e) => {
                setCustomWaMessage(e.target.value);
                setIsWaEdited(true);
              }}
              className="w-full px-3.5 py-2.5 text-xs bg-[#120F0D] border border-[#D4AF37]/20 rounded-xl text-[#F5EFE6]/90 focus:outline-none focus:border-[#D4AF37] leading-relaxed"
            />
          </div>
        </div>

        {/* Order Summary Before Sending */}
        <div className="lg:col-span-5 bg-[#1C1714] border border-[#D4AF37]/20 rounded-3xl p-6 sm:p-8 space-y-6">
          <h2 className="text-lg font-bold text-[#F5EFE6] border-b border-[#D4AF37]/12 pb-3">
            {t('2. ملخص الطلب قبل الإرسال', '2. Order Summary Before Sending')}
          </h2>

          <div className="space-y-3 max-h-72 overflow-y-auto pe-1 divide-y divide-[#D4AF37]/10">
            {cart.map(({ item, quantity, notes: itemNotes }) => (
              <div key={item.id} className="pt-3 first:pt-0 flex items-start justify-between gap-3 text-sm">
                <div>
                  <span className="font-semibold text-[#F5EFE6]">
                    {quantity} × {t(item.nameAr, item.nameEn)}
                  </span>
                  {itemNotes && <p className="text-xs text-[#A69B8D]">{itemNotes}</p>}
                </div>
                <span className="font-mono-num text-xs font-semibold text-[#D4AF37] shrink-0">
                  {item.price > 0
                    ? `${item.price * quantity} ${t('ج.م', 'EGP')}`
                    : t('حسب الاختيار', 'Custom')}
                </span>
              </div>
            ))}
          </div>

          <div className="pt-4 border-t border-[#D4AF37]/15 space-y-2 text-sm">
            <div className="flex items-center justify-between text-[#A69B8D]">
              <span>{t('إجمالي الكميات', 'Total Quantity')}</span>
              <span className="font-mono-num font-semibold text-[#F5EFE6]">{cartCount}</span>
            </div>
            <div className="flex items-center justify-between text-[#A69B8D]">
              <span>{t('الاستلام', 'Receiving Method')}</span>
              <span className="text-[#F5EFE6]">
                {deliveryMethod === 'delivery'
                  ? t('توصيل إلى العنوان', 'Delivery')
                  : t('استلام من المطعم', 'Pickup')}
              </span>
            </div>
            <div className="flex items-center justify-between pt-2 border-t border-[#D4AF37]/10">
              <span className="font-bold text-base text-[#F5EFE6]">
                {t('إجمالي الطلب', 'Order Total')}
              </span>
              <span className="font-mono-num font-bold text-lg text-[#D4AF37]">
                {cartTotal > 0
                  ? `${cartTotal} ${t('ج.م', 'EGP')}`
                  : t('يحدد عند التأكيد', 'Confirmed on order')}
              </span>
            </div>
          </div>

          <div className="space-y-3 pt-2">
            <button
              type="submit"
              disabled={submitting}
              className="w-full py-3.5 px-6 text-sm sm:text-base font-bold text-[#120F0D] bg-[#D4AF37] hover:bg-[#E5C349] rounded-xl transition-colors disabled:opacity-50 cursor-pointer"
            >
              {submitting
                ? t('جاري تسجيل الطلب...', 'Submitting Order...')
                : t('تأكيد وإرسال الطلب للمطعم', 'Confirm & Submit Order')}
            </button>

            <a
              href={`https://wa.me/${intlWhatsapp}?text=${encodeURIComponent(customWaMessage)}`}
              target="_blank"
              rel="noopener noreferrer"
              className="w-full flex items-center justify-center gap-2 py-3 px-6 text-xs sm:text-sm font-bold text-white bg-[#1E8E3E] hover:bg-[#187732] rounded-xl transition-colors"
            >
              <MessageCircle className="w-4 h-4 fill-current" />
              <span>{t('إرسال مباشر عبر واتساب (01080240315)', 'Send Directly via WhatsApp')}</span>
            </a>
          </div>
        </div>
      </form>
    </div>
  );
};
