import React from 'react';
import { AlertCircle, CheckCircle, Clock } from 'lucide-react';
import { Alerta } from '../../types';
import { useAlertas } from '../../hooks/useAlertas';

interface AlertasPanelProps {
  alertas: Alerta[];
}

const AlertasPanel: React.FC<AlertasPanelProps> = ({ alertas }) => {
  const { resolverAlerta } = useAlertas();

  const severidadConfig = {
    Baja: {
      color: 'bg-yellow-100 text-yellow-800 border-yellow-200',
      icon: AlertCircle,
    },
    Media: {
      color: 'bg-orange-100 text-orange-800 border-orange-200',
      icon: AlertCircle,
    },
    Alta: {
      color: 'bg-red-100 text-red-800 border-red-200',
      icon: AlertCircle,
    },
  };

  const tipoConfig = {
    'Consumo Elevado': 'Consumo superior al 120% del promedio',
    'Eficiencia Baja': 'Eficiencia inferior al 70%',
    'Consumo Fuera de Horario': 'Consumo fuera del horario operativo',
  };

  const handleResolver = async (id: string) => {
    try {
      await resolverAlerta(id);
    } catch (error) {
      console.error('Error al resolver alerta:', error);
    }
  };

  if (alertas.length === 0) {
    return (
      <div className="text-center py-8">
        <CheckCircle className="h-12 w-12 text-green-500 mx-auto" />
        <p className="mt-4 text-gray-600">No hay alertas activas</p>
        <p className="text-sm text-gray-500">El sistema está funcionando correctamente</p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {alertas.map((alerta) => {
        const { color, icon: Icon } = severidadConfig[alerta.severidad];
        const tiempoTranscurrido = Math.floor(
          (new Date().getTime() - new Date(alerta.timestamp).getTime()) / (1000 * 60)
        );

        return (
          <div
            key={alerta.id}
            className={`rounded-lg border ${color} p-4 transition-all hover:shadow-sm`}
          >
            <div className="flex items-start justify-between">
              <div className="flex items-start">
                <Icon className="h-5 w-5 mt-0.5 mr-3" />
                <div>
                  <div className="flex items-center">
                    <h4 className="font-medium">{alerta.tipo}</h4>
                    <span className="ml-2 text-xs font-medium px-2 py-0.5 rounded-full bg-white">
                      {alerta.severidad}
                    </span>
                  </div>
                  <p className="text-sm mt-1">{alerta.descripcion}</p>
                  <div className="flex items-center mt-2 text-xs text-gray-600">
                    <Clock className="h-3 w-3 mr-1" />
                    <span>Aula: {alerta.aulaNombre}</span>
                    <span className="mx-2">•</span>
                    <span>Hace {tiempoTranscurrido} min</span>
                  </div>
                </div>
              </div>
              {!alerta.resuelta && (
                <button
                  onClick={() => handleResolver(alerta.id)}
                  className="text-xs font-medium px-3 py-1 bg-white border border-gray-300 rounded-md hover:bg-gray-50 transition-colors"
                >
                  Resolver
                </button>
              )}
            </div>
            {alerta.resuelta && (
              <div className="mt-2 text-xs text-green-600 flex items-center">
                <CheckCircle className="h-3 w-3 mr-1" />
                Resuelta {alerta.resolutionTime && new Date(alerta.resolutionTime).toLocaleTimeString()}
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
};

export default AlertasPanel;