import React, { useState } from 'react';
import { Helmet } from 'react-helmet';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Check, Image as ImageIcon, Briefcase, Calendar, Phone } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/contexts/AuthContext';
import ServiceManagement from '@/components/ServiceManagement';
import AvailabilityManager from '@/components/AvailabilityManager';
import { useToast } from '@/components/ui/use-toast';

const ProfessionalOnboarding = () => {
  const { currentUser, updateProfile } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [activeStep, setActiveStep] = useState(1);
  const [portfolioUrl, setPortfolioUrl] = useState('');
  const [localServices, setLocalServices] = useState(currentUser.services || []);
  const [localAvailability, setLocalAvailability] = useState(currentUser.availability || {});

  const handleFinish = async () => {
    // Save any pending data before finishing onboarding
    await updateProfile({ 
      onboarded: true,
      services: localServices,
      availability: localAvailability
    });
    toast({ title: "¡Perfil configurado!", description: "Tu perfil profesional está ahora activo." });
    navigate('/professional-dashboard');
  };

  const addPortfolioImage = async () => {
    if (!portfolioUrl.trim()) {
      toast({ title: "Error", description: "La URL de la imagen no puede estar vacía.", variant: "destructive" });
      return;
    }
    const currentPortfolio = currentUser.portfolio || [];
    const newPortfolio = [...currentPortfolio, portfolioUrl];
    const { success, error } = await updateProfile({ portfolio: newPortfolio });
    if (success) {
      toast({ title: "Imagen añadida", description: "La imagen se ha agregado a tu portfolio." });
      setPortfolioUrl('');
    } else {
      toast({ title: "Error", description: error, variant: "destructive" });
    }
  };

  const handleUpdateServices = (updatedServices) => {
    setLocalServices(updatedServices);
    // updateProfile({ services: updatedServices }); // Update immediately or on next/finish
  };

  const handleUpdateAvailability = (updatedAvailability) => {
    setLocalAvailability(updatedAvailability);
    // updateProfile({ availability: updatedAvailability }); // Update immediately or on next/finish
  };

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4">
      <Helmet>
        <title>Configuración de Perfil - TuCita Pro</title>
      </Helmet>

      <div className="max-w-4xl mx-auto">
        <div className="mb-10 text-center">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">¡Bienvenido, {currentUser.full_name}!</h1>
          <p className="text-gray-600">Configuremos tu perfil profesional para empezar a recibir clientes.</p>
        </div>

        <div className="flex justify-between items-center mb-12 max-w-2xl mx-auto">
          {[1, 2, 3, 4].map((step) => (
            <button
              key={step}
              onClick={() => setActiveStep(step)}
              className={`flex flex-col items-center gap-2 ${activeStep === step ? 'scale-110 transition-transform' : ''}`}
            >
              <div className={`w-12 h-12 rounded-full flex items-center justify-center border-2 ${
                activeStep === step 
                  ? 'border-rose-500 bg-rose-50 text-rose-600' 
                  : step < activeStep 
                    ? 'border-green-500 bg-green-50 text-green-600'
                    : 'border-gray-300 bg-white text-gray-300'
              }`}>
                {step < activeStep ? <Check className="h-6 w-6" /> : step}
              </div>
              <span className={`text-xs font-medium ${activeStep === step ? 'text-rose-600' : 'text-gray-500'}`}>
                {step === 1 ? 'Portfolio' : step === 2 ? 'Servicios' : step === 3 ? 'Horario' : 'Contacto'}
              </span>
            </button>
          ))}
        </div>

        <motion.div
          key={activeStep}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white rounded-2xl shadow-lg p-8"
        >
          {activeStep === 1 && (
            <div className="space-y-6">
              <div className="flex items-center gap-3 mb-6">
                <ImageIcon className="h-8 w-8 text-rose-500" />
                <h2 className="text-2xl font-bold text-gray-900">Tu Portfolio</h2>
              </div>
              
              <div className="flex gap-4">
                <input 
                  type="text" 
                  value={portfolioUrl}
                  onChange={(e) => setPortfolioUrl(e.target.value)}
                  placeholder="URL de la imagen (ej: Unsplash)"
                  className="flex-1 p-3 border rounded-lg text-gray-900"
                />
                <Button onClick={addPortfolioImage}>Añadir Foto</Button>
              </div>

              <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mt-6">
                {(currentUser.portfolio && currentUser.portfolio.length > 0) ? currentUser.portfolio.map((img, idx) => (
                  <div key={idx} className="relative aspect-square rounded-lg overflow-hidden group">
                    <img src={img} alt="Portfolio" className="w-full h-full object-cover" />
                  </div>
                )) : (
                  <div className="col-span-full text-center py-12 bg-gray-50 rounded-lg border-2 border-dashed">
                    <p className="text-gray-500">Añade fotos de tu trabajo para destacar</p>
                  </div>
                )}
              </div>
              
              <div className="flex justify-end pt-6">
                <Button onClick={() => setActiveStep(2)}>Siguiente: Servicios</Button>
              </div>
            </div>
          )}

          {activeStep === 2 && (
            <div>
              <div className="flex items-center gap-3 mb-6">
                <Briefcase className="h-8 w-8 text-rose-500" />
                <h2 className="text-2xl font-bold text-gray-900">Tus Servicios</h2>
              </div>
              <ServiceManagement 
                services={localServices} 
                onUpdate={handleUpdateServices} 
              />
              <div className="flex justify-between pt-8 border-t mt-8">
                <Button variant="outline" onClick={() => setActiveStep(1)}>Atrás</Button>
                <Button onClick={() => setActiveStep(3)}>Siguiente: Horarios</Button>
              </div>
            </div>
          )}

          {activeStep === 3 && (
            <div>
              <div className="flex items-center gap-3 mb-6">
                <Calendar className="h-8 w-8 text-rose-500" />
                <h2 className="text-2xl font-bold text-gray-900">Tu Disponibilidad</h2>
              </div>
              <AvailabilityManager 
                availability={localAvailability} 
                onUpdate={handleUpdateAvailability} 
              />
              <div className="flex justify-between pt-8 border-t mt-8">
                <Button variant="outline" onClick={() => setActiveStep(2)}>Atrás</Button>
                <Button onClick={() => setActiveStep(4)}>Siguiente: Contacto</Button>
              </div>
            </div>
          )}

          {activeStep === 4 && (
            <div className="space-y-6">
              <div className="flex items-center gap-3 mb-6">
                <Phone className="h-8 w-8 text-rose-500" />
                <h2 className="text-2xl font-bold text-gray-900">Métodos de Contacto</h2>
              </div>
              
              <div className="space-y-4 max-w-md">
                <div>
                  <label className="block text-sm font-medium mb-1">WhatsApp Business</label>
                  <input type="text" placeholder="+34..." className="w-full p-3 border rounded-lg text-gray-900" defaultValue={currentUser.phone} />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">Correo Electrónico de Contacto</label>
                  <input type="email" className="w-full p-3 border rounded-lg text-gray-900" defaultValue={currentUser.email} />
                </div>
              </div>

              <div className="bg-green-50 p-6 rounded-xl border border-green-200 mt-8 text-center">
                <h3 className="text-lg font-bold text-green-800 mb-2">¡Todo listo!</h3>
                <p className="text-green-700 mb-6">Tu perfil está completo y listo para ser publicado.</p>
                <Button onClick={handleFinish} size="lg" className="w-full md:w-auto bg-green-600 hover:bg-green-700">
                  Publicar Perfil y Ir al Dashboard
                </Button>
              </div>
              
              <div className="flex justify-start pt-4">
                <Button variant="outline" onClick={() => setActiveStep(3)}>Atrás</Button>
              </div>
            </div>
          )}
        </motion.div>
      </div>
    </div>
  );
};

export default ProfessionalOnboarding;