
import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { supabase } from '@/lib/customSupabaseClient';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { Loader2, MapPin, Briefcase, ArrowLeft, Mail, Phone, Calendar, AlertCircle } from 'lucide-react';

const ProfessionalDetailPage = () => {
  const { id } = useParams();
  const { isAuthenticated, currentUser } = useAuth();
  const navigate = useNavigate();
  
  const [professional, setProfessional] = useState(null);
  const [userData, setUserData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchDetails = async () => {
      try {
        setLoading(true);
        // Fetch professional details
        const { data: proData, error: proError } = await supabase
          .from('professionals')
          .select('*')
          .eq('id', id)
          .single();

        if (proError) throw proError;
        setProfessional(proData);

        // If authenticated, fetch user contact info (publicly available fields only if desired, but here specific task asks for it)
        if (isAuthenticated) {
          const { data: uData, error: uError } = await supabase
            .from('users')
            .select('email, phone')
            .eq('id', id)
            .single();
          
          if (!uError) setUserData(uData);
        }
      } catch (err) {
        console.error("Error fetching details:", err);
        setError("Profesional no encontrado o error de conexión.");
      } finally {
        setLoading(false);
      }
    };

    if (id) fetchDetails();
  }, [id, isAuthenticated]);

  if (loading) return <div className="min-h-screen flex justify-center items-center"><Loader2 className="w-10 h-10 animate-spin text-rose-600" /></div>;

  if (error || !professional) return (
    <div className="min-h-screen flex flex-col justify-center items-center p-4">
      <AlertCircle className="w-16 h-16 text-gray-300 mb-4" />
      <h2 className="text-2xl font-bold text-gray-900 mb-2">Profesional no encontrado</h2>
      <p className="text-gray-500 mb-6">{error || "No pudimos encontrar el perfil que buscas."}</p>
      <Link to="/profesionales">
        <Button variant="outline"><ArrowLeft className="w-4 h-4 mr-2" /> Volver al listado</Button>
      </Link>
    </div>
  );

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        <Link to="/profesionales" className="inline-flex items-center text-gray-500 hover:text-gray-900 mb-6 transition-colors">
          <ArrowLeft className="w-4 h-4 mr-2" /> Volver a profesionales
        </Link>

        <div className="bg-white rounded-2xl shadow-xl overflow-hidden border border-gray-100">
          {/* Header */}
          <div className="bg-slate-900 px-8 py-10 text-white relative overflow-hidden">
             <div className="relative z-10">
                <span className="inline-block px-3 py-1 bg-rose-600 rounded-full text-xs font-bold uppercase tracking-wider mb-4">
                   {professional.specialty}
                </span>
                <h1 className="text-4xl font-extrabold mb-2">{professional.business_name}</h1>
                <div className="flex items-center gap-4 text-slate-300">
                   <div className="flex items-center gap-1">
                      <MapPin className="w-4 h-4" /> {professional.city}
                   </div>
                   <div className="flex items-center gap-1">
                      <Briefcase className="w-4 h-4" /> {professional.specialty}
                   </div>
                </div>
             </div>
             {/* Decorative circle */}
             <div className="absolute top-0 right-0 -mt-10 -mr-10 w-64 h-64 bg-white/5 rounded-full blur-3xl"></div>
          </div>

          <div className="p-8">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
              
              {/* Main Info */}
              <div className="md:col-span-2 space-y-8">
                <section>
                  <h3 className="text-lg font-bold text-gray-900 mb-3 border-b pb-2">Biografía</h3>
                  <p className="text-gray-600 leading-relaxed whitespace-pre-wrap">
                    {professional.bio}
                  </p>
                </section>

                <section>
                   <h3 className="text-lg font-bold text-gray-900 mb-3 border-b pb-2">Ubicación</h3>
                   <div className="flex items-start gap-3 bg-gray-50 p-4 rounded-lg">
                      <MapPin className="w-5 h-5 text-rose-600 mt-0.5" />
                      <div>
                         <p className="font-medium text-gray-900">{professional.location}</p>
                         <p className="text-sm text-gray-500">{professional.city}</p>
                      </div>
                   </div>
                </section>
              </div>

              {/* Sidebar / Actions */}
              <div className="md:col-span-1 space-y-6">
                <div className="bg-white border border-gray-200 rounded-xl p-6 shadow-sm">
                  <h3 className="font-bold text-gray-900 mb-4">Contacto</h3>
                  
                  {isAuthenticated ? (
                    <div className="space-y-4">
                       {userData && (
                          <div className="space-y-3 mb-4 text-sm">
                             <div className="flex items-center gap-2 text-gray-600">
                                <Mail className="w-4 h-4 text-gray-400" /> {userData.email}
                             </div>
                             <div className="flex items-center gap-2 text-gray-600">
                                <Phone className="w-4 h-4 text-gray-400" /> {userData.phone || "No disponible"}
                             </div>
                          </div>
                       )}
                       <Button 
                         onClick={() => navigate(`/contact?professional_id=${professional.id}`)}
                         className="w-full bg-rose-600 hover:bg-rose-700 text-white"
                       >
                         Contactar
                       </Button>
                    </div>
                  ) : (
                    <div className="text-center space-y-4">
                       <p className="text-sm text-gray-500">Inicia sesión para ver los datos de contacto y agendar citas.</p>
                       <Link to="/login-client">
                          <Button variant="outline" className="w-full">Iniciar Sesión</Button>
                       </Link>
                    </div>
                  )}
                </div>

                <div className="bg-gray-50 rounded-xl p-6 border border-gray-200">
                   <h3 className="font-bold text-gray-900 mb-2 flex items-center gap-2">
                      <Calendar className="w-4 h-4" /> Disponibilidad
                   </h3>
                   <p className="text-sm text-gray-500">
                      Consulta la disponibilidad contactando directamente al profesional.
                   </p>
                </div>
              </div>

            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfessionalDetailPage;
