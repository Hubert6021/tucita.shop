
import React, { useState, useRef } from 'react';
import { Upload, X, Image as ImageIcon, CheckCircle, Loader2 } from 'lucide-react';
import { supabase } from '@/lib/customSupabaseClient';
import { cn } from '@/lib/utils';
import { validateFileSize } from '@/utils/validationUtils';
import { useToast } from '@/components/ui/use-toast';

const FileUpload = ({ onUploadComplete, currentImage, label, required, className }) => {
  const [isDragging, setIsDragging] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [preview, setPreview] = useState(currentImage || null);
  const [error, setError] = useState(null);
  const fileInputRef = useRef(null);
  const { toast } = useToast();

  const handleDragOver = (e) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = (e) => {
    e.preventDefault();
    setIsDragging(false);
  };

  const handleDrop = async (e) => {
    e.preventDefault();
    setIsDragging(false);
    
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      await processFile(e.dataTransfer.files[0]);
    }
  };

  const handleFileSelect = async (e) => {
    if (e.target.files && e.target.files[0]) {
      await processFile(e.target.files[0]);
    }
  };

  const processFile = async (file) => {
    setError(null);
    
    // Validations
    const sizeError = validateFileSize(file, 5); // 5MB limit
    if (sizeError) {
      setError(sizeError);
      return;
    }

    if (!['image/jpeg', 'image/png', 'image/webp'].includes(file.type)) {
      setError("Solo se permiten archivos JPG, PNG o WebP");
      return;
    }

    // Preview
    const reader = new FileReader();
    reader.onloadend = () => {
      setPreview(reader.result);
    };
    reader.readAsDataURL(file);

    // Upload
    await uploadToSupabase(file);
  };

  const uploadToSupabase = async (file) => {
    setIsUploading(true);
    try {
      const fileExt = file.name.split('.').pop();
      const fileName = `registration-${Date.now()}.${fileExt}`;
      const filePath = `${fileName}`;

      const { error: uploadError } = await supabase.storage
        .from('professional-photos')
        .upload(filePath, file);

      if (uploadError) throw uploadError;

      const { data: { publicUrl } } = supabase.storage
        .from('professional-photos')
        .getPublicUrl(filePath);

      onUploadComplete(publicUrl);
      toast({
        title: "Imagen subida",
        description: "La imagen se ha cargado correctamente.",
        variant: "success", 
        className: "bg-green-50 text-green-900 border-green-200"
      });
      
    } catch (err) {
      console.error('Upload error:', err);
      setError("Error al subir la imagen. Inténtalo de nuevo.");
      setPreview(null);
      toast({
        title: "Error de subida",
        description: "No se pudo subir la imagen al servidor.",
        variant: "destructive"
      });
    } finally {
      setIsUploading(false);
    }
  };

  const clearImage = (e) => {
    e.stopPropagation();
    setPreview(null);
    onUploadComplete('');
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  return (
    <div className={cn("space-y-2", className)}>
      <label className="block text-sm font-medium text-gray-700">
        {label || "Foto de Perfil"} {required && <span className="text-red-500">*</span>}
      </label>

      <div
        onClick={() => fileInputRef.current?.click()}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        className={cn(
          "relative border-2 border-dashed rounded-xl p-6 transition-all cursor-pointer group flex flex-col items-center justify-center text-center overflow-hidden h-48",
          isDragging ? "border-blue-500 bg-blue-50" : "border-gray-300 bg-gray-50 hover:bg-gray-100 hover:border-gray-400",
          error ? "border-red-300 bg-red-50" : ""
        )}
      >
        <input
          type="file"
          ref={fileInputRef}
          className="hidden"
          accept="image/jpeg,image/png,image/webp"
          onChange={handleFileSelect}
        />

        {isUploading ? (
          <div className="flex flex-col items-center animate-pulse">
            <Loader2 className="w-10 h-10 text-blue-500 animate-spin mb-2" />
            <p className="text-sm text-blue-600 font-medium">Subiendo imagen...</p>
          </div>
        ) : preview ? (
          <div className="relative w-full h-full group-hover:opacity-90 transition-opacity">
            <img 
              src={preview} 
              alt="Preview" 
              className="w-full h-full object-contain rounded-lg"
            />
            <button
              type="button"
              onClick={clearImage}
              className="absolute top-2 right-2 p-1.5 bg-red-500 text-white rounded-full hover:bg-red-600 shadow-sm transition-transform hover:scale-110"
            >
              <X className="w-4 h-4" />
            </button>
            <div className="absolute bottom-2 right-2 bg-green-500 text-white px-2 py-1 rounded-md text-xs font-bold shadow-sm flex items-center">
               <CheckCircle className="w-3 h-3 mr-1" /> Cargada
            </div>
          </div>
        ) : (
          <div className="flex flex-col items-center text-gray-500 group-hover:text-gray-700">
            <div className="p-3 bg-white rounded-full shadow-sm mb-3 group-hover:scale-110 transition-transform">
               <Upload className="w-6 h-6 text-blue-500" />
            </div>
            <p className="text-sm font-medium">
              <span className="text-blue-600">Haz clic para subir</span> o arrastra
            </p>
            <p className="text-xs mt-1 text-gray-400">JPG, PNG o WebP (Max. 5MB)</p>
          </div>
        )}
      </div>

      {error && (
        <p className="text-xs text-red-600 font-medium flex items-center mt-1">
          <X className="w-3 h-3 mr-1" /> {error}
        </p>
      )}
    </div>
  );
};

export default FileUpload;
