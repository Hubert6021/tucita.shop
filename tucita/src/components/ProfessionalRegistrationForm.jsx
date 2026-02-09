
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/lib/customSupabaseClient';
import { useToast } from '@/components/ui/use-toast';
import { Button } from '@/components/ui/button';
import { Loader2, ArrowRight, DollarSign, Clock, MapPin, Building, Phone } from 'lucide-react';
import FormField from '@/components/ui/FormField';
import FileUpload from '@/components/ui/FileUpload';
import { 
  validateEmail, 
  validatePhone, 
  validateWhatsAppNumber, 
  validateRequiredField, 
  validatePrice 
} from '@/utils/validationUtils';

const ProfessionalRegistrationForm = () => {
  const { currentUser, updateProfile } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();
  
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});
  
  // Initialize form with auth data if available
  const [formData, setFormData] = useState({
    business_name: '',
    // If user came from auth flow, pre-fill email
    email: currentUser?.email || '',
    phone: currentUser?.phone || '',
    whatsapp_number: '',
    specialty: '',
    price_range: '$$',
    price: '',
    bio: '',
    image_url: '',
    city: '',
    address: '',
    experience_years: '',
    payment_methods: [],
    terms_accepted: false,
    days_available: []
  });

  const specialties = [
    { value: 'Peluquería', label: 'Peluquería' },
    { value: 'Barbería', label: 'Barbería' },
    { value: 'Manicura/Pedicura', label: 'Manicura/Pedicura' },
    { value: 'Maquillaje', label: 'Maquillaje' },
    { value: 'Spa y Masajes', label: 'Spa y Masajes' },
    { value: 'Depilación', label: 'Depilación' },
    { value: 'Tatuajes', label: 'Tatuajes' },
    { value: 'Otros', label: 'Otros' }
  ];

  const daysOfWeek = [
    { id: 1, label: 'Lunes' },
    { id: 2, label: 'Martes' },
    { id: 3, label: 'Miércoles' },
    { id: 4, label: 'Jueves' },
    { id: 5, label: 'Viernes' },
    { id: 6, label: 'Sábado' },
    { id: 0, label: 'Domingo' },
  ];

  const paymentMethodsList = ['Efectivo', 'Tarjeta Débito/Crédito', 'Transferencia', 'Nequi', 'DaviPlata'];

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
    
    // Clear specific error on change
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: null }));
    }
  };

  const handleMultiSelect = (field, value) => {
    setFormData(prev => {
      const current = prev[field] || [];
      const updated = current.includes(value) 
        ? current.filter(item => item !== value)
        : [...current, value];
      return { ...prev, [field]: updated };
    });
  };

  const validateStep = (currentStep) => {
    const newErrors = {};
    let isValid = true;

    if (currentStep === 1) {
      // Basic Info
      if (validateRequiredField(formData.business_name)) newErrors.business_name = validateRequiredField(formData.business_name);
      if (validateRequiredField(formData.specialty)) newErrors.specialty = validateRequiredField(formData.specialty);
      if (validateEmail(formData.email)) newErrors.email = validateEmail(formData.email);
      if (validatePhone(formData.phone)) newErrors.phone = validatePhone(formData.phone);
      if (validateWhatsAppNumber(formData.whatsapp_number)) newErrors.whatsapp_number = validateWhatsAppNumber(formData.whatsapp_number);
    }

    if (currentStep === 2) {
      // Details & Location
      if (validateRequiredField(formData.city)) newErrors.city = validateRequiredField(formData.city);
      if (validateRequiredField(formData.address)) newErrors.address = validateRequiredField(formData.address);
      if (validatePrice(formData.price)) newErrors.price = validatePrice(formData.price);
      if (validateRequiredField(formData.bio)) newErrors.bio = validateRequiredField(formData.bio);
    }

    if (currentStep === 3) {
      // Gallery & Config
      if (!formData.image_url) newErrors.image_url = "Debes subir una foto de perfil o logo";
      if (!formData.terms_accepted) newErrors.terms_accepted = "Debes aceptar los términos y condiciones";
      if (formData.days_available.length === 0) newErrors.days_available = "Selecciona al menos un día disponible";
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      isValid = false;
      toast({
        title: "Campos incompletos",
        description: "Por favor revisa los campos marcados en rojo.",
        variant: "destructive"
      });
    }

    return isValid;
  };

  const nextStep = () => {
    if (validateStep(step)) {
      setStep(prev => prev + 1);
    }
  };

  const prevStep = () => {
    setStep(prev => prev - 1);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateStep(3)) return;

    if (!currentUser) {
       toast({
         title: "Error de Sesión",
         description: "Debes iniciar sesión para registrarte como profesional.",
         variant: "destructive"
       });
       return;
    }

    setLoading(true);

    try {
      // Prepare RPC parameters
      // Note: p_id should ideally be the user ID for 1:1 relationship, but RPC might expect a new UUID if it inserts into a table with auto-generated ID.
      // However, professionals table usually has id as FK to users.id.
      // We will use currentUser.id as p_id to ensure FK constraint is met if the RPC allows it.
      // If the RPC forces a new UUID, it might fail FK constraint.
      // Assuming the RPC handles insertion correctly for now, but we must ensure the user has the 'professional' role first.

      // 1. Ensure user has 'professional' role
      if (currentUser.role !== 'professional') {
        const { error: roleError } = await supabase
          .from('users')
          .update({ role: 'professional' }) // Explicitly set valid role
          .eq('id', currentUser.id);

        if (roleError) {
            console.error("Role update error:", roleError);
            throw new Error("No se pudo actualizar el rol de usuario.");
        }
        
        // Try to update context
        if (updateProfile) {
           await updateProfile({ role: 'professional' });
        }
      }

      const rpcPayload = {
        p_id: currentUser.id, // Use current user ID to satisfy FK constraint
        p_user_id: currentUser.id,
        p_nombre: formData.business_name,
        p_price: parseInt(formData.price),
        p_moneda: 'COP',
        p_horario: { days: formData.days_available, hours: "9:00 - 18:00" },
        p_fotos: [formData.image_url],
        p_metodos: formData.payment_methods
      };

      console.log("RPC Payload:", rpcPayload);

      // Call the specific RPC function
      const { error: rpcError } = await supabase.rpc('insertar_profesional_with_cop', rpcPayload);

      if (rpcError) {
        console.error("RPC Error:", rpcError);
        // If RPC fails (e.g. duplicate key), try upsert fallback
        if (rpcError.message.includes('duplicate key')) {
             const { error: upsertError } = await supabase
                .from('professionals')
                .upsert({
                    id: currentUser.id,
                    business_name: formData.business_name,
                    price_range: formData.price_range,
                    // Map other fields as needed for direct upsert
                    city: formData.city,
                    location: formData.address,
                    bio: formData.bio,
                    image_url: formData.image_url,
                    status: 'pending'
                });
             if (upsertError) throw upsertError;
        } else {
            throw new Error(rpcError.message || "Error al crear el perfil profesional.");
        }
      }

      toast({
        title: "¡Registro Exitoso!",
        description: "Tu perfil profesional ha sido creado.",
        className: "bg-green-600 text-white"
      });

      // Redirect to professionals list or dashboard
      setTimeout(() => {
        navigate('/profesionales');
      }, 1500);

    } catch (err) {
      console.error("Registration Critical Error:", err);
      toast({
        title: "Error en el registro",
        description: err.message || "Hubo un problema de conexión. Inténtalo de nuevo.",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-white rounded-2xl shadow-xl overflow-hidden border border-gray-100 relative z-10">
      {/* Progress Header */}
      <div className="bg-gray-50 px-6 py-4 border-b border-gray-200 flex justify-between items-center">
         <span className="text-sm font-semibold text-gray-600">Paso {step} de 3</span>
         <div className="flex gap-2">
            {[1, 2, 3].map(i => (
              <div 
                key={i} 
                className={`h-2 w-10 rounded-full transition-all duration-300 ${i <= step ? 'bg-blue-600' : 'bg-gray-200'}`}
              />
            ))}
         </div>
      </div>

      <div className="p-6 md:p-8">
        <form onSubmit={handleSubmit}>
          
          {/* STEP 1: Basic Info */}
          {step === 1 && (
            <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} className="space-y-6">
              <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center">
                <Building className="mr-2 w-6 h-6 text-blue-500"/> Información del Negocio
              </h2>
              
              <FormField
                label="Nombre del Negocio / Profesional"
                name="business_name"
                value={formData.business_name}
                onChange={handleChange}
                error={errors.business_name}
                required
                placeholder="Ej. Barbería El Maestro"
              />

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                 <FormField
                    label="Especialidad Principal"
                    name="specialty"
                    type="select"
                    value={formData.specialty}
                    onChange={handleChange}
                    options={specialties}
                    error={errors.specialty}
                    required
                 />
                 <FormField
                    label="Años de Experiencia"
                    name="experience_years"
                    type="number"
                    value={formData.experience_years}
                    onChange={handleChange}
                    placeholder="Ej. 5"
                 />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <FormField
                  label="Email de Contacto"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  error={errors.email}
                  required
                  disabled={!!currentUser?.email} // Lock email if logged in
                  helperText="Este será tu usuario de acceso."
                />
                <FormField
                  label="Teléfono Móvil"
                  name="phone"
                  value={formData.phone}
                  onChange={handleChange}
                  error={errors.phone}
                  required
                  placeholder="+57 300 123 4567"
                />
              </div>

              <FormField
                label="WhatsApp para Notificaciones (con código de país)"
                name="whatsapp_number"
                value={formData.whatsapp_number}
                onChange={handleChange}
                error={errors.whatsapp_number}
                required
                placeholder="+573001234567"
                helperText="Fundamental para recibir confirmaciones de citas."
              />
            </motion.div>
          )}

          {/* STEP 2: Details & Location */}
          {step === 2 && (
            <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} className="space-y-6">
              <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center">
                <MapPin className="mr-2 w-6 h-6 text-blue-500"/> Ubicación y Precios
              </h2>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                 <FormField
                    label="Ciudad"
                    name="city"
                    value={formData.city}
                    onChange={handleChange}
                    error={errors.city}
                    required
                    placeholder="Ej. Bogotá"
                 />
                 <FormField
                    label="Dirección / Ubicación"
                    name="address"
                    value={formData.address}
                    onChange={handleChange}
                    error={errors.address}
                    required
                    placeholder="Calle 123 # 45-67, Local 101"
                 />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                 <FormField
                    label="Precio Base Promedio (COP)"
                    name="price"
                    type="number"
                    value={formData.price}
                    onChange={handleChange}
                    error={errors.price}
                    required
                    placeholder="25000"
                    helperText="Valor referencia para búsquedas."
                 />
                 <FormField
                    label="Rango de Precios"
                    name="price_range"
                    type="select"
                    value={formData.price_range}
                    onChange={handleChange}
                    options={[
                        { value: '$', label: '$ (Económico)' },
                        { value: '$$', label: '$$ (Moderado)' },
                        { value: '$$$', label: '$$$ (Costoso)' },
                        { value: '$$$$', label: '$$$$ (Lujo)' },
                    ]}
                 />
              </div>

              <FormField
                label="Biografía / Descripción"
                name="bio"
                type="textarea"
                value={formData.bio}
                onChange={handleChange}
                error={errors.bio}
                required
                placeholder="Cuenta a tus clientes sobre ti, tus servicios y lo que te hace único..."
                rows={5}
              />
            </motion.div>
          )}

          {/* STEP 3: Gallery & Config */}
          {step === 3 && (
            <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} className="space-y-6">
              <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center">
                <Clock className="mr-2 w-6 h-6 text-blue-500"/> Finalizar Perfil
              </h2>

              <FileUpload
                label="Foto de Perfil o Logo del Negocio"
                currentImage={formData.image_url}
                onUploadComplete={(url) => setFormData(prev => ({ ...prev, image_url: url }))}
                required
              />
              {errors.image_url && <p className="text-red-500 text-sm mt-1 flex items-center"><span className="mr-1">⚠</span>{errors.image_url}</p>}

              <div className="space-y-3">
                 <label className="block text-sm font-medium text-gray-700 flex items-center">
                    <Clock className="w-4 h-4 mr-2"/> Días de Atención Disponibles
                 </label>
                 <div className="flex flex-wrap gap-2">
                    {daysOfWeek.map(day => (
                       <button
                         key={day.id}
                         type="button"
                         onClick={() => handleMultiSelect('days_available', day.id)}
                         className={`px-3 py-1.5 rounded-full text-sm font-medium border transition-all ${
                           formData.days_available.includes(day.id)
                             ? 'bg-blue-600 text-white border-blue-600 shadow-md transform scale-105'
                             : 'bg-white text-gray-600 border-gray-300 hover:border-blue-300 hover:text-blue-600'
                         }`}
                       >
                         {day.label}
                       </button>
                    ))}
                 </div>
                 {errors.days_available && <p className="text-red-500 text-sm mt-1">{errors.days_available}</p>}
              </div>

              <div className="space-y-3">
                 <label className="block text-sm font-medium text-gray-700 flex items-center">
                    <DollarSign className="w-4 h-4 mr-2"/> Métodos de Pago Aceptados
                 </label>
                 <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                    {paymentMethodsList.map(method => (
                       <label key={method} className="flex items-center space-x-2 cursor-pointer p-3 border rounded-lg hover:bg-gray-50 transition-colors">
                          <input
                            type="checkbox"
                            checked={formData.payment_methods.includes(method)}
                            onChange={() => handleMultiSelect('payment_methods', method)}
                            className="rounded text-blue-600 focus:ring-blue-500 w-4 h-4 border-gray-300"
                          />
                          <span className="text-sm text-gray-700 font-medium">{method}</span>
                       </label>
                    ))}
                 </div>
              </div>

              <div className="pt-4 border-t border-gray-100">
                <label className="flex items-start gap-3 cursor-pointer group">
                  <div className="relative flex items-center pt-1">
                    <input
                      type="checkbox"
                      name="terms_accepted"
                      checked={formData.terms_accepted}
                      onChange={handleChange}
                      className="w-5 h-5 border-gray-300 rounded text-blue-600 focus:ring-blue-500"
                    />
                  </div>
                  <div className="text-sm text-gray-600 group-hover:text-gray-900 transition-colors">
                    He leído y acepto los <a href="#" className="text-blue-600 hover:underline font-medium">Términos y Condiciones</a> y la <a href="#" className="text-blue-600 hover:underline font-medium">Política de Privacidad</a>.
                  </div>
                </label>
                {errors.terms_accepted && <p className="text-red-500 text-sm mt-1 ml-8">{errors.terms_accepted}</p>}
              </div>
            </motion.div>
          )}

          {/* Navigation Buttons */}
          <div className="mt-8 flex justify-between items-center pt-6 border-t border-gray-100">
            {step > 1 ? (
              <Button type="button" variant="outline" onClick={prevStep} className="px-6 border-gray-300 hover:bg-gray-50">
                Atrás
              </Button>
            ) : (
              <div></div> // Spacer
            )}

            {step < 3 ? (
              <Button type="button" onClick={nextStep} className="bg-blue-600 hover:bg-blue-700 text-white px-8 shadow-md">
                Siguiente <ArrowRight className="ml-2 w-4 h-4" />
              </Button>
            ) : (
              <Button 
                type="submit" 
                disabled={loading} 
                className="bg-green-600 hover:bg-green-700 text-white px-8 min-w-[180px] shadow-lg hover:shadow-xl transition-all"
              >
                {loading ? <><Loader2 className="mr-2 h-4 w-4 animate-spin" /> Registrando...</> : 'Finalizar Registro'}
              </Button>
            )}
          </div>
        </form>
      </div>
    </div>
  );
};

export default ProfessionalRegistrationForm;
