
import React, { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/lib/customSupabaseClient';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Loader2, Edit2, Save, User, MapPin, Briefcase, Mail, Phone, X } from 'lucide-react';
import { useToast } from '@/components/ui/use-toast';
import { cn } from '@/lib/utils';

const ProfessionalProfilePage = () => {
  const { currentUser } = useAuth();
  const { toast } = useToast();
  
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [profile, setProfile] = useState(null);
  
  // Form state for editing
  const [formData, setFormData] = useState({
    business_name: '',
    specialty: '',
    bio: '',
    city: '',
    location: ''
  });
  const [errors, setErrors] = useState({});

  const fetchProfile = async () => {
    if (!currentUser) return;
    try {
      setLoading(true);
      // Use maybeSingle() to handle missing profile gracefully
      const { data, error } = await supabase
        .from('professionals')
        .select('*')
        .eq('id', currentUser.id)
        .maybeSingle();
        
      if (error) throw error;
      
      if (data) {
        setProfile(data);
        setFormData({
          business_name: data.business_name || '',
          specialty: data.specialty || '',
          bio: data.bio || '',
          city: data.city || '',
          location: data.location || ''
        });
      } else {
        setProfile(null);
      }
    } catch (err) {
      console.error("Error loading profile:", err);
      toast({
        title: "Error",
        description: "No se pudieron cargar los datos del perfil.",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProfile();
  }, [currentUser]);

  const validate = () => {
    const newErrors = {};
    if (!formData.business_name.trim()) newErrors.business_name = "Requerido";
    if (!formData.specialty.trim()) newErrors.specialty = "Requerido";
    if (!formData.bio.trim()) newErrors.bio = "Requerido";
    if (!formData.city.trim()) newErrors.city = "Requerido";
    if (!formData.location.trim()) newErrors.location = "Requerido";
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSave = async () => {
    if (!validate()) return;
    
    setSaving(true);
    try {
      // Validate role before update
      if (currentUser.role !== 'professional' && currentUser.role !== 'admin') {
          const { error: roleError } = await supabase
            .from('users')
            .update({ role: 'professional' })
            .eq('id', currentUser.id);
            
          if (roleError) throw new Error("No se pudo verificar el rol de profesional.");
      }

      const { error } = await supabase
        .from('professionals')
        .update({
          business_name: formData.business_name,
          specialty: formData.specialty,
          bio: formData.bio,
          city: formData.city,
          location: formData.location,
          updated_at: new Date().toISOString()
        })
        .eq('id', currentUser.id);

      if (error) throw error;

      toast({
        title: "Perfil actualizado exitosamente",
        className: "bg-green-600 text-white"
      });
      
      setProfile({ ...profile, ...formData });
      setIsEditing(false);
    } catch (err) {
      console.error("Update error:", err);
      toast({
        title: "Error al actualizar",
        description: err.message,
        variant: "destructive"
      });
    } finally {
      setSaving(false);
    }
  };

  if (loading) return <div className="flex justify-center p-12"><Loader2 className="animate-spin h-8 w-8 text-slate-900" /></div>;

  if (!profile) return (
    <div className="flex flex-col items-center justify-center min-h-[50vh]">
      <p className="text-gray-500 mb-4">No se encontró perfil profesional.</p>
      <Button onClick={() => window.location.href = '/register-professional-details'}>Crear Perfil</Button>
    </div>
  );

  return (
    <div className="container mx-auto px-4 py-8 max-w-4xl">
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
        {/* Header Banner */}
        <div className="h-32 bg-gradient-to-r from-slate-800 to-slate-900 relative">
          <div className="absolute -bottom-12 left-8">
            <div className="h-24 w-24 rounded-full bg-white p-1 shadow-lg">
              <div className="h-full w-full rounded-full bg-slate-100 flex items-center justify-center overflow-hidden">
                {profile.image_url ? (
                  <img src={profile.image_url} alt="Profile" className="h-full w-full object-cover" />
                ) : (
                  <User className="h-10 w-10 text-slate-400" />
                )}
              </div>
            </div>
          </div>
          <div className="absolute top-4 right-4">
             {!isEditing && (
                <Button onClick={() => setIsEditing(true)} variant="secondary" size="sm" className="bg-white/10 text-white hover:bg-white/20 border-none backdrop-blur-sm">
                   <Edit2 className="w-4 h-4 mr-2" /> Editar Perfil
                </Button>
             )}
          </div>
        </div>

        <div className="pt-16 pb-8 px-8">
          {/* User Info Section (Read-only usually) */}
          <div className="mb-8 border-b pb-6">
             <h1 className="text-3xl font-bold text-gray-900 mb-1">{isEditing ? 'Editando Perfil' : profile.business_name}</h1>
             <p className="text-gray-500 flex items-center gap-2">
                <Briefcase className="w-4 h-4" /> {isEditing ? 'Vista de edición' : profile.specialty}
             </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
             {/* Contact Info Sidebar */}
             <div className="col-span-1 space-y-4">
                <div className="bg-gray-50 p-4 rounded-lg">
                   <h3 className="font-semibold text-gray-900 mb-3">Contacto Personal</h3>
                   <div className="space-y-3 text-sm">
                      <div className="flex items-center gap-2 text-gray-600">
                         <Mail className="w-4 h-4" />
                         <span className="truncate" title={currentUser?.email}>{currentUser?.email}</span>
                      </div>
                      <div className="flex items-center gap-2 text-gray-600">
                         <Phone className="w-4 h-4" />
                         <span>{currentUser?.phone || 'No registrado'}</span>
                      </div>
                      <div className="flex items-center gap-2 text-gray-600">
                         <User className="w-4 h-4" />
                         <span>{currentUser?.full_name}</span>
                      </div>
                   </div>
                </div>
             </div>

             {/* Main Content Form/Display */}
             <div className="col-span-1 md:col-span-2 space-y-6">
                {isEditing ? (
                  <div className="space-y-4 animate-in fade-in">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                       <div className="space-y-2">
                          <label className="text-sm font-medium">Nombre del Negocio</label>
                          <Input 
                            value={formData.business_name} 
                            onChange={(e) => setFormData({...formData, business_name: e.target.value})}
                            className={cn(errors.business_name && "border-red-500")}
                          />
                          {errors.business_name && <span className="text-xs text-red-500">{errors.business_name}</span>}
                       </div>
                       <div className="space-y-2">
                          <label className="text-sm font-medium">Especialidad</label>
                          <Input 
                            value={formData.specialty} 
                            onChange={(e) => setFormData({...formData, specialty: e.target.value})}
                            className={cn(errors.specialty && "border-red-500")}
                          />
                          {errors.specialty && <span className="text-xs text-red-500">{errors.specialty}</span>}
                       </div>
                    </div>
                    
                    <div className="space-y-2">
                       <label className="text-sm font-medium">Biografía</label>
                       <textarea 
                          className={cn("w-full p-2 border rounded-md text-sm min-h-[100px]", errors.bio ? "border-red-500" : "border-gray-200")}
                          value={formData.bio}
                          onChange={(e) => setFormData({...formData, bio: e.target.value})}
                       />
                       {errors.bio && <span className="text-xs text-red-500">{errors.bio}</span>}
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                       <div className="space-y-2">
                          <label className="text-sm font-medium">Ciudad</label>
                          <Input 
                            value={formData.city} 
                            onChange={(e) => setFormData({...formData, city: e.target.value})}
                            className={cn(errors.city && "border-red-500")}
                          />
                          {errors.city && <span className="text-xs text-red-500">{errors.city}</span>}
                       </div>
                       <div className="space-y-2">
                          <label className="text-sm font-medium">Ubicación / Dirección</label>
                          <Input 
                            value={formData.location} 
                            onChange={(e) => setFormData({...formData, location: e.target.value})}
                            className={cn(errors.location && "border-red-500")}
                          />
                          {errors.location && <span className="text-xs text-red-500">{errors.location}</span>}
                       </div>
                    </div>

                    <div className="flex justify-end gap-3 pt-4">
                       <Button variant="outline" onClick={() => setIsEditing(false)}>
                          <X className="w-4 h-4 mr-2" /> Cancelar
                       </Button>
                       <Button onClick={handleSave} disabled={saving} className="bg-green-600 hover:bg-green-700 text-white">
                          {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : <><Save className="w-4 h-4 mr-2" /> Guardar Cambios</>}
                       </Button>
                    </div>
                  </div>
                ) : (
                  <div className="space-y-6 animate-in fade-in">
                    <div>
                       <h3 className="font-semibold text-gray-900 mb-2">Sobre el negocio</h3>
                       <p className="text-gray-600 leading-relaxed">{profile.bio}</p>
                    </div>
                    
                    <div className="flex flex-wrap gap-4">
                       <div className="bg-slate-50 px-4 py-2 rounded-full flex items-center gap-2 border border-slate-100">
                          <MapPin className="w-4 h-4 text-slate-500" />
                          <span className="text-sm font-medium text-slate-700">{profile.city}</span>
                       </div>
                       <div className="bg-slate-50 px-4 py-2 rounded-full flex items-center gap-2 border border-slate-100">
                          <MapPin className="w-4 h-4 text-slate-500" />
                          <span className="text-sm font-medium text-slate-700">{profile.location}</span>
                       </div>
                    </div>
                  </div>
                )}
             </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfessionalProfilePage;
