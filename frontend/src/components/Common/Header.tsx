import React from 'react';
import { Activity, Wifi, WifiOff } from 'lucide-react';
import { useWebSocket } from '../../hooks/useWebSocket';

const Header: React.FC = () => {
  const { isConnected } = useWebSocket();

  return (
    <header className="bg-white shadow-sm border-b border-gray-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <div className="flex items-center">
            <Activity className="h-8 w-8 text-blue-600" />
            <div className="ml-3">
              <h1 className="text-xl font-bold text-gray-900">PowerTrack</h1>
              <p className="text-sm text-gray-500">Sistema de Monitoreo Energético</p>
            </div>
          </div>
          <div className="flex items-center space-x-4">
            <div className="flex items-center">
              {isConnected ? (
                <>
                  <Wifi className="h-5 w-5 text-green-500" />
                  <span className="ml-2 text-sm text-green-600">Conectado</span>
                </>
              ) : (
                <>
                  <WifiOff className="h-5 w-5 text-red-500" />
                  <span className="ml-2 text-sm text-red-600">Desconectado</span>
                </>
              )}
            </div>
            <div className="text-sm text-gray-500">
              {new Date().toLocaleDateString('es-ES', {
                weekday: 'long',
                year: 'numeric',
                month: 'long',
                day: 'numeric',
              })}
            </div>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;