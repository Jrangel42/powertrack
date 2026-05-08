import { configureStore } from '@reduxjs/toolkit';
import aulasReducer from './slices/aulasSlice';
import alertasReducer from './slices/alertasSlice';
import uiReducer from './slices/uiSlice';

export const store = configureStore({
  reducer: {
    aulas: aulasReducer,
    alertas: alertasReducer,
    ui: uiReducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: ['aulas/setAulas', 'alertas/setAlertas'],
        ignoredPaths: ['aulas.aulas', 'alertas.alertas'],
      },
    }),
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;