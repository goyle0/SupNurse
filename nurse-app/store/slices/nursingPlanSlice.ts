// これは看護計画を管理するRedux Sliceです

import { createSlice, PayloadAction } from '@reduxjs/toolkit';

export interface NursingPlan {
    id: string;
    patientId: string;
    patientName: string;
    problem: string;
    goal: string;
    interventions: string[];
    startDate: string;
    targetDate: string;
    status: 'active' | 'completed' | 'cancelled';
    evaluationNotes?: string;
    createdBy: string;
    updatedBy?: string;
}

interface NursingPlanState {
    nursingPlans: NursingPlan[];
    loading: boolean;
    error: string | null;
}

const initialState: NursingPlanState = {
    nursingPlans: [],
    loading: false,
    error: null,
};

const nursingPlanSlice = createSlice({
    name: 'nursingPlan',
    initialState,
    reducers: {
        fetchNursingPlanStart(state) {
            state.loading = true;
            state.error = null;
        },
        fetchNursingPlanSuccess(state, action: PayloadAction<NursingPlan[]>) {
            state.nursingPlans = action.payload;
            state.loading = false;
        },
        fetchNursingPlanFailure(state, action: PayloadAction<string>) {
            state.loading = false;
            state.error = action.payload;
        },
        addNursingPlan(state, action: PayloadAction<NursingPlan>) {
            state.nursingPlans.push(action.payload);
        },
        updateNursingPlan(state, action: PayloadAction<NursingPlan>) {
            const index = state.nursingPlans.findIndex(
                (plan) => plan.id === action.payload.id
            );
            if (index !== -1) {
                state.nursingPlans[index] = action.payload;
            }
        },
        deleteNursingPlan(state, action: PayloadAction<string>) {
            state.nursingPlans = state.nursingPlans.filter(
                (plan) => plan.id !== action.payload
            );
        },
    },
});

export const {
    fetchNursingPlanStart,
    fetchNursingPlanSuccess,
    fetchNursingPlanFailure,
    addNursingPlan,
    updateNursingPlan,
    deleteNursingPlan,
} = nursingPlanSlice.actions;

export default nursingPlanSlice.reducer;