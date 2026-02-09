
import React, { useState, useEffect } from 'react';
import { Helmet } from 'react-helmet';
import { useAuth } from '@/contexts/AuthContext';
import { useSupabase } from '@/hooks/useSupabase';
import { supabase } from '@/lib/customSupabaseClient';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { useToast } from '@/components/ui/use-toast';
import { Link } from 'react-router-dom';
import ProfessionalProfileEditor from '@/components/ProfessionalProfileEditor';
import ServiceManagement from '@/components/ServiceManagement';
import AvailabilityManager from '@/components/AvailabilityManager';
import { Briefcase, Calendar, LayoutDashboard, User, Clock, Scissors, CheckCircle, AlertTriangle, Phone, RefreshCw, MessageSquare, ArrowRight, Loader2 } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useTheme } from '@/contexts/ThemeContext';

class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true };
  }

  componentDidCatch(error, errorInfo) {
    console.error("Dashboard Component Error:", error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="p-6 bg-red-50 text-red-700 rounded-lg border border-red-200 m-4">
          <h2 className="text-lg font-bold mb-2">Algo salió mal</h2>
          <p>Ha ocurrido un error al cargar esta sección. Por favor recarga la página.</p>
          <Button onClick={() => window.location.reload()} className="mt-4 bg-red-600 hover:bg-red-700 text-white">Recargar Página</Button>
        </div>
      );
    }
    return this.props.children;
  }
}

