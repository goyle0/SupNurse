import { configureStore } from '@reduxjs/toolkit';
import treatmentReducer from './slices/treatmentSlice';

export const store = configureStore({
  reducer: {
    treatment: treatmentReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;