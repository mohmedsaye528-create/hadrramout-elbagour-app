import React, { useState, useEffect } from 'react';
import {
  Calendar,
  Clock,
  Users,
  CheckCircle2,
  MessageCircle,
  Search,
  PackageSearch,
  Phone,
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import { OrderTrackingData } from '../data/initialData';

export const ReservationsPage: React.FC = () => {
  const { lang, t, settings, submitReservation, showToast } = useApp();

  const [customerName, setCustomerName] = useState('');
  const [customerPhone, setCustomerPhone] = useState('');
  const [guests, setGuests] = useState(4);
  const [date, setDate] = useState(() => {
    const d = new Date();
    return d.toISOString().split('T')[0];
  });
  const [time, setTime] = useState('20:00');
  const [notes, setNotes] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [confirmedRes, setConfirmedRes] = useState<{
    reservationNumber: string;
    waUrl: string;
  } | null>(null);

  const cleanWhatsapp = (settings.whatsapp || '01080240315').replace(/[^0-9]/g, '');
  const intlWhatsapp = cleanWhatsapp.startsWith('0') ? `2${cleanWhatsapp}` : cleanWhatsapp;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      const res = await submitReservation({
        customerName,
        customerPhone,
        guests,
        date,
        time,
        notes,
      });

      const waText = [
        `طلب حجز طاولة - مطعم حضرموت الباجور`,
        `رقم الطلب: ${res.reservationNumber}`,
        `الاسم: ${customerName}`,
        `الهاتف: ${customerPhone}`,
        `عدد الأشخاص: ${guests}`,
        `التاريخ: ${date}`,
        `الوقت: ${time}`,
        notes ? `ملاحظات: ${notes}` : '',
      ]
        .filter(Boolean)
        .join('\n');

      setConfirmedRes({
        reservationNumber: res.reservationNumber,
        waUrl: `https://wa.me/${intlWhatsapp}?text=${encodeURIComponent(waText)}`,
      });
    } catch (err: any) {
      showToast(err?.message || t('تعذر إرسال طلب الحجز', 'Failed to submit reservation'), 'error');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-14 space-y-8">
      <div className="border-b border-[#D4AF37]/15 pb-6 space-y-2">
        <span className="text-xs font-medium text-[#D4AF37]">
          {t('أجواء عائلية وشرقية مميزة', 'Family & Oriental Dining')}
        </span>
        <h1
          className={`text-3xl sm:text-5xl font-bold text-[#F5EFE6] ${
            lang === 'ar' ? 'font-display-ar' : 'font-display-en'
          }`}
        >
          {t('احجز طاولتك', 'Book Your Table')}
        </h1>
        <p className="text-sm text-[#A69B8D] max-w-xl">
          {t(
            'احجز طاولتك مسبقًا للأفراد أو العائلات أو العزومات في مطعم حضرموت الباجور. يتم تأكيد الحجز نهائيًا بعد تواصل إدارة المطعم معك.',
            'Request a table reservation for individuals, families, or gatherings at Hadramout El-Bagour. Reservations are finalized upon restaurant confirmation.'
          )}
        </p>
      </div>

      {confirmedRes ? (
        <div className="bg-[#1C1714] border border-[#D4AF37]/30 rounded-3xl p-8 text-center space-y-6">
          <div className="w-16 h-16 rounded-full bg-emerald-500/15 border border-emerald-500/30 flex items-center justify-center mx-auto text-emerald-400">
            <CheckCircle2 className="w-9 h-9" />
          </div>

          <div className="space-y-2">
            <h2 className="text-2xl font-bold text-[#F5EFE6]">
              {t(
                'تم استلام طلب الحجز، وسيتم التواصل معك لتأكيد الحجز.',
                'Your reservation request has been received. We will contact you to confirm.'
              )}
            </h2>
            <p className="text-xs sm:text-sm text-[#A69B8D]">
              {t('رقم مرجع الحجز:', 'Reservation Reference:')}
            </p>
            <div className="inline-block font-mono-num text-lg font-bold text-[#D4AF37] bg-[#120F0D] border border-[#D4AF37]/30 px-4 py-1.5 rounded-xl">
              {confirmedRes.reservationNumber}
            </div>
          </div>

          <p className="text-xs sm:text-sm text-[#A69B8D] max-w-md mx-auto">
            {t(
              'ملاحظة هامة: لا يعتبر الحجز مؤكدًا نهائيًا إلا بعد مراجعة وتأكيد إدارة المطعم عبر الهاتف أو واتساب.',
              'Important note: Your reservation is finalized once confirmed by restaurant management via phone or WhatsApp.'
            )}
          </p>

          <div className="flex flex-wrap items-center justify-center gap-3 pt-2">
            <a
              href={confirmedRes.waUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-6 py-3 text-sm font-bold text-white bg-[#1E8E3E] hover:bg-[#187732] rounded-xl transition-colors"
            >
              <MessageCircle className="w-4 h-4 fill-current" />
              <span>{t('تأكيد سريع عبر واتساب', 'Send via WhatsApp')}</span>
            </a>

            <button
              type="button"
              onClick={() => setConfirmedRes(null)}
              className="px-5 py-3 text-xs sm:text-sm font-semibold text-[#F5EFE6] bg-[#251E1A] rounded-xl cursor-pointer"
            >
              {t('تقديم طلب حجز آخر', 'Submit Another Request')}
            </button>
          </div>
        </div>
      ) : (
        <form
          onSubmit={handleSubmit}
          className="bg-[#1C1714] border border-[#D4AF37]/15 rounded-3xl p-6 sm:p-10 space-y-6"
        >
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
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
                placeholder={t('أدخل اسمك', 'Enter your full name')}
                className="w-full px-4 py-3 text-sm bg-[#120F0D] border border-[#D4AF37]/20 rounded-xl text-[#F5EFE6] focus:outline-none focus:border-[#D4AF37]"
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
                className="w-full px-4 py-3 text-sm font-mono-num bg-[#120F0D] border border-[#D4AF37]/20 rounded-xl text-[#F5EFE6] focus:outline-none focus:border-[#D4AF37]"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
            <div>
              <label className="block text-xs font-medium text-[#F5EFE6]/90 mb-1.5">
                <Users className="w-3.5 h-3.5 inline me-1 text-[#D4AF37]" />
                {t('عدد الأشخاص *', 'Number of Guests *')}
              </label>
              <input
                type="number"
                required
                min={1}
                max={150}
                value={guests}
                onChange={(e) => setGuests(Number(e.target.value))}
                className="w-full px-4 py-3 text-sm font-mono-num bg-[#120F0D] border border-[#D4AF37]/20 rounded-xl text-[#F5EFE6] focus:outline-none focus:border-[#D4AF37]"
              />
            </div>

            <div>
              <label className="block text-xs font-medium text-[#F5EFE6]/90 mb-1.5">
                <Calendar className="w-3.5 h-3.5 inline me-1 text-[#D4AF37]" />
                {t('التاريخ *', 'Date *')}
              </label>
              <input
                type="date"
                required
                value={date}
                onChange={(e) => setDate(e.target.value)}
                className="w-full px-4 py-3 text-sm font-mono-num bg-[#120F0D] border border-[#D4AF37]/20 rounded-xl text-[#F5EFE6] focus:outline-none focus:border-[#D4AF37]"
              />
            </div>

            <div>
              <label className="block text-xs font-medium text-[#F5EFE6]/90 mb-1.5">
                <Clock className="w-3.5 h-3.5 inline me-1 text-[#D4AF37]" />
                {t('الوقت *', 'Time *')}
              </label>
              <input
                type="time"
                required
                value={time}
                onChange={(e) => setTime(e.target.value)}
                className="w-full px-4 py-3 text-sm font-mono-num bg-[#120F0D] border border-[#D4AF37]/20 rounded-xl text-[#F5EFE6] focus:outline-none focus:border-[#D4AF37]"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-medium text-[#F5EFE6]/90 mb-1.5">
              {t('ملاحظات إضافية (اختياري)', 'Additional Notes (Optional)')}
            </label>
            <textarea
              rows={3}
              maxLength={500}
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder={t(
                'مثال: حجز قسم العائلات، مناسبة خاصة، أو طلب تجهيز مسبق للأطباق...',
                'e.g., family section seating, special occasion, pre-ordered dishes...'
              )}
              className="w-full px-4 py-3 text-sm bg-[#120F0D] border border-[#D4AF37]/20 rounded-xl text-[#F5EFE6] focus:outline-none focus:border-[#D4AF37]"
            />
          </div>

          <div className="pt-2 flex flex-col sm:flex-row items-center justify-between gap-4">
            <p className="text-xs text-[#A69B8D]">
              {t(
                '* سيتم التواصل معك هاتفيًا لتأكيد توفر الطاولة في الموعد المحدد.',
                '* We will contact you by phone to confirm table availability.'
              )}
            </p>
            <button
              type="submit"
              disabled={submitting}
              className="w-full sm:w-auto px-8 py-3.5 text-sm font-bold text-[#120F0D] bg-[#D4AF37] hover:bg-[#E5C349] rounded-xl transition-colors disabled:opacity-50 cursor-pointer"
            >
              {submitting
                ? t('جاري إرسال الحجز...', 'Sending Request...')
                : t('إرسال طلب الحجز', 'Submit Reservation Request')}
            </button>
          </div>
        </form>
      )}
    </div>
  );
};

export const OrderTrackingPage: React.FC = () => {
  const {
    lang,
    t,
    activeTrackingCode,
    recentOrderCodes,
    lookupOrderTracking,
    settings,
  } = useApp();

  const [inputCode, setInputCode] = useState(activeTrackingCode || '');
  const [trackingResult, setTrackingResult] = useState<OrderTrackingData | null>(null);
  const [loading, setLoading] = useState(false);
  const [notFound, setNotFound] = useState(false);

  const handleSearch = async (codeToSearch: string) => {
    const clean = codeToSearch.trim().toUpperCase();
    if (!clean) return;
    setLoading(true);
    setNotFound(false);
    try {
      const res = await lookupOrderTracking(clean);
      setTrackingResult(res);
      if (!res) setNotFound(true);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (activeTrackingCode) {
      setInputCode(activeTrackingCode);
      handleSearch(activeTrackingCode);
    }
  }, [activeTrackingCode]);

  const statusSteps: {
    key: OrderTrackingData['status'];
    labelAr: string;
    labelEn: string;
  }[] = [
    { key: 'new', labelAr: 'جديد (تم الاستلام)', labelEn: 'New (Received)' },
    { key: 'confirmed', labelAr: 'تم التأكيد', labelEn: 'Confirmed' },
    { key: 'preparing', labelAr: 'قيد التحضير', labelEn: 'Preparing' },
    { key: 'ready', labelAr: 'جاهز للاستلام / التوصيل', labelEn: 'Ready' },
    { key: 'delivered', labelAr: 'تم التسليم', labelEn: 'Delivered' },
  ];

  const currentStepIndex = trackingResult
    ? statusSteps.findIndex((s) => s.key === trackingResult.status)
    : -1;

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-14 space-y-8">
      <div className="border-b border-[#D4AF37]/15 pb-6 space-y-2">
        <span className="text-xs font-medium text-[#D4AF37]">
          {t('متابعة لحظية لحالة طلبك', 'Real-Time Order Status')}
        </span>
        <h1
          className={`text-3xl sm:text-4xl font-bold text-[#F5EFE6] ${
            lang === 'ar' ? 'font-display-ar' : 'font-display-en'
          }`}
        >
          {t('تتبع حالة الطلب', 'Order Tracking')}
        </h1>
        <p className="text-sm text-[#A69B8D]">
          {t(
            'أدخل رقم الطلب (مثال: HB-123456) لمعرفة حالة تحضير وتوصيل طلبك الآن.',
            'Enter your order number (e.g., HB-123456) to check live preparation status.'
          )}
        </p>
      </div>

      {/* Search Form */}
      <form
        onSubmit={(e) => {
          e.preventDefault();
          handleSearch(inputCode);
        }}
        className="flex flex-col sm:flex-row gap-3"
      >
        <div className="relative flex-1">
          <PackageSearch className="w-5 h-5 text-[#D4AF37] absolute top-1/2 -translate-y-1/2 start-3.5" />
          <input
            type="text"
            dir="ltr"
            value={inputCode}
            onChange={(e) => setInputCode(e.target.value)}
            placeholder="HB-XXXXXX"
            className="w-full ps-11 pe-4 py-3 text-sm font-mono-num bg-[#1C1714] border border-[#D4AF37]/25 rounded-xl text-[#F5EFE6] focus:outline-none focus:border-[#D4AF37]"
          />
        </div>
        <button
          type="submit"
          disabled={loading}
          className="inline-flex items-center justify-center gap-2 px-6 py-3 text-sm font-bold text-[#120F0D] bg-[#D4AF37] hover:bg-[#E5C349] rounded-xl transition-colors cursor-pointer"
        >
          <Search className="w-4 h-4" />
          <span>{loading ? t('جاري البحث...', 'Searching...') : t('تتبع الطلب', 'Track Order')}</span>
        </button>
      </form>

      {/* Recent Orders Quick Select */}
      {recentOrderCodes.length > 0 && (
        <div className="flex flex-wrap items-center gap-2 text-xs">
          <span className="text-[#A69B8D]">{t('طلباتك الأخيرة:', 'Your recent orders:')}</span>
          {recentOrderCodes.map((code) => (
            <button
              key={code}
              type="button"
              onClick={() => {
                setInputCode(code);
                handleSearch(code);
              }}
              className="font-mono-num px-3 py-1 rounded-lg bg-[#1C1714] border border-[#D4AF37]/20 text-[#D4AF37] hover:bg-[#251E1A] cursor-pointer"
            >
              {code}
            </button>
          ))}
        </div>
      )}

      {/* Tracking Result */}
      {notFound && (
        <div className="bg-[#1C1714] border border-[#D4AF37]/15 rounded-2xl p-8 text-center space-y-2">
          <p className="text-base font-bold text-[#F5EFE6]">
            {t('لم يتم العثور على طلب بهذا الرقم', 'No order found with this number')}
          </p>
          <p className="text-xs text-[#A69B8D]">
            {t(
              'تأكد من كتابة رقم الطلب بشكل صحيح (مثال: HB-123456) أو تواصل معنا هاتفيًا.',
              'Please verify the order number format (e.g., HB-123456) or call us directly.'
            )}
          </p>
        </div>
      )}

      {trackingResult && (
        <div className="bg-[#1C1714] border border-[#D4AF37]/20 rounded-3xl p-6 sm:p-8 space-y-8">
          <div className="flex flex-wrap items-center justify-between gap-4 border-b border-[#D4AF37]/12 pb-5">
            <div>
              <span className="text-xs text-[#A69B8D] block">
                {t('رقم الطلب', 'Order Number')}
              </span>
              <span className="font-mono-num text-2xl font-bold text-[#D4AF37]">
                {trackingResult.orderNumber}
              </span>
            </div>

            <div className="text-end">
              <span className="text-xs text-[#A69B8D] block">
                {t('طريقة الاستلام', 'Method')}
              </span>
              <span className="text-sm font-semibold text-[#F5EFE6]">
                {trackingResult.deliveryMethod === 'delivery'
                  ? t('توصيل إلى العنوان', 'Home Delivery')
                  : t('استلام من المطعم', 'Restaurant Pickup')}
              </span>
            </div>
          </div>

          {/* Status Stepper */}
          {trackingResult.status === 'cancelled' ? (
            <div className="p-4 rounded-2xl bg-red-950/40 border border-red-500/30 text-red-200 text-sm font-semibold text-center">
              {t('تم إلغاء هذا الطلب. للاستفسار يرجى الاتصال بالمطعم.', 'This order has been cancelled.')}
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-5 gap-3">
              {statusSteps.map((step, index) => {
                const isDone = index <= currentStepIndex;
                const isCurrent = index === currentStepIndex;
                return (
                  <div
                    key={step.key}
                    className={`p-3.5 rounded-xl border text-center space-y-1.5 ${
                      isCurrent
                        ? 'bg-[#D4AF37]/15 border-[#D4AF37] text-[#D4AF37]'
                        : isDone
                        ? 'bg-emerald-950/25 border-emerald-500/30 text-emerald-300'
                        : 'bg-[#120F0D] border-[#D4AF37]/10 text-[#A69B8D]'
                    }`}
                  >
                    <div className="font-mono-num text-xs font-bold">0{index + 1}</div>
                    <div className="text-xs font-semibold">{t(step.labelAr, step.labelEn)}</div>
                  </div>
                );
              })}
            </div>
          )}

          <div className="bg-[#120F0D] border border-[#D4AF37]/12 rounded-2xl p-5 space-y-3 text-sm">
            <div className="flex items-center justify-between">
              <span className="text-[#A69B8D]">{t('تفاصيل الأصناف:', 'Items Summary:')}</span>
              <span className="font-mono-num text-xs text-[#A69B8D]">
                ({trackingResult.itemCount} {t('وحدة', 'items')})
              </span>
            </div>
            <p className="text-[#F5EFE6] font-medium">
              {t(trackingResult.itemsSummaryAr, trackingResult.itemsSummaryEn)}
            </p>
            <div className="pt-3 border-t border-[#D4AF37]/10 flex items-center justify-between">
              <span className="text-[#A69B8D]">{t('الإجمالي:', 'Total:')}</span>
              <span className="font-mono-num font-bold text-[#D4AF37]">
                {trackingResult.totalAmount > 0
                  ? `${trackingResult.totalAmount} ${t('ج.م', 'EGP')}`
                  : t('يحدد عند تأكيد الطلب', 'Confirmed with restaurant')}
              </span>
            </div>
          </div>

          <div className="flex items-center justify-between pt-2 text-xs text-[#A69B8D]">
            <span>{t('هل تحتاج مساعدة بخصوص طلبك؟', 'Need help with your order?')}</span>
            <a
              href={`tel:${settings.phone}`}
              className="inline-flex items-center gap-1.5 text-[#D4AF37] font-semibold hover:underline"
            >
              <Phone className="w-3.5 h-3.5" />
              <span dir="ltr">{settings.phone}</span>
            </a>
          </div>
        </div>
      )}
    </div>
  );
};
