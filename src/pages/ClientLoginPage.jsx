
import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { Mail, Lock, Loader2, ArrowLeft } from 'lucide-react';
import { useToast } from '@/components/ui/use-toast';

const ClientLoginPage = () => {
  const navigate = useNavigate();
  const { signIn } = useAuth();
  const { toast } = useToast();
  
  const [formData, setFormData] = useState({ email: '', password: '' });
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrors({});
    setLoading(true);

    const result = await signIn(formData.email, formData.password);

    if (result.success) {
      if (result.user.role === 'cliente' || result.user.role === 'customer') { // Allow both for compatibility
        navigate('/dashboard-cliente');
      } else {
        setErrors({ general: "Este usuario no es cliente" });
      }
    } else {
      if (result.error.includes("Contraseña")) {
         setErrors({ password: result.error });
      } else if (result.error.includes("Usuario")) {
         setErrors({ email: result.error });
      } else {
         setErrors({ general: result.error });
      }
    }
    setLoading(false);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8 bg-white p-8 rounded-xl shadow-lg relative">
        <Link to="/" className="absolute top-4 left-4 text-gray-400 hover:text-gray-600">
          <ArrowLeft className="w-6 h-6" />
        </Link>
        
        <div className="text-center">
          <h2 className="text-3xl font-extrabold text-gray-900">Login Cliente</h2>
          <p className="mt-2 text-sm text-gray-600">Inicia sesión para gestionar tus citas</p>
        </div>

        {errors.general && (
          <div className="bg-red-50 text-red-600 p-3 rounded-md text-sm text-center">
            {errors.general}
          </div>
        )}

        <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
          <div className="space-y-4">
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
                  className="appearance-none block w-full pl-10 px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-rose-500 focus:border-rose-500 sm:text-sm"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                />
              </div>
              {errors.email && <p className="mt-1 text-xs text-red-600">{errors.email}</p>}
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
                  className="appearance-none block w-full pl-10 px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-rose-500 focus:border-rose-500 sm:text-sm"
                  value={formData.password}
                  onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                />
              </div>
              {errors.password && <p className="mt-1 text-xs text-red-600">{errors.password}</p>}
            </div>
          </div>

          <Button
            type="submit"
            disabled={loading}
            className="w-full bg-rose-600 hover:bg-rose-700 text-white"
          >
            {loading ? <Loader2 className="animate-spin h-5 w-5" /> : "Iniciar Sesión"}
          </Button>

          <div className="text-center text-sm">
            <Link to="/register-client" className="font-medium text-rose-600 hover:text-rose-500">¿No tienes cuenta? Regístrate</Link>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ClientLoginPage;
