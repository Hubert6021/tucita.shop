
import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import ProfessionalRegistrationForm from '@/components/ProfessionalRegistrationForm';
import ClientRegistrationForm from '@/components/ClientRegistrationForm';
import { Briefcase, User, Sparkles } from 'lucide-react';

const RegistrationFormLayout = () => {
  const location = useLocation();
  const [mode, setMode] = useState('client'); // 'client' or 'professional'

  useEffect(() => {
    // Detect initial mode from URL state or query param
    // This allows linking directly to professional registration: /register?type=professional
    const params = new URLSearchParams(location.search);
    const typeParam = params.get('type');
    
    if (location.state?.mode === 'professional' || typeParam === 'professional') {
      setMode('professional');
    } else {
      setMode('client');
    }
    console.log("Registration Layout Mounted. Mode:", mode);
  }, [location.search, location.state]);

  const handleModeSwitch = (newMode) => {
    setMode(newMode);
    console.log("Switched registration mode to:", newMode);
  };

  return (
    <div className="w-full max-w-4xl mx-auto px-4 py-8 flex flex-col items-center">
      
      {/* Header Branding */}
      <div className="text-center mb-10 max-w-2xl">
        <div className="inline-flex items-center justify-center p-3 bg-white rounded-full shadow-sm mb-4">
          <Sparkles className="w-8 h-8 text-transparent bg-clip-text bg-gradient-to-r from-rose-500 to-purple-600 stroke-rose-500" />
        </div>
        <h1 className="text-4xl font-extrabold text-gray-900 tracking-tight mb-3">
          Únete a <span className="text-transparent bg-clip-text bg-gradient-to-r from-rose-500 to-purple-600">TuCita</span>
        </h1>
        <p className="text-lg text-gray-600">
          La plataforma líder para conectar profesionales con clientes increíbles.
        </p>
      </div>

      {/* Mode Toggle Tabs */}
      <div className="w-full max-w-md mb-8">
        <div className="bg-white p-1 rounded-xl shadow-sm border border-gray-200 grid grid-cols-2 gap-1">
           <button
             type="button"
             onClick={() => handleModeSwitch('client')}
             className={`flex items-center justify-center py-3 px-4 rounded-lg text-sm font-semibold transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-rose-200 ${
               mode === 'client' 
                 ? 'bg-rose-50 text-rose-700 shadow-sm ring-1 ring-rose-200' 
                 : 'text-gray-500 hover:bg-gray-50'
             }`}
           >
             <User className="w-4 h-4 mr-2" />
             Soy Cliente
           </button>
           <button
             type="button"
             onClick={() => handleModeSwitch('professional')}
             className={`flex items-center justify-center py-3 px-4 rounded-lg text-sm font-semibold transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-blue-200 ${
               mode === 'professional' 
                 ? 'bg-blue-50 text-blue-700 shadow-sm ring-1 ring-blue-200' 
                 : 'text-gray-500 hover:bg-gray-50'
             }`}
           >
             <Briefcase className="w-4 h-4 mr-2" />
             Soy Profesional
           </button>
        </div>
      </div>

      {/* Form Container with Transitions */}
      <div className="w-full relative min-h-[500px]">
        <AnimatePresence mode="wait">
          {mode === 'professional' ? (
            <motion.div
              key="professional"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.3 }}
              className="relative w-full"
            >
               {/* Decorative Background Elements */}
               <div className="absolute -top-10 -left-10 w-40 h-40 bg-blue-100 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-blob pointer-events-none"></div>
               <div className="absolute -bottom-10 -right-10 w-40 h-40 bg-purple-100 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-blob animation-delay-2000 pointer-events-none"></div>
               
               <ProfessionalRegistrationForm />
            </motion.div>
          ) : (
            <motion.div
              key="client"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 20 }}
              transition={{ duration: 0.3 }}
              className="relative w-full"
            >
               {/* Decorative Background Elements */}
               <div className="absolute -top-10 -left-10 w-40 h-40 bg-rose-100 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-blob pointer-events-none"></div>
               <div className="absolute -bottom-10 -right-10 w-40 h-40 bg-pink-100 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-blob animation-delay-2000 pointer-events-none"></div>
               
               <ClientRegistrationForm />
            </motion.div>
          )}
        </AnimatePresence>
      </div>
      
    </div>
  );
};

export default RegistrationFormLayout;
