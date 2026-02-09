import React, { useState, useEffect } from 'react';
import { Helmet } from 'react-helmet';
import { useParams, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Calendar, Clock, Check, ArrowLeft, ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useToast } from '@/components/ui/use-toast';
import { useAuth } from '@/contexts/AuthContext';
import { useTheme } from '@/contexts/ThemeContext';
import { useSupabase } from '@/hooks/useSupabase';
import { supabase } from '@/lib/customSupabaseClient';
import { getThemeForProfessional } from '@/utils/themeUtils';
import { cn } from '@/lib/utils';
import BarberThemeWrapper from '@/components/BarberThemeWrapper';

const BookingFlow = () => {
  const { professionalId } = useParams();
  const navigate = useNavigate();
  const { toast } = useToast();
  const { currentUser } = useAuth();
  const { setTheme, isBarber, styles } = useTheme();
  const { fetchProfessionalById, createAppointment, loading: supabaseLoading } = useSupabase();

  const [professional, setProfessional] = useState(null);
  const [currentStep, setCurrentStep] = useState(1);
  const [selectedService, setSelectedService] = useState(null);
  const [selectedDate, setSelectedDate] = useState('');
  const [selectedTime, setSelectedTime] = useState('');

  useEffect(() => {
    const loadPro = async () => {
      const data = await fetchProfessionalById(professionalId);
      if (data) {
        setProfessional(data);
        setTheme(getThemeForProfessional(data));
      }
    };
    loadPro();
    return () => setTheme('default');
  }, [professionalId, fetchProfessionalById, setTheme]);

  if (!professional) {
    return <div className="min-h-screen flex items-center justify-center">Cargando...</div>;
  }

  const handleServiceSelect = (service) => {
    setSelectedService(service);
    setCurrentStep(2);
  };

  const handleDateSelect = (date) => {
    setSelectedDate(date);
  };

  const handleTimeSelect = (time) => {
    setSelectedTime(time);
    setCurrentStep(3);
  };

  const handleConfirmBooking = async () => {
    if (!currentUser) {
        toast({ title: "Error", description: "Debes iniciar sesión para reservar una cita.", variant: "destructive" });
        return;
    }
    if (!selectedService || !selectedDate || !selectedTime) {
      toast({ title: "Error", description: "Por favor, selecciona un servicio, fecha y hora.", variant: "destructive" });
      return;
    }

    const appointmentData = {
      customer_id: currentUser.id,
      professional_id: professional.id,
      service_id: selectedService.id,
      date: selectedDate,
      time: selectedTime,
      price: selectedService.price,
      status: 'pending' 
    };

    const result = await createAppointment(appointmentData);

    if (result && result.success) {
      setCurrentStep(4);
      toast({
        title: "¡Reserva confirmada!",
        description: `Tu cita con ${professional.business_name} ha sido reservada exitosamente.`,
      });

      // WhatsApp Notification Trigger
      if (professional.whatsapp_notifications_enabled && professional.whatsapp_number) {
          try {
              supabase.functions.invoke('send-whatsapp-notification', {
                  body: {
                      professional_phone: professional.whatsapp_number,
                      professional_id: professional.id,
                      appointment_id: result.data[0]?.id, // Assuming result.data contains the new appointment
                      message_type: 'created',
                      appointment_data: {
                          customer_name: currentUser.full_name || currentUser.name || 'Cliente',
                          service_name: selectedService.name,
                          date: selectedDate,
                          time: selectedTime,
                          duration: selectedService.duration,
                          price: selectedService.price
                      }
                  }
              });
          } catch (err) {
              console.error("Failed to trigger WhatsApp notification", err);
              // Don't block user flow for notification failure
          }
      }

    } else {
      toast({
        title: "Error al reservar",
        description: "Hubo un problema al procesar tu cita. Por favor, inténtalo de nuevo.",
        variant: "destructive"
      });
    }
  };

  const generateDates = () => {
    const dates = [];
    const today = new Date();
    for (let i = 0; i < 14; i++) {
      const date = new Date(today);
      date.setDate(today.getDate() + i);
      dates.push(date.toISOString().split('T')[0]);
    }
    return dates;
  };

  const availableDates = generateDates();
  // Simplified slots
  const slots = ["09:00", "10:00", "11:00", "12:00", "14:00", "15:00", "16:00"];

  return (
    <div className={cn("min-h-screen py-12 transition-colors duration-500", isBarber ? "bg-[#1a1a1a]" : "bg-gray-50")}>
      <Helmet>
        <title>Reservar Cita | TuCita</title>
      </Helmet>

      <div className="container mx-auto px-4 max-w-4xl">
        {/* Progress Steps */}
        <div className="mb-8">
           {/* Steps UI (simplified) */}
           <div className="flex justify-between text-sm font-medium text-gray-500">
               <span className={currentStep >= 1 ? "text-rose-500" : ""}>1. Servicio</span>
               <span className={currentStep >= 2 ? "text-rose-500" : ""}>2. Fecha y Hora</span>
               <span className={currentStep >= 3 ? "text-rose-500" : ""}>3. Confirmar</span>
           </div>
           <div className="h-2 bg-gray-200 mt-2 rounded-full overflow-hidden">
               <div className="h-full bg-rose-500 transition-all duration-300" style={{ width: `${currentStep * 33.33}%` }}></div>
           </div>
        </div>

        <AnimatePresence mode="wait">
          {/* Step 1: Select Service */}
          {currentStep === 1 && (
            <motion.div key="step1" initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
              <BarberThemeWrapper className={cn("p-8 rounded-2xl", !isBarber && "bg-white shadow-lg")}>
                <h2 className={cn("text-3xl font-bold mb-6", isBarber ? "text-white" : "text-gray-900")}>Elige tu servicio</h2>
                <div className="space-y-4">
                  {professional.services?.map((service) => (
                    <div
                      key={service.id}
                      onClick={() => handleServiceSelect(service)}
                      className={cn(
                        "p-4 border rounded-xl cursor-pointer transition-colors flex justify-between items-center",
                        selectedService?.id === service.id 
                          ? "border-rose-500 ring-2 ring-rose-500 bg-rose-50/20" 
                          : "hover:border-rose-500",
                        isBarber ? "hover:border-yellow-600 border-zinc-700 text-white" : "hover:border-rose-300 border-gray-200"
                      )}
                    >
                        <div>
                            <h3 className={cn("font-semibold text-lg", isBarber ? "text-white" : "text-gray-900")}>{service.name}</h3>
                            <p className={cn("text-sm", isBarber ? "text-gray-400" : "text-gray-500")}>{service.duration} min</p>
                        </div>
                        <span className={cn("font-bold text-xl", isBarber ? "text-yellow-500" : "text-gray-900")}>{service.price}€</span>
                    </div>
                  ))}
                </div>
              </BarberThemeWrapper>
            </motion.div>
          )}

          {/* Step 2: Date/Time */}
          {currentStep === 2 && (
             <motion.div key="step2" initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
                <BarberThemeWrapper className={cn("p-8 rounded-2xl", !isBarber && "bg-white shadow-lg")}>
                    <Button variant="ghost" onClick={() => setCurrentStep(1)} className="mb-4"><ArrowLeft className="mr-2 h-4 w-4"/> Volver</Button>
                    <h2 className={cn("text-2xl font-bold mb-4", isBarber ? "text-white" : "text-gray-900")}>Selecciona Fecha</h2>
                    <div className="grid grid-cols-4 md:grid-cols-7 gap-2 mb-6">
                        {availableDates.map(date => (
                            <button 
                                key={date} 
                                onClick={() => handleDateSelect(date)}
                                className={cn(
                                  "p-2 rounded border text-sm text-center transition-colors",
                                  selectedDate === date 
                                    ? (isBarber ? "bg-yellow-600 text-white border-yellow-600" : "bg-rose-500 text-white border-rose-500") 
                                    : (isBarber ? "bg-zinc-800 border-zinc-700 text-gray-300 hover:border-yellow-600" : "bg-gray-50 border-gray-200 text-gray-900 hover:border-rose-300")
                                )}
                            >
                                {new Date(date).getDate()} <br/>
                                <span className="text-xs opacity-75">{new Date(date).toLocaleDateString('es-ES', {month:'short'})}</span>
                            </button>
                        ))}
                    </div>
                    
                    {selectedDate && (
                        <>
                            <h2 className={cn("text-2xl font-bold mb-4", isBarber ? "text-white" : "text-gray-900")}>Selecciona Hora</h2>
                            <div className="grid grid-cols-4 gap-2">
                                {slots.map(time => (
                                    <button
                                        key={time}
                                        onClick={() => handleTimeSelect(time)}
                                        className={cn(
                                          "p-2 rounded border text-sm transition-colors",
                                          selectedTime === time 
                                            ? (isBarber ? "bg-yellow-600 text-white border-yellow-600" : "bg-rose-500 text-white border-rose-500") 
                                            : (isBarber ? "bg-zinc-800 border-zinc-700 text-gray-300 hover:border-yellow-600" : "bg-gray-50 border-gray-200 text-gray-900 hover:border-rose-300")
                                        )}
                                    >
                                        {time}
                                    </button>
                                ))}
                            </div>
                        </>
                    )}
                </BarberThemeWrapper>
             </motion.div>
          )}

          {/* Step 3: Confirm */}
          {currentStep === 3 && (
              <motion.div key="step3" initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
                 <BarberThemeWrapper className={cn("p-8 rounded-2xl", !isBarber && "bg-white shadow-lg")}>
                    <Button variant="ghost" onClick={() => setCurrentStep(2)} className="mb-4"><ArrowLeft className="mr-2 h-4 w-4"/> Volver</Button>
                    <h2 className={cn("text-2xl font-bold mb-6", isBarber ? "text-white" : "text-gray-900")}>Confirmar Reserva</h2>
                    <div className={cn("p-6 rounded-xl mb-6 space-y-3", isBarber ? "bg-zinc-800 text-gray-300" : "bg-gray-50 text-gray-700")}>
                        <div className="flex justify-between"><span>Servicio:</span> <span className={cn("font-bold", isBarber ? "text-white" : "text-gray-900")}>{selectedService.name}</span></div>
                        <div className="flex justify-between"><span>Fecha:</span> <span className={cn("font-bold", isBarber ? "text-white" : "text-gray-900")}>{selectedDate}</span></div>
                        <div className="flex justify-between"><span>Hora:</span> <span className={cn("font-bold", isBarber ? "text-white" : "text-gray-900")}>{selectedTime}</span></div>
                        <div className={cn("flex justify-between border-t pt-2 mt-2", isBarber ? "border-zinc-700" : "border-gray-200")}><span>Total:</span> <span className={cn("font-bold text-xl", isBarber ? "text-yellow-500" : "text-rose-600")}>{selectedService.price}€</span></div>
                    </div>
                    <Button onClick={handleConfirmBooking} className={cn("w-full", isBarber ? "bg-yellow-600 hover:bg-yellow-700 text-white" : "bg-rose-600 hover:bg-rose-700")} disabled={supabaseLoading}>
                        {supabaseLoading ? "Procesando..." : "Confirmar Cita"}
                    </Button>
                 </BarberThemeWrapper>
              </motion.div>
          )}

          {/* Step 4: Success */}
          {currentStep === 4 && (
             <motion.div key="step4" initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
                <div className={cn("text-center p-8 rounded-2xl shadow-lg", isBarber ? "bg-zinc-900 border border-yellow-900/30" : "bg-white")}>
                    <div className={cn("w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4", isBarber ? "bg-green-900/30 text-green-500" : "bg-green-100 text-green-600")}>
                        <Check className="h-8 w-8 stroke-[3]" />
                    </div>
                    <h2 className={cn("text-2xl font-bold mb-2", isBarber ? "text-white" : "text-gray-900")}>¡Cita Confirmada!</h2>
                    <p className={cn("text-gray-600 mb-6", isBarber ? "text-gray-400" : "text-gray-600")}>Hemos enviado los detalles a tu correo electrónico.</p>
                    <Button onClick={() => navigate('/dashboard')} className={isBarber ? "bg-yellow-600 hover:bg-yellow-700 text-white" : "bg-rose-600 hover:bg-rose-700"}>Ir a mis Reservas</Button>
                </div>
             </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};

export default BookingFlow;