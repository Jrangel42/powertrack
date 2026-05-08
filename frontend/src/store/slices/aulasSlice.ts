import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { Aula } from '../../types';

interface AulasState {
  aulas: Aula[];
  loading: boolean;
  error: string | null;
}

const initialState: AulasState = {
  aulas: [],
  loading: false,
  error: null,
};

const aulasSlice = createSlice({
  name: 'aulas',
  initialState,
  reducers: {
    setAulas: (state, action: PayloadAction<Aula[]>) => {
      state.aulas = action.payload;
      state.loading = false;
      state.error = null;
    },
    addAula: (state, action: PayloadAction<Aula>) => {
      state.aulas.push(action.payload);
    },
    updateAula: (state, action: PayloadAction<Aula>) => {
      const index = state.aulas.findIndex((a) => a.id === action.payload.id);
      if (index !== -1) {
        state.aulas[index] = action.payload;
      }
    },
    removeAula: (state, action: PayloadAction<string>) => {
      state.aulas = state.aulas.filter((a) => a.id !== action.payload);
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
  setAulas,
  addAula,
  updateAula,
  removeAula,
  setLoading,
  setError,
} = aulasSlice.actions;

export default aulasSlice.reducer;