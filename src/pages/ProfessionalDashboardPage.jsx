
import React from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { LogOut, Briefcase, Calendar, Users, Star } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const ProfessionalDashboardPage = () => {
  const { user, signOut } = useAuth();
  const navigate = useNavigate();

  const handleLogout = async () => {
    await signOut();
    navigate('/');
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b border-indigo-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex justify-between items-center">
          <div className="flex items-center gap-2">
            <Briefcase className="h-6 w-6 text-indigo-600" />
            <h1 className="text-2xl font-bold text-gray-900">Panel Profesional</h1>
          </div>
          <Button variant="outline" onClick={handleLogout} className="flex items-center gap-2 hover:bg-indigo-50 hover:text-indigo-700">
            <LogOut className="h-4 w-4" /> Cerrar Sesión
          </Button>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Welcome Section */}
        <div className="bg-white rounded-lg shadow p-6 mb-8 border-l-4 border-indigo-600">
          <div className="flex items-center gap-4">
            <div className="h-16 w-16 bg-indigo-100 rounded-full flex items-center justify-center">
              <span className="text-2xl font-bold text-indigo-600">
                {user?.full_name?.charAt(0).toUpperCase()}
              </span>
            </div>
            <div>
              <h2 className="text-2xl font-bold text-gray-900">Bienvenido, {user?.full_name}</h2>
              <p className="text-gray-500">Administra tu negocio y servicios</p>
            </div>
          </div>
          
          <div className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-4 border-t pt-4">
            <div>
              <p className="text-sm font-medium text-gray-500">Email Profesional</p>
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
          <div className="bg-white p-6 rounded-lg shadow transition hover:shadow-md">
            <div className="flex items-center gap-3 mb-4 text-indigo-600">
              <Calendar className="h-6 w-6" />
              <h3 className="text-lg font-semibold text-gray-900">Agenda</h3>
            </div>
            <p className="text-gray-500 mb-4">Visualiza y administra tus citas programadas.</p>
            <div className="h-24 border-2 border-dashed border-gray-200 rounded flex items-center justify-center text-gray-400">
              Calendario Interactivo
            </div>
          </div>

          <div className="bg-white p-6 rounded-lg shadow transition hover:shadow-md">
            <div className="flex items-center gap-3 mb-4 text-indigo-600">
              <Users className="h-6 w-6" />
              <h3 className="text-lg font-semibold text-gray-900">Servicios</h3>
            </div>
            <p className="text-gray-500 mb-4">Configura tu catálogo de servicios y precios.</p>
            <div className="h-24 border-2 border-dashed border-gray-200 rounded flex items-center justify-center text-gray-400">
              Lista de Servicios
            </div>
          </div>

          <div className="bg-white p-6 rounded-lg shadow transition hover:shadow-md">
            <div className="flex items-center gap-3 mb-4 text-indigo-600">
              <Star className="h-6 w-6" />
              <h3 className="text-lg font-semibold text-gray-900">Reputación</h3>
            </div>
            <p className="text-gray-500 mb-4">Revisa las calificaciones y comentarios.</p>
            <div className="h-24 border-2 border-dashed border-gray-200 rounded flex items-center justify-center text-gray-400">
              Reseñas y Calificaciones
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default ProfessionalDashboardPage;
