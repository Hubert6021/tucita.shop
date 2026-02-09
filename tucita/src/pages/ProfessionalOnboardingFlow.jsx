import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { useSupabase } from '@/hooks/useSupabase';
import { supabase } from '@/lib/customSupabaseClient';
import { Button } from '@/components/ui/button';
import { useToast } from '@/components/ui/use-toast';
import { Loader2, Camera, Scissors, Calendar, CheckCircle } from 'lucide-react';
import ProfessionalProfileEditor from '@/components/ProfessionalProfileEditor';
import ServiceManagement from '@/components/ServiceManagement';
import AvailabilityManager from '@/components/AvailabilityManager';

const ProfessionalOnboardingFlow = () => {
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const { currentUser, updateProfile } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();

  const handleFinish = async () => {
    setLoading(true);
    try {
      // Approve professional automatically for demo purposes
      const { error } = await supabase
        .from('professionals')
        .update({ status: 'approved' }) 
        .eq('id', currentUser.id);

      if (error) throw error;
      
      // Update local context status if possible, or just force reload
      await updateProfile({ status: 'approved' });
      
      toast({ title: "¡Configuración completada!", description: "Bienvenido a tu panel profesional." });
      navigate('/professional-dashboard');
    } catch (error) {
      toast({ title: "Error", description: error.message, variant: "destructive" });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-3xl mx-auto">
        <div className="mb-10 text-center">
          <h1 className="text-3xl font-bold text-gray-900">Configura tu Perfil Profesional</h1>
          <p className="mt-2 text-gray-600">Completa estos pasos para empezar a recibir reservas.</p>
        </div>

        {/* Progress Steps */}
        <div className="flex justify-center mb-8">
          <div className="flex items-center gap-4">
             {[
               { num: 1, label: 'Perfil', icon: Camera },
               { num: 2, label: 'Servicios', icon: Scissors },
               { num: 3, label: 'Horarios', icon: Calendar }
             ].map((s) => (
               <div key={s.num} className={`flex items-center ${step === s.num ? 'text-blue-600' : 'text-gray-400'}`}>
                 <div className={`w-8 h-8 rounded-full flex items-center justify-center border-2 mr-2 ${step >= s.num ? 'border-blue-600 bg-blue-50' : 'border-gray-300'}`}>
                   <s.icon className="h-4 w-4" />
                 </div>
                 <span className="hidden sm:inline font-medium">{s.label}</span>
                 {s.num < 3 && <div className="w-8 h-0.5 bg-gray-200 mx-2 sm:mx-4" />}
               </div>
             ))}
          </div>
        </div>

        <div className="bg-white shadow rounded-lg p-6">
          <div className="mb-6">
            <h2 className="text-xl font-semibold mb-2">
              {step === 1 && "1. Información de Perfil"}
              {step === 2 && "2. Agrega tus servicios"}
              {step === 3 && "3. Define tu disponibilidad"}
            </h2>
            <p className="text-gray-500 text-sm">
              {step === 1 && "Completa los detalles de tu negocio y sube una foto."}
              {step === 2 && "Agrega al menos un servicio para continuar."}
              {step === 3 && "Configura tus horarios de trabajo semanales."}
            </p>
          </div>

          <div className="mb-8">
             {step === 1 && <ProfessionalProfileEditor />}
             {step === 2 && <ServiceManagement />}
             {step === 3 && <AvailabilityManager />}
          </div>

          <div className="flex justify-between pt-4 border-t">
            <Button 
              variant="outline" 
              onClick={() => setStep(prev => Math.max(1, prev - 1))}
              disabled={step === 1}
            >
              Atrás
            </Button>
            
            {step < 3 ? (
              <Button onClick={() => setStep(prev => Math.min(3, prev + 1))}>
                Siguiente
              </Button>
            ) : (
              <Button onClick={handleFinish} className="bg-green-600 hover:bg-green-700 text-white" disabled={loading}>
                {loading ? <Loader2 className="animate-spin mr-2 h-4 w-4" /> : <CheckCircle className="mr-2 h-4 w-4" />}
                Finalizar y Publicar
              </Button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfessionalOnboardingFlow;