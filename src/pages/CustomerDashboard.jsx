
import React, { useState, useEffect } from 'react';
import { Helmet } from 'react-helmet';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Calendar, Clock, X, User, Loader2, AlertCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/contexts/AuthContext';
import { useSupabase } from '@/hooks/useSupabase';
import { supabase } from '@/lib/customSupabaseClient';

const CustomerDashboard = () => {
  const { currentUser, isAuthenticated, loading } = useAuth();
  const { fetchAppointments, updateAppointmentStatus } = useSupabase();
  const [appointments, setAppointments] = useState([]);
  const [activeTab, setActiveTab] = useState('upcoming');
  const [dataLoading, setDataLoading] = useState(false);

  useEffect(() => {
    if (isAuthenticated && currentUser) {
      loadAppointments();
    }
  }, [isAuthenticated, currentUser]);

  const loadAppointments = async () => {
    setDataLoading(true);
    const data = await fetchAppointments(currentUser.id, 'customer');
    if (data) setAppointments(data);
    setDataLoading(false);
  };

  const handleCancel = async (id, apt) => {
    if (confirm("¿Estás seguro de que quieres cancelar esta cita?")) {
        const result = await updateAppointmentStatus(id, 'cancelled');
        if (result && result.success) {
            loadAppointments();
            // Optional: WhatsApp Notification logic...
        }
    }
  };

  if (loading) {
     return <div className="min-h-screen flex items-center justify-center"><Loader2 className="w-8 h-8 animate-spin text-rose-500" /></div>;
  }

  if (!isAuthenticated) {
     return (
       <div className="min-h-screen flex flex-col items-center justify-center p-4 text-center">
          <AlertCircle className="w-12 h-12 text-red-500 mb-4" />
          <h2 className="text-2xl font-bold text-gray-900">Acceso Restringido</h2>
          <p className="text-gray-500 mb-6">Debes iniciar sesión para ver tu panel de cliente.</p>
          <Link to="/login/client"><Button>Iniciar Sesión</Button></Link>
       </div>
     );
  }

  const upcoming = appointments.filter(a => new Date(a.date) >= new Date() && a.status !== 'cancelled');
  const past = appointments.filter(a => new Date(a.date) < new Date() || a.status === 'completed' || a.status === 'cancelled');

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <Helmet><title>Mi Panel | TuCita</title></Helmet>
      <div className="container mx-auto px-4">
        <h1 className="text-3xl font-bold mb-8">Mi Panel</h1>
        
        <div className="grid lg:grid-cols-3 gap-8">
           <div className="bg-white p-6 rounded-xl shadow h-fit">
              <div className="flex items-center gap-4 mb-4">
                  <div className="w-12 h-12 bg-rose-100 rounded-full flex items-center justify-center text-rose-600 font-bold text-xl uppercase">
                      {currentUser?.full_name?.charAt(0) || 'U'}
                  </div>
                  <div>
                      <h2 className="font-bold">{currentUser?.full_name}</h2>
                      <p className="text-sm text-gray-500">{currentUser?.email}</p>
                      <span className="inline-block mt-1 px-2 py-0.5 bg-gray-100 text-gray-600 text-xs rounded-full capitalize">{currentUser?.role}</span>
                  </div>
              </div>
           </div>

           <div className="lg:col-span-2 bg-white rounded-xl shadow overflow-hidden">
               <div className="flex border-b">
                   <button 
                     onClick={() => setActiveTab('upcoming')}
                     className={`flex-1 p-4 font-medium ${activeTab === 'upcoming' ? 'text-rose-600 border-b-2 border-rose-600' : 'text-gray-500'}`}
                   >
                       Próximas
                   </button>
                   <button 
                     onClick={() => setActiveTab('past')}
                     className={`flex-1 p-4 font-medium ${activeTab === 'past' ? 'text-rose-600 border-b-2 border-rose-600' : 'text-gray-500'}`}
                   >
                       Historial
                   </button>
               </div>
               
               <div className="p-6 space-y-4">
                   {dataLoading ? (
                       <div className="text-center py-8"><Loader2 className="w-6 h-6 animate-spin mx-auto text-gray-400" /></div>
                   ) : (
                       <>
                           {(activeTab === 'upcoming' ? upcoming : past).map(apt => (
                               <div key={apt.id} className="border rounded-lg p-4 hover:shadow-md transition-shadow">
                                   <div className="flex justify-between items-start">
                                       <div>
                                           <h3 className="font-bold text-lg">{apt.professionalName}</h3>
                                           <p className="text-rose-500">{apt.serviceName}</p>
                                           <div className="flex gap-4 mt-2 text-sm text-gray-600">
                                               <span className="flex items-center"><Calendar className="h-4 w-4 mr-1"/> {new Date(apt.date).toLocaleDateString('es-ES', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}</span>
                                               <span className="flex items-center"><Clock className="h-4 w-4 mr-1"/> {apt.time}</span>
                                           </div>
                                       </div>
                                       <div className="text-right">
                                           <span className="font-bold block text-lg">{apt.price}€</span>
                                           <span className={`text-xs px-2 py-1 rounded-full ${
                                               apt.status === 'confirmed' ? 'bg-green-100 text-green-700' : apt.status === 'cancelled' ? 'bg-red-100 text-red-700' : 'bg-gray-100 text-gray-700'
                                           }`}>
                                               {apt.status === 'confirmed' ? 'Confirmada' : apt.status === 'pending' ? 'Pendiente' : 'Cancelada'}
                                           </span>
                                       </div>
                                   </div>
                                   {activeTab === 'upcoming' && (
                                       <div className="mt-4 pt-4 border-t flex justify-end">
                                           <Button variant="outline" size="sm" className="text-red-500 hover:bg-red-50" onClick={() => handleCancel(apt.id, apt)}>
                                               Cancelar Cita
                                           </Button>
                                       </div>
                                   )}
                               </div>
                           ))}
                           {(activeTab === 'upcoming' ? upcoming : past).length === 0 && (
                               <div className="text-center py-8 text-gray-500">No hay citas en esta sección.</div>
                           )}
                       </>
                   )}
               </div>
           </div>
        </div>
      </div>
    </div>
  );
};

export default CustomerDashboard;
