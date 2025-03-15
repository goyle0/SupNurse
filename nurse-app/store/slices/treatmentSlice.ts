import { createSlice, PayloadAction } from '@reduxjs/toolkit';

export type Treatment = {
  id: string;
  patientId: string;
  patientName: string;
  treatmentType: string;
  description: string;
  scheduledTime: string;
  status: 'scheduled' | 'completed' | 'cancelled';
  completedTime?: string;
  completedBy?: string;
  notes?: string;
};

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
      state.error = null;
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
  },
});

export const {
  fetchTreatmentStart,
  fetchTreatmentSuccess,
  fetchTreatmentFailure,
  addTreatment,
  updateTreatment,
} = treatmentSlice.actions;

export default treatmentSlice.reducer;