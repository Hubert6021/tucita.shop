import React, { useState, useEffect } from 'react';
import { Helmet } from 'react-helmet';
import { Link, useSearchParams } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Search, SlidersHorizontal, Star, MapPin, X, Briefcase } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Slider } from '@/components/ui/slider';
import { useTheme } from '@/contexts/ThemeContext';
import { useSupabase } from '@/hooks/useSupabase';
import { getThemeByCategory } from '@/utils/themeUtils';
import { cn } from '@/lib/utils';

const SearchPage = () => {
  const { setTheme, isBarber, styles } = useTheme();
  const { fetchProfessionals, fetchCategories, loading } = useSupabase();
  const [searchParams] = useSearchParams();
  
  const [professionals, setProfessionals] = useState([]);
  const [categories, setCategories] = useState([]);
  const [searchQuery, setSearchQuery] = useState(searchParams.get('q') || '');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [minRating, setMinRating] = useState(0);
  const [showFilters, setShowFilters] = useState(false);

  useEffect(() => {
    // Fetch categories
    fetchCategories().then(data => {
      if(data) setCategories(data);
    });
  }, [fetchCategories]);

  useEffect(() => {
    // Fetch professionals with filters
    const loadPros = async () => {
      const data = await fetchProfessionals({
        searchQuery,
        category: selectedCategory,
        rating: minRating
      });
      if(data) setProfessionals(data);
    };
    
    // Debounce a bit
    const timer = setTimeout(loadPros, 300);
    return () => clearTimeout(timer);
  }, [searchQuery, selectedCategory, minRating, fetchProfessionals]);

  // Effect to handle dynamic theme switching
  useEffect(() => {
    if (selectedCategory !== 'all') {
      const detectedTheme = getThemeByCategory(selectedCategory);
      setTheme(detectedTheme);
    } else {
      setTheme('default');
    }
  }, [selectedCategory, setTheme]);

  const clearFilters = () => {
    setSearchQuery('');
    setSelectedCategory('all');
    setMinRating(0);
    setTheme('default');
  };

  return (
    <div className={cn("min-h-screen transition-colors duration-500", isBarber ? "bg-[#1a1a1a]" : "bg-gray-50")}>
      <Helmet>
        <title>Buscar Profesionales - TuCita</title>
      </Helmet>

      <div className="container mx-auto px-4 py-8">
        {/* Search Header */}
        <div className={cn("rounded-2xl shadow-lg p-6 mb-8 transition-colors duration-500", isBarber ? "bg-[#262626] border border-yellow-900/30" : "bg-white")}>
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1 relative">
              <Search className={cn("absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5", styles.icon)} />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Buscar por nombre, especialidad..."
                className={cn(
                  "w-full pl-10 pr-4 py-3 border rounded-lg focus:outline-none focus:ring-2 transition-colors",
                  isBarber 
                    ? "bg-[#1a1a1a] border-[#404040] text-white placeholder:text-gray-500 focus:ring-yellow-500" 
                    : "border-gray-300 text-gray-900 placeholder:text-gray-500 focus:ring-rose-500"
                )}
              />
            </div>
            <Button
              onClick={() => setShowFilters(!showFilters)}
              variant="outline"
              className={cn("md:w-auto transition-colors", isBarber ? styles.buttonOutline : "")}
            >
              <SlidersHorizontal className="h-4 w-4 mr-2" />
              Filtros
            </Button>
          </div>

          {/* Filters */}
          {showFilters && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className={cn("mt-6 pt-6 border-t grid md:grid-cols-2 lg:grid-cols-3 gap-6", isBarber ? "border-[#404040]" : "border-gray-200")}
            >
              <div>
                <label className={cn("block text-sm font-medium mb-2", isBarber ? "text-gray-300" : "text-gray-700")}>Categoría</label>
                <select
                  value={selectedCategory}
                  onChange={(e) => setSelectedCategory(e.target.value)}
                  className={cn(
                    "w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2",
                    isBarber 
                      ? "bg-[#1a1a1a] border-[#404040] text-white focus:ring-yellow-500" 
                      : "border-gray-300 text-gray-900 focus:ring-rose-500"
                  )}
                >
                  <option value="all">Todas las categorías</option>
                  {categories.map(cat => (
                    <option key={cat.id} value={cat.name}>{cat.name}</option>
                  ))}
                  <option value="Barbería">Barbería</option>
                  <option value="Peluquería">Peluquería</option>
                  <option value="Manicura">Manicura</option>
                </select>
              </div>

              <div>
                <label className={cn("block text-sm font-medium mb-2", isBarber ? "text-gray-300" : "text-gray-700")}>
                  Valoración mínima: {minRating > 0 ? `${minRating}★` : 'Todas'}
                </label>
                <Slider
                  value={[minRating]}
                  onValueChange={(val) => setMinRating(val[0])}
                  max={5}
                  min={0}
                  step={0.5}
                  className="mt-2"
                />
              </div>
            </motion.div>
          )}

          {/* Active Filters */}
          {(selectedCategory !== 'all' || minRating > 0) && (
            <div className="mt-4 flex flex-wrap gap-2 items-center">
              <span className={cn("text-sm", isBarber ? "text-gray-400" : "text-gray-600")}>Filtros activos:</span>
              {selectedCategory !== 'all' && (
                <span className={cn("px-3 py-1 rounded-full text-sm", styles.badge)}>
                  {selectedCategory}
                </span>
              )}
              {minRating > 0 && (
                <span className={cn("px-3 py-1 rounded-full text-sm", styles.badge)}>
                  ★ {minRating}+
                </span>
              )}
              <button onClick={clearFilters} className="text-gray-500 hover:text-red-500 ml-2 text-sm flex items-center">
                 <X className="h-4 w-4 mr-1" /> Limpiar
              </button>
            </div>
          )}
        </div>

        {/* Results Grid */}
        {loading ? (
            <div className="text-center py-12">Cargando resultados...</div>
        ) : professionals.length > 0 ? (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {professionals.map((professional, index) => (
              <motion.div
                key={professional.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, delay: index * 0.05 }}
              >
                <Link to={`/professional/${professional.id}`}>
                  <div className={cn(
                    "group rounded-2xl overflow-hidden shadow-lg transition-all duration-300 hover:scale-105 h-full flex flex-col",
                    isBarber 
                      ? "bg-[#262626] hover:shadow-yellow-900/20 border border-transparent hover:border-yellow-900/50" 
                      : "bg-white hover:shadow-2xl"
                  )}>
                    <div className="relative h-56 overflow-hidden">
                      <img
                        src={professional.image_url || "https://images.unsplash.com/photo-1595152772835-219674b2a8a6?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80"}
                        alt={professional.business_name}
                        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                      />
                      <div className="absolute top-4 right-4 bg-white px-3 py-1 rounded-full shadow-lg">
                        <div className="flex items-center space-x-1">
                          <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                          <span className="font-semibold text-gray-900">{professional.rating || 0}</span>
                        </div>
                      </div>
                    </div>
                    <div className="p-6 flex-1 flex flex-col justify-between">
                      <div>
                         <h3 className={cn("text-xl font-bold mb-2", isBarber ? "text-white" : "text-gray-900")}>{professional.business_name || professional.users?.full_name}</h3>
                         <p className={cn("font-medium mb-2", styles.icon)}>{professional.specialty}</p>
                         <div className={cn("flex items-center text-sm mb-3", isBarber ? "text-gray-400" : "text-gray-600")}>
                           <MapPin className={cn("h-4 w-4 mr-1", styles.icon)} />
                           {professional.city}
                         </div>
                      </div>
                      <div className="flex items-center justify-between text-sm">
                        <span className={isBarber ? "text-gray-500" : "text-gray-500"}>{professional.review_count || 0} opiniones</span>
                        <span className={cn("font-semibold", isBarber ? "text-white" : "text-gray-900")}>{professional.price_range || '€€'}</span>
                      </div>
                    </div>
                  </div>
                </Link>
              </motion.div>
            ))}
          </div>
        ) : (
          <div className="text-center py-16">
            <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-gray-100 mb-4">
              <Briefcase className="h-8 w-8 text-gray-400" />
            </div>
            <h3 className="text-xl font-semibold mb-2">No se encontraron resultados</h3>
            <p className="text-gray-600 mb-6">Prueba ajustando tus filtros.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default SearchPage;