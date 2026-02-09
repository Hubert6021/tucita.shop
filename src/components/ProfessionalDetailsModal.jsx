import React, { useState } from 'react';
import { X, Check, Ban, AlertTriangle, Phone, Mail, MapPin, Calendar, Trash2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { motion, AnimatePresence } from 'framer-motion';

const ProfessionalDetailsModal = ({ professional, onClose, onStatusChange, onDelete }) => {
  const [rejectReason, setRejectReason] = useState('');
  const [showRejectInput, setShowRejectInput] = useState(false);

  if (!professional) return null;

  const handleApprove = () => {
    onStatusChange(professional.id, 'approved');
    onClose();
  };

  const handleReject = () => {
    if (!showRejectInput) {
        setShowRejectInput(true);
        return;
    }
    if (rejectReason.trim()) {
        onStatusChange(professional.id, 'rejected', rejectReason);
        onClose();
    }
  };

  const handleSuspend = () => {
    onStatusChange(professional.id, 'suspended');
    onClose();
  };

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
        <motion.div 
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto"
        >
            <div className="sticky top-0 bg-white z-10 p-6 border-b flex justify-between items-center">
                <h2 className="text-xl font-bold text-gray-900">Detalles del Profesional</h2>
                <button onClick={onClose} className="p-2 hover:bg-gray-100 rounded-full">
                    <X className="h-5 w-5 text-gray-500" />
                </button>
            </div>

            <div className="p-6 space-y-6">
                {/* Header Info */}
                <div className="flex gap-4 items-start">
                    <img 
                        src={professional.image} 
                        alt={professional.name} 
                        className="w-24 h-24 rounded-lg object-cover shadow-sm"
                    />
                    <div>
                        <h3 className="text-2xl font-bold text-gray-900">{professional.name}</h3>
                        <p className="text-blue-600 font-medium">{professional.specialty}</p>
                        <div className="flex items-center gap-2 mt-2">
                            <span className={`px-2 py-1 rounded-full text-xs font-semibold ${
                                professional.status === 'approved' ? 'bg-green-100 text-green-700' :
                                professional.status === 'pending' ? 'bg-yellow-100 text-yellow-700' :
                                'bg-red-100 text-red-700'
                            }`}>
                                {professional.status === 'approved' ? 'APROBADO' : professional.status === 'pending' ? 'PENDIENTE' : 'RECHAZADO'}
                            </span>
                            <span className="text-sm text-gray-500">Registrado: {professional.registrationDate}</span>
                        </div>
                    </div>
                </div>

                {/* Contact Info */}
                <div className="grid md:grid-cols-2 gap-4">
                    <div className="p-4 bg-gray-50 rounded-lg">
                        <div className="flex items-center gap-3 mb-2">
                            <Mail className="h-4 w-4 text-gray-400" />
                            <span className="text-sm text-gray-900">{professional.email}</span>
                        </div>
                        <div className="flex items-center gap-3 mb-2">
                            <Phone className="h-4 w-4 text-gray-400" />
                            <span className="text-sm text-gray-900">{professional.phone}</span>
                        </div>
                        <div className="flex items-center gap-3">
                            <MapPin className="h-4 w-4 text-gray-400" />
                            <span className="text-sm text-gray-900">{professional.location || professional.city}</span>
                        </div>
                    </div>
                    <div className="p-4 bg-gray-50 rounded-lg">
                        <h4 className="font-semibold text-gray-900 mb-2">Negocio</h4>
                        <p className="text-sm text-gray-600 mb-1">Nombre: {professional.businessName || 'N/A'}</p>
                        <p className="text-sm text-gray-600">Dirección: {professional.businessAddress || 'N/A'}</p>
                    </div>
                </div>

                {/* Bio */}
                <div>
                    <h4 className="font-semibold text-gray-900 mb-2">Biografía</h4>
                    <p className="text-gray-600 text-sm leading-relaxed bg-gray-50 p-4 rounded-lg">
                        {professional.bio || "Sin biografía."}
                    </p>
                </div>

                {/* Actions */}
                <div className="pt-6 border-t space-y-4">
                    {professional.status === 'pending' && (
                        <div className="flex flex-col gap-3">
                            {showRejectInput && (
                                <textarea
                                    className="w-full p-2 border rounded-md text-sm text-gray-900"
                                    placeholder="Motivo del rechazo..."
                                    value={rejectReason}
                                    onChange={(e) => setRejectReason(e.target.value)}
                                />
                            )}
                            <div className="flex gap-3">
                                <Button onClick={handleApprove} className="flex-1 bg-green-600 hover:bg-green-700">
                                    <Check className="h-4 w-4 mr-2" /> Aprobar
                                </Button>
                                <Button onClick={handleReject} variant="destructive" className="flex-1">
                                    <Ban className="h-4 w-4 mr-2" /> {showRejectInput ? 'Confirmar Rechazo' : 'Rechazar'}
                                </Button>
                            </div>
                        </div>
                    )}

                    {professional.status === 'approved' && (
                        <div className="flex gap-3">
                            <Button onClick={handleSuspend} variant="outline" className="flex-1 border-yellow-500 text-yellow-600 hover:bg-yellow-50">
                                <AlertTriangle className="h-4 w-4 mr-2" /> Suspender
                            </Button>
                            <Button onClick={() => onDelete(professional.id)} variant="destructive" className="flex-1">
                                <Trash2 className="h-4 w-4 mr-2" /> Eliminar Cuenta
                            </Button>
                        </div>
                    )}
                </div>
            </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};

export default ProfessionalDetailsModal;