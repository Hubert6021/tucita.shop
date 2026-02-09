
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/lib/customSupabaseClient';
import { useToast } from '@/components/ui/use-toast';
import { Button } from '@/components/ui/button';
import { Loader2, User, Phone, MapPin } from 'lucide-react';
import FormField from '@/components/ui/FormField';
import { 
  validatePhone, 
  validateRequiredField,
  validateEmail
} from '@/utils/validationUtils';

const ClientRegistrationForm = () => {
  const { currentUser, signup, signInWithGoogle } = useAuth(); // Access auth methods
  const navigate = useNavigate();
  const { toast } = useToast();
  
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});
  const [isNewUser, setIsNewUser] = useState(!currentUser); // If no currentUser, treat as new registration

  const [formData, setFormData] = useState({
    full_name: currentUser?.user_metadata?.full_name || currentUser?.full_name || '',
    email: currentUser?.email || '',
    phone: currentUser?.user_metadata?.phone || '',
    password: '', // Only needed for new email/pass signup
    confirm_password: '', // Only needed for new email/pass signup
    city: '',
    preferences: [],
    terms_accepted: false
  });

  const preferenceOptions = [
    { id: 'hair', label: 'Cortes de Cabello' },
    { id: 'beard', label: 'Barba' },
    { id: 'nails', label: 'Uñas' },
    { id: 'facial', label: 'Faciales' },
    { id: 'massage', label: 'Masajes' },
  ];

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
    if (errors[name]) setErrors(prev => ({ ...prev, [name]: null }));
  };

  const handlePreferenceToggle = (id) => {
    setFormData(prev => {
      const current = prev.preferences || [];
      const updated = current.includes(id) 
        ? current.filter(item => item !== id)
        : [...current, id];
      return { ...prev, preferences: updated };
    });
  };

  const validate = () => {
    const newErrors = {};
    if (validateRequiredField(formData.full_name)) newErrors.full_name = validateRequiredField(formData.full_name);
    
    // Validations for new users who are not logged in yet
    if (isNewUser) {
        if (validateEmail(formData.email)) newErrors.email = validateEmail(formData.email);
        if (formData.password.length < 6) newErrors.password = "La contraseña debe tener al menos 6 caracteres";
        if (formData.password !== formData.confirm_password) newErrors.confirm_password = "Las contraseñas no coinciden";
    }

    if (validatePhone(formData.phone)) newErrors.phone = validatePhone(formData.phone);
    if (validateRequiredField(formData.city)) newErrors.city = validateRequiredField(formData.city);
    if (!formData.terms_accepted) newErrors.terms_accepted = "Debes aceptar los términos y condiciones";
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;

    setLoading(true);
    try {
      let userId = currentUser?.id;

      // 1. Handle Authentication (if not already logged in)
      if (isNewUser) {
          console.log("Creating new user account...");
          const { data, error } = await supabase.auth.signUp({
              email: formData.email,
              password: formData.password,
              options: {
                  data: {
                      full_name: formData.full_name,
                      phone: formData.phone,
                      role: 'customer' // Ensure role is strictly 'customer'
                  }
              }
          });

          if (error) throw error;
          if (data?.user) userId = data.user.id;
          
          if (!data?.session) {
              toast({
                  title: "Verifica tu correo",
                  description: "Te hemos enviado un enlace de confirmación. Por favor revisa tu email.",
                  className: "bg-blue-600 text-white"
              });
              setLoading(false);
              return; // Stop here, wait for email confirmation
          }
      }

      // 2. Update Profile Data in 'users' table
      // Ensure we have a valid userId at this point
      if (userId) {
          const { error: updateError } = await supabase
            .from('users')
            .upsert({
              id: userId,
              email: formData.email, // Ensure email is synced
              full_name: formData.full_name,
              phone: formData.phone,
              role: 'customer', // Enforce valid role 'customer'
              updated_at: new Date().toISOString()
            });

          if (updateError) throw updateError;
      }

      toast({
        title: "Registro Completado",
        description: "¡Bienvenido! Ya puedes empezar a reservar citas.",
        className: "bg-rose-600 text-white"
      });

      setTimeout(() => {
        navigate('/dashboard');
      }, 1500);

    } catch (err) {
      console.error("Client Registration Error:", err);
      toast({
        title: "Error",
        description: err.message || "No se pudo completar el registro.",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-white rounded-2xl shadow-xl overflow-hidden border border-gray-100 p-6 md:p-8 relative z-10">
      <form onSubmit={handleSubmit}>
        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="space-y-6">
          <h2 className="text-2xl font-bold text-gray-900 mb-2 flex items-center">
             <User className="mr-2 w-6 h-6 text-rose-500"/> Completa tu Perfil
          </h2>
          <p className="text-gray-500 mb-6">Regístrate gratis y reserva en segundos.</p>

          <FormField
            label="Nombre Completo"
            name="full_name"
            value={formData.full_name}
            onChange={handleChange}
            error={errors.full_name}
            required
            placeholder="Juan Pérez"
          />

          {isNewUser && (
              <div className="space-y-4">
                  <FormField
                    label="Correo Electrónico"
                    name="email"
                    type="email"
                    value={formData.email}
                    onChange={handleChange}
                    error={errors.email}
                    required
                    placeholder="juan@ejemplo.com"
                  />
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <FormField
                        label="Contraseña"
                        name="password"
                        type="password"
                        value={formData.password}
                        onChange={handleChange}
                        error={errors.password}
                        required
                        placeholder="******"
                      />
                      <FormField
                        label="Confirmar Contraseña"
                        name="confirm_password"
                        type="password"
                        value={formData.confirm_password}
                        onChange={handleChange}
                        error={errors.confirm_password}
                        required
                        placeholder="******"
                      />
                  </div>
              </div>
          )}

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <FormField
              label="Teléfono Móvil"
              name="phone"
              value={formData.phone}
              onChange={handleChange}
              error={errors.phone}
              required
              placeholder="+57 300..."
            />
            <FormField
              label="Ciudad de Residencia"
              name="city"
              value={formData.city}
              onChange={handleChange}
              error={errors.city}
              required
              placeholder="Bogotá, Medellín..."
            />
          </div>

          <div className="space-y-3">
             <label className="block text-sm font-medium text-gray-700">
                ¿Qué servicios te interesan?
             </label>
             <div className="grid grid-cols-2 gap-3">
                {preferenceOptions.map(opt => (
                   <div 
                     key={opt.id}
                     onClick={() => handlePreferenceToggle(opt.id)}
                     className={`cursor-pointer p-3 rounded-lg border text-sm font-medium text-center transition-all ${
                       formData.preferences.includes(opt.id)
                         ? 'bg-rose-50 border-rose-500 text-rose-700 shadow-sm font-semibold'
                         : 'bg-white border-gray-200 text-gray-600 hover:bg-gray-50'
                     }`}
                   >
                     {opt.label}
                   </div>
                ))}
             </div>
          </div>

          <div className="pt-4 border-t border-gray-100">
            <label className="flex items-start gap-3 cursor-pointer group">
              <input
                type="checkbox"
                name="terms_accepted"
                checked={formData.terms_accepted}
                onChange={handleChange}
                className="w-5 h-5 border-gray-300 rounded text-rose-600 focus:ring-rose-500 mt-0.5"
              />
              <div className="text-sm text-gray-600 group-hover:text-gray-900 transition-colors">
                Acepto los <a href="#" className="text-rose-600 hover:underline font-medium">Términos y Condiciones</a> y consiento el tratamiento de mis datos personales.
              </div>
            </label>
            {errors.terms_accepted && <p className="text-red-500 text-sm mt-1 ml-8">{errors.terms_accepted}</p>}
          </div>

          <Button 
            type="submit" 
            disabled={loading} 
            className="w-full bg-rose-600 hover:bg-rose-700 text-white h-12 text-lg mt-6 shadow-md hover:shadow-lg transition-all"
          >
            {loading ? <><Loader2 className="mr-2 h-5 w-5 animate-spin" /> Guardando...</> : 'Completar Registro'}
          </Button>
          
          {isNewUser && (
              <div className="text-center mt-4">
                  <p className="text-sm text-gray-500">¿Ya tienes cuenta? <a href="/login" className="text-rose-600 font-medium hover:underline">Inicia Sesión</a></p>
              </div>
          )}

        </motion.div>
      </form>
    </div>
  );
};

export default ClientRegistrationForm;
