import React, { useState } from 'react';
import { Helmet } from 'react-helmet';
import { Edit2, Trash2, Plus, Check, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { services as initialServices } from '@/data/mockData';

const AdminCategoryManagement = () => {
  // Extract unique categories from services mock data
  const initialCategories = [...new Set(initialServices.map(s => s.category))].map((name, idx) => ({
      id: idx + 1,
      name,
      description: `Servicios relacionados con ${name.toLowerCase()}`,
      status: 'active'
  }));

  const [categories, setCategories] = useState(initialCategories);
  const [isEditing, setIsEditing] = useState(null);
  const [newCategoryName, setNewCategoryName] = useState('');

  const handleDelete = (id) => {
    if(window.confirm('¿Desea eliminar esta categoría?')) {
        setCategories(categories.filter(c => c.id !== id));
    }
  };

  const handleAdd = () => {
    if (!newCategoryName.trim()) return;
    const newCat = {
        id: Date.now(),
        name: newCategoryName,
        description: 'Nueva categoría',
        status: 'active'
    };
    setCategories([...categories, newCat]);
    setNewCategoryName('');
  };

  return (
    <div className="min-h-screen bg-slate-50 p-6">
      <Helmet>
        <title>Gestión de Categorías - Administrador</title>
      </Helmet>

      <div className="max-w-5xl mx-auto">
        <h1 className="text-3xl font-bold text-slate-900 mb-8">Categorías de Servicio</h1>

        <div className="bg-white rounded-xl shadow-sm p-6 mb-8">
            <h2 className="text-lg font-bold mb-4">Añadir Nueva Categoría</h2>
            <div className="flex gap-4">
                <input 
                    type="text" 
                    placeholder="Nombre de la categoría" 
                    className="flex-1 p-2 border rounded-lg text-gray-900"
                    value={newCategoryName}
                    onChange={(e) => setNewCategoryName(e.target.value)}
                />
                <Button onClick={handleAdd} className="bg-blue-600 hover:bg-blue-700 text-white">
                    <Plus className="h-4 w-4 mr-2" /> Agregar
                </Button>
            </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm overflow-hidden">
            <table className="w-full text-left">
                <thead className="bg-slate-50 border-b">
                    <tr>
                        <th className="p-4 text-sm font-semibold text-slate-500">Nombre</th>
                        <th className="p-4 text-sm font-semibold text-slate-500">Descripción</th>
                        <th className="p-4 text-sm font-semibold text-slate-500">Estado</th>
                        <th className="p-4 text-sm font-semibold text-slate-500 text-right">Acciones</th>
                    </tr>
                </thead>
                <tbody className="divide-y">
                    {categories.map((cat) => (
                        <tr key={cat.id}>
                            <td className="p-4 font-medium">{cat.name}</td>
                            <td className="p-4 text-sm text-gray-500">{cat.description}</td>
                            <td className="p-4">
                                <span className="px-2 py-1 bg-green-100 text-green-700 rounded-full text-xs font-semibold">
                                    {cat.status === 'active' ? 'Activo' : 'Inactivo'}
                                </span>
                            </td>
                            <td className="p-4 text-right">
                                <button className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg mr-2">
                                    <Edit2 className="h-4 w-4" />
                                </button>
                                <button onClick={() => handleDelete(cat.id)} className="p-2 text-red-600 hover:bg-red-50 rounded-lg">
                                    <Trash2 className="h-4 w-4" />
                                </button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
      </div>
    </div>
  );
};

export default AdminCategoryManagement;