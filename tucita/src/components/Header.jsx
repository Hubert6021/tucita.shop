
import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { Search, Menu, X, LogOut, Briefcase, Shield, User, LayoutDashboard, UserCircle, ShoppingCart as CartIcon, ChevronDown } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { useTheme } from '@/contexts/ThemeContext';
import { useCart } from '@/hooks/useCart';

const Header = ({ onCartClick }) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [authDropdownOpen, setAuthDropdownOpen] = useState(null); // 'login' or 'register'
  
  const navigate = useNavigate();
  const location = useLocation();
  const { isAuthenticated, currentUser, signOut, isAdmin, isProfessional, isClient } = useAuth();
  const { isBarber } = useTheme();
  const { cartItems } = useCart();

  const cartCount = cartItems.reduce((sum, item) => sum + item.quantity, 0);

  const handleLogout = async () => {
    await signOut();
    navigate('/');
    setMobileMenuOpen(false);
  };

  const isActive = (path) => location.pathname === path;

  // Render Admin Navigation
  if (isAdmin) {
    return (
      <header className="sticky top-0 z-50 bg-slate-900 border-b border-slate-800 shadow-sm text-white">
        <nav className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
             <Link to="/admin/dashboard" className="flex items-center space-x-2">
                <Shield className="h-6 w-6 text-blue-500" />
                <span className="text-xl font-bold">Panel Admin</span>
             </Link>
             <Button onClick={handleLogout} variant="ghost" size="sm" className="text-slate-300 hover:text-white">
                <LogOut className="h-4 w-4 mr-2" /> Salir
             </Button>
          </div>
        </nav>
      </header>
    );
  }

  return (
    <header className={cn(
      "sticky top-0 z-50 backdrop-blur-lg border-b shadow-sm transition-colors duration-300",
      isBarber ? "bg-black/90 border-yellow-900/30" : "bg-white/80 border-gray-200"
    )}>
      <nav className="container mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          <Link to="/" className="flex items-center space-x-2">
            <motion.div
              whileHover={{ scale: 1.05 }}
              className={cn(
                "text-2xl font-bold bg-clip-text text-transparent",
                isBarber ? "bg-gradient-to-r from-yellow-500 to-yellow-300" : "bg-gradient-to-r from-rose-500 via-pink-500 to-purple-500"
              )}
            >
              TuCita{isProfessional ? ' Pro' : ''}
            </motion.div>
          </Link>

          {/* Desktop Nav */}
          <div className="hidden md:flex items-center space-x-6">
            <Link 
              to="/profesionales" 
              className={cn(
                "text-sm font-medium transition-colors hover:text-rose-500",
                isActive('/profesionales') ? "text-rose-600 font-bold" : "text-gray-700"
              )}
            >
              Profesionales
            </Link>
            
            <Link 
              to="/store" 
              className={cn(
                "text-sm font-medium transition-colors hover:text-rose-500",
                isActive('/store') ? "text-rose-600 font-bold" : "text-gray-700"
              )}
            >
              Tienda
            </Link>

            {isAuthenticated ? (
              <div className="flex items-center space-x-4">
                {isProfessional && (
                  <>
                     <Link
                       to="/professional-dashboard"
                       className={cn("text-sm font-medium hover:text-rose-700 flex items-center gap-1", isActive('/professional-dashboard') ? "text-rose-600" : "text-gray-700")}
                     >
                       <LayoutDashboard className="w-4 h-4" /> Panel
                     </Link>
                     <Link
                       to="/mi-perfil-profesional"
                       className={cn("text-sm font-medium hover:text-rose-700 flex items-center gap-1", isActive('/mi-perfil-profesional') ? "text-rose-600" : "text-gray-700")}
                     >
                       <UserCircle className="w-4 h-4" /> Mi Perfil
                     </Link>
                  </>
                )}
                
                {isClient && (
                  <Link
                    to="/customer-dashboard"
                    className={cn("text-sm font-medium hover:text-rose-700 flex items-center gap-1", isActive('/customer-dashboard') ? "text-rose-600" : "text-gray-700")}
                  >
                    <LayoutDashboard className="w-4 h-4" /> Mi Panel
                  </Link>
                )}
                
                <div className="h-6 w-px bg-gray-200 mx-2"></div>

                <div className="flex flex-col text-right mr-1">
                   <span className="text-xs font-bold text-gray-900">{currentUser?.full_name}</span>
                   <span className="text-[10px] text-gray-500 capitalize">{currentUser?.role}</span>
                </div>
                <Button onClick={handleLogout} variant="ghost" size="sm" className="hover:text-red-600">
                  <LogOut className="h-4 w-4" />
                </Button>
              </div>
            ) : (
              <div className="flex items-center space-x-4">
                {/* Login Dropdown */}
                <div className="relative group">
                   <button className="flex items-center text-sm font-medium text-gray-700 hover:text-rose-600">
                      Ingresar <ChevronDown className="w-3 h-3 ml-1" />
                   </button>
                   <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg py-1 border border-gray-100 hidden group-hover:block hover:block z-50">
                      <Link to="/login-client" className="block px-4 py-2 text-sm text-gray-700 hover:bg-rose-50 hover:text-rose-600">
                         Soy Cliente
                      </Link>
                      <Link to="/login-professional" className="block px-4 py-2 text-sm text-gray-700 hover:bg-indigo-50 hover:text-indigo-600">
                         Soy Profesional
                      </Link>
                   </div>
                </div>

                {/* Register Dropdown */}
                <div className="relative group">
                   <button className="flex items-center text-sm font-medium px-4 py-2 rounded-md bg-rose-600 text-white hover:bg-rose-700 transition-colors">
                      Registrarse <ChevronDown className="w-3 h-3 ml-1" />
                   </button>
                   <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg py-1 border border-gray-100 hidden group-hover:block hover:block z-50">
                      <Link to="/register-client" className="block px-4 py-2 text-sm text-gray-700 hover:bg-rose-50 hover:text-rose-600">
                         Crear cuenta Cliente
                      </Link>
                      <Link to="/register-professional" className="block px-4 py-2 text-sm text-gray-700 hover:bg-indigo-50 hover:text-indigo-600">
                         Crear cuenta Profesional
                      </Link>
                   </div>
                </div>
              </div>
            )}
            
            {/* Cart Icon */}
            <button 
               onClick={onCartClick}
               className="relative p-2 text-gray-600 hover:text-rose-600 transition-colors"
            >
               <CartIcon className="w-6 h-6" />
               {cartCount > 0 && (
                  <span className="absolute -top-1 -right-1 bg-rose-600 text-white text-[10px] font-bold px-1.5 py-0.5 rounded-full">
                     {cartCount}
                  </span>
               )}
            </button>
          </div>

          {/* Mobile Menu Button */}
          <div className="md:hidden flex items-center gap-4">
            <button 
               onClick={onCartClick}
               className="relative p-1 text-gray-600 hover:text-rose-600 transition-colors"
            >
               <CartIcon className="w-6 h-6" />
               {cartCount > 0 && (
                  <span className="absolute -top-1 -right-1 bg-rose-600 text-white text-[10px] font-bold px-1.5 py-0.5 rounded-full">
                     {cartCount}
                  </span>
               )}
            </button>
            <button onClick={() => setMobileMenuOpen(!mobileMenuOpen)} className="p-2">
              {mobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </button>
          </div>
        </div>
      </nav>

      {/* Mobile Menu */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="md:hidden bg-white border-b overflow-hidden"
          >
            <div className="p-4 space-y-4">
              <Link to="/profesionales" onClick={() => setMobileMenuOpen(false)} className="block p-2 text-center text-gray-700 font-medium border-b border-gray-50">
                Ver Profesionales
              </Link>
              <Link to="/store" onClick={() => setMobileMenuOpen(false)} className="block p-2 text-center text-gray-700 font-medium border-b border-gray-50">
                Tienda
              </Link>

              {!isAuthenticated ? (
                <div className="grid grid-cols-2 gap-2 mt-4">
                   <div className="col-span-2 text-center text-xs font-semibold text-gray-400 uppercase tracking-wider mb-1">Clientes</div>
                   <Link to="/login-client" className="p-2 text-center bg-gray-50 rounded text-sm font-medium">Ingresar</Link>
                   <Link to="/register-client" className="p-2 text-center bg-rose-600 text-white rounded text-sm font-medium">Registrarse</Link>
                   
                   <div className="col-span-2 text-center text-xs font-semibold text-gray-400 uppercase tracking-wider mb-1 mt-3">Profesionales</div>
                   <Link to="/login-professional" className="p-2 text-center bg-gray-50 rounded text-sm font-medium">Ingresar</Link>
                   <Link to="/register-professional" className="p-2 text-center bg-indigo-600 text-white rounded text-sm font-medium">Registrarse</Link>
                </div>
              ) : (
                <>
                  {isProfessional ? (
                    <>
                      <Link to="/professional-dashboard" onClick={() => setMobileMenuOpen(false)} className="block p-2 text-indigo-600 font-bold text-center">
                        Panel Profesional
                      </Link>
                      <Link to="/mi-perfil-profesional" onClick={() => setMobileMenuOpen(false)} className="block p-2 text-indigo-600 font-medium text-center">
                        Mi Perfil Público
                      </Link>
                    </>
                  ) : (
                    <Link to="/customer-dashboard" onClick={() => setMobileMenuOpen(false)} className="block p-2 text-rose-600 font-bold text-center">
                      Mi Panel
                    </Link>
                  )}
                  <button onClick={handleLogout} className="block w-full text-center p-2 text-red-500 font-medium mt-4 bg-red-50 rounded-lg">
                    Cerrar Sesión
                  </button>
                </>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
};

export default Header;
