import React, { useState, useCallback } from 'react';
import Toast from './Toast';

export interface ToastMessage {
  id: string;
  tipo: 'success' | 'error' | 'warning' | 'info';
  mensaje: string;
  duracion?: number;
}

interface ToastContainerProps {
  toasts: ToastMessage[];
  onRemove: (id: string) => void;
}

const ToastContainer: React.FC<ToastContainerProps> = ({ toasts, onRemove }) => {
  return (
    <div className="fixed bottom-4 right-4 space-y-2 z-50 max-w-md">
      {toasts.map((toast) => (
        <Toast
          key={toast.id}
          tipo={toast.tipo}
          mensaje={toast.mensaje}
          duracion={toast.duracion}
          onClose={() => onRemove(toast.id)}
        />
      ))}
    </div>
  );
};

export default ToastContainer;

// Hook para usar toasts
export function useToast() {
  const [toasts, setToasts] = useState<ToastMessage[]>([]);

  const addToast = useCallback(
    (tipo: ToastMessage['tipo'], mensaje: string, duracion?: number) => {
      const id = Math.random().toString(36).substr(2, 9);
      setToasts((prev) => [...prev, { id, tipo, mensaje, duracion }]);
    },
    []
  );

  const removeToast = useCallback((id: string) => {
    setToasts((prev) => prev.filter((toast) => toast.id !== id));
  }, []);

  const success = useCallback((mensaje: string) => addToast('success', mensaje), [addToast]);
  const error = useCallback((mensaje: string) => addToast('error', mensaje, 7000), [addToast]);
  const warning = useCallback((mensaje: string) => addToast('warning', mensaje), [addToast]);
  const info = useCallback((mensaje: string) => addToast('info', mensaje), [addToast]);

  return {
    toasts,
    removeToast,
    addToast,
    success,
    error,
    warning,
    info,
  };
}
