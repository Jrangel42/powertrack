import { useCallback } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '../store/store';
import { setAlertas, resolverAlerta, setLoading, setError } from '../store/slices/alertasSlice';
import { obtenerAlertas, resolverAlerta as resolverAlertaApi } from '../services/api';

export function useAlertas() {
  const dispatch = useDispatch();
  const { alertas, loading, error } = useSelector((state: RootState) => state.alertas);

  const cargarAlertas = useCallback(async (aulaId?: string) => {
    try {
      dispatch(setLoading(true));
      const alertasData = await obtenerAlertas(aulaId);
      dispatch(setAlertas(alertasData));
    } catch (err) {
      dispatch(setError(err instanceof Error ? err.message : 'Error al cargar alertas'));
    }
  }, [dispatch]);

  const resolverAlertaLocal = useCallback(async (id: string) => {
    try {
      dispatch(setLoading(true));
      await resolverAlertaApi(id);
      dispatch(resolverAlerta(id));
    } catch (err) {
      dispatch(setError(err instanceof Error ? err.message : 'Error al resolver alerta'));
      throw err;
    } finally {
      dispatch(setLoading(false));
    }
  }, [dispatch]);

  const alertasActivas = useCallback(() => {
    return alertas.filter((alerta) => !alerta.resuelta);
  }, [alertas]);

  const alertasPorAula = useCallback((aulaId: string) => {
    return alertas.filter((alerta) => alerta.aulaId === aulaId);
  }, [alertas]);

  const alertasActivasPorAula = useCallback((aulaId: string) => {
    return alertas.filter((alerta) => alerta.aulaId === aulaId && !alerta.resuelta);
  }, [alertas]);

  const contarAlertasActivas = useCallback(() => {
    return alertas.filter((alerta) => !alerta.resuelta).length;
  }, [alertas]);

  return {
    alertas,
    alertasActivas,
    alertasPorAula,
    alertasActivasPorAula,
    contarAlertasActivas,
    loading,
    error,
    cargarAlertas,
    resolverAlerta: resolverAlertaLocal,
  };
}