import React, { useState } from 'react';
import { Helmet } from 'react-helmet';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { AlertCircle, ArrowLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useToast } from '@/components/ui/use-toast';
import { useAuth } from '@/contexts/AuthContext';

const LoginPage = () => {
  const [error, setError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { toast } = useToast();
  const { signInWithGoogle } = useAuth();

  const handleGoogleLogin = async () => {
    setIsSubmitting(true);
    try {
      const result = await signInWithGoogle('customer');
      if (!result.success) {
        setError(result.error);
        toast({ title: "Error", description: result.error, variant: "destructive" });
        setIsSubmitting(false);
      }
      // If success, Supabase will redirect
    } catch (err) {
      setError('Error conectando con Google.');
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center py-12 px-4 bg-gradient-to-br from-rose-50 via-pink-50 to-purple-50 relative">
      <Helmet><title>Acceso Clientes - TuCita</title></Helmet>
      
      <div className="absolute top-4 left-4 md:top-8 md:left-8">
        <Link to="/login">
          <Button variant="ghost" className="flex items-center gap-2 text-gray-600 hover:text-gray-900">
            <ArrowLeft className="w-4 h-4" /> Volver
          </Button>
        </Link>
      </div>

      <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className="bg-white rounded-2xl shadow-xl p-8 w-full max-w-md">
        <div className="text-center mb-6">
          <h1 className="text-3xl font-bold text-gray-900">Acceso Clientes</h1>
          <p className="text-gray-500">Ingresa a tu cuenta personal</p>
        </div>

        {error && (
          <div className="mb-4 p-3 bg-red-50 text-red-700 text-sm rounded-lg flex items-center gap-2">
            <AlertCircle className="h-4 w-4" /> {error}
          </div>
        )}

        <div className="space-y-3 mb-6">
          <Button 
            variant="outline" 
            type="button" 
            className="w-full bg-white hover:bg-gray-50 text-gray-700 border-gray-200 py-6 text-base"
            onClick={handleGoogleLogin}
            disabled={isSubmitting}
          >
            <svg className="mr-3 h-5 w-5" aria-hidden="true" focusable="false" data-prefix="fab" data-icon="google" role="img" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 488 512">
              <path fill="currentColor" d="M488 261.8C488 403.3 391.1 504 248 504 110.8 504 0 393.2 0 256S110.8 8 248 8c66.8 0 123 24.5 166.3 64.9l-67.5 64.9C258.5 52.6 94.3 116.6 94.3 256c0 86.5 69.1 156.6 153.7 156.6 98.2 0 135-70.4 140.8-106.9H248v-85.3h236.1c2.3 12.7 3.9 24.9 3.9 41.4z"></path>
            </svg>
            Continuar con Google
          </Button>
        </div>

        <div className="mt-6 text-center text-sm">
          <p className="text-gray-600">¿No tienes cuenta? <Link to="/signup" className="text-rose-600 font-bold hover:underline">Regístrate gratis</Link></p>
        </div>
      </motion.div>
    </div>
  );
};

export default LoginPage;