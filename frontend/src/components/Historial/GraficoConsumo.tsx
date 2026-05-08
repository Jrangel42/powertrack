import React from 'react';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from 'recharts';
import { HistorialEntry } from '../../types';

interface GraficoConsumoProps {
  historial: HistorialEntry[];
  consumoEsperado: number;
}

const GraficoConsumo: React.FC<GraficoConsumoProps> = ({ historial, consumoEsperado }) => {
  if (historial.length === 0) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <p className="text-gray-500">No hay datos de historial disponibles</p>
          <p className="text-sm text-gray-400 mt-1">
            Los datos se mostrarán cuando el sistema genere mediciones
          </p>
        </div>
      </div>
    );
  }

  // Preparar datos para el gráfico
  const datosGrafico = historial.map((entry, index) => ({
    tiempo: new Date(entry.timestamp).toLocaleTimeString('es-ES', {
      hour: '2-digit',
      minute: '2-digit',
    }),
    consumo: entry.valor,
    eficiencia: entry.eficiencia,
    consumoEsperado,
    esAnomalia: entry.esAnomalia ? entry.valor : null,
    index,
  }));

  // Configurar colores
  const colorConsumo = '#3b82f6'; // blue-500
  const colorConsumoEsperado = '#10b981'; // green-500
  const colorEficiencia = '#8b5cf6'; // purple-500
  const colorAnomalia = '#ef4444'; // red-500

  return (
    <div className="h-80">
      <ResponsiveContainer width="100%" height="100%">
        <LineChart
          data={datosGrafico}
          margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
        >
          <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
          <XAxis
            dataKey="tiempo"
            stroke="#6b7280"
            fontSize={12}
            tick={{ fill: '#6b7280' }}
          />
          <YAxis
            stroke="#6b7280"
            fontSize={12}
            tick={{ fill: '#6b7280' }}
            label={{
              value: 'kWh',
              angle: -90,
              position: 'insideLeft',
              offset: -10,
              style: { fill: '#6b7280' },
            }}
          />
          <Tooltip
            contentStyle={{
              backgroundColor: 'white',
              border: '1px solid #e5e7eb',
              borderRadius: '0.375rem',
              boxShadow: '0 1px 3px 0 rgba(0, 0, 0, 0.1)',
            }}
            formatter={(value, name) => {
              if (name === 'consumo' || name === 'consumoEsperado') {
                return [`${value} kWh`, name === 'consumo' ? 'Consumo Actual' : 'Consumo Esperado'];
              }
              if (name === 'eficiencia') {
                return [`${value}%`, 'Eficiencia'];
              }
              return [value, name];
            }}
            labelFormatter={(label) => `Hora: ${label}`}
          />
          <Legend />
          
          {/* Línea de consumo actual */}
          <Line
            type="monotone"
            dataKey="consumo"
            stroke={colorConsumo}
            strokeWidth={2}
            dot={{ r: 3 }}
            activeDot={{ r: 6 }}
            name="Consumo Actual"
          />
          
          {/* Línea de consumo esperado */}
          <Line
            type="monotone"
            dataKey="consumoEsperado"
            stroke={colorConsumoEsperado}
            strokeWidth={2}
            strokeDasharray="5 5"
            dot={false}
            name="Consumo Esperado"
          />
          
          {/* Línea de eficiencia (eje secundario) */}
          <Line
            type="monotone"
            dataKey="eficiencia"
            stroke={colorEficiencia}
            strokeWidth={2}
            dot={{ r: 3 }}
            yAxisId="right"
            name="Eficiencia (%)"
          />
          
          {/* Puntos de anomalías */}
          <Line
            type="monotone"
            dataKey="esAnomalia"
            stroke={colorAnomalia}
            strokeWidth={0}
            dot={{
              r: 6,
              fill: colorAnomalia,
              strokeWidth: 2,
              stroke: 'white',
            }}
            activeDot={{ r: 8 }}
            name="Anomalías"
            connectNulls
          />
          
          <YAxis
            yAxisId="right"
            orientation="right"
            stroke="#6b7280"
            fontSize={12}
            tick={{ fill: '#6b7280' }}
            label={{
              value: '%',
              angle: 90,
              position: 'insideRight',
              offset: -10,
              style: { fill: '#6b7280' },
            }}
            domain={[0, 100]}
          />
        </LineChart>
      </ResponsiveContainer>
      
      <div className="mt-4 text-sm text-gray-600">
        <div className="flex items-center justify-center space-x-6">
          <div className="flex items-center">
            <div className="h-3 w-3 rounded-full bg-blue-500 mr-2"></div>
            <span>Consumo Actual</span>
          </div>
          <div className="flex items-center">
            <div className="h-3 w-3 rounded-full bg-green-500 mr-2"></div>
            <span>Consumo Esperado</span>
          </div>
          <div className="flex items-center">
            <div className="h-3 w-3 rounded-full bg-purple-500 mr-2"></div>
            <span>Eficiencia</span>
          </div>
          <div className="flex items-center">
            <div className="h-3 w-3 rounded-full bg-red-500 mr-2"></div>
            <span>Anomalías</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default GraficoConsumo;