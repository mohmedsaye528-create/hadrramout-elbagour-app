/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { AppProvider, useApp } from './context/AppContext';
import { Navbar } from './components/Navbar';
import { FloatingActions } from './components/FloatingActions';
import { Footer } from './components/Footer';
import { HomePage } from './pages/HomePage';
import { MenuPage, ProductDetailsPage } from './pages/MenuPage';
import { CartPage, CheckoutPage } from './pages/CartAndCheckoutPages';
import { ReservationsPage, OrderTrackingPage } from './pages/ReservationsAndTrackingPages';
import { AboutPage, GalleryPage, ContactPage } from './pages/AboutGalleryContactPages';
import { AdminLoginPage, AdminDashboardPage } from './pages/AdminPages';

class AppErrorBoundary extends React.Component<
  { children: React.ReactNode },
  { hasError: boolean; message: string }
> {
  constructor(props: { children: React.ReactNode }) {
    super(props);
    this.state = { hasError: false, message: '' };
  }

  static getDerivedStateFromError(error: Error) {
    return { hasError: true, message: error?.message || 'Unexpected error' };
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen bg-[#120F0D] text-[#F5EFE6] flex items-center justify-center p-6">
          <div className="max-w-md w-full bg-[#1C1714] border border-[#D4AF37]/30 rounded-3xl p-8 text-center space-y-4">
            <h1 className="text-2xl font-bold text-[#D4AF37] font-display-ar">
              مطعم حضرموت الباجور
            </h1>
            <p className="text-sm text-[#A69B8D]">
              حدث خطأ غير متوقع أثناء تحميل البيانات. يرجى إعادة تحديث الصفحة.
            </p>
            <button
              type="button"
              onClick={() => window.location.reload()}
              className="px-6 py-2.5 bg-[#D4AF37] text-[#120F0D] font-bold text-sm rounded-xl cursor-pointer"
            >
              إعادة تحميل الصفحة
            </button>
          </div>
        </div>
      );
    }
    return this.props.children;
  }
}

const MainRouter: React.FC = () => {
  const { currentPage } = useApp();

  return (
    <div className="min-h-screen flex flex-col bg-[#120F0D] text-[#F5EFE6] font-sans-ui">
      <Navbar />
      <main className="flex-1">
        {currentPage === 'home' && <HomePage />}
        {currentPage === 'menu' && <MenuPage />}
        {currentPage === 'product-details' && <ProductDetailsPage />}
        {currentPage === 'cart' && <CartPage />}
        {currentPage === 'checkout' && <CheckoutPage />}
        {currentPage === 'reservations' && <ReservationsPage />}
        {currentPage === 'about' && <AboutPage />}
        {currentPage === 'gallery' && <GalleryPage />}
        {currentPage === 'contact' && <ContactPage />}
        {currentPage === 'order-tracking' && <OrderTrackingPage />}
        {currentPage === 'admin-login' && <AdminLoginPage />}
        {currentPage === 'admin-dashboard' && <AdminDashboardPage />}
      </main>
      <Footer />
      <FloatingActions />
    </div>
  );
};

export default function App() {
  return (
    <AppErrorBoundary>
      <AppProvider>
        <MainRouter />
      </AppProvider>
    </AppErrorBoundary>
  );
}
