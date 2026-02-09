/**
 * Validates a phone number against E.164 format.
 * Format: +[country_code][number] (e.g., +14155552671)
 * Regex allows for international numbers starting with + followed by 1-15 digits.
 * 
 * @param {string} phone - The phone number to validate
 * @returns {Object} { valid: boolean, error: string | null }
 */
export const validateWhatsAppNumber = (phone) => {
  if (!phone) {
    return { valid: false, error: 'El número de teléfono es requerido.' };
  }

  // E.164 Regex: Starts with +, followed by 1 to 15 digits (excluding the +)
  // Actually E.164 max length is 15 digits.
  const e164Regex = /^\+[1-9]\d{1,14}$/;

  if (!e164Regex.test(phone)) {
    return { 
      valid: false, 
      error: 'Formato inválido. Debe ser E.164 (ej. +34600000000)' 
    };
  }

  return { valid: true, error: null };
};