import { createSlice, PayloadAction } from '@reduxjs/toolkit';

export interface Treatment {
    id: string;
    patientId: string;
    patientName: string;
    treatmentType: string;
    description: string;
    scheduledTime: string;
    performedTime?: string;
    performedBy?: string;
    status: 'scheduled' | 'performed' | 'cancelled';
    notes?: string;
}

interface TreatmentState {
    treatments: Treatment[];
    loading: boolean;
    error: string | null;
}

const initialState: TreatmentState = {
    treatments: [],
    loading: false,
    error: null,
};

const treatmentSlice = createSlice({
    name: 'treatment',
    initialState,
    reducers: {
        fetchTreatmentStart(state) {
            state.loading = true;
            state.error = null;
        },
        fetchTreatmentSuccess(state, action: PayloadAction<Treatment[]>) {
            state.treatments = action.payload;
            state.loading = false;
        },
        fetchTreatmentFailure(state, action: PayloadAction<string>) {
            state.loading = false;
            state.error = action.payload;
        },
        addTreatment(state, action: PayloadAction<Treatment>) {
            state.treatments.push(action.payload);
        },
        updateTreatment(state, action: PayloadAction<Treatment>) {
            const index = state.treatments.findIndex(
                (treatment) => treatment.id === action.payload.id
            );
            if (index !== -1) {
                state.treatments[index] = action.payload;
            }
        },
        deleteTreatment(state, action: PayloadAction<string>) {
            state.treatments = state.treatments.filter(
                (treatment) => treatment.id !== action.payload
            );
        },
    },
});

export const {
    fetchTreatmentStart,
    fetchTreatmentSuccess,
    fetchTreatmentFailure,
    addTreatment,
    updateTreatment,
    deleteTreatment,
} = treatmentSlice.actions;

export default treatmentSlice.reducer;