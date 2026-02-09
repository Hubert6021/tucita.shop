import React, { useState, useEffect } from 'react';
import { useSupabase } from '@/hooks/useSupabase';
import { Button } from '@/components/ui/button';
import { useToast } from '@/components/ui/use-toast';
import { Plus, Trash2, Edit2, Loader2, Clock, DollarSign, X, AlertCircle, Scissors } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";

const ServiceManagement = ({ professionalId }) => {
  const { getServices, addService, updateService, deleteService, loading } = useSupabase();
  const { toast } = useToast();

  const [services, setServices] = useState([]);
  const [initialLoading, setInitialLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingService, setEditingService] = useState(null);
  
  // Form State
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    category: '',
    price: '',
    duration: 30
  });
  const [formErrors, setFormErrors] = useState({});

  useEffect(() => {
    if (professionalId) {
      loadServices();
    }
  }, [professionalId]);

  const loadServices = async () => {
    setInitialLoading(true);
    const result = await getServices(professionalId);
    if (result.success) {
      setServices(result.data);
      setError(null);
    } else {
      setError("No se pudieron cargar los servicios. Por favor intenta de nuevo.");
    }
    setInitialLoading(false);
  };

  const validateForm = () => {
    const errors = {};
    if (!formData.name?.trim()) errors.name = "El nombre del servicio es obligatorio.";
    if (!formData.price || formData.price < 0) errors.price = "El precio debe ser un número válido (0 o mayor).";
    if (!formData.duration || formData.duration <= 0) errors.duration = "La duración es obligatoria y debe ser mayor a 0.";
    
    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    // Clear error when user types
    if (formErrors[name]) {
      setFormErrors(prev => ({ ...prev, [name]: null }));
    }
  };

  const handleOpenAdd = () => {
    setEditingService(null);
    setFormData({ name: '', description: '', category: '', price: '', duration: 30 });
    setFormErrors({});
    setIsFormOpen(true);
  };

  const handleOpenEdit = (service) => {
    setEditingService(service);
    setFormData({
      name: service.name,
      description: service.description || '',
      category: service.category || '',
      price: service.price,
      duration: service.duration
    });
    setFormErrors({});
    setIsFormOpen(true);
  };

  const handleCloseForm = () => {
    setIsFormOpen(false);
    setEditingService(null);
    setFormErrors({});
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) {
      toast({ title: "Error de validación", description: "Por favor revisa los campos marcados en rojo.", variant: "destructive" });
      return;
    }

    let result;
    if (editingService) {
      result = await updateService(editingService.id, formData);
    } else {
      result = await addService(professionalId, formData);
    }

    if (result.success) {
      toast({ 
        title: editingService ? "Servicio actualizado" : "Servicio creado", 
        description: editingService ? "Los cambios se han guardado." : "El nuevo servicio está disponible.",
        className: "bg-green-50 text-green-900" 
      });
      loadServices();
      handleCloseForm();
    }
  };

  const handleDelete = async (id) => {
    const result = await deleteService(id);
    if (result.success) {
      toast({ title: "Servicio eliminado", description: "El servicio ha sido removido de tu lista." });
      setServices(prev => prev.filter(s => s.id !== id));
    }
  };

  if (initialLoading) {
    return <div className="p-8 text-center flex justify-center"><Loader2 className="h-8 w-8 animate-spin text-gray-400" /></div>;
  }

  if (error) {
    return (
      <div className="p-6 bg-red-50 text-red-700 rounded-lg flex items-center justify-between">
        <span className="flex items-center gap-2"><AlertCircle className="h-5 w-5"/> {error}</span>
        <Button variant="outline" onClick={loadServices} className="bg-white border-red-200 hover:bg-red-100">Reintentar</Button>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
      <div className="p-6 border-b border-gray-100 flex justify-between items-center bg-gray-50/50">
        <div>
           <h2 className="text-xl font-bold text-gray-900">Mis Servicios</h2>
           <p className="text-sm text-gray-500">Administra los servicios que ofreces a tus clientes</p>
        </div>
        {!isFormOpen && (
          <Button onClick={handleOpenAdd} className="bg-blue-600 hover:bg-blue-700 text-white shadow-sm">
            <Plus className="w-4 h-4 mr-2" /> Añadir Servicio
          </Button>
        )}
      </div>

      <div className="p-6">
        <AnimatePresence>
          {isFormOpen && (
            <motion.div 
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              className="mb-8"
            >
              <div className="bg-blue-50/50 border border-blue-100 rounded-xl p-6 shadow-sm">
                <div className="flex justify-between items-center mb-4">
                  <h3 className="font-semibold text-lg text-blue-900">{editingService ? 'Editar Servicio' : 'Nuevo Servicio'}</h3>
                  <Button variant="ghost" size="icon" onClick={handleCloseForm} className="text-gray-400 hover:text-gray-600">
                    <X className="w-5 h-5" />
                  </Button>
                </div>

                <form onSubmit={handleSubmit} className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <label className="text-sm font-medium text-gray-700">Nombre del Servicio *</label>
                      <input 
                        name="name"
                        value={formData.name}
                        onChange={handleInputChange}
                        className={`w-full p-2.5 bg-white border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all ${formErrors.name ? 'border-red-300 ring-1 ring-red-100' : 'border-gray-200'}`}
                        placeholder="Ej. Corte de Cabello Premium"
                      />
                      {formErrors.name && <p className="text-xs text-red-600">{formErrors.name}</p>}
                    </div>

                    <div className="space-y-2">
                       <label className="text-sm font-medium text-gray-700">Categoría</label>
                       <input 
                         name="category"
                         value={formData.category}
                         onChange={handleInputChange}
                         className="w-full p-2.5 bg-white border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                         placeholder="Ej. Peluquería, Spa, Uñas..."
                       />
                    </div>

                    <div className="space-y-2">
                      <label className="text-sm font-medium text-gray-700">Precio (€) *</label>
                      <div className="relative">
                        <DollarSign className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                        <input 
                          type="number"
                          name="price"
                          value={formData.price}
                          onChange={handleInputChange}
                          className={`w-full pl-9 p-2.5 bg-white border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${formErrors.price ? 'border-red-300 ring-1 ring-red-100' : 'border-gray-200'}`}
                          placeholder="0.00"
                          step="0.01"
                          min="0"
                        />
                      </div>
                      {formErrors.price && <p className="text-xs text-red-600">{formErrors.price}</p>}
                    </div>

                    <div className="space-y-2">
                      <label className="text-sm font-medium text-gray-700">Duración (minutos) *</label>
                      <div className="relative">
                        <Clock className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                        <input 
                          type="number"
                          name="duration"
                          value={formData.duration}
                          onChange={handleInputChange}
                          className={`w-full pl-9 p-2.5 bg-white border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${formErrors.duration ? 'border-red-300 ring-1 ring-red-100' : 'border-gray-200'}`}
                          placeholder="30"
                          min="5"
                          step="5"
                        />
                      </div>
                      {formErrors.duration && <p className="text-xs text-red-600">{formErrors.duration}</p>}
                    </div>
                  </div>

                  <div className="space-y-2">
                    <label className="text-sm font-medium text-gray-700">Descripción</label>
                    <textarea 
                      name="description"
                      value={formData.description}
                      onChange={handleInputChange}
                      className="w-full p-2.5 bg-white border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 h-24 resize-none"
                      placeholder="Describe qué incluye el servicio..."
                    />
                  </div>

                  <div className="flex justify-end gap-3 pt-2">
                    <Button type="button" variant="outline" onClick={handleCloseForm} className="border-gray-200">Cancelar</Button>
                    <Button type="submit" disabled={loading} className="bg-blue-600 hover:bg-blue-700 text-white">
                      {loading && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
                      {editingService ? 'Guardar Cambios' : 'Crear Servicio'}
                    </Button>
                  </div>
                </form>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        <div className="space-y-4">
          {services.length === 0 && !isFormOpen && (
            <div className="text-center py-12 px-4 rounded-xl border-2 border-dashed border-gray-200 bg-gray-50/50">
              <div className="w-12 h-12 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-3">
                 <Scissors className="h-6 w-6 text-gray-400" />
              </div>
              <h3 className="text-lg font-medium text-gray-900 mb-1">No tienes servicios aún</h3>
              <p className="text-gray-500 mb-6 max-w-sm mx-auto">Comienza agregando los servicios que ofreces para que tus clientes puedan reservar.</p>
              <Button onClick={handleOpenAdd} variant="outline" className="border-blue-200 text-blue-700 hover:bg-blue-50">
                <Plus className="w-4 h-4 mr-2" /> Agregar mi primer servicio
              </Button>
            </div>
          )}

          <div className="grid grid-cols-1 gap-4">
            {services.map(service => (
              <motion.div 
                key={service.id} 
                layout
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-white border border-gray-100 rounded-xl p-5 shadow-sm hover:shadow-md transition-shadow flex flex-col md:flex-row justify-between items-start md:items-center gap-4 group"
              >
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-1">
                    <h3 className="font-bold text-gray-900 text-lg">{service.name}</h3>
                    {service.category && (
                      <span className="text-xs px-2 py-0.5 rounded-full bg-gray-100 text-gray-600 border border-gray-200">
                        {service.category}
                      </span>
                    )}
                  </div>
                  <p className="text-gray-500 text-sm mb-3 line-clamp-2">{service.description || "Sin descripción"}</p>
                  
                  <div className="flex items-center gap-4 text-sm">
                    <span className="flex items-center text-blue-700 font-semibold bg-blue-50 px-2 py-1 rounded-md">
                      <DollarSign className="w-3.5 h-3.5 mr-1" /> {Number(service.price).toFixed(2)}
                    </span>
                    <span className="flex items-center text-gray-600 bg-gray-100 px-2 py-1 rounded-md">
                      <Clock className="w-3.5 h-3.5 mr-1" /> {service.duration} min
                    </span>
                  </div>
                </div>

                <div className="flex items-center gap-2 self-end md:self-center opacity-100 md:opacity-0 group-hover:opacity-100 transition-opacity">
                  <Button 
                    size="sm" 
                    variant="outline" 
                    onClick={() => handleOpenEdit(service)}
                    className="h-9 px-3 border-gray-200 hover:bg-gray-50 text-gray-700"
                  >
                    <Edit2 className="w-4 h-4 mr-2" /> Editar
                  </Button>

                  <AlertDialog>
                    <AlertDialogTrigger asChild>
                      <Button 
                        size="sm" 
                        variant="ghost" 
                        className="h-9 w-9 p-0 text-red-500 hover:text-red-600 hover:bg-red-50"
                      >
                         <Trash2 className="w-4 h-4" />
                      </Button>
                    </AlertDialogTrigger>
                    <AlertDialogContent>
                      <AlertDialogHeader>
                        <AlertDialogTitle>¿Eliminar servicio?</AlertDialogTitle>
                        <AlertDialogDescription>
                          Esta acción no se puede deshacer. El servicio "{service.name}" dejará de estar disponible para futuras reservas.
                        </AlertDialogDescription>
                      </AlertDialogHeader>
                      <AlertDialogFooter>
                        <AlertDialogCancel>Cancelar</AlertDialogCancel>
                        <AlertDialogAction onClick={() => handleDelete(service.id)} className="bg-red-600 hover:bg-red-700">
                          Eliminar
                        </AlertDialogAction>
                      </AlertDialogFooter>
                    </AlertDialogContent>
                  </AlertDialog>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ServiceManagement;