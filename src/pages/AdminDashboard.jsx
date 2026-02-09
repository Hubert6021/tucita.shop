import React, { useEffect, useState } from 'react';
import { Helmet } from 'react-helmet';
import { Link } from 'react-router-dom';
import { Users, Briefcase, Calendar, DollarSign, ArrowRight, Activity } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/contexts/AuthContext';
import { professionals as initialPros } from '@/data/mockData';

const AdminDashboard = () => {
  const { currentUser } = useAuth();
  const [stats, setStats] = useState({
      pros: 0,
      customers: 0,
      appointments: 0,
      revenue: 0
  });

  useEffect(() => {
    // Load data from localStorage or mock
    const pros = JSON.parse(localStorage.getItem('professionals') || JSON.stringify(initialPros));
    const users = JSON.parse(localStorage.getItem('users') || '[]');
    const bookings = JSON.parse(localStorage.getItem('bookings') || '[]');

    const revenue = bookings.reduce((acc, curr) => acc + (parseFloat(curr.price) || 0), 0);

    setStats({
        pros: pros.length,
        customers: users.length,
        appointments: bookings.length,
        revenue: revenue
    });
  }, []);

  return (
    <div className="min-h-screen bg-slate-50 p-6">
      <Helmet>
        <title>Panel de Administración - TuCita</title>
      </Helmet>

      <div className="max-w-7xl mx-auto">
        <div className="mb-8">
            <h1 className="text-3xl font-bold text-slate-900">Panel de Control</h1>
            <p className="text-slate-500">Bienvenido de nuevo, {currentUser?.name}</p>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-100 flex items-center justify-between">
                <div>
                    <p className="text-sm font-medium text-slate-500">Profesionales</p>
                    <h3 className="text-3xl font-bold text-slate-800">{stats.pros}</h3>
                </div>
                <div className="p-3 bg-blue-100 text-blue-600 rounded-lg">
                    <Briefcase className="h-6 w-6" />
                </div>
            </div>
            <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-100 flex items-center justify-between">
                <div>
                    <p className="text-sm font-medium text-slate-500">Clientes</p>
                    <h3 className="text-3xl font-bold text-slate-800">{stats.customers}</h3>
                </div>
                <div className="p-3 bg-emerald-100 text-emerald-600 rounded-lg">
                    <Users className="h-6 w-6" />
                </div>
            </div>
            <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-100 flex items-center justify-between">
                <div>
                    <p className="text-sm font-medium text-slate-500">Citas Totales</p>
                    <h3 className="text-3xl font-bold text-slate-800">{stats.appointments}</h3>
                </div>
                <div className="p-3 bg-purple-100 text-purple-600 rounded-lg">
                    <Calendar className="h-6 w-6" />
                </div>
            </div>
            <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-100 flex items-center justify-between">
                <div>
                    <p className="text-sm font-medium text-slate-500">Ingresos Est.</p>
                    <h3 className="text-3xl font-bold text-slate-800">{stats.revenue.toLocaleString()}€</h3>
                </div>
                <div className="p-3 bg-amber-100 text-amber-600 rounded-lg">
                    <DollarSign className="h-6 w-6" />
                </div>
            </div>
        </div>

        {/* Quick Links */}
        <div className="grid md:grid-cols-2 gap-6">
            <div className="bg-gradient-to-br from-blue-600 to-indigo-700 rounded-2xl p-8 text-white shadow-lg">
                <h3 className="text-xl font-bold mb-2">Gestión de Profesionales</h3>
                <p className="text-blue-100 mb-6">Revisar solicitudes pendientes, verificar documentos y gestionar cuentas.</p>
                <Link to="/admin/professionals">
                    <Button variant="secondary" className="bg-white text-blue-700 hover:bg-blue-50">
                        Gestionar <ArrowRight className="h-4 w-4 ml-2" />
                    </Button>
                </Link>
            </div>

            <div className="bg-white rounded-2xl p-8 shadow-md border border-slate-100">
                <h3 className="text-xl font-bold text-slate-800 mb-4">Accesos Rápidos</h3>
                <div className="grid grid-cols-2 gap-4">
                    <Link to="/admin/customers" className="block p-4 rounded-lg bg-slate-50 hover:bg-slate-100 transition-colors">
                        <Users className="h-6 w-6 text-slate-600 mb-2" />
                        <span className="font-medium text-slate-900">Clientes</span>
                    </Link>
                    <Link to="/admin/categories" className="block p-4 rounded-lg bg-slate-50 hover:bg-slate-100 transition-colors">
                        <Briefcase className="h-6 w-6 text-slate-600 mb-2" />
                        <span className="font-medium text-slate-900">Categorías</span>
                    </Link>
                    <Link to="/admin/reports" className="block p-4 rounded-lg bg-slate-50 hover:bg-slate-100 transition-colors">
                        <Activity className="h-6 w-6 text-slate-600 mb-2" />
                        <span className="font-medium text-slate-900">Reportes</span>
                    </Link>
                    <div className="block p-4 rounded-lg bg-slate-50 opacity-50 cursor-not-allowed">
                        <span className="font-medium text-slate-400">Configuración</span>
                    </div>
                </div>
            </div>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;