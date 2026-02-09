import React, { useState, useEffect } from 'react';
import { Helmet } from 'react-helmet';
import { Search, MoreHorizontal, UserX, UserCheck } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useToast } from '@/components/ui/use-toast';

const AdminCustomerManagement = () => {
  const [customers, setCustomers] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const { toast } = useToast();

  useEffect(() => {
    // Load customers from localStorage
    const storedUsers = localStorage.getItem('users');
    if (storedUsers) {
      setCustomers(JSON.parse(storedUsers));
    }
  }, []);

  const toggleStatus = (id) => {
    const updatedCustomers = customers.map(c => 
        c.id === id ? { ...c, status: c.status === 'active' ? 'inactive' : 'active' } : c
    );
    setCustomers(updatedCustomers);
    localStorage.setItem('users', JSON.stringify(updatedCustomers));
    
    toast({
        title: "Estado Actualizado",
        description: "El estado del cliente ha sido modificado.",
    });
  };

  const filteredCustomers = customers.filter(c => 
    (c.name?.toLowerCase().includes(searchTerm.toLowerCase()) || 
     c.email?.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  return (
    <div className="min-h-screen bg-slate-50 p-6">
      <Helmet>
        <title>Gestión de Clientes - Administrador</title>
      </Helmet>

      <div className="max-w-7xl mx-auto">
        <h1 className="text-3xl font-bold text-slate-900 mb-8">Gestión de Clientes</h1>

        <div className="bg-white rounded-xl shadow-sm overflow-hidden">
            <div className="p-4 border-b flex justify-between items-center">
                <div className="relative w-72">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                    <input 
                        type="text" 
                        placeholder="Buscar cliente por nombre o correo electrónico..." 
                        className="w-full pl-9 pr-4 py-2 border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-900"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />
                </div>
                <div className="text-sm text-slate-500">
                    Total: {customers.length} clientes
                </div>
            </div>

            <table className="w-full text-left border-collapse">
                <thead>
                    <tr className="bg-slate-50 border-b border-slate-200 text-xs uppercase text-slate-500 font-semibold">
                        <th className="p-4">Cliente</th>
                        <th className="p-4">Correo Electrónico</th>
                        <th className="p-4">Teléfono</th>
                        <th className="p-4">Registro</th>
                        <th className="p-4">Estado</th>
                        <th className="p-4 text-right">Acciones</th>
                    </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                    {filteredCustomers.length > 0 ? (
                        filteredCustomers.map((customer) => (
                            <tr key={customer.id} className="hover:bg-slate-50 transition-colors">
                                <td className="p-4 font-medium text-slate-900">{customer.name}</td>
                                <td className="p-4 text-sm text-slate-600">{customer.email}</td>
                                <td className="p-4 text-sm text-slate-600">{customer.phone || 'N/A'}</td>
                                <td className="p-4 text-sm text-slate-600">
                                    {customer.createdAt ? new Date(customer.createdAt).toLocaleDateString() : 'N/A'}
                                </td>
                                <td className="p-4">
                                    <span className={`px-2 py-1 rounded-full text-xs font-semibold ${
                                        customer.status === 'active' ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-700'
                                    }`}>
                                        {customer.status === 'active' ? 'Activo' : 'Inactivo'}
                                    </span>
                                </td>
                                <td className="p-4 text-right">
                                    <Button 
                                        onClick={() => toggleStatus(customer.id)} 
                                        size="sm" 
                                        variant="ghost"
                                        className={customer.status === 'active' ? "text-red-600 hover:bg-red-50" : "text-green-600 hover:bg-green-50"}
                                    >
                                        {customer.status === 'active' ? <UserX className="h-4 w-4 mr-1" /> : <UserCheck className="h-4 w-4 mr-1" />}
                                        {customer.status === 'active' ? 'Desactivar' : 'Activar'}
                                    </Button>
                                </td>
                            </tr>
                        ))
                    ) : (
                        <tr>
                            <td colSpan="6" className="p-8 text-center text-slate-500">
                                No se encontraron clientes.
                            </td>
                        </tr>
                    )}
                </tbody>
            </table>
        </div>
      </div>
    </div>
  );
};

export default AdminCustomerManagement;