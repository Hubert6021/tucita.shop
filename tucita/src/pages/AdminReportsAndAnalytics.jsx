import React from 'react';
import { Helmet } from 'react-helmet';
import { BarChart, TrendingUp, Users, DollarSign } from 'lucide-react';

const AdminReportsAndAnalytics = () => {
  return (
    <div className="min-h-screen bg-slate-50 p-6">
      <Helmet>
        <title>Reportes y Análisis - Administrador</title>
      </Helmet>

      <div className="max-w-7xl mx-auto">
        <h1 className="text-3xl font-bold text-slate-900 mb-8">Reportes y Análisis</h1>

        {/* Charts Placeholder - Using simple CSS bars for demo since no chart lib allowed outside explicit list */}
        <div className="grid md:grid-cols-2 gap-8 mb-8">
            <div className="bg-white p-6 rounded-xl shadow-sm">
                <h3 className="font-bold text-slate-800 mb-6 flex items-center">
                    <TrendingUp className="h-5 w-5 mr-2 text-blue-600" /> 
                    Ingresos Mensuales
                </h3>
                <div className="h-64 flex items-end justify-between gap-2 px-4">
                    {[40, 65, 45, 80, 55, 90].map((h, i) => (
                        <div key={i} className="w-full bg-blue-100 rounded-t-lg relative group">
                            <div 
                                style={{ height: `${h}%` }} 
                                className="absolute bottom-0 w-full bg-blue-600 rounded-t-lg transition-all duration-500 group-hover:bg-blue-700"
                            ></div>
                            <div className="absolute -bottom-6 w-full text-center text-xs text-slate-500">
                                {['Jul', 'Ago', 'Sep', 'Oct', 'Nov', 'Dic'][i]}
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            <div className="bg-white p-6 rounded-xl shadow-sm">
                <h3 className="font-bold text-slate-800 mb-6 flex items-center">
                    <Users className="h-5 w-5 mr-2 text-purple-600" /> 
                    Nuevos Clientes vs Profesionales
                </h3>
                <div className="h-64 flex items-end justify-between gap-4 px-4">
                     {[30, 50, 40, 70, 45, 85].map((h, i) => (
                        <div key={i} className="w-full flex gap-1 h-full items-end">
                            <div style={{ height: `${h}%` }} className="w-1/2 bg-purple-500 rounded-t-sm"></div>
                            <div style={{ height: `${h * 0.4}%` }} className="w-1/2 bg-slate-300 rounded-t-sm"></div>
                        </div>
                    ))}
                </div>
                <div className="flex justify-center gap-4 mt-6 text-sm">
                    <div className="flex items-center"><div className="w-3 h-3 bg-purple-500 mr-2 rounded"></div> Clientes</div>
                    <div className="flex items-center"><div className="w-3 h-3 bg-slate-300 mr-2 rounded"></div> Profesionales</div>
                </div>
            </div>
        </div>

        {/* Top Lists */}
        <div className="grid md:grid-cols-2 gap-8">
             <div className="bg-white p-6 rounded-xl shadow-sm">
                <h3 className="font-bold text-slate-800 mb-4">Servicios Más Solicitados</h3>
                <div className="space-y-4">
                    {[
                        { name: "Corte de Cabello", count: 145, pct: "85%" },
                        { name: "Manicura Gel", count: 120, pct: "70%" },
                        { name: "Barbería Completa", count: 98, pct: "55%" },
                        { name: "Mechas Balayage", count: 76, pct: "40%" },
                    ].map((item, i) => (
                        <div key={i}>
                            <div className="flex justify-between text-sm mb-1">
                                <span className="font-medium text-slate-700">{item.name}</span>
                                <span className="text-slate-500">{item.count} reservas</span>
                            </div>
                            <div className="w-full bg-slate-100 rounded-full h-2">
                                <div style={{ width: item.pct }} className="bg-blue-500 h-2 rounded-full"></div>
                            </div>
                        </div>
                    ))}
                </div>
             </div>

             <div className="bg-white p-6 rounded-xl shadow-sm">
                <h3 className="font-bold text-slate-800 mb-4">Profesionales Top</h3>
                <div className="space-y-4">
                    {[
                        { name: "Sofía Martínez", rating: 4.9, revenue: "€3,450" },
                        { name: "Carlos Ruiz", rating: 4.8, revenue: "€2,890" },
                        { name: "Ana García", rating: 5.0, revenue: "€2,100" },
                    ].map((pro, i) => (
                        <div key={i} className="flex items-center justify-between p-3 bg-slate-50 rounded-lg">
                            <div className="flex items-center gap-3">
                                <div className="w-8 h-8 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center font-bold text-sm">
                                    {i + 1}
                                </div>
                                <div>
                                    <p className="font-medium text-slate-900">{pro.name}</p>
                                    <p className="text-xs text-slate-500">Calificación: {pro.rating}</p>
                                </div>
                            </div>
                            <span className="font-bold text-slate-700">{pro.revenue}</span>
                        </div>
                    ))}
                </div>
             </div>
        </div>
      </div>
    </div>
  );
};

export default AdminReportsAndAnalytics;