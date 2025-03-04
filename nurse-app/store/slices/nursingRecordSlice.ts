// これは看護記録を管理するRedux Sliceです

// これは看護記録のRedux Sliceです

import { createSlice, PayloadAction } from '@reduxjs/toolkit';

export interface NursingRecord {
    id: string;
    patientId: string;
    patientName: string;
    recordType: 'observation' | 'assessment' | 'intervention' | 'evaluation';
    content: string;
    recordTime: string;
    vitalSigns?: {
        temperature?: number;
        heartRate?: number;
        respiratoryRate?: number;
        bloodPressure?: string;
        oxygenSaturation?: number;
    };
    createdBy: string;
    updatedBy?: string;
}

interface NursingRecordState {
    nursingRecords: NursingRecord[];
    loading: boolean;
    error: string | null;
}

const initialState: NursingRecordState = {
    nursingRecords: [],
    loading: false,
    error: null,
};

const nursingRecordSlice = createSlice({
    name: 'nursingRecord',
    initialState,
    reducers: {
        fetchNursingRecordStart(state) {
            state.loading = true;
            state.error = null;
        },
        fetchNursingRecordSuccess(state, action: PayloadAction<NursingRecord[]>) {
            state.nursingRecords = action.payload;
            state.loading = false;
        },
        fetchNursingRecordFailure(state, action: PayloadAction<string>) {
            state.loading = false;
            state.error = action.payload;
        },
        addNursingRecord(state, action: PayloadAction<NursingRecord>) {
            state.nursingRecords.push(action.payload);
        },
        updateNursingRecord(state, action: PayloadAction<NursingRecord>) {
            const index = state.nursingRecords.findIndex(
                (record) => record.id === action.payload.id
            );
            if (index !== -1) {
                state.nursingRecords[index] = action.payload;
            }
        },
        deleteNursingRecord(state, action: PayloadAction<string>) {
            state.nursingRecords = state.nursingRecords.filter(
                (record) => record.id !== action.payload
            );
        },
    },
});

export const {
    fetchNursingRecordStart,
    fetchNursingRecordSuccess,
    fetchNursingRecordFailure,
    addNursingRecord,
    updateNursingRecord,
    deleteNursingRecord,
} = nursingRecordSlice.actions;

export default nursingRecordSlice.reducer;