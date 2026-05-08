import React from 'react';
import { Zap, TrendingUp, AlertCircle, Building, LucideIcon } from 'lucide-react';

interface MetricaCardProps {
  titulo: string;
  valor: string;
  icono: 'zap' | 'trending-up' | 'alert-circle' | 'building';
  color: 'blue' | 'green' | 'yellow' | 'red';
  tendencia: 'positiva' | 'negativa' | 'estable';
}

const MetricaCard: React.FC<MetricaCardProps> = ({
  titulo,
  valor,
  icono,
  color,
  tendencia,
}) => {
  const iconos: Record<string, LucideIcon> = {
    zap: Zap,
    'trending-up': TrendingUp,
    'alert-circle': AlertCircle,
    building: Building,
  };

  const Icono = iconos[icono];

  const colorClasses = {
    blue: 'bg-blue-50 text-blue-600 border-blue-200',
    green: 'bg-green-50 text-green-600 border-green-200',
    yellow: 'bg-yellow-50 text-yellow-600 border-yellow-200',
    red: 'bg-red-50 text-red-600 border-red-200',
  };

  const tendenciaConfig = {
    positiva: { texto: '+2.5%', color: 'text-green-600' },
    negativa: { texto: '-1.8%', color: 'text-red-600' },
    estable: { texto: '0.0%', color: 'text-gray-600' },
  };

  const { texto: tendenciaTexto, color: tendenciaColor } = tendenciaConfig[tendencia];

  return (
    <div className={`rounded-lg border ${colorClasses[color]} p-6`}>
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm font-medium opacity-80">{titulo}</p>
          <p className="text-2xl font-bold mt-2">{valor}</p>
          <div className="flex items-center mt-2">
            <span className={`text-sm font-medium ${tendenciaColor}`}>
              {tendenciaTexto}
            </span>
            <span className="text-sm text-gray-500 ml-2">vs. ayer</span>
          </div>
        </div>
        <div className={`p-3 rounded-full ${colorClasses[color].split(' ')[0]}`}>
          <Icono className="h-6 w-6" />
        </div>
      </div>
    </div>
  );
};

export default MetricaCard;