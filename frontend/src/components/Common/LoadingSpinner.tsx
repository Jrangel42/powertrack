import React from 'react';

interface LoadingSpinnerProps {
  tamaño?: 'sm' | 'md' | 'lg';
  texto?: string;
  centrado?: boolean;
}

const LoadingSpinner: React.FC<LoadingSpinnerProps> = ({
  tamaño = 'md',
  texto,
  centrado = true,
}) => {
  const sizeClasses = {
    sm: 'h-4 w-4 border-2',
    md: 'h-8 w-8 border-3',
    lg: 'h-12 w-12 border-4',
  };

  const containerClasses = centrado
    ? 'flex flex-col items-center justify-center'
    : 'inline-flex flex-col items-center';

  return (
    <div className={containerClasses}>
      <div className="relative">
        <div
          className={`${sizeClasses[tamaño]} rounded-full border-gray-200`}
        ></div>
        <div
          className={`${sizeClasses[tamaño]} absolute top-0 left-0 rounded-full border-blue-600 border-t-transparent animate-spin`}
        ></div>
      </div>
      {texto && (
        <p className="mt-2 text-sm text-gray-600 font-medium">{texto}</p>
      )}
    </div>
  );
};

export default LoadingSpinner;