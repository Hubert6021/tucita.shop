import React, { useState, useEffect } from 'react';
import { Helmet } from 'react-helmet';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Search, Clock, Award, Star, Users, Briefcase } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useSupabase } from '@/hooks/useSupabase';

const HomePage = () => {
  const { fetchProfessionals, loading } = useSupabase();
  const [featuredProfessionals, setFeaturedProfessionals] = useState([]);

  useEffect(() => {
    const loadData = async () => {
      const data = await fetchProfessionals({ rating: 4.5 });
      if (data) {
        setFeaturedProfessionals(data.slice(0, 6));
      }
    };
    loadData();
  }, [fetchProfessionals]);

  return (
    <div className="min-h-screen">
      <Helmet>
        <title>TuCita - Reserva tu cita de belleza en segundos</title>
        <meta name="description" content="Encuentra y reserva servicios de belleza con los mejores profesionales en TuCita." />
      </Helmet>

      {/* Hero Section */}
      <section className="relative h-[600px] flex items-center justify-center overflow-hidden">
        <div className="absolute inset-0">
          <img
            src="https://images.unsplash.com/photo-1633681926019-03bd9325ec20"
            alt="Hero"
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-br from-rose-900/80 via-purple-900/70 to-pink-900/80"></div>
        </div>

        <div className="relative z-10 text-center px-4 max-w-4xl mx-auto">
          <motion.h1
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-5xl md:text-6xl font-bold text-white mb-6"
          >
            Reserva tu cita de belleza{' '}
            <span className="bg-gradient-to-r from-rose-300 to-pink-300 bg-clip-text text-transparent">
              en segundos
            </span>
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="text-xl text-gray-200 mb-8"
          >
            Conecta con los mejores profesionales de belleza cerca de ti con TuCita
          </motion.p>
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.4 }}
          >
            <Link to="/search">
              <Button size="lg" className="bg-white text-rose-600 hover:bg-gray-100 text-lg px-8 py-6 shadow-2xl">
                <Search className="mr-2 h-5 w-5" />
                Buscar Profesionales
              </Button>
            </Link>
          </motion.div>
        </div>
      </section>

      {/* Featured Professionals */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">Profesionales Destacados</h2>
            <p className="text-xl text-gray-600">Los mejores expertos en belleza te esperan en TuCita</p>
          </div>

          {loading ? (
             <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto">
               {[1, 2, 3].map(i => (
                 <div key={i} className="h-80 bg-gray-100 rounded-2xl animate-pulse"></div>
               ))}
             </div>
          ) : featuredProfessionals.length > 0 ? (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-6xl mx-auto">
              {featuredProfessionals.map((professional, index) => (
                <motion.div
                  key={professional.id}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: index * 0.1 }}
                  viewport={{ once: true }}
                >
                  <Link to={`/professional/${professional.id}`}>
                    <div className="group bg-white rounded-2xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-300 hover:scale-105 h-full flex flex-col">
                      <div className="relative h-64 overflow-hidden">
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
                          <h3 className="text-xl font-bold text-gray-900 mb-2">{professional.business_name || professional.users?.full_name}</h3>
                          <p className="text-rose-500 font-medium mb-2">{professional.specialty}</p>
                          <p className="text-gray-600 text-sm mb-3">{professional.city}</p>
                        </div>
                        <div className="flex items-center justify-between text-sm text-gray-500">
                          <span>{professional.review_count || 0} opiniones</span>
                          <span className="font-semibold text-gray-900">{professional.price_range || '€€'}</span>
                        </div>
                      </div>
                    </div>
                  </Link>
                </motion.div>
              ))}
            </div>
          ) : (
            <div className="text-center py-12 bg-gray-50 rounded-2xl max-w-3xl mx-auto">
              <Briefcase className="h-16 w-16 text-gray-300 mx-auto mb-4" />
              <h3 className="text-2xl font-bold text-gray-900 mb-2">¿Eres un profesional de la belleza?</h3>
              <p className="text-gray-600 mb-6">Aún no hay profesionales destacados. ¡Sé el primero en unirte!</p>
              <Link to="/professional-signup">
                <Button size="lg" className="bg-gradient-to-r from-rose-500 to-pink-500 hover:from-rose-600 hover:to-pink-600">
                  Registrar mi Negocio
                </Button>
              </Link>
            </div>
          )}
        </div>
      </section>

      {/* Features - Keeping static for now */}
      <section className="py-16 bg-gradient-to-b from-gray-50 to-white">
        <div className="container mx-auto px-4">
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8 max-w-6xl mx-auto">
            {[
              { icon: <Clock className="h-8 w-8" />, title: 'Reservas 24/7', description: 'Reserva cuando quieras, a cualquier hora.' },
              { icon: <Award className="h-8 w-8" />, title: 'Profesionales Verificados', description: 'Expertos de calidad garantizada para tu tranquilidad.' },
              { icon: <Star className="h-8 w-8" />, title: 'Opiniones Reales', description: 'Basadas en experiencias de clientes como tú.' },
              { icon: <Users className="h-8 w-8" />, title: 'Comunidad Activa', description: 'Únete a miles de usuarios satisfechos.' }
            ].map((feature, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, scale: 0.9 }}
                whileInView={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                viewport={{ once: true }}
                className="text-center"
              >
                <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-gradient-to-br from-rose-100 to-pink-100 text-rose-600 mb-4">
                  {feature.icon}
                </div>
                <h3 className="text-lg font-bold text-gray-900 mb-2">{feature.title}</h3>
                <p className="text-gray-600 text-sm">{feature.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
};

export default HomePage;