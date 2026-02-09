import { useState, useCallback } from 'react';
import { supabase } from '@/lib/customSupabaseClient';
import { useToast } from '@/components/ui/use-toast';

export const useSupabase = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const { toast } = useToast();

  const logOperation = (operation, details) => {
    console.group(`Supabase Operation: ${operation}`);
    console.log('Timestamp:', new Date().toISOString());
    console.log('Details:', details);
    console.groupEnd();
  };

  const handleError = (error, customMessage, operationData = {}) => {
    console.group('Supabase Error Log');
    console.error("Error Object:", error);
    console.error("Operation Data:", operationData);
    console.groupEnd();

    setError(error);
    
    let displayMessage = customMessage || error.message || "Ha ocurrido un error inesperado";
    
    if (error.code === '23505') displayMessage = "Este registro ya existe.";
    if (error.code === '42501') displayMessage = "No tienes permisos para realizar esta acción.";
    if (error.code === 'PGRST116') displayMessage = "No se encontraron datos.";
    
    if (error.message?.includes('FunctionsFetchError') || error.message?.includes('Failed to fetch')) {
      displayMessage = "Error de conexión con el servidor. Por favor intenta nuevamente.";
    }

    toast({
      title: "Error",
      description: displayMessage,
      variant: "destructive"
    });
    setLoading(false);
    return { success: false, error: displayMessage };
  };

  // --- Services Management (Task 2 & 5) ---

  const getServices = useCallback(async (professionalId) => {
    logOperation('getServices', { professionalId });
    setLoading(true);
    try {
      if (!professionalId) throw new Error('Professional ID is required to fetch services');

      const { data, error } = await supabase
        .from('services')
        .select('*')
        .eq('professional_id', professionalId)
        .order('created_at', { ascending: false });
      
      logOperation('getServices Response', { count: data?.length, error });

      if (error) throw error;
      setLoading(false);
      return { success: true, data };
    } catch (err) {
      return handleError(err, "Error al cargar servicios", { professionalId });
    }
  }, [toast]);

  const addService = useCallback(async (professionalId, serviceData) => {
    logOperation('addService', { professionalId, serviceData });
    setLoading(true);
    
    try {
      // 1. Validation
      if (!professionalId) throw new Error('Professional ID missing');
      if (!serviceData.name) throw new Error('Service name is required');
      if (!serviceData.price || isNaN(serviceData.price) || Number(serviceData.price) < 0) throw new Error('Valid price is required');
      if (!serviceData.duration || isNaN(serviceData.duration) || Number(serviceData.duration) <= 0) throw new Error('Valid duration is required');

      const payload = {
        professional_id: professionalId,
        name: serviceData.name.trim(),
        description: serviceData.description?.trim() || '',
        category: serviceData.category || 'General',
        price: Number(serviceData.price),
        duration: parseInt(serviceData.duration),
        updated_at: new Date().toISOString()
      };

      const { data, error } = await supabase
        .from('services')
        .insert([payload])
        .select()
        .single();

      logOperation('addService Response', { success: !error, data, error });

      if (error) throw error;
      setLoading(false);
      return { success: true, data };
    } catch (err) {
      return handleError(err, err.message || "Error al crear servicio", { professionalId, serviceData });
    }
  }, [toast]);

  const updateService = useCallback(async (serviceId, serviceData) => {
    logOperation('updateService', { serviceId, serviceData });
    setLoading(true);
    try {
      if (!serviceId) throw new Error('Service ID missing');
      
      const payload = {
        updated_at: new Date().toISOString()
      };

      if (serviceData.name) payload.name = serviceData.name.trim();
      if (serviceData.description !== undefined) payload.description = serviceData.description.trim();
      if (serviceData.category) payload.category = serviceData.category;
      if (serviceData.price !== undefined) {
         if(Number(serviceData.price) < 0) throw new Error('Price cannot be negative');
         payload.price = Number(serviceData.price);
      }
      if (serviceData.duration !== undefined) {
         if(Number(serviceData.duration) <= 0) throw new Error('Duration must be positive');
         payload.duration = parseInt(serviceData.duration);
      }

      const { error } = await supabase
        .from('services')
        .update(payload)
        .eq('id', serviceId);

      logOperation('updateService Response', { success: !error, error });

      if (error) throw error;
      setLoading(false);
      return { success: true };
    } catch (err) {
      return handleError(err, err.message || "Error al actualizar servicio", { serviceId, serviceData });
    }
  }, [toast]);

  const deleteService = useCallback(async (serviceId) => {
    logOperation('deleteService', { serviceId });
    setLoading(true);
    try {
      if (!serviceId) throw new Error('Service ID missing');

      const { error } = await supabase
        .from('services')
        .delete()
        .eq('id', serviceId);

      logOperation('deleteService Response', { success: !error, error });

      if (error) throw error;
      setLoading(false);
      return { success: true };
    } catch (err) {
      return handleError(err, "Error al eliminar servicio", { serviceId });
    }
  }, [toast]);

  // --- Other Methods (Kept for compatibility) ---

  const fetchProfessionalById = useCallback(async (id) => {
    setLoading(true);
    try {
      const { data: professional, error: proError } = await supabase
        .from('professionals')
        .select('*')
        .eq('id', id)
        .single();
      if (proError) throw proError;

      const { data: user, error: userError } = await supabase
        .from('users')
        .select('email, full_name, phone')
        .eq('id', id)
        .single();
      if (userError && userError.code !== 'PGRST116') throw userError;

      setLoading(false);
      return { ...professional, users: user, name: user?.full_name, email: user?.email, phone: user?.phone };
    } catch (err) {
      return handleError(err, "Error al cargar datos del profesional");
    }
  }, [toast]);

  const updateProfessionalProfile = useCallback(async (id, updates) => {
    setLoading(true);
    try {
      const { error } = await supabase.from('professionals').update(updates).eq('id', id);
      if (error) throw error;
      setLoading(false);
      return { success: true };
    } catch (err) {
      return handleError(err, "Error al actualizar perfil");
    }
  }, [toast]);

  const fetchAvailability = useCallback(async (professionalId) => {
    setLoading(true);
    try {
      const { data, error } = await supabase.from('availability').select('*').eq('professional_id', professionalId).order('day_of_week');
      if (error) throw error;
      setLoading(false);
      return data;
    } catch (err) {
      return handleError(err, "Error al cargar horarios");
    }
  }, [toast]);

  const updateAvailabilityBatch = useCallback(async (professionalId, availabilityData) => {
    setLoading(true);
    try {
      const { error: delError } = await supabase.from('availability').delete().eq('professional_id', professionalId);
      if (delError) throw delError;
      if (availabilityData.length > 0) {
        const { error: insError } = await supabase.from('availability').insert(availabilityData);
        if (insError) throw insError;
      }
      setLoading(false);
      return { success: true };
    } catch (err) {
      return handleError(err, "Error al guardar horarios");
    }
  }, [toast]);

  const uploadProfessionalPhoto = useCallback(async (userId, file) => {
    setLoading(true);
    try {
      const fileExt = file.name.split('.').pop();
      const fileName = `${userId}-${Date.now()}.${fileExt}`;
      const { error: uploadError } = await supabase.storage.from('professional-photos').upload(fileName, file, { upsert: true });
      if (uploadError) throw uploadError;
      const { data: { publicUrl } } = supabase.storage.from('professional-photos').getPublicUrl(fileName);
      setLoading(false);
      return { success: true, publicUrl };
    } catch (err) {
      return handleError(err, "Error al subir imagen");
    }
  }, [toast]);

  const fetchAppointments = useCallback(async (userId, userType) => {
    setLoading(true);
    try {
      const column = userType === 'professional' ? 'professional_id' : 'customer_id';
      const { data: appointments, error } = await supabase
        .from('appointments')
        .select(`*, service:services (name, duration, price), users (full_name)`)
        .eq(column, userId)
        .order('date', { ascending: false });
      if (error) throw error;
      setLoading(false);
      return appointments;
    } catch (err) {
      return handleError(err, "Error al cargar citas");
    }
  }, [toast]);

  const updateAppointmentStatus = useCallback(async (id, status) => {
    try {
      const { error } = await supabase.from('appointments').update({ status }).eq('id', id);
      if (error) throw error;
      return { success: true };
    } catch (err) {
      return handleError(err, "Error al actualizar la cita");
    }
  }, [toast]);

  // Mapping old names to new standard names if needed, but keeping direct exports for clarity
  const fetchServices = getServices; // Alias for backward compatibility if any
  const createService = addService; // Alias

  return {
    loading,
    error,
    getServices,
    addService,
    updateService,
    deleteService,
    // Legacy/Other exports
    fetchServices,
    createService,
    fetchProfessionalById,
    updateProfessionalProfile,
    fetchAvailability,
    updateAvailabilityBatch,
    uploadProfessionalPhoto,
    fetchAppointments,
    updateAppointmentStatus
  };
};