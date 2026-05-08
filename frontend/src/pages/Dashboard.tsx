import React, { useEffect, useState } from 'react';
import { useAulas } from '../hooks/useAulas';
import { useAlertas } from '../hooks/useAlertas';
import { useWebSocket } from '../hooks/useWebSocket';
import MetricaCard from '../components/Dashboard/MetricaCard';
import TablaAulas from '../components/Dashboard/TablaAulas';
import AlertasPanel from '../components/Dashboard/AlertasPanel';
import LoadingSpinner from '../components/Common/LoadingSpinner';
import AulaDetailModal from '../components/Common/AulaDetailModal';

const Dashboard: React.FC = () => {
  const { aulas, aulasOrdenadasPorEstado, cargarAulas, loading: aulasLoading, obtenerAulaPorId } = useAulas();
  const { alertasActivas, contarAlertasActivas, cargarAlertas, loading: alertasLoading, alertas } = useAlertas();
  const [modalAbierto, setModalAbierto] = useState(false);
  const [aulaSeleccionada, setAulaSeleccionada] = useState<string | null>(null);
  useWebSocket();

  useEffect(() => {
    cargarAulas();
    cargarAlertas();
  }, []);

  if (aulasLoading || alertasLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <LoadingSpinner tamaño="lg" texto="Cargando dashboard..." />
      </div>
    );
  }

  const consumoTotal = aulas.reduce((sum, aula) => sum + aula.consumoActual, 0);
  const eficienciaPromedio = aulas.length > 0 
    ? aulas.reduce((sum, aula) => sum + aula.eficiencia, 0) / aulas.length 
    : 0;

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Dashboard</h1>
        <p className="text-gray-600">Vista general del sistema de monitoreo energético</p>
      </div>

      {/* Tarjetas de métricas */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <MetricaCard
          titulo="Consumo Total"
          valor={`${consumoTotal.toFixed(2)} kWh`}
          icono="zap"
          color="blue"
          tendencia="estable"
        />
        <MetricaCard
          titulo="Eficiencia Promedio"
          valor={`${eficienciaPromedio.toFixed(1)}%`}
          icono="trending-up"
          color={eficienciaPromedio >= 70 ? 'green' : eficienciaPromedio >= 50 ? 'yellow' : 'red'}
          tendencia={eficienciaPromedio >= 70 ? 'positiva' : 'negativa'}
        />
        <MetricaCard
          titulo="Alertas Activas"
          valor={contarAlertasActivas().toString()}
          icono="alert-circle"
          color={contarAlertasActivas() === 0 ? 'green' : contarAlertasActivas() <= 3 ? 'yellow' : 'red'}
          tendencia="estable"
        />
        <MetricaCard
          titulo="Aulas Monitoreadas"
          valor={aulas.length.toString()}
          icono="building"
          color="blue"
          tendencia="estable"
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Tabla de aulas */}
        <div className="lg:col-span-2">
          <div className="bg-white shadow-sm rounded-lg border border-gray-200">
            <div className="px-6 py-4 border-b border-gray-200">
              <h2 className="text-lg font-semibold text-gray-900">Aulas Monitoreadas</h2>
              <p className="text-sm text-gray-600">Estado actual de todas las aulas</p>
            </div>
            <div className="p-6">
              <TablaAulas 
                aulas={aulasOrdenadasPorEstado()}
                onRowClick={(aulaId) => {
                  setAulaSeleccionada(aulaId);
                  setModalAbierto(true);
                }}
              />
            </div>
          </div>
        </div>

        {/* Panel de alertas */}
        <div className="lg:col-span-1">
          <div className="bg-white shadow-sm rounded-lg border border-gray-200 h-full">
            <div className="px-6 py-4 border-b border-gray-200">
              <h2 className="text-lg font-semibold text-gray-900">Alertas Activas</h2>
              <p className="text-sm text-gray-600">Últimas alertas no resueltas</p>
            </div>
            <div className="p-6">
              <AlertasPanel alertas={alertasActivas().slice(0, 5)} />
            </div>
          </div>
        </div>
      </div>

      {/* Modal de detalles del aula */}
      {modalAbierto && aulaSeleccionada && obtenerAulaPorId(aulaSeleccionada) && (
        <AulaDetailModal
          aula={obtenerAulaPorId(aulaSeleccionada)!}
          alertas={alertas}
          onClose={() => {
            setModalAbierto(false);
            setAulaSeleccionada(null);
          }}
          onAlertaResuelta={() => {
            cargarAlertas();
          }}
        />
      )}
    </div>
  );
};

export default Dashboard;