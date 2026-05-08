import React, { useState, useEffect } from 'react';
import { X, AlertCircle, CheckCircle, TrendingUp, TrendingDown, BarChart3 } from 'lucide-react';
import { Aula, Alerta } from '../../types';
import { resolverAlerta } from '../../services/api';
import Indicador from './Indicador';
import ResolverAlertaModal from './ResolverAlertaModal';

interface AulaDetailModalProps {
  aula: Aula;
  alertas: Alerta[];
  onClose: () => void;
  onAlertaResuelta?: (alertaId: string) => void;
}

const AulaDetailModal: React.FC<AulaDetailModalProps> = ({
  aula,
  alertas,
  onClose,
  onAlertaResuelta,
}) => {
  const [resolviendo, setResolviendo] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [alertaParaResolver, setAlertaParaResolver] = useState<Alerta | null>(null);

  const aulasAlertas = alertas.filter((a) => a.aulaId === aula.id && !a.resuelta);

  const handleResolverAlerta = (alerta: Alerta) => {
    setAlertaParaResolver(alerta);
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
      <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        {/* Encabezado */}
        <div className="sticky top-0 bg-white border-b border-gray-200 px-6 py-4 flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <h2 className="text-2xl font-bold text-gray-900">{aula.nombre}</h2>
            <Indicador estado={aula.estado} />
          </div>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 transition-colors"
          >
            <X className="h-6 w-6" />
          </button>
        </div>

        {/* Contenido */}
        <div className="p-6 space-y-6">
          {/* Información General */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="bg-gray-50 rounded-lg p-4 border border-gray-200">
              <p className="text-sm text-gray-500 mb-1">Horario Operativo</p>
              <p className="text-lg font-semibold text-gray-900">
                {aula.horarioInicio}:00 - {aula.horarioCierre}:00
              </p>
            </div>
            <div className="bg-gray-50 rounded-lg p-4 border border-gray-200">
              <p className="text-sm text-gray-500 mb-1">Consumo Esperado</p>
              <p className="text-lg font-semibold text-gray-900">
                {aula.consumoEsperado.toFixed(2)} kWh
              </p>
            </div>
            <div className="bg-blue-50 rounded-lg p-4 border border-blue-200">
              <div className="flex items-center">
                <TrendingUp className="h-5 w-5 text-blue-600 mr-2" />
                <div>
                  <p className="text-sm text-blue-600 mb-1">Consumo Actual</p>
                  <p className="text-lg font-semibold text-blue-900">
                    {aula.consumoActual.toFixed(2)} kWh
                  </p>
                </div>
              </div>
            </div>
            <div className="bg-green-50 rounded-lg p-4 border border-green-200">
              <div className="flex items-center">
                <BarChart3 className="h-5 w-5 text-green-600 mr-2" />
                <div>
                  <p className="text-sm text-green-600 mb-1">Eficiencia</p>
                  <p className="text-lg font-semibold text-green-900">
                    {aula.eficiencia.toFixed(1)}%
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Última Actualización */}
          <div className="bg-gray-50 rounded-lg p-4 border border-gray-200">
            <p className="text-sm text-gray-500 mb-1">Última Actualización</p>
            <p className="text-gray-900">
              {new Date(aula.ultimaActualizacion).toLocaleString('es-ES')}
            </p>
          </div>

          {/* Alertas */}
          <div className="border-t border-gray-200 pt-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
              <AlertCircle className="h-5 w-5 mr-2 text-red-600" />
              Alertas Activas ({aulasAlertas.length})
            </h3>

            {error && (
              <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-md mb-4">
                {error}
              </div>
            )}

            {aulasAlertas.length === 0 ? (
              <div className="bg-green-50 border border-green-200 rounded-lg p-6 text-center">
                <CheckCircle className="h-12 w-12 text-green-600 mx-auto mb-2" />
                <p className="text-green-800 font-medium">No hay alertas activas</p>
                <p className="text-green-700 text-sm mt-1">
                  El aula está funcionando correctamente
                </p>
              </div>
            ) : (
              <div className="space-y-3">
                {aulasAlertas.map((alerta) => (
                  <div
                    key={alerta.id}
                    className={`rounded-lg p-4 border ${getSeveridadColor(alerta.severidad)}`}
                  >
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex items-center space-x-2 mb-2">
                          <h4 className="font-semibold">{alerta.tipo}</h4>
                          <span className={`text-xs font-bold px-2 py-1 rounded border ${getSeveridadColor(alerta.severidad)}`}>
                            {alerta.severidad}
                          </span>
                        </div>
                        <p className="text-sm mb-2">{alerta.descripcion}</p>
                        <p className="text-xs opacity-75">
                          {new Date(alerta.timestamp).toLocaleString('es-ES')}
                        </p>
                      </div>
                      <button
                        onClick={() => handleResolverAlerta(alerta)}
                        disabled={resolviendo === alerta.id}
                        className="ml-4 px-3 py-2 bg-green-600 text-white text-sm font-medium rounded-md hover:bg-green-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors whitespace-nowrap"
                      >
                        {resolviendo === alerta.id ? 'Resolviendo...' : 'Resolver'}
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Pie */}
        <div className="sticky bottom-0 bg-gray-50 border-t border-gray-200 px-6 py-4 flex justify-end">
          <button
            onClick={onClose}
            className="px-4 py-2 bg-gray-600 text-white rounded-md hover:bg-gray-700 transition-colors"
          >
            Cerrar
          </button>
        </div>

        {/* Modal de resolución de alerta */}
        {alertaParaResolver && (
          <ResolverAlertaModal
            alerta={alertaParaResolver}
            onClose={() => setAlertaParaResolver(null)}
            onResuelta={() => {
              onAlertaResuelta?.(alertaParaResolver.id);
              setAlertaParaResolver(null);
            }}
          />
        )}
      </div>
    </div>
  );
};

export default AulaDetailModal;
