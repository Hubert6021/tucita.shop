import React, { useState } from 'react';
import { Helmet } from 'react-helmet';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ShieldCheck, User, Lock, ArrowLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useToast } from '@/components/ui/use-toast';
import { useAuth } from '@/contexts/AuthContext';

const AdminLoginPage = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();
  const { toast } = useToast();
  const { loginAdmin } = useAuth();

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!username || !password) {
        toast({
            title: "Error",
            description: "Por favor, ingrese el correo electrónico y la contraseña.",
            variant: "destructive"
        });
        return;
    }

    const result = loginAdmin(username, password);
    
    if (result.success) {
      toast({
        title: "Acceso Concedido",
        description: "Bienvenido al panel de administración.",
      });
      navigate('/admin/dashboard');
    } else {
      toast({
        title: "Acceso Denegado",
        description: result.error,
        variant: "destructive",
      });
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center py-12 px-4 bg-gradient-to-br from-slate-900 via-blue-900 to-slate-900">
      <Helmet>
        <title>Iniciar Sesión - Administrador</title>
        <meta name="description" content="Acceso administrativo a TuCita." />
      </Helmet>

      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="bg-white rounded-2xl shadow-2xl p-8 w-full max-w-md relative"
      >
        <Link to="/" className="absolute top-4 left-4 text-gray-400 hover:text-gray-600">
            <ArrowLeft className="h-5 w-5" />
        </Link>
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-blue-100 text-blue-600 mb-4">
             <ShieldCheck className="h-8 w-8" />
          </div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Administración</h1>
          <p className="text-gray-500">Acceso restringido a personal autorizado</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Correo electrónico
            </label>
            <div className="relative">
              <User className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
              <input
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-900 placeholder:text-gray-500"
                placeholder="admin@tucita.com"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Contraseña
            </label>
            <div className="relative">
              <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-900 placeholder:text-gray-500"
                placeholder="••••••••"
              />
            </div>
          </div>

          <Button
            type="submit"
            size="lg"
            className="w-full bg-blue-600 hover:bg-blue-700 text-white"
          >
            Iniciar Sesión
          </Button>
        </form>

        <div className="mt-8 pt-6 border-t border-gray-100 text-center text-sm">
           <p className="text-gray-500">¿No eres administrador?</p>
           <div className="flex justify-center gap-4 mt-2">
               <Link to="/login" className="text-blue-600 hover:underline">Acceso Cliente</Link>
               <span className="text-gray-300">|</span>
               <Link to="/professional-login" className="text-blue-600 hover:underline">Acceso Profesional</Link>
           </div>
        </div>
      </motion.div>
    </div>
  );
};

export default AdminLoginPage;