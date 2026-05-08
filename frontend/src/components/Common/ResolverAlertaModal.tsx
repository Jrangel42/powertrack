import React, { useState } from 'react';
import { X, AlertCircle } from 'lucide-react';
import { Alerta } from '../../types';
import { resolverAlerta } from '../../services/api';

interface ResolverAlertaModalProps {
  alerta: Alerta;
  onClose: () => void;
  onResuelta: () => void;
}

const ResolverAlertaModal: React.FC<ResolverAlertaModalProps> = ({
  alerta,
  onClose,
  onResuelta,
}) => {
  const [notas, setNotas] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleResolver = async () => {
    if (!notas.trim()) {
      setError('Por favor, describe cómo se resolvió la alerta');
      return;
    }

    setLoading(true);
    setError(null);

    try {
      await resolverAlerta(alerta.id, notas);
      onResuelta();
      onClose();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error al resolver alerta');
    } finally {
      setLoading(false);
    }
  };

  const getSeveridadColor = (severidad: string) => {
    switch (severidad) {
      case 'Baja':
        return 'bg-yellow-100 text-yellow-800 border-yellow-300';
      case 'Media':
        return 'bg-orange-100 text-orange-800 border-orange-300';
      case 'Alta':
        return 'bg-red-100 text-red-800 border-red-300';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-300';
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-xl max-w-md w-full">
        {/* Encabezado */}
        <div className="bg-gradient-to-r from-blue-600 to-blue-700 px-6 py-4 flex items-center justify-between rounded-t-lg">
          <div className="flex items-center space-x-3">
            <AlertCircle className="h-6 w-6 text-white" />
            <h2 className="text-lg font-semibold text-white">Resolver Alerta</h2>
          </div>
          <button
            onClick={onClose}
            className="text-blue-100 hover:text-white transition-colors"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Contenido */}
        <div className="p-6 space-y-4">
          {/* Información de la alerta */}
          <div className="bg-gray-50 rounded-lg p-4 border border-gray-200">
            <div className="flex items-start justify-between mb-2">
              <h3 className="font-semibold text-gray-900">{alerta.tipo}</h3>
              <span className={`text-xs font-bold px-2 py-1 rounded border ${getSeveridadColor(alerta.severidad)}`}>
                {alerta.severidad}
              </span>
            </div>
            <p className="text-sm text-gray-600 mb-2">{alerta.descripcion}</p>
            <p className="text-xs text-gray-500">
              {new Date(alerta.timestamp).toLocaleString('es-ES')}
            </p>
          </div>

          {/* Campo de notas */}
          <div>
            <label htmlFor="notas" className="block text-sm font-medium text-gray-700 mb-2">
              ¿Cómo se resolvió la alerta?
            </label>
            <textarea
              id="notas"
              value={notas}
              onChange={(e) => {
                setNotas(e.target.value);
                setError(null);
              }}
              placeholder="Describe las acciones tomadas para resolver esta alerta..."
              className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 resize-none"
              rows={4}
            />
            <p className="text-xs text-gray-500 mt-1">
              {notas.length}/200 caracteres
            </p>
          </div>

          {/* Mensaje de error */}
          {error && (
            <div className="bg-red-50 border border-red-200 text-red-700 px-3 py-2 rounded-md text-sm">
              {error}
            </div>
          )}

          {/* Botones */}
          <div className="flex justify-end space-x-3 pt-4 border-t border-gray-200">
            <button
              onClick={onClose}
              disabled={loading}
              className="px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50 disabled:bg-gray-100 disabled:cursor-not-allowed transition-colors"
            >
              Cancelar
            </button>
            <button
              onClick={handleResolver}
              disabled={loading || !notas.trim()}
              className="px-4 py-2 bg-green-600 text-white rounded-md text-sm font-medium hover:bg-green-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors"
            >
              {loading ? 'Resolviendo...' : 'Confirmar Resolución'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ResolverAlertaModal;
