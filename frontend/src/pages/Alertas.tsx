import React, { useEffect, useState } from 'react';
import { AlertCircle, CheckCircle, Filter, X } from 'lucide-react';
import { useAlertas } from '../hooks/useAlertas';
import { useAulas } from '../hooks/useAulas';
import LoadingSpinner from '../components/Common/LoadingSpinner';

const Alertas: React.FC = () => {
  const {
    alertas,
    alertasActivas,
    cargarAlertas,
    resolverAlerta,
    loading,
    error,
  } = useAlertas();

  const { aulas } = useAulas();
  const [filtroAula, setFiltroAula] = useState<string>('todas');
  const [filtroSeveridad, setFiltroSeveridad] = useState<string>('todas');
  const [filtroResueltas, setFiltroResueltas] = useState<string>('activas');

  useEffect(() => {
    cargarAlertas();
  }, []);

  // Filtrar alertas
  const alertasFiltradas = alertas.filter((alerta) => {
    // Filtro por aula
    if (filtroAula !== 'todas' && alerta.aulaId !== filtroAula) {
      return false;
    }

    // Filtro por severidad
    if (filtroSeveridad !== 'todas' && alerta.severidad !== filtroSeveridad) {
      return false;
    }

    // Filtro por estado
    if (filtroResueltas === 'activas' && alerta.resuelta) {
      return false;
    }
    if (filtroResueltas === 'resueltas' && !alerta.resuelta) {
      return false;
    }

    return true;
  });

  const handleResolver = async (id: string) => {
    try {
      await resolverAlerta(id);
    } catch (error) {
      console.error('Error al resolver alerta:', error);
    }
  };

  const limpiarFiltros = () => {
    setFiltroAula('todas');
    setFiltroSeveridad('todas');
    setFiltroResueltas('activas');
  };

  const severidadConfig = {
    Baja: {
      color: 'bg-yellow-100 text-yellow-800',
      borderColor: 'border-yellow-200',
    },
    Media: {
      color: 'bg-orange-100 text-orange-800',
      borderColor: 'border-orange-200',
    },
    Alta: {
      color: 'bg-red-100 text-red-800',
      borderColor: 'border-red-200',
    },
  };

  const tipoConfig = {
    'Consumo Elevado': {
      icon: AlertCircle,
      color: 'text-red-600',
    },
    'Eficiencia Baja': {
      icon: AlertCircle,
      color: 'text-orange-600',
    },
    'Consumo Fuera de Horario': {
      icon: AlertCircle,
      color: 'text-yellow-600',
    },
  };

  if (loading && alertas.length === 0) {
    return (
      <div className="flex items-center justify-center h-64">
        <LoadingSpinner tamaño="lg" texto="Cargando alertas..." />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Gestión de Alertas</h1>
        <p className="text-gray-600">Monitorea y gestiona las alertas del sistema</p>
      </div>

      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-md">
          {error}
        </div>
      )}

      {/* Estadísticas */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-white shadow-sm rounded-lg border border-gray-200 p-4">
          <div className="flex items-center">
            <AlertCircle className="h-8 w-8 text-red-500 mr-3" />
            <div>
              <p className="text-sm text-gray-500">Total Alertas</p>
              <p className="text-2xl font-bold text-gray-900">{alertas.length}</p>
            </div>
          </div>
        </div>
        <div className="bg-white shadow-sm rounded-lg border border-gray-200 p-4">
          <div className="flex items-center">
            <AlertCircle className="h-8 w-8 text-yellow-500 mr-3" />
            <div>
              <p className="text-sm text-gray-500">Alertas Activas</p>
              <p className="text-2xl font-bold text-gray-900">{alertasActivas().length}</p>
            </div>
          </div>
        </div>
        <div className="bg-white shadow-sm rounded-lg border border-gray-200 p-4">
          <div className="flex items-center">
            <CheckCircle className="h-8 w-8 text-green-500 mr-3" />
            <div>
              <p className="text-sm text-gray-500">Alertas Resueltas</p>
              <p className="text-2xl font-bold text-gray-900">
                {alertas.length - alertasActivas().length}
              </p>
            </div>
          </div>
        </div>
        <div className="bg-white shadow-sm rounded-lg border border-gray-200 p-4">
          <div className="flex items-center">
            <AlertCircle className="h-8 w-8 text-blue-500 mr-3" />
            <div>
              <p className="text-sm text-gray-500">Aulas con Alertas</p>
              <p className="text-2xl font-bold text-gray-900">
                {new Set(alertas.map((a) => a.aulaId)).size}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Filtros */}
      <div className="bg-white shadow-sm rounded-lg border border-gray-200 p-4">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center">
            <Filter className="h-5 w-5 text-gray-500 mr-2" />
            <h3 className="text-lg font-medium text-gray-900">Filtros</h3>
          </div>
          <button
            onClick={limpiarFiltros}
            className="text-sm text-gray-600 hover:text-gray-900 flex items-center"
          >
            <X className="h-4 w-4 mr-1" />
            Limpiar filtros
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Filtrar por Aula
            </label>
            <select
              value={filtroAula}
              onChange={(e) => setFiltroAula(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="todas">Todas las aulas</option>
              {aulas.map((aula) => (
                <option key={aula.id} value={aula.id}>
                  {aula.nombre}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Filtrar por Severidad
            </label>
            <select
              value={filtroSeveridad}
              onChange={(e) => setFiltroSeveridad(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="todas">Todas las severidades</option>
              <option value="Baja">Baja</option>
              <option value="Media">Media</option>
              <option value="Alta">Alta</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Filtrar por Estado
            </label>
            <select
              value={filtroResueltas}
              onChange={(e) => setFiltroResueltas(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="activas">Solo activas</option>
              <option value="resueltas">Solo resueltas</option>
              <option value="todas">Todas</option>
            </select>
          </div>
        </div>
      </div>

      {/* Lista de alertas */}
      <div className="bg-white shadow-sm rounded-lg border border-gray-200 overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-200">
          <h2 className="text-lg font-semibold text-gray-900">
            Alertas ({alertasFiltradas.length})
          </h2>
          <p className="text-sm text-gray-600">
            {filtroResueltas === 'activas' ? 'Alertas activas' : 
             filtroResueltas === 'resueltas' ? 'Alertas resueltas' : 'Todas las alertas'}
          </p>
        </div>

        {alertasFiltradas.length === 0 ? (
          <div className="text-center py-12">
            <CheckCircle className="h-12 w-12 text-green-500 mx-auto" />
            <p className="mt-4 text-gray-600">No hay alertas con los filtros seleccionados</p>
            <button
              onClick={limpiarFiltros}
              className="mt-4 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
            >
              Ver todas las alertas
            </button>
          </div>
        ) : (
          <div className="divide-y divide-gray-200">
            {alertasFiltradas.map((alerta) => {
              const { color, borderColor } = severidadConfig[alerta.severidad];
              const { icon: Icon, color: iconColor } = tipoConfig[alerta.tipo];
              const tiempoTranscurrido = Math.floor(
                (new Date().getTime() - new Date(alerta.timestamp).getTime()) / (1000 * 60)
              );

              return (
                <div
                  key={alerta.id}
                  className={`p-6 hover:bg-gray-50 transition-colors ${alerta.resuelta ? 'opacity-75' : ''}`}
                >
                  <div className="flex items-start justify-between">
                    <div className="flex items-start">
                      <Icon className={`h-6 w-6 mt-0.5 mr-4 ${iconColor}`} />
                      <div>
                        <div className="flex items-center">
                          <h4 className="font-medium text-gray-900">{alerta.tipo}</h4>
                          <span
                            className={`ml-3 text-xs font-medium px-2 py-1 rounded-full ${color} ${borderColor} border`}
                          >
                            {alerta.severidad}
                          </span>
                          {alerta.resuelta && (
                            <span className="ml-2 text-xs font-medium px-2 py-1 rounded-full bg-green-100 text-green-800 border border-green-200">
                              Resuelta
                            </span>
                          )}
                        </div>
                        <p className="text-gray-700 mt-1">{alerta.descripcion}</p>
                        <div className="flex items-center mt-3 text-sm text-gray-500">
                          <span className="font-medium">{alerta.aulaNombre}</span>
                          <span className="mx-2">•</span>
                          <span>
                            {new Date(alerta.timestamp).toLocaleDateString('es-ES', {
                              weekday: 'short',
                              month: 'short',
                              day: 'numeric',
                              hour: '2-digit',
                              minute: '2-digit',
                            })}
                          </span>
                          <span className="mx-2">•</span>
                          <span>Hace {tiempoTranscurrido} minutos</span>
                        </div>
                      </div>
                    </div>
                    {!alerta.resuelta && (
                      <button
                        onClick={() => handleResolver(alerta.id)}
                        className="px-4 py-2 bg-blue-600 text-white text-sm font-medium rounded-md hover:bg-blue-700 transition-colors"
                      >
                        Marcar como Resuelta
                      </button>
                    )}
                  </div>
                  {alerta.resuelta && alerta.resolutionTime && (
                    <div className="mt-3 text-sm text-green-600 flex items-center">
                      <CheckCircle className="h-4 w-4 mr-2" />
                      Resuelta el {new Date(alerta.resolutionTime).toLocaleDateString('es-ES')} a las{' '}
                      {new Date(alerta.resolutionTime).toLocaleTimeString('es-ES', {
                        hour: '2-digit',
                        minute: '2-digit',
                      })}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};

export default Alertas;