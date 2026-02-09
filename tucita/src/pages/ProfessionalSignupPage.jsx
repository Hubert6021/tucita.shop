import React, { useState } from 'react';
import { Helmet } from 'react-helmet';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { AlertCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useToast } from '@/components/ui/use-toast';
import { useAuth } from '@/contexts/AuthContext';

const ProfessionalSignupPage = () => {
  const [error, setError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { toast } = useToast();
  const { signInWithGoogle } = useAuth();

  const handleGoogleSignup = async () => {
    setIsSubmitting(true);
    try {
      const result = await signInWithGoogle('professional');
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
    <div className="min-h-screen flex bg-gray-50">
      <div className="hidden lg:block w-1/2 bg-cover bg-center" style={{ backgroundImage: 'url("https://images.unsplash.com/photo-1556755140-e34e22dcb26c")' }}>
        <div className="h-full w-full bg-black/50 flex items-center justify-center p-12 text-white">
          <div><h1 className="text-5xl font-bold mb-4">Tu Negocio, Tu Nivel.</h1><p className="text-xl">Gestiona citas como un profesional.</p></div>
        </div>
      </div>
      <div className="w-full lg:w-1/2 flex items-center justify-center p-8">
        <Helmet><title>Registro Profesional</title></Helmet>
        <div className="max-w-md w-full">
          <div className="mb-8 text-center lg:text-left">
            <h2 className="text-3xl font-bold mb-2">Registro Profesional</h2>
            <p className="text-gray-500">Únete a nuestra red de expertos</p>
          </div>
          
          {error && (
            <div className="mb-6 p-4 bg-red-50 text-red-700 rounded-lg flex items-center gap-2">
              <AlertCircle className="h-5 w-5" />
              <span>{error}</span>
            </div>
          )}

          <div className="mb-6 space-y-3">
             <Button 
                variant="outline" 
                type="button" 
                className="w-full bg-white hover:bg-gray-50 text-gray-700 border-gray-200 py-6 text-base"
                onClick={handleGoogleSignup}
                disabled={isSubmitting}
              >
                <svg className="mr-3 h-5 w-5" aria-hidden="true" focusable="false" data-prefix="fab" data-icon="google" role="img" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 488 512">
                  <path fill="currentColor" d="M488 261.8C488 403.3 391.1 504 248 504 110.8 504 0 393.2 0 256S110.8 8 248 8c66.8 0 123 24.5 166.3 64.9l-67.5 64.9C258.5 52.6 94.3 116.6 94.3 256c0 86.5 69.1 156.6 153.7 156.6 98.2 0 135-70.4 140.8-106.9H248v-85.3h236.1c2.3 12.7 3.9 24.9 3.9 41.4z"></path>
                </svg>
                Registrarse con Google
              </Button>
          </div>
          
          <p className="mt-8 text-center text-sm text-gray-600">
            ¿Ya tienes cuenta? <Link to="/professional-login" className="text-purple-600 font-bold hover:underline">Inicia Sesión</Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default ProfessionalSignupPage;