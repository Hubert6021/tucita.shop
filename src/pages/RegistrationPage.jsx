
import React from 'react';
import { Helmet } from 'react-helmet';
import { Link } from 'react-router-dom';
import RegistrationFormLayout from '@/components/RegistrationFormLayout';
import { ChevronRight, Home } from 'lucide-react';

const RegistrationPage = () => {
  return (
    <div className="min-h-screen bg-gray-50/50 pb-12">
      <Helmet>
        <title>Registro - TuCita | Únete a nuestra comunidad</title>
        <meta name="description" content="Regístrate en TuCita como cliente o profesional. Gestiona citas, reservas y haz crecer tu negocio." />
      </Helmet>

      {/* Breadcrumb Navigation */}
      <div className="bg-white border-b border-gray-200 mb-6 sticky top-[64px] z-10 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 py-3">
          <nav className="flex text-sm text-gray-500">
            <Link to="/" className="hover:text-gray-900 flex items-center transition-colors">
              <Home className="w-4 h-4 mr-1" /> Inicio
            </Link>
            <ChevronRight className="w-4 h-4 mx-2 text-gray-300" />
            <span className="text-gray-900 font-medium cursor-default">Registro</span>
          </nav>
        </div>
      </div>

      {/* Main Content */}
      <div className="container mx-auto px-4">
         <RegistrationFormLayout />
      </div>
    </div>
  );
};

export default RegistrationPage;
