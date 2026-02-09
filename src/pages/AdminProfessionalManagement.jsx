import React, { useState, useEffect } from 'react';
import { Helmet } from 'react-helmet';
import { Search, Filter, Eye, Check, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import ProfessionalDetailsModal from '@/components/ProfessionalDetailsModal';
import { professionals as initialPros } from '@/data/mockData';
import { useToast } from '@/components/ui/use-toast';

const AdminProfessionalManagement = () => {
  const [professionals, setProfessionals] = useState([]);
  const [activeTab, setActiveTab] = useState('pending');
  const [selectedPro, setSelectedPro] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const { toast } = useToast();

  useEffect(() => {
    // Load professionals from localStorage or use initial mock data
    const storedPros = localStorage.getItem('professionals');
    if (storedPros) {
      setProfessionals(JSON.parse(storedPros));
    } else {
      setProfessionals(initialPros);
      localStorage.setItem('professionals', JSON.stringify(initialPros));
    }
  }, []);

  const handleStatusChange = (id, newStatus, reason = null) => {
    const updatedPros = professionals.map(pro => 
      pro.id === id ? { ...pro, status: newStatus, rejectionReason: reason } : pro
    );
    setProfessionals(updatedPros);
    localStorage.setItem('professionals', JSON.stringify(updatedPros));
    
    toast({
      title: "Estado Actualizado",
      description: `El profesional ha sido ${newStatus === 'approved' ? 'aprobado' : newStatus === 'rejected' ? 'rechazado' : 'suspendido'}.`,
    });
  };

  const handleDelete = (id) => {
    if (window.confirm("¿Está seguro de que desea eliminar este profesional? Esta acción no se puede deshacer.")) {
        const updatedPros = professionals.filter(pro => pro.id !== id);
        setProfessionals(updatedPros);
        localStorage.setItem('professionals', JSON.stringify(updatedPros));
        setSelectedPro(null);
        toast({
            title: "Eliminado",
            description: "Profesional eliminado correctamente.",
        });
    }
  };

  const filteredPros = professionals.filter(pro => {
    const matchesTab = activeTab === 'pending' ? pro.status === 'pending' : pro.status !== 'pending';
    const matchesSearch = pro.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
                          pro.email.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesTab && matchesSearch;
  });

  return (
    <div className="min-h-screen bg-slate-50 p-6">
      <Helmet>
        <title>Gestión de Profesionales - Administrador</title>
      </Helmet>

      <div className="max-w-7xl mx-auto">
        <h1 className="text-3xl font-bold text-slate-900 mb-8">Gestión de Profesionales</h1>

        {/* Tabs */}
        <div className="flex space-x-1 bg-slate-200 p-1 rounded-lg w-fit mb-6">
          <button
            onClick={() => setActiveTab('pending')}
            className={`px-4 py-2 rounded-md text-sm font-medium transition-all ${
              activeTab === 'pending' ? 'bg-white shadow text-blue-600' : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            Pendientes de Verificación ({professionals.filter(p => p.status === 'pending').length})
          </button>
          <button
            onClick={() => setActiveTab('approved')}
            className={`px-4 py-2 rounded-md text-sm font-medium transition-all ${
              activeTab === 'approved' ? 'bg-white shadow text-blue-600' : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            Profesionales Aprobados
          </button>
        </div>

        {/* Search & Filters */}
        <div className="bg-white p-4 rounded-t-xl border-b flex justify-between items-center">
            <div className="relative w-64">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                <input 
                    type="text" 
                    placeholder="Buscar por nombre..." 
                    className="w-full pl-9 pr-4 py-2 border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-900"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                />
            </div>
            {activeTab === 'approved' && (
                <Button variant="outline" size="sm">
                    <Filter className="h-4 w-4 mr-2" /> Filtros
                </Button>
            )}
        </div>

        {/* Table */}
        <div className="bg-white rounded-b-xl shadow-sm overflow-hidden">
            <table className="w-full text-left border-collapse">
                <thead>
                    <tr className="bg-slate-50 border-b border-slate-200 text-xs uppercase text-slate-500 font-semibold">
                        <th className="p-4">Profesional</th>
                        <th className="p-4">Categoría</th>
                        <th className="p-4">Ubicación</th>
                        <th className="p-4">Registro</th>
                        {activeTab === 'approved' && <th className="p-4">Estado</th>}
                        <th className="p-4 text-right">Acciones</th>
                    </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                    {filteredPros.length > 0 ? (
                        filteredPros.map((pro) => (
                            <tr key={pro.id} className="hover:bg-slate-50 transition-colors">
                                <td className="p-4">
                                    <div className="flex items-center gap-3">
                                        <div className="w-10 h-10 rounded-full bg-slate-200 overflow-hidden">
                                            <img src={pro.image} alt={pro.name} className="w-full h-full object-cover" />
                                        </div>
                                        <div>
                                            <p className="font-medium text-slate-900">{pro.name}</p>
                                            <p className="text-xs text-slate-500">{pro.email}</p>
                                        </div>
                                    </div>
                                </td>
                                <td className="p-4 text-sm text-slate-600">{pro.specialty}</td>
                                <td className="p-4 text-sm text-slate-600">{pro.location || pro.city || 'N/A'}</td>
                                <td className="p-4 text-sm text-slate-600">{pro.registrationDate || 'N/A'}</td>
                                {activeTab === 'approved' && (
                                    <td className="p-4">
                                        <span className={`px-2 py-1 rounded-full text-xs font-semibold ${
                                            pro.status === 'approved' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'
                                        }`}>
                                            {pro.status === 'approved' ? 'Activo' : pro.status}
                                        </span>
                                    </td>
                                )}
                                <td className="p-4 text-right">
                                    <Button onClick={() => setSelectedPro(pro)} size="sm" variant="ghost" className="text-blue-600 hover:bg-blue-50">
                                        <Eye className="h-4 w-4 mr-1" /> Detalles
                                    </Button>
                                </td>
                            </tr>
                        ))
                    ) : (
                        <tr>
                            <td colSpan="6" className="p-8 text-center text-slate-500">
                                No se encontraron profesionales.
                            </td>
                        </tr>
                    )}
                </tbody>
            </table>
        </div>

        {selectedPro && (
            <ProfessionalDetailsModal 
                professional={selectedPro} 
                onClose={() => setSelectedPro(null)} 
                onStatusChange={handleStatusChange}
                onDelete={handleDelete}
            />
        )}
      </div>
    </div>
  );
};

export default AdminProfessionalManagement;