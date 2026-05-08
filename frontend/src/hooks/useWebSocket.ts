import { useEffect, useRef } from 'react';
import { useDispatch } from 'react-redux';
import { webSocketService } from '../services/websocket';
import { setAulas, addAula, updateAula } from '../store/slices/aulasSlice';
import { addAlerta } from '../store/slices/alertasSlice';
import { Aula, Alerta } from '../types';

export function useWebSocket() {
  const dispatch = useDispatch();
  const listenersRegistered = useRef(false);

  useEffect(() => {
    if (listenersRegistered.current) return;

    webSocketService.connect();

    const handleAulasActualizadas = (aulas: Aula[]) => {
      dispatch(setAulas(aulas));
    };

    const handleAlertaGenerada = (alerta: Alerta) => {
      dispatch(addAlerta(alerta));
    };

    webSocketService.onAulasActualizadas(handleAulasActualizadas);
    webSocketService.onAlertaGenerada(handleAlertaGenerada);

    listenersRegistered.current = true;

    return () => {
      webSocketService.offAulasActualizadas(handleAulasActualizadas);
      webSocketService.offAlertaGenerada(handleAlertaGenerada);
    };
  }, [dispatch]);

  return {
    isConnected: webSocketService.isConnected(),
  };
}