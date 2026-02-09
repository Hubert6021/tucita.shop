
import React, { useState, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { Helmet } from 'react-helmet';
import useSupabaseRealtime from '@/hooks/useSupabaseRealtime';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Loader2, MapPin, Search, AlertCircle, RefreshCw, Briefcase, Filter, X } from 'lucide-react';

const ProfessionalsListPage = () => {
  const { data: professionals, loading, error } = useSupabaseRealtime('professionals');
  
  const [searchTerm, setSearchTerm] = useState('');
  const [cityFilter, setCityFilter] = useState('');
  const [specialtyFilter, setSpecialtyFilter] = useState('');

  // Extract unique values for filters
  const uniqueCities = useMemo(() => {
    return [...new Set(professionals.map(p => p.city).filter(Boolean))].sort();
  }, [professionals]);

  const uniqueSpecialties = useMemo(() => {
    return [...new Set(professionals.map(p => p.specialty).filter(Boolean))].sort();
  }, [professionals]);

  // Filter logic
  const filteredProfessionals = useMemo(() => {
    return professionals.filter(pro => {
      const matchesSearch = !searchTerm || (pro.business_name && pro.business_name.toLowerCase().includes(searchTerm.toLowerCase()));
      const matchesCity = !cityFilter || pro.city === cityFilter;
      const matchesSpecialty = !specialtyFilter || pro.specialty === specialtyFilter;
      
      return matchesSearch && matchesCity && matchesSpecialty;
    });
  }, [professionals, searchTerm, cityFilter, specialtyFilter]);

  const clearFilters = () => {
    setSearchTerm('');
    setCityFilter('');
    setSpecialtyFilter('');
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4 sm:px-6 lg:px-8">
      <Helmet>
        <title>Encuentra Profesionales | TuCita</title>
        <meta name="description" content="Directorio de profesionales verificados. Encuentra expertos en tu ciudad." />
      </Helmet>

      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-10">
          <h1 className="text-4xl font-extrabold text-gray-900 mb-4 tracking-tight">
            Nuestros Profesionales
          </h1>
          <p className="text-xl text-gray-500 max-w-2xl mx-auto">
            Explora nuestra red de expertos y encuentra el servicio perfecto para ti.
          </p>
        </div>

        {/* Filters Section */}
        <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-100 mb-8 sticky top-20 z-10">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="relative col-span-1 md:col-span-2">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-4 h-4" />
              <Input 
                placeholder="Buscar por nombre..." 
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-9"
              />
            </div>
            
            <div className="relative">
              <select 
                className="flex h-10 w-full items-center justify-between rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                value={cityFilter}
                onChange={(e) => setCityFilter(e.target.value)}
              >
                <option value="">Todas las ciudades</option>
                {uniqueCities.map(city => (
                  <option key={city} value={city}>{city}</option>
                ))}
              </select>
            </div>

            <div className="relative">
              <select 
                className="flex h-10 w-full items-center justify-between rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                value={specialtyFilter}
                onChange={(e) => setSpecialtyFilter(e.target.value)}
              >
                <option value="">Todas las especialidades</option>
                {uniqueSpecialties.map(spec => (
                  <option key={spec} value={spec}>{spec}</option>
                ))}
              </select>
            </div>
          </div>
          
          {(searchTerm || cityFilter || specialtyFilter) && (
             <div className="mt-3 flex justify-end">
                <Button variant="ghost" size="sm" onClick={clearFilters} className="text-red-500 hover:text-red-700 hover:bg-red-50">
                   <X className="w-3 h-3 mr-1" /> Limpiar filtros
                </Button>
             </div>
          )}
        </div>

        {/* Content */}
        {error ? (
          <div className="flex flex-col items-center justify-center p-8 bg-white rounded-xl shadow-sm border border-red-100">
            <AlertCircle className="w-12 h-12 text-red-500 mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">Error al cargar datos</h3>
            <p className="text-gray-500 mb-6">{error}</p>
            <Button onClick={() => window.location.reload()} variant="outline">
              <RefreshCw className="w-4 h-4 mr-2" /> Recargar página
            </Button>
          </div>
        ) : loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[1, 2, 3, 4, 5, 6].map((i) => (
              <div key={i} className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 h-80 animate-pulse">
                <div className="h-6 bg-gray-200 rounded w-3/4 mb-4"></div>
                <div className="h-4 bg-gray-200 rounded w-1/2 mb-8"></div>
                <div className="space-y-3">
                  <div className="h-4 bg-gray-200 rounded w-full"></div>
                  <div className="h-4 bg-gray-200 rounded w-full"></div>
                  <div className="h-4 bg-gray-200 rounded w-2/3"></div>
                </div>
              </div>
            ))}
          </div>
        ) : filteredProfessionals.length === 0 ? (
          <div className="text-center py-16 bg-white rounded-2xl shadow-sm border border-dashed border-gray-300">
            <Filter className="w-12 h-12 text-gray-300 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">No se encontraron resultados</h3>
            <p className="text-gray-500">Intenta ajustar tus filtros de búsqueda.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredProfessionals.map((pro) => (
              <div key={pro.id} className="bg-white rounded-2xl shadow-sm hover:shadow-xl transition-all duration-300 border border-gray-100 overflow-hidden flex flex-col group">
                <div className="p-6 flex-1 flex flex-col">
                  <div className="flex items-start justify-between mb-4">
                     <div>
                        <h3 className="text-xl font-bold text-gray-900 group-hover:text-rose-600 transition-colors">
                          {pro.business_name}
                        </h3>
                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-rose-100 text-rose-800 mt-2">
                           {pro.specialty}
                        </span>
                     </div>
                     <div className="bg-gray-100 p-2 rounded-full">
                        <Briefcase className="w-5 h-5 text-gray-500" />
                     </div>
                  </div>

                  <p className="text-gray-600 text-sm mb-6 line-clamp-3 flex-1">
                    {pro.bio ? pro.bio.substring(0, 100) + (pro.bio.length > 100 ? '...' : '') : 'Sin descripción disponible.'}
                  </p>

                  <div className="mt-auto pt-4 border-t border-gray-50 flex items-center justify-between">
                    <div className="flex items-center text-sm text-gray-500">
                      <MapPin className="w-4 h-4 mr-1" />
                      {pro.city}
                    </div>
                    <Link to={`/profesionales/${pro.id}`}>
                      <Button size="sm" className="bg-slate-900 text-white hover:bg-rose-600">
                        Ver Perfil
                      </Button>
                    </Link>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default ProfessionalsListPage;
