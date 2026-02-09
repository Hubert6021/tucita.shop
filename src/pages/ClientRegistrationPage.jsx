
import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { User, Mail, Phone, Lock, Loader2, ArrowLeft } from 'lucide-react';
import { useToast } from '@/components/ui/use-toast';

const ClientRegistrationPage = () => {
  const navigate = useNavigate();
  const { signUp } = useAuth();
  const { toast } = useToast();
  
  const [formData, setFormData] = useState({
    full_name: '',
    email: '',
    telefono: '',
    password: ''
  });
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);

  const validate = () => {
    const newErrors = {};
    if (!formData.full_name.trim()) newErrors.full_name = "Campo requerido";
    
    if (!formData.email.trim()) {
      newErrors.email = "Campo requerido";
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = "Formato de email inválido";
    }

    if (!formData.telefono.trim()) newErrors.telefono = "Campo requerido";

    if (!formData.password) {
      newErrors.password = "Campo requerido";
    } else {
      if (formData.password.length < 8) newErrors.password = "Mínimo 8 caracteres";
      if (!/[A-Z]/.test(formData.password)) newErrors.password = "Debe incluir una mayúscula";
      if (!/[0-9]/.test(formData.password)) newErrors.password = "Debe incluir un número";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;

    setLoading(true);
    const result = await signUp(
      formData.email,
      formData.password,
      formData.full_name,
      formData.telefono,
      'cliente'
    );

    if (result.success) {
      toast({ 
        title: "¡Registro Exitoso!", 
        description: "Bienvenido a TuCita. Has ingresado a tu panel de cliente.",
        className: "bg-green-600 text-white"
      });
      navigate('/customer-dashboard');
    } else {
      if (result.error.toLowerCase().includes("email")) {
        setErrors(prev => ({ ...prev, email: result.error }));
      } else {
        toast({ title: "Error en registro", description: result.error, variant: "destructive" });
      }
    }
    setLoading(false);
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    if (errors[e.target.name]) setErrors({ ...errors, [e.target.name]: null });
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8 bg-white p-8 rounded-xl shadow-lg relative">
        <Link to="/" className="absolute top-4 left-4 text-gray-400 hover:text-gray-600">
          <ArrowLeft className="w-6 h-6" />
        </Link>
        
        <div className="text-center">
          <h2 className="text-3xl font-extrabold text-gray-900">Crear cuenta Cliente</h2>
          <p className="mt-2 text-sm text-gray-600">Regístrate para agendar tus citas</p>
        </div>

        <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700">Nombre Completo</label>
              <div className="mt-1 relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <User className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  name="full_name"
                  type="text"
                  required
                  className={`appearance-none block w-full pl-10 px-3 py-2 border ${errors.full_name ? 'border-red-500' : 'border-gray-300'} rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-rose-500 focus:border-rose-500 sm:text-sm`}
                  placeholder="Juan Pérez"
                  value={formData.full_name}
                  onChange={handleChange}
                />
              </div>
              {errors.full_name && <p className="mt-1 text-xs text-red-600">{errors.full_name}</p>}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">Email</label>
              <div className="mt-1 relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Mail className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  name="email"
                  type="email"
                  required
                  className={`appearance-none block w-full pl-10 px-3 py-2 border ${errors.email ? 'border-red-500' : 'border-gray-300'} rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-rose-500 focus:border-rose-500 sm:text-sm`}
                  placeholder="juan@ejemplo.com"
                  value={formData.email}
                  onChange={handleChange}
                />
              </div>
              {errors.email && <p className="mt-1 text-xs text-red-600">{errors.email}</p>}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">Teléfono</label>
              <div className="mt-1 relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Phone className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  name="telefono"
                  type="tel"
                  required
                  className={`appearance-none block w-full pl-10 px-3 py-2 border ${errors.telefono ? 'border-red-500' : 'border-gray-300'} rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-rose-500 focus:border-rose-500 sm:text-sm`}
                  placeholder="+57 300 123 4567"
                  value={formData.telefono}
                  onChange={handleChange}
                />
              </div>
              {errors.telefono && <p className="mt-1 text-xs text-red-600">{errors.telefono}</p>}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">Contraseña</label>
              <div className="mt-1 relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Lock className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  name="password"
                  type="password"
                  required
                  className={`appearance-none block w-full pl-10 px-3 py-2 border ${errors.password ? 'border-red-500' : 'border-gray-300'} rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-rose-500 focus:border-rose-500 sm:text-sm`}
                  placeholder="Mín. 8 car, 1 mayús, 1 num"
                  value={formData.password}
                  onChange={handleChange}
                />
              </div>
              {errors.password && <p className="mt-1 text-xs text-red-600">{errors.password}</p>}
            </div>
          </div>

          <div>
            <Button
              type="submit"
              disabled={loading}
              className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-rose-600 hover:bg-rose-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-rose-500"
            >
              {loading ? <Loader2 className="animate-spin h-5 w-5" /> : "Crear Cuenta"}
            </Button>
          </div>
          
          <div className="text-center text-sm">
            <span className="text-gray-500">¿Ya tienes cuenta? </span>
            <Link to="/login-client" className="font-medium text-rose-600 hover:text-rose-500">Inicia sesión</Link>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ClientRegistrationPage;
