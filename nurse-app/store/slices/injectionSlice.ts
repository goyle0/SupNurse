// これは注射情報を管理するRedux Sliceです

// これは注射情報を管理するRedux Sliceです

import { createSlice, PayloadAction } from '@reduxjs/toolkit';

export interface Injection {
    id: string;
    patientId: string;
    patientName: string;
    medication: string;
    dose: string;
    route: string;
    scheduledTime: string;
    administeredTime?: string;
    administeredBy?: string;
    status: 'scheduled' | 'administered' | 'cancelled';
    notes?: string;
}

interface InjectionState {
    injections: Injection[];
    loading: boolean;
    error: string | null;
}

const initialState: InjectionState = {
    injections: [],
    loading: false,
    error: null,
};

const injectionSlice = createSlice({
    name: 'injection',
    initialState,
    reducers: {
        fetchInjectionStart(state) {
            state.loading = true;
            state.error = null;
        },
        fetchInjectionSuccess(state, action: PayloadAction<Injection[]>) {
            state.injections = action.payload;
            state.loading = false;
        },
        fetchInjectionFailure(state, action: PayloadAction<string>) {
            state.loading = false;
            state.error = action.payload;
        },
        addInjection(state, action: PayloadAction<Injection>) {
            state.injections.push(action.payload);
        },
        updateInjection(state, action: PayloadAction<Injection>) {
            const index = state.injections.findIndex(
                (injection) => injection.id === action.payload.id
            );
            if (index !== -1) {
                state.injections[index] = action.payload;
            }
        },
        deleteInjection(state, action: PayloadAction<string>) {
            state.injections = state.injections.filter(
                (injection) => injection.id !== action.payload
            );
        },
    },
});

export const {
    fetchInjectionStart,
    fetchInjectionSuccess,
    fetchInjectionFailure,
    addInjection,
    updateInjection,
    deleteInjection,
} = injectionSlice.actions;

export default injectionSlice.reducer;