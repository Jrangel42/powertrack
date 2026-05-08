import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Aula } from '../../types';
import Indicador from '../Common/Indicador';

interface TablaAulasProps {
  aulas: Aula[];
  onRowClick?: (aulaId: string) => void;
}

const TablaAulas: React.FC<TablaAulasProps> = ({ aulas, onRowClick }) => {
  const navigate = useNavigate();

  const handleRowClick = (aulaId: string) => {
    if (onRowClick) {
      onRowClick(aulaId);
    } else {
      navigate(`/historial?aulaId=${aulaId}`);
    }
  };

  if (aulas.length === 0) {
    return (
      <div className="text-center py-12">
        <p className="text-gray-500">No hay aulas registradas</p>
        <button
          onClick={() => navigate('/aulas')}
          className="mt-4 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
        >
          Registrar primera aula
        </button>
      </div>
    );
  }

  return (
    <div className="overflow-x-auto">
      <table className="min-w-full divide-y divide-gray-200">
        <thead>
          <tr>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Aula
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Consumo Actual
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Consumo Esperado
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Eficiencia
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Estado
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Última Actualización
            </th>
          </tr>
        </thead>
        <tbody className="bg-white divide-y divide-gray-200">
          {aulas.map((aula) => (
            <tr
              key={aula.id}
              onClick={() => handleRowClick(aula.id)}
              className="hover:bg-gray-50 cursor-pointer transition-colors"
            >
              <td className="px-6 py-4 whitespace-nowrap">
                <div className="flex items-center">
                  <div className="ml-4">
                    <div className="text-sm font-medium text-gray-900">
                      {aula.nombre}
                    </div>
                    <div className="text-sm text-gray-500">
                      Horario: {aula.horarioInicio}:00 - {aula.horarioCierre}:00
                    </div>
                  </div>
                </div>
              </td>
              <td className="px-6 py-4 whitespace-nowrap">
                <div className="text-sm text-gray-900 font-medium">
                  {aula.consumoActual.toFixed(2)} kWh
                </div>
              </td>
              <td className="px-6 py-4 whitespace-nowrap">
                <div className="text-sm text-gray-900">
                  {aula.consumoEsperado.toFixed(2)} kWh
                </div>
              </td>
              <td className="px-6 py-4 whitespace-nowrap">
                <div className="text-sm text-gray-900 font-medium">
                  {aula.eficiencia.toFixed(1)}%
                </div>
                <div className="text-xs text-gray-500">
                  {aula.eficiencia >= 70 ? 'Excelente' : aula.eficiencia >= 50 ? 'Aceptable' : 'Baja'}
                </div>
              </td>
              <td className="px-6 py-4 whitespace-nowrap">
                <Indicador estado={aula.estado} />
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                {new Date(aula.ultimaActualizacion).toLocaleTimeString('es-ES', {
                  hour: '2-digit',
                  minute: '2-digit',
                })}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default TablaAulas;