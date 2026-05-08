import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { UIState } from '../../types';

const initialState: UIState = {
  aulaSeleccionada: null,
  modalAbierto: null,
  loading: false,
  error: null,
  success: null,
};

const uiSlice = createSlice({
  name: 'ui',
  initialState,
  reducers: {
    setAulaSeleccionada: (state, action: PayloadAction<string | null>) => {
      state.aulaSeleccionada = action.payload;
    },
    setModalAbierto: (
      state,
      action: PayloadAction<UIState['modalAbierto']>,
    ) => {
      state.modalAbierto = action.payload;
    },
    setLoading: (state, action: PayloadAction<boolean>) => {
      state.loading = action.payload;
    },
    setError: (state, action: PayloadAction<string | null>) => {
      state.error = action.payload;
    },
    setSuccess: (state, action: PayloadAction<string | null>) => {
      state.success = action.payload;
    },
    clearNotifications: (state) => {
      state.error = null;
      state.success = null;
    },
  },
});

export const {
  setAulaSeleccionada,
  setModalAbierto,
  setLoading,
  setError,
  setSuccess,
  clearNotifications,
} = uiSlice.actions;

export default uiSlice.reducer;