
import { useState, useEffect } from 'react';
import { supabase } from '@/lib/customSupabaseClient';

const useSupabaseRealtime = (tableName, select = '*', initialFilter = null) => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    let mounted = true;
    
    const fetchData = async () => {
      try {
        setLoading(true);
        let query = supabase.from(tableName).select(select);
        
        if (initialFilter) {
          Object.entries(initialFilter).forEach(([key, value]) => {
            query = query.eq(key, value);
          });
        }
        
        const { data: initialData, error: initialError } = await query;
        
        if (initialError) throw initialError;
        if (mounted) setData(initialData || []);
      } catch (err) {
        console.error(`Error fetching ${tableName}:`, err);
        if (mounted) setError(err.message);
      } finally {
        if (mounted) setLoading(false);
      }
    };

    fetchData();

    const channel = supabase
      .channel(`public:${tableName}`)
      .on(
        'postgres_changes',
        { event: '*', schema: 'public', table: tableName },
        (payload) => {
          if (!mounted) return;

          console.log('Realtime change:', payload);

          if (payload.eventType === 'INSERT') {
            setData(prev => [payload.new, ...prev]);
          } else if (payload.eventType === 'UPDATE') {
            setData(prev => prev.map(item => item.id === payload.new.id ? payload.new : item));
          } else if (payload.eventType === 'DELETE') {
            setData(prev => prev.filter(item => item.id !== payload.old.id));
          }
        }
      )
      .subscribe();

    return () => {
      mounted = false;
      supabase.removeChannel(channel);
    };
  }, [tableName, select, JSON.stringify(initialFilter)]); // Safe dependency on stringified filter

  return { data, loading, error };
};

export default useSupabaseRealtime;
