
export const validateEmail = (email) => {
  const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return regex.test(email) ? null : "El correo electrónico no es válido";
};

export const validatePhone = (phone) => {
  // Simple validation for international or local numbers, allowing +, spaces, dashes
  const regex = /^\+?[\d\s-]{7,15}$/;
  return regex.test(phone) ? null : "El número de teléfono no es válido";
};

export const validateWhatsAppNumber = (phone) => {
  // WhatsApp usually requires international format for APIs, strict check
  const regex = /^\+[1-9]\d{1,14}$/;
  return regex.test(phone) ? null : "Debe incluir el código de país (ej. +573001234567)";
};

export const validatePrice = (price) => {
  if (!price) return "El precio es requerido";
  if (isNaN(price)) return "El precio debe ser un número";
  if (Number(price) <= 0) return "El precio debe ser mayor a 0";
  return null;
};

export const validateRequiredField = (value) => {
  if (value === null || value === undefined) return "Este campo es requerido";
  if (typeof value === 'string' && value.trim() === '') return "Este campo es requerido";
  if (Array.isArray(value) && value.length === 0) return "Seleccione al menos una opción";
  return null;
};

export const validateFileSize = (file, maxSizeMB = 5) => {
  if (!file) return "No se ha seleccionado ningún archivo";
  const maxSizeBytes = maxSizeMB * 1024 * 1024;
  if (file.size > maxSizeBytes) return `El archivo excede el tamaño máximo de ${maxSizeMB}MB`;
  return null;
};
