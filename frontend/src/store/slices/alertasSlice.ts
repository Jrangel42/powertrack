import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { Alerta } from '../../types';

interface AlertasState {
  alertas: Alerta[];
  loading: boolean;
  error: string | null;
}

const initialState: AlertasState = {
  alertas: [],
  loading: false,
  error: null,
};

const alertasSlice = createSlice({
  name: 'alertas',
  initialState,
  reducers: {
    setAlertas: (state, action: PayloadAction<Alerta[]>) => {
      state.alertas = action.payload;
      state.loading = false;
      state.error = null;
    },
    addAlerta: (state, action: PayloadAction<Alerta>) => {
      // Evitar alertas duplicadas
      const existe = state.alertas.some((a) => a.id === action.payload.id);
      if (!existe) {
        state.alertas.unshift(action.payload);
      }
    },
    resolverAlerta: (state, action: PayloadAction<string>) => {
      const alerta = state.alertas.find((a) => a.id === action.payload);
      if (alerta) {
        alerta.resuelta = true;
        alerta.resolutionTime = new Date();
      }
    },
    setLoading: (state, action: PayloadAction<boolean>) => {
      state.loading = action.payload;
    },
    setError: (state, action: PayloadAction<string | null>) => {
      state.error = action.payload;
      state.loading = false;
    },
  },
});

export const {
  setAlertas,
  addAlerta,
  resolverAlerta,
  setLoading,
  setError,
} = alertasSlice.actions;

export default alertasSlice.reducer;