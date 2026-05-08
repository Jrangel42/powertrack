import { useCallback } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '../store/store';
import { setAulas, addAula, updateAula, removeAula, setLoading, setError } from '../store/slices/aulasSlice';
import { setAulaSeleccionada } from '../store/slices/uiSlice';
import { crearAula, obtenerAulas, actualizarAula, eliminarAula } from '../services/api';
import { CreateAulaDto, UpdateAulaDto } from '../types';

export function useAulas() {
  const dispatch = useDispatch();
  const { aulas, loading, error } = useSelector((state: RootState) => state.aulas);
  const { aulaSeleccionada } = useSelector((state: RootState) => state.ui);

  const cargarAulas = useCallback(async () => {
    try {
      dispatch(setLoading(true));
      const aulasData = await obtenerAulas();
      dispatch(setAulas(aulasData));
    } catch (err) {
      dispatch(setError(err instanceof Error ? err.message : 'Error al cargar aulas'));
    }
  }, [dispatch]);

  const crearNuevaAula = useCallback(async (dto: CreateAulaDto) => {
    try {
      dispatch(setLoading(true));
      const nuevaAula = await crearAula(dto);
      dispatch(addAula(nuevaAula));
      return nuevaAula;
    } catch (err) {
      dispatch(setError(err instanceof Error ? err.message : 'Error al crear aula'));
      throw err;
    } finally {
      dispatch(setLoading(false));
    }
  }, [dispatch]);

  const actualizarAulaExistente = useCallback(async (id: string, dto: UpdateAulaDto) => {
    try {
      dispatch(setLoading(true));
      const aulaActualizada = await actualizarAula(id, dto);
      dispatch(updateAula(aulaActualizada));
      return aulaActualizada;
    } catch (err) {
      dispatch(setError(err instanceof Error ? err.message : 'Error al actualizar aula'));
      throw err;
    } finally {
      dispatch(setLoading(false));
    }
  }, [dispatch]);

  const eliminarAulaExistente = useCallback(async (id: string) => {
    try {
      dispatch(setLoading(true));
      await eliminarAula(id);
      dispatch(removeAula(id));
      if (aulaSeleccionada === id) {
        dispatch(setAulaSeleccionada(null));
      }
    } catch (err) {
      dispatch(setError(err instanceof Error ? err.message : 'Error al eliminar aula'));
      throw err;
    } finally {
      dispatch(setLoading(false));
    }
  }, [dispatch, aulaSeleccionada]);

  const seleccionarAula = useCallback((id: string | null) => {
    dispatch(setAulaSeleccionada(id));
  }, [dispatch]);

  const obtenerAulaPorId = useCallback((id: string) => {
    return aulas.find((aula) => aula.id === id);
  }, [aulas]);

  const aulasOrdenadasPorEstado = useCallback(() => {
    const ordenEstado = { 'Crítico': 0, 'Advertencia': 1, 'Normal': 2 };
    return [...aulas].sort((a, b) => ordenEstado[a.estado] - ordenEstado[b.estado]);
  }, [aulas]);

  return {
    aulas,
    aulasOrdenadasPorEstado,
    aulaSeleccionada,
    loading,
    error,
    cargarAulas,
    crearNuevaAula,
    actualizarAulaExistente,
    eliminarAulaExistente,
    seleccionarAula,
    obtenerAulaPorId,
  };
}