
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/lib/customSupabaseClient';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Loader2, Save, MapPin, FileText, Building, CheckCircle2 } from 'lucide-react';
import { useToast } from '@/components/ui/use-toast';
import { cn } from '@/lib/utils';

const ProfessionalDetailsPage = () => {
  const { currentUser, isAuthenticated, isLoading } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();
  
  const [isInitializing, setIsInitializing] = useState(true);
  const [saving, setSaving] = useState(false);
  const [isEditMode, setIsEditMode] = useState(false);
  
  const [formData, setFormData] = useState({
    business_name: '',
    specialty: '',
    bio: '',
    city: '',
    location: ''
  });
  
  const [errors, setErrors] = useState({});

  useEffect(() => {
    // 1. Authentication Check on Mount
    if (!isLoading) {
      if (!isAuthenticated) {
        navigate('/login-professional');
        return;
      }
      
      // Role check - allow 'profesional' or 'professional'
      const role = currentUser?.role || '';
      if (role !== 'profesional' && role !== 'professional') {
        navigate('/login-professional');
        return;
      }

      checkExistingProfile();
    }
  }, [isAuthenticated, isLoading, currentUser, navigate]);

  const checkExistingProfile = async () => {
    try {
      if (!currentUser?.id) return;

      const { data, error } = await supabase
        .from('professionals')
        .select('*')
        .eq('id', currentUser.id)
        .single();

      if (error && error.code !== 'PGRST116') { // PGRST116 is "no rows returned"
        console.error("Error fetching profile:", error);
      }

      if (data) {
        setIsEditMode(true);
        setFormData({
          business_name: data.business_name || '',
          specialty: data.specialty || '',
          bio: data.bio || '',
          city: data.city || '',
          location: data.location || ''
        });
      }
    } catch (err) {
      console.error("Unexpected error:", err);
    } finally {
      setIsInitializing(false);
    }
  };

  const validate = () => {
    const newErrors = {};
    if (!formData.business_name.trim()) newErrors.business_name = "Este campo es requerido";
    if (!formData.specialty.trim()) newErrors.specialty = "Este campo es requerido";
    if (!formData.bio.trim()) newErrors.bio = "Este campo es requerido";
    if (!formData.city.trim()) newErrors.city = "Este campo es requerido";
    if (!formData.location.trim()) newErrors.location = "Este campo es requerido";
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;
    
    setSaving(true);
    try {
      const userId = currentUser.id;
      
      const payload = {
        business_name: formData.business_name,
        specialty: formData.specialty,
        bio: formData.bio,
        city: formData.city,
        location: formData.location,
        updated_at: new Date().toISOString()
      };

      let result;
      
      if (isEditMode) {
        // 3. Update existing record
        result = await supabase
          .from('professionals')
          .update(payload)
          .eq('id', userId);
      } else {
        // 4. Insert new record
        result = await supabase
          .from('professionals')
          .insert({
            id: userId,
            // Including user_id explicitly as requested, though id is usually sufficient for 1:1
            user_id: userId, 
            status: 'pending',
            ...payload,
            created_at: new Date().toISOString()
          });
      }

      if (result.error) throw result.error;

      // Success Handling
      toast({
        title: "¡Éxito!",
        description: isEditMode ? "Perfil actualizado correctamente" : "Perfil creado exitosamente",
        className: "bg-green-600 text-white"
      });

      // Clear form only if creating new (optional, but requested implicitly by "Clear form fields")
      // However, for UX on edit, we usually keep data. 
      // Prompt says "Clear form fields" generally. 
      if (!isEditMode) {
          setFormData({
            business_name: '',
            specialty: '',
            bio: '',
            city: '',
            location: ''
          });
      }

      // Redirect after 2 seconds
      setTimeout(() => {
        navigate('/professional-dashboard');
      }, 2000);
      
    } catch (err) {
      console.error("Error saving profile:", err);
      toast({
        title: "Error al guardar perfil",
        description: err.message || "Por favor intenta nuevamente",
        variant: "destructive"
      });
    } finally {
      setSaving(false);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    if (errors[name]) setErrors(prev => ({ ...prev, [name]: null }));
  };

  if (isLoading || isInitializing) {
    return (
      <div className="min-h-screen flex flex-col justify-center items-center bg-gray-50">
        <Loader2 className="w-10 h-10 animate-spin text-indigo-600 mb-4" />
        <p className="text-gray-500 font-medium">Cargando información...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-3xl mx-auto bg-white rounded-2xl shadow-xl overflow-hidden border border-gray-100">
        <div className="bg-indigo-900 px-8 py-8 text-white">
          <h1 className="text-3xl font-bold flex items-center gap-3">
            <CheckCircle2 className="w-8 h-8 text-indigo-300" />
            {isEditMode ? 'Editar Perfil Profesional' : 'Completa tu Perfil'}
          </h1>
          <p className="text-indigo-200 mt-2 text-lg">
            {isEditMode ? 'Actualiza la información de tu negocio.' : 'Configura los detalles de tu negocio para empezar.'}
          </p>
        </div>

        <form onSubmit={handleSubmit} className="p-8 space-y-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="space-y-3">
              <label className="text-sm font-semibold text-gray-700 flex items-center gap-2">
                <Building className="w-4 h-4 text-indigo-600" /> Nombre Comercial
              </label>
              <Input
                name="business_name"
                value={formData.business_name}
                onChange={handleChange}
                placeholder="Ej. Barbería El Rey"
                className={cn("h-11", errors.business_name && "border-red-500 ring-1 ring-red-500")}
              />
              {errors.business_name && <p className="text-xs text-red-500 font-medium">{errors.business_name}</p>}
            </div>

            <div className="space-y-3">
              <label className="text-sm font-semibold text-gray-700 flex items-center gap-2">
                <FileText className="w-4 h-4 text-indigo-600" /> Especialidad
              </label>
              <Input
                name="specialty"
                value={formData.specialty}
                onChange={handleChange}
                placeholder="Ej. Barbería, Estilismo, Uñas..."
                className={cn("h-11", errors.specialty && "border-red-500 ring-1 ring-red-500")}
              />
              {errors.specialty && <p className="text-xs text-red-500 font-medium">{errors.specialty}</p>}
            </div>
          </div>

          <div className="space-y-3">
            <label className="text-sm font-semibold text-gray-700">Biografía</label>
            <textarea
              name="bio"
              value={formData.bio}
              onChange={handleChange}
              rows={4}
              className={cn(
                "w-full rounded-md border border-input bg-background px-3 py-3 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500 focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 resize-none",
                errors.bio ? "border-red-500 ring-1 ring-red-500" : "border-gray-200"
              )}
              placeholder="Describe tus servicios y experiencia..."
            />
            {errors.bio && <p className="text-xs text-red-500 font-medium">{errors.bio}</p>}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="space-y-3">
              <label className="text-sm font-semibold text-gray-700 flex items-center gap-2">
                <MapPin className="w-4 h-4 text-indigo-600" /> Ciudad
              </label>
              <Input
                name="city"
                value={formData.city}
                onChange={handleChange}
                placeholder="Ej. Bogotá"
                className={cn("h-11", errors.city && "border-red-500 ring-1 ring-red-500")}
              />
              {errors.city && <p className="text-xs text-red-500 font-medium">{errors.city}</p>}
            </div>

            <div className="space-y-3">
              <label className="text-sm font-semibold text-gray-700 flex items-center gap-2">
                <MapPin className="w-4 h-4 text-indigo-600" /> Ubicación
              </label>
              <Input
                name="location"
                value={formData.location}
                onChange={handleChange}
                placeholder="Dirección del local"
                className={cn("h-11", errors.location && "border-red-500 ring-1 ring-red-500")}
              />
              {errors.location && <p className="text-xs text-red-500 font-medium">{errors.location}</p>}
            </div>
          </div>

          <div className="pt-6 flex justify-end border-t border-gray-100">
            <Button 
              type="submit" 
              disabled={saving}
              className="bg-indigo-600 hover:bg-indigo-700 text-white px-10 h-12 text-lg shadow-lg hover:shadow-xl transition-all"
            >
              {saving ? (
                <>
                  <Loader2 className="mr-2 h-5 w-5 animate-spin" /> Guardando...
                </>
              ) : (
                <>
                  <Save className="mr-2 h-5 w-5" /> {isEditMode ? 'Guardar Cambios' : 'Crear Perfil'}
                </>
              )}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ProfessionalDetailsPage;
