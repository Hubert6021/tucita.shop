import React, { useState } from 'react';
import { Helmet } from 'react-helmet';
import { useParams, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Star, MapPin, Phone, Mail, Clock, Calendar } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { getProfessionalById, getServicesByIds, getReviewsByProfessional } from '@/data/mockData';

const ProfessionalProfile = () => {
  const { id } = useParams();
  const professional = getProfessionalById(id);
  const [activeTab, setActiveTab] = useState('services');

  if (!professional) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Profesional no encontrado</h2>
          <Link to="/search">
            <Button>Volver a la búsqueda</Button>
          </Link>
        </div>
      </div>
    );
  }

  const services = getServicesByIds(professional.services);
  const reviews = getReviewsByProfessional(professional.id);

  return (
    <div className="min-h-screen bg-gray-50">
      <Helmet>
        <title>{professional.name} - {professional.specialty} | BeautyBook</title>
        <meta name="description" content={`${professional.bio}. Reserva tu cita con ${professional.name} en BeautyBook.`} />
      </Helmet>

      {/* Hero Section */}
      <div className="relative h-96 bg-gradient-to-r from-rose-500 to-pink-500">
        <img
          src={professional.image}
          alt={professional.name}
          className="w-full h-full object-cover opacity-30"
        />
        <div className="absolute inset-0 flex items-end">
          <div className="container mx-auto px-4 pb-8">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-white rounded-2xl shadow-2xl p-6 md:p-8 max-w-4xl"
            >
              <div className="flex flex-col md:flex-row gap-6 items-start">
                <img
                  src={professional.image}
                  alt={professional.name}
                  className="w-32 h-32 rounded-xl object-cover shadow-lg"
                />
                <div className="flex-1">
                  <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-2">
                    {professional.name}
                  </h1>
                  <p className="text-xl text-rose-500 font-medium mb-3">{professional.specialty}</p>
                  <div className="flex flex-wrap gap-4 text-sm text-gray-600">
                    <div className="flex items-center">
                      <Star className="h-5 w-5 fill-yellow-400 text-yellow-400 mr-1" />
                      <span className="font-semibold text-gray-900 mr-1">{professional.rating}</span>
                      <span>({professional.reviewCount} opiniones)</span>
                    </div>
                    <div className="flex items-center">
                      <MapPin className="h-5 w-5 mr-1" />
                      {professional.location}
                    </div>
                    <div className="flex items-center">
                      <span className="font-semibold">{professional.priceRange}</span>
                    </div>
                  </div>
                </div>
                <Link to={`/booking/${professional.id}`}>
                  <Button size="lg" className="bg-gradient-to-r from-rose-500 to-pink-500 hover:from-rose-600 hover:to-pink-600 shadow-lg">
                    <Calendar className="h-5 w-5 mr-2" />
                    Reservar Cita
                  </Button>
                </Link>
              </div>
            </motion.div>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="container mx-auto px-4 py-12">
        <div className="grid lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2">
            <Tabs value={activeTab} onValueChange={setActiveTab}>
              <TabsList className="w-full justify-start mb-6 bg-white shadow-sm rounded-lg p-1">
                <TabsTrigger value="services" className="flex-1">Servicios</TabsTrigger>
                <TabsTrigger value="portfolio" className="flex-1">Portfolio</TabsTrigger>
                <TabsTrigger value="reviews" className="flex-1">Opiniones</TabsTrigger>
              </TabsList>

              {/* Services Tab */}
              <TabsContent value="services">
                <div className="bg-white rounded-2xl shadow-lg p-6">
                  <h2 className="text-2xl font-bold text-gray-900 mb-6">Servicios Disponibles</h2>
                  <div className="space-y-4">
                    {services.map((service) => (
                      <motion.div
                        key={service.id}
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        className="flex items-start justify-between p-4 border border-gray-200 rounded-xl hover:border-rose-500 hover:shadow-md transition-all"
                      >
                        <div className="flex-1">
                          <h3 className="text-lg font-semibold text-gray-900 mb-1">{service.name}</h3>
                          <p className="text-sm text-gray-600 mb-2">{service.description}</p>
                          <div className="flex items-center space-x-4 text-sm text-gray-500">
                            <span className="flex items-center">
                              <Clock className="h-4 w-4 mr-1" />
                              {service.duration} min
                            </span>
                            <span className="px-2 py-1 bg-rose-100 text-rose-700 rounded-full text-xs">
                              {service.category}
                            </span>
                          </div>
                        </div>
                        <div className="text-right ml-4">
                          <p className="text-2xl font-bold text-gray-900">{service.price}€</p>
                        </div>
                      </motion.div>
                    ))}
                  </div>
                </div>
              </TabsContent>

              {/* Portfolio Tab */}
              <TabsContent value="portfolio">
                <div className="bg-white rounded-2xl shadow-lg p-6">
                  <h2 className="text-2xl font-bold text-gray-900 mb-6">Portfolio</h2>
                  <div className="grid md:grid-cols-2 gap-4">
                    {professional.portfolio.map((image, index) => (
                      <motion.div
                        key={index}
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ delay: index * 0.1 }}
                        className="relative h-64 rounded-xl overflow-hidden group cursor-pointer"
                      >
                        <img
                          src={image}
                          alt={`Portfolio ${index + 1}`}
                          className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                      </motion.div>
                    ))}
                  </div>
                </div>
              </TabsContent>

              {/* Reviews Tab */}
              <TabsContent value="reviews">
                <div className="bg-white rounded-2xl shadow-lg p-6">
                  <div className="flex items-center justify-between mb-6">
                    <h2 className="text-2xl font-bold text-gray-900">Opiniones</h2>
                    <div className="flex items-center space-x-2">
                      <Star className="h-6 w-6 fill-yellow-400 text-yellow-400" />
                      <span className="text-2xl font-bold text-gray-900">{professional.rating}</span>
                      <span className="text-gray-500">({professional.reviewCount})</span>
                    </div>
                  </div>
                  <div className="space-y-6">
                    {reviews.length > 0 ? (
                      reviews.map((review) => (
                        <motion.div
                          key={review.id}
                          initial={{ opacity: 0, y: 20 }}
                          animate={{ opacity: 1, y: 0 }}
                          className="pb-6 border-b border-gray-200 last:border-0"
                        >
                          <div className="flex items-start justify-between mb-2">
                            <div>
                              <h4 className="font-semibold text-gray-900">{review.customerName}</h4>
                              <p className="text-sm text-gray-500">{new Date(review.date).toLocaleDateString('es-ES')}</p>
                            </div>
                            <div className="flex">
                              {[...Array(5)].map((_, i) => (
                                <Star
                                  key={i}
                                  className={`h-4 w-4 ${
                                    i < review.rating
                                      ? 'fill-yellow-400 text-yellow-400'
                                      : 'text-gray-300'
                                  }`}
                                />
                              ))}
                            </div>
                          </div>
                          <p className="text-gray-700">{review.comment}</p>
                        </motion.div>
                      ))
                    ) : (
                      <p className="text-center text-gray-500 py-8">Aún no hay opiniones</p>
                    )}
                  </div>
                </div>
              </TabsContent>
            </Tabs>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* About */}
            <div className="bg-white rounded-2xl shadow-lg p-6">
              <h3 className="text-xl font-bold text-gray-900 mb-4">Sobre mí</h3>
              <p className="text-gray-700 leading-relaxed mb-6">{professional.bio}</p>
              
              <h4 className="font-semibold text-gray-900 mb-3">Contacto</h4>
              <div className="space-y-3">
                <div className="flex items-center text-gray-600">
                  <Phone className="h-5 w-5 mr-3 text-rose-500" />
                  <span>{professional.phone}</span>
                </div>
                <div className="flex items-center text-gray-600">
                  <Mail className="h-5 w-5 mr-3 text-rose-500" />
                  <span className="break-all">{professional.email}</span>
                </div>
                <div className="flex items-center text-gray-600">
                  <MapPin className="h-5 w-5 mr-3 text-rose-500" />
                  <span>{professional.location}</span>
                </div>
              </div>
            </div>

            {/* Hours */}
            <div className="bg-white rounded-2xl shadow-lg p-6">
              <h3 className="text-xl font-bold text-gray-900 mb-4">Horarios Disponibles</h3>
              <div className="space-y-2">
                {professional.availableSlots.slice(0, 5).map((slot, index) => (
                  <div key={index} className="flex items-center text-gray-600">
                    <Clock className="h-4 w-4 mr-2 text-rose-500" />
                    <span>{slot}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* CTA */}
            <div className="bg-gradient-to-br from-rose-500 to-pink-500 rounded-2xl shadow-lg p-6 text-white">
              <h3 className="text-xl font-bold mb-2">¿Listo para reservar?</h3>
              <p className="mb-4 text-white/90">Elige tu servicio y horario preferido</p>
              <Link to={`/booking/${professional.id}`}>
                <Button size="lg" className="w-full bg-white text-rose-600 hover:bg-gray-100">
                  Reservar Ahora
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfessionalProfile;