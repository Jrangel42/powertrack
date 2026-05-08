import React from 'react';

interface IndicadorProps {
  estado: 'Normal' | 'Advertencia' | 'Crítico';
  texto?: string;
  tamaño?: 'sm' | 'md' | 'lg';
}

const Indicador: React.FC<IndicadorProps> = ({ estado, texto, tamaño = 'md' }) => {
  const config = {
    Normal: {
      color: 'bg-green-500',
      textColor: 'text-green-800',
      borderColor: 'border-green-300',
      label: 'Normal',
    },
    Advertencia: {
      color: 'bg-yellow-500',
      textColor: 'text-yellow-800',
      borderColor: 'border-yellow-300',
      label: 'Advertencia',
    },
    Crítico: {
      color: 'bg-red-500',
      textColor: 'text-red-800',
      borderColor: 'border-red-300',
      label: 'Crítico',
    },
  };

  const { color, textColor, borderColor, label } = config[estado];
  const displayText = texto || label;

  const sizeClasses = {
    sm: 'px-2 py-1 text-xs',
    md: 'px-3 py-1.5 text-sm',
    lg: 'px-4 py-2 text-base',
  };

  return (
    <span
      className={`inline-flex items-center rounded-full border ${borderColor} ${color} ${textColor} ${sizeClasses[tamaño]} font-medium`}
    >
      <span className="h-2 w-2 rounded-full bg-current mr-2"></span>
      {displayText}
    </span>
  );
};

export default Indicador;