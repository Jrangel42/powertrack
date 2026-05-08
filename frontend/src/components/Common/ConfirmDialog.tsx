import React from 'react';
import { AlertTriangle } from 'lucide-react';

interface ConfirmDialogProps {
  titulo: string;
  mensaje: string;
  textoConfirmar?: string;
  textoCancelar?: string;
  tipo?: 'peligro' | 'advertencia' | 'info';
  onConfirm: () => void;
  onCancel: () => void;
}

const ConfirmDialog: React.FC<ConfirmDialogProps> = ({
  titulo,
  mensaje,
  textoConfirmar = 'Confirmar',
  textoCancelar = 'Cancelar',
  tipo = 'peligro',
  onConfirm,
  onCancel,
}) => {
  const tipoConfig = {
    peligro: {
      color: 'bg-red-50 border-red-200',
      iconColor: 'text-red-600',
      buttonColor: 'bg-red-600 hover:bg-red-700',
    },
    advertencia: {
      color: 'bg-yellow-50 border-yellow-200',
      iconColor: 'text-yellow-600',
      buttonColor: 'bg-yellow-600 hover:bg-yellow-700',
    },
    info: {
      color: 'bg-blue-50 border-blue-200',
      iconColor: 'text-blue-600',
      buttonColor: 'bg-blue-600 hover:bg-blue-700',
    },
  };

  const { color, iconColor, buttonColor } = tipoConfig[tipo];

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-xl max-w-md w-full">
        <div className={`px-6 py-4 border-b ${color} rounded-t-lg`}>
          <div className="flex items-center">
            <AlertTriangle className={`h-6 w-6 ${iconColor} mr-3`} />
            <h3 className="text-lg font-semibold text-gray-900">{titulo}</h3>
          </div>
        </div>

        <div className="p-6">
          <p className="text-gray-700">{mensaje}</p>

          <div className="flex justify-end space-x-3 mt-6">
            <button
              onClick={onCancel}
              className="px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors"
            >
              {textoCancelar}
            </button>
            <button
              onClick={onConfirm}
              className={`px-4 py-2 border border-transparent rounded-md text-sm font-medium text-white ${buttonColor} transition-colors`}
            >
              {textoConfirmar}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ConfirmDialog;