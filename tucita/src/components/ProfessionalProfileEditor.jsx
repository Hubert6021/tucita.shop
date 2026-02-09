
import React, { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useSupabase } from '@/hooks/useSupabase';
import { supabase } from '@/lib/customSupabaseClient';
import { Button } from '@/components/ui/button';
import { useToast } from '@/components/ui/use-toast';
import { Loader2, Upload, MapPin, DollarSign, Building, User, FileText, Phone, CreditCard } from 'lucide-react';
import { validateWhatsAppNumber } from '@/utils/phoneValidation';

const ProfessionalProfileEditor = () => {
  const { currentUser, updateProfile } = useAuth();
  const { fetchProfessionalById, uploadProfessionalPhoto, loading } = useSupabase();
  const { toast } = useToast();
  
  const [formData, setFormData] = useState({
    business_name: '',
    specialty: '',
    bio: '',
    city: '',
    location: '',
    price_range: '$$',
    price: '', // Numeric price for COP
    image_url: '',
    whatsapp_number: '',
    whatsapp_notifications_enabled: false
  });

  const [validationError, setValidationError] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [rpcLoading, setRpcLoading] = useState(false);

  useEffect(() => {
    if (currentUser) {
      fetchData();
    }
  }, [currentUser]);

  const fetchData = async () => {
    const data = await fetchProfessionalById(currentUser.id);
    if (data) {
      setFormData({
        business_name: data.business_name || '',
        specialty: data.specialty || '',
        bio: data.bio || '',
        city: data.city || '',
        location: data.location || '',
        price_range: data.price_range || '$$',
        price: data.price || '', // Attempt to load if exists, otherwise empty
        image_url: data.image_url || '',
        whatsapp_number: data.whatsapp_number || '',
        whatsapp_notifications_enabled: data.whatsapp_notifications_enabled || false
      });
    }
  };

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    const val = type === 'checkbox' ? checked : value;

    if (name === 'whatsapp_number') {
        const { valid, error } = validateWhatsAppNumber(value);
        setValidationError(error);
    }

    setFormData(prev => ({ ...prev, [name]: val }));
  };

  const handlePhotoUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    setUploading(true);
    const { success, publicUrl } = await uploadProfessionalPhoto(currentUser.id, file);
    
    if (success) {
      setFormData(prev => ({ ...prev, image_url: publicUrl }));
      toast({ title: "Foto subida", description: "No olvides guardar los cambios." });
    }
    setUploading(false);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setRpcLoading(true);
    
    if (!formData.business_name || !formData.specialty || !formData.city) {
      toast({ title: "Campos requeridos", description: "Por favor completa los campos obligatorios.", variant: "destructive" });
      setRpcLoading(false);
      return;
    }

    // WhatsApp Validation on Save
    if (formData.whatsapp_number) {
        const { valid, error } = validateWhatsAppNumber(formData.whatsapp_number);
        if (!valid) {
             toast({ title: "Error en WhatsApp", description: error, variant: "destructive" });
             setRpcLoading(false);
             return;
        }
    }

    // Validate role before proceeding
    if (currentUser?.role !== 'professional' && currentUser?.role !== 'admin') {
         // Attempt to update role if missing
         const { error: roleError } = await supabase
            .from('users')
            .update({ role: 'professional' })
            .eq('id', currentUser.id);
            
         if (roleError) {
             toast({ title: "Error de permisos", description: "No se pudo verificar el rol de profesional.", variant: "destructive" });
             setRpcLoading(false);
             return;
         }
    }

    try {
      // Use upsert directly on professionals table for editing
      // This is safer than the insert RPC for updates and handles both create/update scenarios
      const { error } = await supabase
        .from('professionals')
        .upsert({
          id: currentUser.id,
          business_name: formData.business_name,
          specialty: formData.specialty,
          bio: formData.bio,
          city: formData.city,
          location: formData.location,
          price_range: formData.price_range,
          price: parseInt(formData.price || 0),
          image_url: formData.image_url,
          whatsapp_number: formData.whatsapp_number,
          whatsapp_notifications_enabled: formData.whatsapp_notifications_enabled,
          updated_at: new Date().toISOString()
        });

      if (error) throw error;

      // Update local context to reflect changes in UI immediately where possible
      if (updateProfile) {
        updateProfile(formData);
      }
      
      toast({ 
        title: "Perfil Profesional Guardado", 
        description: "La información se ha registrado correctamente en el sistema.", 
        className: "bg-green-50 text-green-900" 
      });

    } catch (error) {
      console.error('Error saving professional profile:', error);
      toast({ 
        title: "Error al guardar", 
        description: error.message || "Hubo un problema al conectar con el servidor.", 
        variant: "destructive" 
      });
    } finally {
      setRpcLoading(false);
    }
  };

  return (
    <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
      <h2 className="text-xl font-bold mb-6 text-gray-900">Editar Perfil Profesional</h2>
      
      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Photo Section */}
        <div className="flex items-center gap-6 p-4 bg-gray-50 rounded-lg border border-dashed border-gray-300">
          <div className="relative">
            <img 
              src={formData.image_url || "https://images.unsplash.com/photo-1633681926019-03bd9325ec20"} 
              alt="Profile" 
              className="w-24 h-24 rounded-full object-cover border-4 border-white shadow-sm"
            />
            {uploading && (
              <div className="absolute inset-0 bg-black/50 rounded-full flex items-center justify-center">
                <Loader2 className="w-6 h-6 text-white animate-spin" />
              </div>
            )}
          </div>
          <div className="flex-1">
            <h3 className="font-medium text-gray-900">Foto de Presentación</h3>
            <p className="text-sm text-gray-500 mb-3">Se recomienda una imagen cuadrada de alta calidad.</p>
            <label className="inline-flex cursor-pointer">
              <span className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 flex items-center">
                <Upload className="w-4 h-4 mr-2" />
                Cambiar Foto
              </span>
              <input type="file" className="hidden" accept="image/*" onChange={handlePhotoUpload} disabled={uploading} />
            </label>
          </div>
        </div>

        {/* WhatsApp Notification Section */}
        <div className="p-4 border rounded-lg bg-green-50 border-green-200">
            <div className="flex items-center justify-between mb-4">
                <h3 className="font-semibold text-green-900 flex items-center">
                    <Phone className="w-4 h-4 mr-2" /> Notificaciones WhatsApp
                </h3>
                <div className="flex items-center gap-2">
                    <label className="text-sm text-green-800 font-medium">Activar</label>
                    <input 
                        type="checkbox"
                        name="whatsapp_notifications_enabled"
                        checked={formData.whatsapp_notifications_enabled}
                        onChange={handleInputChange}
                        className="w-5 h-5 text-green-600 rounded focus:ring-green-500 border-gray-300"
                    />
                </div>
            </div>
            
            <div className="space-y-2">
                <label className="text-sm font-medium text-green-800">Número de WhatsApp (Formato Internacional)</label>
                <div className="relative">
                    <input 
                        type="text"
                        name="whatsapp_number"
                        value={formData.whatsapp_number}
                        onChange={handleInputChange}
                        placeholder="+34600000000"
                        className={`w-full p-2 border rounded-md ${validationError ? 'border-red-500 focus:ring-red-500' : 'border-green-300 focus:ring-green-500'}`}
                    />
                    {validationError && (
                        <p className="text-xs text-red-600 mt-1">{validationError}</p>
                    )}
                </div>
                <p className="text-xs text-green-700">Recibirás notificaciones de nuevas citas, cancelaciones y recordatorios.</p>
            </div>
        </div>

        {/* Standard Form Fields */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-2">
            <label className="text-sm font-medium text-gray-700 flex items-center"><Building className="w-4 h-4 mr-1"/> Nombre del Negocio</label>
            <input
              name="business_name"
              value={formData.business_name}
              onChange={handleInputChange}
              className="w-full p-2 border rounded-md"
              placeholder="Ej. Salón Estilo"
            />
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium text-gray-700 flex items-center"><User className="w-4 h-4 mr-1"/> Especialidad</label>
            <select 
              name="specialty" 
              value={formData.specialty} 
              onChange={handleInputChange}
              className="w-full p-2 border rounded-md"
            >
              <option value="">Seleccionar...</option>
              <option value="Peluquería">Peluquería</option>
              <option value="Barbería">Barbería</option>
              <option value="Estética">Estética</option>
              <option value="Uñas">Uñas</option>
              <option value="Masajes">Masajes</option>
              <option value="Spa">Spa</option>
            </select>
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium text-gray-700 flex items-center"><MapPin className="w-4 h-4 mr-1"/> Ciudad</label>
            <input
              name="city"
              value={formData.city}
              onChange={handleInputChange}
              className="w-full p-2 border rounded-md"
              placeholder="Ej. Madrid"
            />
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium text-gray-700 flex items-center"><MapPin className="w-4 h-4 mr-1"/> Dirección Exacta</label>
            <input
              name="location"
              value={formData.location}
              onChange={handleInputChange}
              className="w-full p-2 border rounded-md"
              placeholder="Calle Principal 123"
            />
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium text-gray-700 flex items-center"><DollarSign className="w-4 h-4 mr-1"/> Rango de Precios</label>
            <select 
              name="price_range" 
              value={formData.price_range} 
              onChange={handleInputChange}
              className="w-full p-2 border rounded-md"
            >
              <option value="$">$ (Económico)</option>
              <option value="$$">$$ (Moderado)</option>
              <option value="$$$">$$$ (Premium)</option>
              <option value="$$$$">$$$$ (Lujo)</option>
            </select>
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium text-gray-700 flex items-center"><CreditCard className="w-4 h-4 mr-1"/> Precio Base (COP)</label>
            <input
              type="number"
              name="price"
              value={formData.price}
              onChange={handleInputChange}
              className="w-full p-2 border rounded-md"
              placeholder="Ej. 25000"
              min="0"
            />
            <p className="text-xs text-gray-500">Precio promedio en pesos colombianos.</p>
          </div>
        </div>

        <div className="space-y-2">
          <label className="text-sm font-medium text-gray-700 flex items-center"><FileText className="w-4 h-4 mr-1"/> Biografía</label>
          <textarea
            name="bio"
            value={formData.bio}
            onChange={handleInputChange}
            className="w-full p-2 border rounded-md h-32"
            placeholder="Cuéntales a tus clientes sobre ti y tu experiencia..."
          />
        </div>

        <div className="flex justify-end pt-4">
          <Button type="submit" disabled={loading || uploading || rpcLoading} className="min-w-[150px]">
            {(loading || rpcLoading) ? <><Loader2 className="w-4 h-4 mr-2 animate-spin" /> Guardando...</> : 'Guardar Cambios'}
          </Button>
        </div>
      </form>
    </div>
  );
};

export default ProfessionalProfileEditor;
