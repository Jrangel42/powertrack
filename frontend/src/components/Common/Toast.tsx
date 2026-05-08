import React, { useEffect } from 'react';
import { AlertCircle, CheckCircle, Info, X } from 'lucide-react';

interface ToastProps {
  tipo: 'success' | 'error' | 'warning' | 'info';
  mensaje: string;
  duracion?: number;
  onClose: () => void;
}

const Toast: React.FC<ToastProps> = ({ tipo, mensaje, duracion = 5000, onClose }) => {
  useEffect(() => {
    const timer = setTimeout(onClose, duracion);
    return () => clearTimeout(timer);
  }, [duracion, onClose]);

  const config = {
    success: {
      bg: 'bg-green-50',
      border: 'border-green-200',
      text: 'text-green-800',
      icon: CheckCircle,
      iconColor: 'text-green-500',
    },
    error: {
      bg: 'bg-red-50',
      border: 'border-red-200',
      text: 'text-red-800',
      icon: AlertCircle,
      iconColor: 'text-red-500',
    },
    warning: {
      bg: 'bg-yellow-50',
      border: 'border-yellow-200',
      text: 'text-yellow-800',
      icon: AlertCircle,
      iconColor: 'text-yellow-500',
    },
    info: {
      bg: 'bg-blue-50',
      border: 'border-blue-200',
      text: 'text-blue-800',
      icon: Info,
      iconColor: 'text-blue-500',
    },
  };

  const { bg, border, text, icon: Icon, iconColor } = config[tipo];

  return (
    <div
      className={`${bg} ${border} ${text} px-4 py-3 rounded-md border flex items-center justify-between animate-slideIn`}
      role="alert"
    >
      <div className="flex items-center">
        <Icon className={`h-5 w-5 mr-3 ${iconColor}`} />
        <span className="text-sm font-medium">{mensaje}</span>
      </div>
      <button
        onClick={onClose}
        className={`ml-4 ${text} hover:opacity-75 transition-opacity`}
      >
        <X className="h-4 w-4" />
      </button>
    </div>
  );
};

export default Toast;
