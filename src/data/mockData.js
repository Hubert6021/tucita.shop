// Mock database for beauty booking platform

export const professionals = [];

export const services = [
  { id: 1, name: "Corte de Cabello", category: "Peluquería", description: "Corte personalizado según tu estilo", price: 35, duration: 45 },
  { id: 2, name: "Lavado y Peinado", category: "Peluquería", description: "Lavado profesional y peinado", price: 25, duration: 30 },
  { id: 3, name: "Tratamiento Capilar", category: "Peluquería", description: "Tratamiento nutritivo e hidratante", price: 45, duration: 60 },
  { id: 4, name: "Tinte Completo", category: "Colorimetría", description: "Coloración completa del cabello", price: 65, duration: 120 },
  { id: 5, name: "Mechas/Balayage", category: "Colorimetría", description: "Técnica de iluminación moderna", price: 85, duration: 150 },
  { id: 6, name: "Corte Caballero", category: "Barbería", description: "Corte masculino clásico o moderno", price: 25, duration: 30 },
  { id: 7, name: "Arreglo de Barba", category: "Barbería", description: "Perfilado y arreglo profesional", price: 15, duration: 20 },
  { id: 8, name: "Afeitado Tradicional", category: "Barbería", description: "Afeitado clásico con navaja", price: 30, duration: 40 },
  { id: 9, name: "Corte + Barba", category: "Barbería", description: "Servicio completo de barbería", price: 35, duration: 45 },
  { id: 10, name: "Maquillaje Diario", category: "Maquillaje", description: "Maquillaje natural para el día a día", price: 40, duration: 45 },
  { id: 11, name: "Maquillaje de Novia", category: "Maquillaje", description: "Maquillaje completo para bodas", price: 120, duration: 90 },
  { id: 12, name: "Maquillaje de Fiesta", category: "Maquillaje", description: "Look glamuroso para eventos", price: 55, duration: 60 },
  { id: 13, name: "Maquillaje Profesional", category: "Maquillaje", description: "Para sesiones fotográficas", price: 75, duration: 75 },
  { id: 14, name: "Manicura Clásica", category: "Manicura", description: "Cuidado completo de manos", price: 20, duration: 40 },
  { id: 15, name: "Manicura con Gel", category: "Manicura", description: "Esmalte semipermanente", price: 35, duration: 60 },
  { id: 16, name: "Uñas Esculpidas", category: "Manicura", description: "Extensión de uñas acrílico/gel", price: 50, duration: 90 },
  { id: 17, name: "Nail Art", category: "Manicura", description: "Diseños personalizados en uñas", price: 45, duration: 75 },
  { id: 18, name: "Asesoría de Imagen", category: "Consultoría", description: "Consulta personalizada de estilo", price: 60, duration: 60 },
  { id: 19, name: "Tratamiento Facial Express", category: "Estética", description: "Limpieza rápida facial", price: 40, duration: 30 },
  { id: 20, name: "Diseño de Cejas", category: "Cejas", description: "Perfilado profesional de cejas", price: 18, duration: 30 },
  { id: 21, name: "Laminado de Cejas", category: "Cejas", description: "Tratamiento para cejas perfectas", price: 45, duration: 45 },
  { id: 22, name: "Microblading", category: "Cejas", description: "Micropigmentación semipermanente", price: 280, duration: 120 },
  { id: 23, name: "Peinado para Evento", category: "Peluquería", description: "Recogido o peinado elaborado", price: 55, duration: 75 },
  { id: 24, name: "Alisado/Keratina", category: "Tratamientos", description: "Tratamiento alisador profesional", price: 150, duration: 180 },
  { id: 25, name: "Limpieza Facial Profunda", category: "Estética Facial", description: "Limpieza completa con extracción", price: 60, duration: 75 },
  { id: 26, name: "Peeling Químico", category: "Estética Facial", description: "Renovación celular facial", price: 80, duration: 60 },
  { id: 27, name: "Tratamiento Anti-Edad", category: "Estética Facial", description: "Protocolo rejuvenecedor", price: 95, duration: 90 },
  { id: 28, name: "Hidratación Facial", category: "Estética Facial", description: "Tratamiento hidratante intensivo", price: 55, duration: 60 },
  { id: 29, name: "Degradado Premium", category: "Barbería", description: "Degradado profesional high fade", price: 30, duration: 40 },
  { id: 30, name: "Corrección de Color", category: "Colorimetría", description: "Corrección de tintes previos", price: 120, duration: 180 }
];

export const reviews = [];

export const appointments = [];

export const getServiceById = (id) => services.find(s => s.id === id);
export const getProfessionalById = (id) => professionals.find(p => p.id === parseInt(id));
export const getReviewsByProfessional = (professionalId) => reviews.filter(r => r.professionalId === professionalId);
export const getServicesByIds = (ids) => services.filter(s => ids.includes(s.id));