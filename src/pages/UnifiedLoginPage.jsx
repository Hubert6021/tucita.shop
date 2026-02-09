
import React from 'react';
import { Helmet } from 'react-helmet';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { User, Briefcase, ArrowRight, ArrowLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';

const UnifiedLoginPage = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 flex items-center justify-center p-4">
      <Helmet>
        <title>Iniciar Sesión - TuCita</title>
        <meta name="description" content="Accede a tu cuenta de TuCita como cliente o profesional." />
      </Helmet>

      <div className="max-w-4xl w-full">
        <div className="mb-8 ml-2">
           <Link to="/" className="text-sm font-medium text-gray-500 hover:text-gray-900 flex items-center transition-colors">
              <ArrowLeft className="w-4 h-4 mr-1" /> Volver al Inicio
           </Link>
        </div>

        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-4 tracking-tight">Bienvenido a TuCita</h1>
          <p className="text-xl text-gray-600">Selecciona tu tipo de cuenta para continuar</p>
        </div>

        <div className="grid md:grid-cols-2 gap-8">
          {/* Client Option */}
          <motion.div 
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.1 }}
            className="group relative bg-white rounded-2xl shadow-xl overflow-hidden hover:shadow-2xl transition-all duration-300 border border-gray-100 flex flex-col"
          >
            <div className="absolute top-0 left-0 w-full h-1.5 bg-gradient-to-r from-rose-400 to-pink-600" />
            <div className="p-8 flex flex-col items-center text-center flex-grow">
              <div className="w-20 h-20 bg-rose-50 rounded-full flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300 shadow-inner">
                <User className="w-10 h-10 text-rose-600" />
              </div>
              <h2 className="text-2xl font-bold text-gray-900 mb-3">Soy Cliente</h2>
              <p className="text-gray-500 mb-8">
                Reserva citas, gestiona tus servicios favoritos y descubre nuevos profesionales cerca de ti.
              </p>
              
              <div className="mt-auto w-full">
                <Link to="/login/client" className="w-full block">
                  <Button className="w-full bg-rose-600 hover:bg-rose-700 text-white h-12 text-lg group-hover:shadow-lg transition-all rounded-xl">
                    Ingresar como Cliente <ArrowRight className="ml-2 w-5 h-5" />
                  </Button>
                </Link>
              </div>

              <div className="mt-6 pt-6 border-t w-full">
                <p className="text-sm text-gray-600">
                  ¿No tienes cuenta?{' '}
                  <Link to="/signup" className="text-rose-600 font-semibold hover:underline">
                    Regístrate gratis
                  </Link>
                </p>
              </div>
            </div>
          </motion.div>

          {/* Professional Option */}
          <motion.div 
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2 }}
            className="group relative bg-white rounded-2xl shadow-xl overflow-hidden hover:shadow-2xl transition-all duration-300 border border-gray-100 flex flex-col"
          >
            <div className="absolute top-0 left-0 w-full h-1.5 bg-gradient-to-r from-purple-500 to-indigo-600" />
            <div className="p-8 flex flex-col items-center text-center flex-grow">
              <div className="w-20 h-20 bg-purple-50 rounded-full flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300 shadow-inner">
                <Briefcase className="w-10 h-10 text-purple-600" />
              </div>
              <h2 className="text-2xl font-bold text-gray-900 mb-3">Soy Profesional</h2>
              <p className="text-gray-500 mb-8">
                Gestiona tu agenda, administra tus servicios, conecta con clientes y haz crecer tu negocio.
              </p>
              
              <div className="mt-auto w-full">
                <Link to="/login/professional" className="w-full block">
                  <Button className="w-full bg-purple-600 hover:bg-purple-700 text-white h-12 text-lg group-hover:shadow-lg transition-all rounded-xl">
                    Ingresar como Profesional <ArrowRight className="ml-2 w-5 h-5" />
                  </Button>
                </Link>
              </div>

              <div className="mt-6 pt-6 border-t w-full">
                <p className="text-sm text-gray-600">
                  ¿Quieres unirte?{' '}
                  <Link to="/register?type=professional" className="text-purple-600 font-semibold hover:underline">
                    Regístrate como Profesional
                  </Link>
                </p>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
};

export default UnifiedLoginPage;
