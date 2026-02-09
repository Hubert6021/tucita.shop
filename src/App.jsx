
import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AuthProvider } from '@/contexts/AuthContext';
import { CartProvider } from '@/hooks/useCart';
import ThemeProvider from '@/components/ThemeProvider';
import { Toaster } from '@/components/ui/toaster';
import ProtectedRoute from '@/components/ProtectedRoute';
import ProfessionalProtectedRoute from '@/components/ProfessionalProtectedRoute'; // Keeping this for backward compatibility if needed, but new ProtectedRoute handles roles
import AdminProtectedRoute from '@/components/AdminProtectedRoute';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import ShoppingCart from '@/components/ShoppingCart'; 

// Public Pages
import HomePage from '@/pages/HomePage';
import SearchPage from '@/pages/SearchPage';
import ProductDetailPage from '@/pages/ProductDetailPage';
import StorePage from '@/pages/StorePage';
import ProfessionalProfilePage from '@/pages/ProfessionalProfilePage';
import ProfessionalsListPage from '@/pages/ProfessionalsListPage';
import ProfessionalDetailPage from '@/pages/ProfessionalDetailPage';

// Auth Pages
import UnifiedLoginPage from '@/pages/UnifiedLoginPage';
import ClientLoginPage from '@/pages/ClientLoginPage';
import ProfessionalLoginPage from '@/pages/ProfessionalLoginPage';
import RegistrationPage from '@/pages/RegistrationPage';
import AdminLoginPage from '@/pages/AdminLoginPage';
import ClientRegistrationPage from '@/pages/ClientRegistrationPage';
import ProfessionalRegistrationPage from '@/pages/ProfessionalRegistrationPage';

// Protected Pages
import BookingFlow from '@/pages/BookingFlow';
import CustomerDashboard from '@/pages/CustomerDashboard'; // Legacy but kept for import safety
import ProfessionalOnboarding from '@/pages/ProfessionalOnboarding';
import ProfessionalDashboard from '@/pages/ProfessionalDashboard';
import CheckoutSuccessPage from '@/pages/CheckoutSuccessPage';
import ProfessionalDetailsPage from '@/pages/ProfessionalDetailsPage';

// New Dashboard Pages
import ClientDashboardPage from '@/pages/ClientDashboardPage';
import ProfessionalDashboardPage from '@/pages/ProfessionalDashboardPage';

// Admin Pages
import AdminDashboard from '@/pages/AdminDashboard';
import AdminProfessionalManagement from '@/pages/AdminProfessionalManagement';
import AdminCustomerManagement from '@/pages/AdminCustomerManagement';
import AdminCategoryManagement from '@/pages/AdminCategoryManagement';
import AdminReportsAndAnalytics from '@/pages/AdminReportsAndAnalytics';

function App() {
  const [isCartOpen, setIsCartOpen] = React.useState(false);

  return (
    <AuthProvider>
      <CartProvider>
        <ThemeProvider>
          <Router>
            <div className="flex flex-col min-h-screen">
              <Header onCartClick={() => setIsCartOpen(true)} />
              <ShoppingCart isCartOpen={isCartOpen} setIsCartOpen={setIsCartOpen} />
              <main className="flex-1">
                <Routes>
                  {/* Public Routes */}
                  <Route path="/" element={<HomePage />} />
                  <Route path="/search" element={<SearchPage />} />
                  <Route path="/profesionales" element={<ProfessionalsListPage />} />
                  <Route path="/profesionales/:id" element={<ProfessionalDetailPage />} />
                  <Route path="/store" element={<StorePage />} />
                  <Route path="/product/:id" element={<ProductDetailPage />} />
                  
                  {/* Auth Routes */}
                  <Route path="/login" element={<UnifiedLoginPage />} />
                  <Route path="/register" element={<RegistrationPage />} />
                  
                  {/* Client Auth Flow */}
                  <Route path="/register-client" element={<ClientRegistrationPage />} />
                  <Route path="/login-client" element={<ClientLoginPage />} />
                  
                  {/* Professional Auth Flow */}
                  <Route path="/register-professional" element={<ProfessionalRegistrationPage />} />
                  <Route path="/login-professional" element={<ProfessionalLoginPage />} />
                  <Route path="/professional-login" element={<ProfessionalLoginPage />} />
                  
                  <Route path="/admin/login" element={<AdminLoginPage />} />

                  {/* Customer Protected Routes */}
                  <Route path="/customer-dashboard" element={
                    <ProtectedRoute requiredRole="cliente"><ClientDashboardPage /></ProtectedRoute>
                  } />
                  <Route path="/dashboard-cliente" element={
                    <ProtectedRoute requiredRole="cliente"><ClientDashboardPage /></ProtectedRoute>
                  } />
                  
                  {/* Booking Flow */}
                  <Route path="/booking/:professionalId" element={
                    <ProtectedRoute requiredRole="cliente"><BookingFlow /></ProtectedRoute>
                  } />
                  <Route path="/success" element={
                    <ProtectedRoute><CheckoutSuccessPage /></ProtectedRoute>
                  } />

                  {/* Professional Protected Routes */}
                  <Route path="/professional-dashboard" element={
                    <ProtectedRoute requiredRole="profesional"><ProfessionalDashboardPage /></ProtectedRoute>
                  } />
                  <Route path="/dashboard-profesional" element={
                    <ProtectedRoute requiredRole="profesional"><ProfessionalDashboardPage /></ProtectedRoute>
                  } />
                  
                  {/* Professional Onboarding / Details */}
                  <Route path="/register-professional-details" element={
                    <ProtectedRoute requiredRole="profesional"><ProfessionalDetailsPage /></ProtectedRoute>
                  } />
                  <Route path="/mi-perfil-profesional" element={
                    <ProtectedRoute requiredRole="profesional"><ProfessionalProfilePage /></ProtectedRoute>
                  } />

                  {/* Admin Protected Routes */}
                  <Route path="/admin/dashboard" element={<AdminProtectedRoute><AdminDashboard /></AdminProtectedRoute>} />
                  <Route path="/admin/professionals" element={<AdminProtectedRoute><AdminProfessionalManagement /></AdminProtectedRoute>} />
                  <Route path="/admin/customers" element={<AdminProtectedRoute><AdminCustomerManagement /></AdminProtectedRoute>} />
                  <Route path="/admin/categories" element={<AdminProtectedRoute><AdminCategoryManagement /></AdminProtectedRoute>} />
                  <Route path="/admin/reports" element={<AdminProtectedRoute><AdminReportsAndAnalytics /></AdminProtectedRoute>} />

                </Routes>
              </main>
              <Footer />
              <Toaster />
            </div>
          </Router>
        </ThemeProvider>
      </CartProvider>
    </AuthProvider>
  );
}

export default App;
