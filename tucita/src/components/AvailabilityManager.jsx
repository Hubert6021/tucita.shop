import React, { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useSupabase } from '@/hooks/useSupabase';
import { Button } from '@/components/ui/button';
import { useToast } from '@/components/ui/use-toast';
import { Loader2, Save, AlertCircle } from 'lucide-react';
import { cn } from '@/lib/utils';

const DAYS = ['Domingo', 'Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes', 'Sábado'];

const AvailabilityManager = () => {
  const { currentUser } = useAuth();
  const { fetchAvailability, updateAvailabilityBatch, loading } = useSupabase();
  const { toast } = useToast();

  // Local state initialized with defaults to ensure UI renders rows
  const [schedule, setSchedule] = useState(
    DAYS.map((_, idx) => ({
      day_of_week: idx,
      start_time: '09:00',
      end_time: '18:00',
      is_available: idx !== 0 && idx !== 6 // Mon-Fri default
    }))
  );

  useEffect(() => {
    if (currentUser) {
      loadAvailability();
    }
  }, [currentUser]);

  const loadAvailability = async () => {
    const data = await fetchAvailability(currentUser.id);
    if (data && data.length > 0) {
      // Merge fetched data with default structure to ensure all days exist
      const merged = DAYS.map((_, idx) => {
        const found = data.find(d => d.day_of_week === idx);
        return found ? {
          ...found,
          start_time: found.start_time.slice(0, 5), // HH:MM:SS -> HH:MM
          end_time: found.end_time.slice(0, 5)
        } : {
          day_of_week: idx,
          start_time: '09:00',
          end_time: '18:00',
          is_available: false
        };
      });
      setSchedule(merged);
    }
  };

  const handleDayChange = (index, field, value) => {
    const newSchedule = [...schedule];
    newSchedule[index] = { ...newSchedule[index], [field]: value };
    setSchedule(newSchedule);
  };

  const validate = () => {
    for (const day of schedule) {
      if (day.is_available) {
        if (!day.start_time || !day.end_time) return false;
        if (day.start_time >= day.end_time) return false;
      }
    }
    return true;
  };

  const handleSave = async () => {
    if (!validate()) {
      toast({ 
        title: "Error en horario", 
        description: "Asegúrate de que la hora de fin sea posterior a la de inicio en los días activos.", 
        variant: "destructive" 
      });
      return;
    }

    const payload = schedule.map(s => ({
      professional_id: currentUser.id,
      day_of_week: s.day_of_week,
      start_time: s.start_time,
      end_time: s.end_time,
      is_available: s.is_available
    }));

    const { success } = await updateAvailabilityBatch(currentUser.id, payload);
    
    if (success) {
      toast({ title: "Horario guardado", className: "bg-green-50 text-green-900" });
    }
  };

  return (
    <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl font-bold text-gray-900">Horario de Disponibilidad</h2>
        <Button onClick={handleSave} disabled={loading} className="bg-blue-600 hover:bg-blue-700 text-white">
          {loading ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : <Save className="w-4 h-4 mr-2" />}
          Guardar Cambios
        </Button>
      </div>

      <div className="space-y-3">
        {schedule.map((day, index) => (
          <div key={index} className={cn(
            "flex flex-col sm:flex-row items-start sm:items-center gap-4 p-4 rounded-lg border transition-colors",
            day.is_available ? "bg-white border-gray-200 shadow-sm" : "bg-gray-50 border-gray-100 opacity-80"
          )}>
            <div className="flex items-center gap-3 min-w-[150px]">
              <input
                type="checkbox"
                checked={day.is_available}
                onChange={(e) => handleDayChange(index, 'is_available', e.target.checked)}
                className="w-5 h-5 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
              />
              <span className={cn("font-medium", day.is_available ? "text-gray-900" : "text-gray-500")}>
                {DAYS[day.day_of_week]}
              </span>
            </div>

            {day.is_available && (
              <div className="flex items-center gap-3">
                <input
                  type="time"
                  value={day.start_time}
                  onChange={(e) => handleDayChange(index, 'start_time', e.target.value)}
                  className="p-2 border rounded-md text-sm"
                />
                <span className="text-gray-400">-</span>
                <input
                  type="time"
                  value={day.end_time}
                  onChange={(e) => handleDayChange(index, 'end_time', e.target.value)}
                  className="p-2 border rounded-md text-sm"
                />
                {(day.start_time >= day.end_time) && (
                  <AlertCircle className="w-4 h-4 text-red-500 ml-2" title="Hora inválida" />
                )}
              </div>
            )}
            {!day.is_available && <span className="text-sm text-gray-400 italic">Cerrado</span>}
          </div>
        ))}
      </div>
    </div>
  );
};

export default AvailabilityManager;