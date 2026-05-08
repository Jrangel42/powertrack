import React, { useState, useEffect } from 'react';
import { X } from 'lucide-react';
import { useAulas } from '../../hooks/useAulas';
import { Aula, CreateAulaDto, UpdateAulaDto } from '../../types';
import LoadingSpinner from '../Common/LoadingSpinner';

interface FormularioAulaProps {
  modo: 'crear' | 'editar';
  aula?: Aula | null;
  onClose: () => void;
  onSuccess: () => void;
}

const FormularioAula: React.FC<FormularioAulaProps> = ({
  modo,
  aula,
  onClose,
  onSuccess,
}) => {
  const { crearNuevaAula, actualizarAulaExistente, loading } = useAulas();
  const [formData, setFormData] = useState<CreateAulaDto>({
    nombre: '',
    horarioInicio: 6,
    horarioCierre: 22,
    consumoEsperado: 10,
  });
  const [errores, setErrores] = useState<Record<string, string>>({});

  useEffect(() => {
    if (modo === 'editar' && aula) {
      setFormData({
        nombre: aula.nombre,
        horarioInicio: aula.horarioInicio,
        horarioCierre: aula.horarioCierre,
        consumoEsperado: aula.consumoEsperado,
      });
    }
  }, [modo, aula]);

  const validarFormulario = (): boolean => {
    const nuevosErrores: Record<string, string> = {};

    if (!formData.nombre.trim()) {
      nuevosErrores.nombre = 'El nombre es requerido';
    }

    if (formData.horarioInicio < 0 || formData.horarioInicio > 23) {
      nuevosErrores.horarioInicio = 'El horario de inicio debe estar entre 0 y 23';
    }

    if (formData.horarioCierre < 0 || formData.horarioCierre > 23) {
      nuevosErrores.horarioCierre = 'El horario de cierre debe estar entre 0 y 23';
    }

    if (formData.horarioCierre <= formData.horarioInicio) {
      nuevosErrores.horarioCierre = 'El horario de cierre debe ser mayor al de inicio';
    }

    if (formData.consumoEsperado <= 0) {
      nuevosErrores.consumoEsperado = 'El consumo esperado debe ser mayor a 0';
    }

    setErrores(nuevosErrores);
    return Object.keys(nuevosErrores).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validarFormulario()) {
      return;
    }

    try {
      if (modo === 'crear') {
        await crearNuevaAula(formData);
      } else if (modo === 'editar' && aula) {
        await actualizarAulaExistente(aula.id, formData);
      }
      onSuccess();
    } catch (error) {
      console.error('Error al guardar aula:', error);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: name === 'nombre' ? value : parseFloat(value) || 0,
    }));
    // Limpiar error del campo al cambiar
    if (errores[name]) {
      setErrores((prev) => ({ ...prev, [name]: '' }));
    }
  };

  const titulo = modo === 'crear' ? 'Registrar Nueva Aula' : 'Editar Aula';
  const textoBoton = modo === 'crear' ? 'Crear Aula' : 'Guardar Cambios';

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-xl max-w-md w-full max-h-[90vh] overflow-y-auto">
        <div className="px-6 py-4 border-b border-gray-200 flex justify-between items-center">
          <h3 className="text-lg font-semibold text-gray-900">{titulo}</h3>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-500 transition-colors"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          {/* Nombre */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Nombre del Aula *
            </label>
            <input
              type="text"
              name="nombre"
              value={formData.nombre}
              onChange={handleChange}
              className={`w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                errores.nombre ? 'border-red-300' : 'border-gray-300'
              }`}
              placeholder="Ej: Aula 101, Laboratorio de Física"
            />
            {errores.nombre && (
              <p className="mt-1 text-sm text-red-600">{errores.nombre}</p>
            )}
          </div>

          {/* Horario */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Horario de Inicio (hora) *
              </label>
              <input
                type="number"
                name="horarioInicio"
                min="0"
                max="23"
                value={formData.horarioInicio}
                onChange={handleChange}
                className={`w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                  errores.horarioInicio ? 'border-red-300' : 'border-gray-300'
                }`}
              />
              {errores.horarioInicio && (
                <p className="mt-1 text-sm text-red-600">{errores.horarioInicio}</p>
              )}
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Horario de Cierre (hora) *
              </label>
              <input
                type="number"
                name="horarioCierre"
                min="0"
                max="23"
                value={formData.horarioCierre}
                onChange={handleChange}
                className={`w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                  errores.horarioCierre ? 'border-red-300' : 'border-gray-300'
                }`}
              />
              {errores.horarioCierre && (
                <p className="mt-1 text-sm text-red-600">{errores.horarioCierre}</p>
              )}
            </div>
          </div>

          {/* Consumo Esperado */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Consumo Esperado (kWh) *
            </label>
            <input
              type="number"
              name="consumoEsperado"
              min="0.1"
              step="0.1"
              value={formData.consumoEsperado}
              onChange={handleChange}
              className={`w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                errores.consumoEsperado ? 'border-red-300' : 'border-gray-300'
              }`}
            />
            {errores.consumoEsperado && (
              <p className="mt-1 text-sm text-red-600">{errores.consumoEsperado}</p>
            )}
            <p className="mt-1 text-sm text-gray-500">
              Consumo energético esperado durante el horario operativo
            </p>
          </div>

          {/* Información adicional */}
          <div className="bg-gray-50 p-4 rounded-md">
            <h4 className="text-sm font-medium text-gray-700 mb-2">Información del Sistema</h4>
            <ul className="text-sm text-gray-600 space-y-1">
              <li>• Horario operativo: Lunes a Viernes</li>
              <li>• Consumo fuera de horario: 0-5% del consumo esperado</li>
              <li>• Variabilidad del consumo: ±15%</li>
              <li>�� Picos ocasionales: hasta 150% del consumo esperado</li>
            </ul>
          </div>

          {/* Botones */}
          <div className="flex justify-end space-x-3 pt-4">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors"
              disabled={loading}
            >
              Cancelar
            </button>
            <button
              type="submit"
              disabled={loading}
              className="px-4 py-2 bg-blue-600 border border-transparent rounded-md text-sm font-medium text-white hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              {loading ? (
                <div className="flex items-center">
                  <LoadingSpinner tamaño="sm" centrado={false} />
                  <span className="ml-2">Guardando...</span>
                </div>
              ) : (
                textoBoton
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default FormularioAula;