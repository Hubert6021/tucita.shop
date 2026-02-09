
import React from 'react';
import { cn } from '@/lib/utils';

const FormField = ({ 
  label, 
  name, 
  type = 'text', 
  value, 
  onChange, 
  error, 
  required = false, 
  placeholder = '',
  options = [],
  className,
  rows = 3,
  helperText
}) => {
  const baseInputStyles = cn(
    "w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 transition-all duration-200",
    error 
      ? "border-red-300 focus:border-red-500 focus:ring-red-200 bg-red-50" 
      : "border-gray-300 focus:border-blue-500 focus:ring-blue-200 bg-white hover:border-gray-400",
    "text-gray-900 placeholder:text-gray-400"
  );

  return (
    <div className={cn("space-y-1.5", className)}>
      {label && (
        <label htmlFor={name} className="block text-sm font-medium text-gray-700">
          {label} {required && <span className="text-red-500">*</span>}
        </label>
      )}
      
      {type === 'select' ? (
        <div className="relative">
          <select
            id={name}
            name={name}
            value={value}
            onChange={onChange}
            className={cn(baseInputStyles, "appearance-none")}
          >
            <option value="" disabled>Seleccionar...</option>
            {options.map((opt) => (
              <option key={opt.value} value={opt.value}>
                {opt.label}
              </option>
            ))}
          </select>
          <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-500">
            <svg className="fill-current h-4 w-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20">
              <path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z" />
            </svg>
          </div>
        </div>
      ) : type === 'textarea' ? (
        <textarea
          id={name}
          name={name}
          value={value}
          onChange={onChange}
          rows={rows}
          placeholder={placeholder}
          className={baseInputStyles}
        />
      ) : (
        <input
          id={name}
          name={name}
          type={type}
          value={value}
          onChange={onChange}
          placeholder={placeholder}
          className={baseInputStyles}
        />
      )}

      {helperText && !error && (
        <p className="text-xs text-gray-500">{helperText}</p>
      )}
      
      {error && (
        <p className="text-xs text-red-600 font-medium animate-in slide-in-from-top-1 flex items-center">
          <span className="mr-1">⚠</span> {error}
        </p>
      )}
    </div>
  );
};

export default FormField;
