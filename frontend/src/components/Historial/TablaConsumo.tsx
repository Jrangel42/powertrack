import React from 'react';
import { AlertCircle } from 'lucide-react';
import { HistorialEntry } from '../../types';
import Indicador from '../Common/Indicador';

interface TablaConsumoProps {
  historial: HistorialEntry[];
}

const TablaConsumo: React.FC<TablaConsumoProps> = ({ historial }) => {
  if (historial.length === 0) {
    return (
      <div className="text-center py-8">
        <p className="text-gray-500">No hay registros de consumo</p>
      </div>
    );
  }

  const clasificarEstado = (eficiencia: number) => {
    if (eficiencia >= 70) return 'Normal';
    if (eficiencia >= 50) return 'Advertencia';
    return 'Crítico';
  };

  return (
    <div className="overflow-x-auto">
      <table className="min-w-full divide-y divide-gray-200">
        <thead>
          <tr>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Hora
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Consumo (kWh)
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Eficiencia
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Estado
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Anomalía
            </th>
          </tr>
        </thead>
        <tbody className="bg-white divide-y divide-gray-200">
          {historial.map((entry, index) => {
            const estado = clasificarEstado(entry.eficiencia);
            const hora = new Date(entry.timestamp).toLocaleTimeString('es-ES', {
              hour: '2-digit',
              minute: '2-digit',
              second: '2-digit',
            });

            return (
              <tr key={index} className="hover:bg-gray-50 transition-colors">
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                  {hora}
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm font-medium text-gray-900">
                    {entry.valor.toFixed(2)} kWh
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm text-gray-900 font-medium">
                    {entry.eficiencia.toFixed(1)}%
                  </div>
                  <div className="text-xs text-gray-500">
                    {entry.eficiencia >= 70 ? 'Excelente' : entry.eficiencia >= 50 ? 'Aceptable' : 'Baja'}
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <Indicador estado={estado} tamaño="sm" />
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  {entry.esAnomalia ? (
                    <div className="flex items-center text-red-600">
                      <AlertCircle className="h-4 w-4 mr-1" />
                      <span className="text-sm">Detectada</span>
                    </div>
                  ) : (
                    <span className="text-sm text-gray-500">Normal</span>
                  )}
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
};

export default TablaConsumo;