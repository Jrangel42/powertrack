import React, { useState, useEffect } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, BarChart3, Calendar, TrendingDown, TrendingUp } from 'lucide-react';
import { useAulas } from '../hooks/useAulas';
import { useAlertas } from '../hooks/useAlertas';
import { obtenerHistorial, obtenerEstadisticas } from '../services/api';
import { HistorialEntry, Estadisticas } from '../types';
import GraficoConsumo from '../components/Historial/GraficoConsumo';
import TablaConsumo from '../components/Historial/TablaConsumo';
import LoadingSpinner from '../components/Common/LoadingSpinner';
import Indicador from '../components/Common/Indicador';
import AulaDetailModal from '../components/Common/AulaDetailModal';

const HistorialConsumo: React.FC = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const aulaId = searchParams.get('aulaId');
  
  const { aulas, obtenerAulaPorId, seleccionarAula } = useAulas();
  const { alertas, cargarAlertas } = useAlertas();
  const [historial, setHistorial] = useState<HistorialEntry[]>([]);
  const [estadisticas, setEstadisticas] = useState<Estadisticas | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [modalAbierto, setModalAbierto] = useState(false);

  const aula = aulaId ? obtenerAulaPorId(aulaId) : null;

  useEffect(() => {
    const cargarHistorial = async () => {
      if (!aulaId) return;

      setLoading(true);
      setError(null);

      try {
        const [historialData, estadisticasData] = await Promise.all([
          obtenerHistorial(aulaId),
          obtenerEstadisticas(aulaId),
        ]);
        
        setHistorial(historialData);
        setEstadisticas(estadisticasData);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Error al cargar historial');
      } finally {
        setLoading(false);
      }
    };

    cargarHistorial();
    cargarAlertas();
  }, [aulaId]);

  const handleVolver = () => {
    seleccionarAula(null);
    window.history.back();
  };

  if (!aulaId) {
    return (
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Historial de Consumo</h1>
          <p className="text-gray-600">Selecciona un aula para ver su historial detallado</p>
        </div>

        {aulas.length === 0 ? (
          <div className="bg-white shadow-sm rounded-lg border border-gray-200 p-12 text-center">
            <BarChart3 className="h-12 w-12 text-gray-400 mx-auto" />
            <h3 className="mt-4 text-lg font-medium text-gray-900">No hay aulas registradas</h3>
            <p className="mt-2 text-gray-600">Crea una aula primero para ver su historial</p>
            <button
              onClick={() => window.location.href = '/aulas'}
              className="mt-4 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
            >
              Ir a Gestión de Aulas
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {aulas.map((aula) => (
              <button
                key={aula.id}
                onClick={() => {
                  seleccionarAula(aula.id);
                  setModalAbierto(true);
                }}
                className="bg-white shadow-sm rounded-lg border border-gray-200 p-6 hover:shadow-md hover:border-blue-300 transition-all text-left"
              >
                <div className="flex items-start justify-between mb-4">
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900">{aula.nombre}</h3>
                    <p className="text-sm text-gray-500 mt-1">
                      Horario: {aula.horarioInicio}:00 - {aula.horarioCierre}:00
                    </p>
                  </div>
                  <Indicador estado={aula.estado} />
                </div>
                <div className="grid grid-cols-2 gap-4 mt-4 pt-4 border-t border-gray-200">
                  <div>
                    <p className="text-xs text-gray-500">Consumo Actual</p>
                    <p className="text-sm font-bold text-gray-900">
                      {aula.consumoActual.toFixed(2)} kWh
                    </p>
                  </div>
                  <div>
                    <p className="text-xs text-gray-500">Eficiencia</p>
                    <p className="text-sm font-bold text-gray-900">
                      {aula.eficiencia.toFixed(1)}%
                    </p>
                  </div>
                </div>
                <div className="mt-4 pt-4 border-t border-gray-200">
                  <p className="text-xs text-blue-600 font-medium">Ver detalles →</p>
                </div>
              </button>
            ))}
          </div>
        )}
      </div>
    );
  }

  if (!aula) {
    return (
      <div className="text-center py-12">
        <p className="text-gray-500">Aula no encontrada</p>
        <button
          onClick={handleVolver}
          className="mt-4 px-4 py-2 bg-gray-600 text-white rounded-md hover:bg-gray-700 transition-colors"
        >
          Volver
        </button>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Encabezado */}
      <div className="flex items-center justify-between">
        <div className="flex items-center">
          <button
            onClick={handleVolver}
            className="mr-4 text-gray-600 hover:text-gray-900 transition-colors"
            title="Volver"
          >
            <ArrowLeft className="h-5 w-5" />
          </button>
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Historial de Consumo</h1>
            <div className="flex items-center mt-1 space-x-4">
              <p className="text-gray-600">{aula.nombre}</p>
              <Indicador estado={aula.estado} />
              <div className="text-sm text-gray-500">
                Horario: {aula.horarioInicio}:00 - {aula.horarioCierre}:00
              </div>
            </div>
          </div>
        </div>
        <div className="text-right">
          <div className="text-sm text-gray-500">Consumo Actual</div>
          <div className="text-xl font-bold text-gray-900">
            {aula.consumoActual.toFixed(2)} kWh
          </div>
          <div className="text-sm text-gray-500">
            Eficiencia: {aula.eficiencia.toFixed(1)}%
          </div>
        </div>
      </div>

      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-md">
          {error}
        </div>
      )}

      {loading ? (
        <div className="flex items-center justify-center h-64">
          <LoadingSpinner tamaño="lg" texto="Cargando historial..." />
        </div>
      ) : (
        <>
          {/* Gráfico */}
          <div className="bg-white shadow-sm rounded-lg border border-gray-200">
            <div className="px-6 py-4 border-b border-gray-200">
              <h2 className="text-lg font-semibold text-gray-900">Tendencia de Consumo</h2>
              <p className="text-sm text-gray-600">Últimas 100 mediciones</p>
            </div>
            <div className="p-6">
              <GraficoConsumo historial={historial} consumoEsperado={aula.consumoEsperado} />
            </div>
          </div>

          {/* Estadísticas */}
          {estadisticas && (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
              <div className="bg-white shadow-sm rounded-lg border border-gray-200 p-4">
                <div className="flex items-center">
                  <TrendingDown className="h-5 w-5 text-green-600 mr-2" />
                  <div>
                    <p className="text-sm text-gray-500">Consumo Mínimo</p>
                    <p className="text-lg font-bold text-gray-900">
                      {estadisticas.consumoMinimo.toFixed(2)} kWh
                    </p>
                  </div>
                </div>
              </div>
              <div className="bg-white shadow-sm rounded-lg border border-gray-200 p-4">
                <div className="flex items-center">
                  <TrendingUp className="h-5 w-5 text-red-600 mr-2" />
                  <div>
                    <p className="text-sm text-gray-500">Consumo Máximo</p>
                    <p className="text-lg font-bold text-gray-900">
                      {estadisticas.consumoMaximo.toFixed(2)} kWh
                    </p>
                  </div>
                </div>
              </div>
              <div className="bg-white shadow-sm rounded-lg border border-gray-200 p-4">
                <div className="flex items-center">
                  <BarChart3 className="h-5 w-5 text-blue-600 mr-2" />
                  <div>
                    <p className="text-sm text-gray-500">Consumo Promedio</p>
                    <p className="text-lg font-bold text-gray-900">
                      {estadisticas.consumoPromedio.toFixed(2)} kWh
                    </p>
                  </div>
                </div>
              </div>
              <div className="bg-white shadow-sm rounded-lg border border-gray-200 p-4">
                <div className="flex items-center">
                  <BarChart3 className="h-5 w-5 text-purple-600 mr-2" />
                  <div>
                    <p className="text-sm text-gray-500">Desviación Estándar</p>
                    <p className="text-lg font-bold text-gray-900">
                      {estadisticas.desviacionEstandar.toFixed(2)} kWh
                    </p>
                  </div>
                </div>
              </div>
              <div className="bg-white shadow-sm rounded-lg border border-gray-200 p-4">
                <div className="flex items-center">
                  <TrendingUp className="h-5 w-5 text-green-600 mr-2" />
                  <div>
                    <p className="text-sm text-gray-500">Eficiencia Promedio</p>
                    <p className="text-lg font-bold text-gray-900">
                      {estadisticas.eficienciaPromedio.toFixed(1)}%
                    </p>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Tabla de historial */}
          <div className="bg-white shadow-sm rounded-lg border border-gray-200">
            <div className="px-6 py-4 border-b border-gray-200">
              <h2 className="text-lg font-semibold text-gray-900">Registro Detallado</h2>
              <p className="text-sm text-gray-600">Últimas 20 mediciones</p>
            </div>
            <div className="p-6">
              <TablaConsumo historial={historial.slice(-20).reverse()} />
            </div>
          </div>
        </>
      )}

      {/* Modal de detalles del aula */}
      {modalAbierto && aula && (
        <AulaDetailModal
          aula={aula}
          alertas={alertas}
          onClose={() => {
            setModalAbierto(false);
            seleccionarAula(null);
          }}
          onAlertaResuelta={() => {
            cargarAlertas();
          }}
        />
      )}
    </div>
  );
};

export default HistorialConsumo;