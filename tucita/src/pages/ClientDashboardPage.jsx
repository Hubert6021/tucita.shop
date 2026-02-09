
import React from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { LogOut, User, Calendar, History, Settings } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const ClientDashboardPage = () => {
  const { user, signOut } = useAuth();
  const navigate = useNavigate();

  const handleLogout = async () => {
    await signOut();
    navigate('/');
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex justify-between items-center">
          <h1 className="text-2xl font-bold text-gray-900">Mi Panel</h1>
          <Button variant="outline" onClick={handleLogout} className="flex items-center gap-2">
            <LogOut className="h-4 w-4" /> Cerrar Sesión
          </Button>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Welcome Section */}
        <div className="bg-white rounded-lg shadow p-6 mb-8">
          <div className="flex items-center gap-4">
            <div className="h-16 w-16 bg-rose-100 rounded-full flex items-center justify-center">
              <span className="text-2xl font-bold text-rose-600">
                {user?.full_name?.charAt(0).toUpperCase()}
              </span>
            </div>
            <div>
              <h2 className="text-2xl font-bold text-gray-900">Hola, {user?.full_name}</h2>
              <p className="text-gray-500">Bienvenido de nuevo</p>
            </div>
          </div>
          
          <div className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-4 border-t pt-4">
            <div>
              <p className="text-sm font-medium text-gray-500">Email</p>
              <p className="text-gray-900">{user?.email}</p>
            </div>
            <div>
              <p className="text-sm font-medium text-gray-500">Teléfono</p>
              <p className="text-gray-900">{user?.telefono}</p>
            </div>
          </div>
        </div>

        {/* Feature Placeholders */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-white p-6 rounded-lg shadow border-l-4 border-rose-500">
            <div className="flex items-center gap-3 mb-4">
              <Calendar className="h-6 w-6 text-rose-500" />
              <h3 className="text-lg font-semibold">Mis Citas</h3>
            </div>
            <p className="text-gray-500 mb-4">Gestiona tus próximas citas y reservas.</p>
            <div className="h-20 bg-gray-100 rounded flex items-center justify-center text-gray-400 italic">
              Próximamente
            </div>
          </div>

          <div className="bg-white p-6 rounded-lg shadow border-l-4 border-blue-500">
            <div className="flex items-center gap-3 mb-4">
              <History className="h-6 w-6 text-blue-500" />
              <h3 className="text-lg font-semibold">Historial</h3>
            </div>
            <p className="text-gray-500 mb-4">Consulta los servicios que has recibido.</p>
            <div className="h-20 bg-gray-100 rounded flex items-center justify-center text-gray-400 italic">
              Próximamente
            </div>
          </div>

          <div className="bg-white p-6 rounded-lg shadow border-l-4 border-gray-500">
            <div className="flex items-center gap-3 mb-4">
              <Settings className="h-6 w-6 text-gray-500" />
              <h3 className="text-lg font-semibold">Configuración</h3>
            </div>
            <p className="text-gray-500 mb-4">Actualiza tus datos y preferencias.</p>
            <div className="h-20 bg-gray-100 rounded flex items-center justify-center text-gray-400 italic">
              Próximamente
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default ClientDashboardPage;
