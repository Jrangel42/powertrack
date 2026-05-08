import React, { useState, useEffect } from 'react';
import { Plus, Edit, Trash2 } from 'lucide-react';
import { useAulas } from '../hooks/useAulas';
import FormularioAula from '../components/Formulario/FormularioAula';
import ConfirmDialog from '../components/Common/ConfirmDialog';
import LoadingSpinner from '../components/Common/LoadingSpinner';
import Indicador from '../components/Common/Indicador';

const GestionAulas: React.FC = () => {
  const {
    aulas,
    aulasOrdenadasPorEstado,
    cargarAulas,
    eliminarAulaExistente,
    seleccionarAula,
    loading,
    error,
  } = useAulas();

  const [modalAbierto, setModalAbierto] = useState<'crear' | 'editar' | null>(null);
  const [aulaAEliminar, setAulaAEliminar] = useState<string | null>(null);
  const [aulaEditando, setAulaEditando] = useState<string | null>(null);

  useEffect(() => {
    cargarAulas();
  }, []);

  const handleCrearAula = () => {
    setAulaEditando(null);
    setModalAbierto('crear');
  };

  const handleEditarAula = (id: string) => {
    setAulaEditando(id);
    setModalAbierto('editar');
  };

  const handleEliminarAula = (id: string) => {
    setAulaAEliminar(id);
  };

  const confirmarEliminar = async () => {
    if (aulaAEliminar) {
      try {
        await eliminarAulaExistente(aulaAEliminar);
        setAulaAEliminar(null);
      } catch (error) {
        console.error('Error al eliminar aula:', error);
      }
    }
  };

  const aulaEditandoData = aulaEditando
    ? aulas.find((a) => a.id === aulaEditando)
    : null;

  if (loading && aulas.length === 0) {
    return (
      <div className="flex items-center justify-center h-64">
        <LoadingSpinner tamaño="lg" texto="Cargando aulas..." />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Gestión de Aulas</h1>
          <p className="text-gray-600">Registra y administra las aulas del sistema</p>
        </div>
        <button
          onClick={handleCrearAula}
          className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
        >
          <Plus className="h-5 w-5 mr-2" />
          Nueva Aula
        </button>
      </div>

      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-md">
          {error}
        </div>
      )}

      <div className="bg-white shadow-sm rounded-lg border border-gray-200 overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-200">
          <h2 className="text-lg font-semibold text-gray-900">Aulas Registradas</h2>
          <p className="text-sm text-gray-600">
            {aulas.length} aula{aulas.length !== 1 ? 's' : ''} registrada{aulas.length !== 1 ? 's' : ''}
          </p>
        </div>

        {aulas.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-gray-500">No hay aulas registradas</p>
            <button
              onClick={handleCrearAula}
              className="mt-4 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
            >
              Registrar primera aula
            </button>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead>
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Aula
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Horario
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Consumo Esperado
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Estado
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Fecha Registro
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Acciones
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {aulasOrdenadasPorEstado().map((aula) => (
                  <tr key={aula.id} className="hover:bg-gray-50 transition-colors">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-medium text-gray-900">
                        {aula.nombre}
                      </div>
                      <div className="text-sm text-gray-500">
                        ID: {aula.id.substring(0, 8)}...
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">
                        {aula.horarioInicio}:00 - {aula.horarioCierre}:00
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900 font-medium">
                        {aula.consumoEsperado.toFixed(2)} kWh
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <Indicador estado={aula.estado} />
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {new Date(aula.createdAt).toLocaleDateString('es-ES')}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      <div className="flex space-x-2">
                        <button
                          onClick={() => handleEditarAula(aula.id)}
                          className="text-blue-600 hover:text-blue-900 transition-colors"
                          title="Editar"
                        >
                          <Edit className="h-5 w-5" />
                        </button>
                        <button
                          onClick={() => handleEliminarAula(aula.id)}
                          className="text-red-600 hover:text-red-900 transition-colors"
                          title="Eliminar"
                        >
                          <Trash2 className="h-5 w-5" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Modal de formulario */}
      {(modalAbierto === 'crear' || modalAbierto === 'editar') && (
        <FormularioAula
          modo={modalAbierto}
          aula={aulaEditandoData}
          onClose={() => {
            setModalAbierto(null);
            setAulaEditando(null);
          }}
          onSuccess={() => {
            setModalAbierto(null);
            setAulaEditando(null);
            cargarAulas();
          }}
        />
      )}

      {/* Diálogo de confirmación de eliminación */}
      {aulaAEliminar && (
        <ConfirmDialog
          titulo="Eliminar Aula"
          mensaje="¿Estás seguro de que deseas eliminar esta aula? Esta acción no se puede deshacer."
          onConfirm={confirmarEliminar}
          onCancel={() => setAulaAEliminar(null)}
        />
      )}
    </div>
  );
};

export default GestionAulas;