const ProfessionalDashboard = () => {
  const { currentUser, isAuthenticated, loading: authLoading } = useAuth();
  const { isBarber } = useTheme();
  const { fetchServices, fetchAvailability } = useSupabase(); 
  const { toast } = useToast();
  const [activeTab, setActiveTab] = useState('overview');
  const [completionStatus, setCompletionStatus] = useState({
    profile: false,
    services: false,
    availability: false,
    percentage: 0
  });
  const [whatsappLogs, setWhatsappLogs] = useState([]);
  const [loadingLogs, setLoadingLogs] = useState(false);
  const [appointments, setAppointments] = useState([]);
  const [loadingApts, setLoadingApts] = useState(false);

  useEffect(() => {
    if (isAuthenticated && currentUser) {
      checkCompletion();
      if (activeTab === 'whatsapp') fetchWhatsappLogs();
      if (activeTab === 'appointments') fetchAppointments();
    }
  }, [currentUser, isAuthenticated, activeTab]);

  const checkCompletion = async () => {
    if (!currentUser?.id) return;
    
    // Check Profile Photo
    const hasPhoto = currentUser.image_url && !currentUser.image_url.includes('unsplash');
    
    // Note: We use the hook's fetchServices here just for counting, separate from ServiceManagement component
    const services = await fetchServices(currentUser.id);
    const hasServices = services && services.length > 0;
    
    const availability = await fetchAvailability(currentUser.id);
    const hasAvailability = availability && availability.some(a => a.is_available);

    const steps = [hasPhoto, hasServices, hasAvailability];
    const completedCount = steps.filter(Boolean).length;
    const percentage = Math.round((completedCount / 3) * 100);

    setCompletionStatus({
      profile: hasPhoto,
      services: hasServices,
      availability: hasAvailability,
      percentage
    });
  };

  const fetchWhatsappLogs = async () => {
      setLoadingLogs(true);
      const { data, error } = await supabase
        .from('whatsapp_message_logs')
        .select('*')
        .eq('professional_id', currentUser.id)
        .order('created_at', { ascending: false })
        .limit(10);
      
      if (!error) setWhatsappLogs(data);
      setLoadingLogs(false);
  };

  const fetchAppointments = async () => {
      setLoadingApts(true);
      const { data, error } = await supabase
        .from('appointments')
        .select(`*, users(full_name), services(name)`)
        .eq('professional_id', currentUser.id)
        .order('date', { ascending: true }); 
      
      if (!error) setAppointments(data);
      setLoadingApts(false);
  };

  const handleConfirmAppointment = async (apt) => {
    const { error } = await supabase.from('appointments').update({ status: 'confirmed' }).eq('id', apt.id);
    if (!error) {
        toast({ title: "Cita Confirmada", description: "El cliente será notificado." });
        fetchAppointments();
        
        if (currentUser.whatsapp_notifications_enabled && currentUser.whatsapp_number) {
            // Logic to send whatsapp...
        }
    }
  };

  if (authLoading) {
     return <div className="min-h-screen flex items-center justify-center"><Loader2 className="w-8 h-8 animate-spin text-purple-600" /></div>;
  }

  if (!isAuthenticated || !currentUser) {
     return (
        <div className="min-h-screen flex flex-col items-center justify-center p-6 text-center">
            <h2 className="text-2xl font-bold mb-4">Acceso Requerido</h2>
            <p className="text-gray-500 mb-6">Debes iniciar sesión como profesional para ver este panel.</p>
            <Link to="/login/professional"><Button>Ir al Login</Button></Link>
        </div>
     );
  }

  const isComplete = completionStatus.percentage === 100;

  return (
    <div className={cn("min-h-screen p-6 transition-colors duration-500", isBarber ? "bg-[#1a1a1a]" : "bg-gray-50")}>
      <Helmet>
        <title>Dashboard Profesional - TuCita</title>
      </Helmet>

      <div className="max-w-7xl mx-auto">
        
        {/* Registration Prompt for incomplete profiles */}
        {completionStatus.percentage < 50 && (
          <div className="bg-blue-50 border border-blue-200 rounded-xl p-6 mb-8 flex flex-col md:flex-row items-center justify-between gap-4">
             <div>
                <h3 className="text-lg font-bold text-blue-900">¡Completa tu Registro!</h3>
                <p className="text-blue-700">Parece que aún te faltan datos importantes. Utiliza nuestro formulario de registro guiado para configurar tu perfil rápidamente.</p>
             </div>
             <Link to="/register?type=professional">
                <Button className="bg-blue-600 hover:bg-blue-700 text-white whitespace-nowrap">
                   Ir al Registro Guiado <ArrowRight className="ml-2 w-4 h-4" />
                </Button>
             </Link>
          </div>
        )}

        {/* Profile Completion Bar */}
        <div className="bg-white p-6 rounded-xl border shadow-sm mb-8">
           <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-4 gap-4">
              <div>
                <h2 className="text-lg font-bold text-gray-900 flex items-center gap-2">
                   {isComplete ? <CheckCircle className="text-green-500 w-6 h-6" /> : <AlertTriangle className="text-amber-500 w-6 h-6" />}
                   Estado de Configuración del Perfil
                </h2>
                <p className="text-gray-500 text-sm">
                  {isComplete 
                    ? "¡Tu perfil está completo y listo para recibir reservas!" 
                    : "Completa los siguientes pasos para activar tu perfil y aceptar reservas."}
                </p>
              </div>
              <div className="text-right">
                 <span className="text-2xl font-bold text-blue-600">{completionStatus.percentage}%</span>
              </div>
           </div>
           
           <div className="w-full bg-gray-200 rounded-full h-2.5 mb-6">
              <div 
                className={cn("h-2.5 rounded-full transition-all duration-500", isComplete ? "bg-green-500" : "bg-blue-600")} 
                style={{ width: `${completionStatus.percentage}%` }}
              ></div>
           </div>

           <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className={cn("flex items-center gap-3 p-3 rounded-lg border", completionStatus.profile ? "bg-green-50 border-green-200" : "bg-gray-50 border-gray-200 opacity-70")}>
                 <div className={cn("w-8 h-8 rounded-full flex items-center justify-center", completionStatus.profile ? "bg-green-100 text-green-600" : "bg-gray-200 text-gray-500")}>
                    {completionStatus.profile ? <CheckCircle className="w-5 h-5" /> : "1"}
                 </div>
                 <div className="flex-1">
                    <p className="font-medium text-sm text-gray-900">Foto de Perfil</p>
                    <p className="text-xs text-gray-500">{completionStatus.profile ? "Completado" : "Sube una foto real"}</p>
                 </div>
                 {!completionStatus.profile && <Button variant="ghost" size="sm" onClick={() => setActiveTab('profile')}>Ir</Button>}
              </div>

              <div className={cn("flex items-center gap-3 p-3 rounded-lg border", completionStatus.services ? "bg-green-50 border-green-200" : "bg-gray-50 border-gray-200 opacity-70")}>
                 <div className={cn("w-8 h-8 rounded-full flex items-center justify-center", completionStatus.services ? "bg-green-100 text-green-600" : "bg-gray-200 text-gray-500")}>
                    {completionStatus.services ? <CheckCircle className="w-5 h-5" /> : "2"}
                 </div>
                 <div className="flex-1">
                    <p className="font-medium text-sm text-gray-900">Servicios</p>
                    <p className="text-xs text-gray-500">{completionStatus.services ? "Completado" : "Añade al menos uno"}</p>
                 </div>
                 {!completionStatus.services && <Button variant="ghost" size="sm" onClick={() => setActiveTab('services')}>Ir</Button>}
              </div>

              <div className={cn("flex items-center gap-3 p-3 rounded-lg border", completionStatus.availability ? "bg-green-50 border-green-200" : "bg-gray-50 border-gray-200 opacity-70")}>
                 <div className={cn("w-8 h-8 rounded-full flex items-center justify-center", completionStatus.availability ? "bg-green-100 text-green-600" : "bg-gray-200 text-gray-500")}>
                    {completionStatus.availability ? <CheckCircle className="w-5 h-5" /> : "3"}
                 </div>
                 <div className="flex-1">
                    <p className="font-medium text-sm text-gray-900">Horario</p>
                    <p className="text-xs text-gray-500">{completionStatus.availability ? "Completado" : "Define disponibilidad"}</p>
                 </div>
                 {!completionStatus.availability && <Button variant="ghost" size="sm" onClick={() => setActiveTab('availability')}>Ir</Button>}
              </div>
           </div>
        </div>

        {/* Header */}
        <div className="mb-8 flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="flex items-center gap-4">
             <img 
               src={currentUser.image_url || "https://images.unsplash.com/photo-1633681926019-03bd9325ec20"} 
               alt="Avatar" 
               className="w-16 h-16 rounded-full object-cover border-2 border-white shadow-md"
             />
             <div>
               <h1 className={cn("text-2xl font-bold", isBarber ? "text-white" : "text-gray-900")}>
                 Hola, {currentUser.full_name || currentUser.name}
               </h1>
               <p className={cn("text-sm", isBarber ? "text-gray-400" : "text-gray-500")}>
                 {currentUser.business_name || 'Configura tu negocio'}
               </p>
             </div>
          </div>
        </div>

        {/* Main Tabs */}
        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
          <div className="bg-white p-1 rounded-xl border shadow-sm inline-flex flex-wrap gap-1">
            <TabsList className="bg-transparent h-auto flex-wrap">
              <TabsTrigger value="overview" className="data-[state=active]:bg-gray-100 data-[state=active]:text-gray-900"><LayoutDashboard className="w-4 h-4 mr-2" /> Resumen</TabsTrigger>
              <TabsTrigger value="appointments" className="data-[state=active]:bg-gray-100 data-[state=active]:text-gray-900"><Calendar className="w-4 h-4 mr-2" /> Citas</TabsTrigger>
              <TabsTrigger value="profile" className="data-[state=active]:bg-gray-100 data-[state=active]:text-gray-900"><User className="w-4 h-4 mr-2" /> Perfil</TabsTrigger>
              <TabsTrigger value="services" className="data-[state=active]:bg-gray-100 data-[state=active]:text-gray-900"><Scissors className="w-4 h-4 mr-2" /> Servicios</TabsTrigger>
              <TabsTrigger value="availability" className="data-[state=active]:bg-gray-100 data-[state=active]:text-gray-900"><Clock className="w-4 h-4 mr-2" /> Horarios</TabsTrigger>
              <TabsTrigger value="whatsapp" className="data-[state=active]:bg-gray-100 data-[state=active]:text-gray-900"><Phone className="w-4 h-4 mr-2" /> WhatsApp</TabsTrigger>
            </TabsList>
          </div>

          <TabsContent value="overview" className="space-y-6">
             <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
               <div className="bg-white p-6 rounded-xl border shadow-sm">
                 <p className="text-gray-500">Estado</p>
                 <p className="text-2xl font-bold capitalize">{currentUser.status || 'Pendiente'}</p>
               </div>
               <div className="bg-white p-6 rounded-xl border shadow-sm">
                 <p className="text-gray-500">Servicios Activos</p>
                 <p className="text-2xl font-bold">{completionStatus.services ? 'Configurado' : 'Pendiente'}</p>
               </div>
               <div className="bg-white p-6 rounded-xl border shadow-sm">
                 <p className="text-gray-500">Valoración</p>
                 <p className="text-2xl font-bold">{currentUser.rating || '0.0'}</p>
               </div>
             </div>
          </TabsContent>

          <TabsContent value="appointments">
              <div className="bg-white p-6 rounded-xl border shadow-sm">
                  <div className="flex justify-between items-center mb-6">
                      <h2 className="text-xl font-bold">Gestión de Citas</h2>
                      <Button onClick={fetchAppointments} variant="outline" size="sm" disabled={loadingApts}>
                        <RefreshCw className={`w-4 h-4 mr-2 ${loadingApts ? 'animate-spin' : ''}`} /> Actualizar
                      </Button>
                  </div>
                  <div className="space-y-4">
                      {appointments.length === 0 && <p className="text-gray-500 text-center py-8">No tienes citas registradas.</p>}
                      {appointments.map(apt => (
                          <div key={apt.id} className="border p-4 rounded-lg flex justify-between items-center">
                              <div>
                                  <h3 className="font-bold">{apt.users?.full_name}</h3>
                                  <p className="text-sm text-gray-600">{apt.services?.name} - {apt.date} {apt.time}</p>
                                  <span className={`text-xs px-2 py-1 rounded-full ${
                                       apt.status === 'confirmed' ? 'bg-green-100 text-green-700' : apt.status === 'cancelled' ? 'bg-red-100 text-red-700' : 'bg-yellow-100 text-yellow-700'
                                   }`}>
                                       {apt.status === 'confirmed' ? 'Confirmada' : apt.status === 'pending' ? 'Pendiente' : 'Cancelada'}
                                   </span>
                              </div>
                              {apt.status === 'pending' && (
                                  <Button size="sm" onClick={() => handleConfirmAppointment(apt)} className="bg-green-600 hover:bg-green-700">Confirmar</Button>
                              )}
                          </div>
                      ))}
                  </div>
              </div>
          </TabsContent>

          <TabsContent value="profile">
            <ErrorBoundary>
              <ProfessionalProfileEditor />
            </ErrorBoundary>
          </TabsContent>

          <TabsContent value="services">
            <ErrorBoundary>
              <ServiceManagement professionalId={currentUser.id} />
            </ErrorBoundary>
          </TabsContent>

          <TabsContent value="availability">
             <ErrorBoundary>
                <AvailabilityManager />
             </ErrorBoundary>
          </TabsContent>

          <TabsContent value="whatsapp">
              <div className="space-y-6">
                  <div className="bg-white p-6 rounded-xl border shadow-sm">
                      <h2 className="text-xl font-bold mb-4 flex items-center"><Phone className="mr-2"/> Configuración de WhatsApp</h2>
                      <div className="flex items-center gap-4 p-4 bg-gray-50 rounded-lg">
                          <div className={`w-3 h-3 rounded-full ${currentUser.whatsapp_notifications_enabled ? 'bg-green-500' : 'bg-gray-400'}`}></div>
                          <div>
                              <p className="font-medium text-gray-900">Estado: {currentUser.whatsapp_notifications_enabled ? 'Activo' : 'Inactivo'}</p>
                              <p className="text-sm text-gray-500">
                                  {currentUser.whatsapp_number 
                                    ? `Número configurado: ${currentUser.whatsapp_number.slice(0, 5)}****${currentUser.whatsapp_number.slice(-3)}`
                                    : 'No hay número configurado'}
                              </p>
                          </div>
                          <Button variant="outline" size="sm" onClick={() => setActiveTab('profile')} className="ml-auto">Editar en Perfil</Button>
                      </div>
                  </div>

                  <div className="bg-white p-6 rounded-xl border shadow-sm">
                      <div className="flex justify-between items-center mb-4">
                          <h3 className="text-lg font-bold flex items-center"><MessageSquare className="mr-2 w-5 h-5"/> Historial de Mensajes (Últimos 10)</h3>
                          <Button variant="ghost" size="sm" onClick={fetchWhatsappLogs} disabled={loadingLogs}>
                              <RefreshCw className={`w-4 h-4 ${loadingLogs ? 'animate-spin' : ''}`} />
                          </Button>
                      </div>
                      
                      <div className="overflow-x-auto">
                          <table className="w-full text-sm">
                              <thead>
                                  <tr className="bg-gray-50 text-left">
                                      <th className="p-3">Tipo</th>
                                      <th className="p-3">Estado</th>
                                      <th className="p-3">Enviado</th>
                                      <th className="p-3">Contenido</th>
                                  </tr>
                              </thead>
                              <tbody>
                                  {whatsappLogs.length === 0 && (
                                      <tr><td colSpan="4" className="p-4 text-center text-gray-500">No hay registros de mensajes.</td></tr>
                                  )}
                                  {whatsappLogs.map(log => (
                                      <tr key={log.id} className="border-t">
                                          <td className="p-3 capitalize">{log.message_type}</td>
                                          <td className="p-3">
                                              <span className={`px-2 py-1 rounded text-xs ${log.status === 'sent' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                                                  {log.status}
                                              </span>
                                          </td>
                                          <td className="p-3 text-gray-500">{new Date(log.created_at).toLocaleString()}</td>
                                          <td className="p-3 text-gray-600 max-w-xs truncate" title={log.message_content}>{log.message_content}</td>
                                      </tr>
                                  ))}
                              </tbody>
                          </table>
                      </div>
                  </div>
              </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default ProfessionalDashboard;
