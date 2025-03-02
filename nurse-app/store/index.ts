import { configureStore } from '@reduxjs/toolkit';
import injectionReducer from './slices/injectionSlice';
import treatmentReducer from './slices/treatmentSlice';
import nursingPlanReducer from './slices/nursingPlanSlice';
import nursingRecordReducer from './slices/nursingRecordSlice';

export const store = configureStore({
    reducer: {
        injection: injectionReducer,
        treatment: treatmentReducer,
        nursingPlan: nursingPlanReducer,
        nursingRecord: nursingRecordReducer,
    },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;