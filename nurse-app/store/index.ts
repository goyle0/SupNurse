import { configureStore } from '@reduxjs/toolkit';
import treatmentReducer from './slices/treatmentSlice';
import injectionReducer from './slices/injectionSlice';
import nursingRecordReducer from './slices/nursingRecordSlice';
import nursingPlanReducer from './slices/nursingPlanSlice';

export const store = configureStore({
  reducer: {
    treatment: treatmentReducer,
    injection: injectionReducer,
    nursingRecord: nursingRecordReducer,
    nursingPlan: nursingPlanReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;