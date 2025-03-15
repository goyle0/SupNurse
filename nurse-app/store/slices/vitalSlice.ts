import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import api from '../../utils/api';

interface VitalSign {
    id: number;
    patient_id: number;
    timestamp: string;
    vital_type: string;
    value: number;
    unit: string;
    is_abnormal: boolean;
    notes?: string;
}

interface VitalState {
    vitalSigns: VitalSign[];
    abnormalCount: number;
    loading: boolean;
    error: string | null;
}

interface FetchVitalsParams {
    patientId: number;
    vitalType?: string;
    days?: number;
}

// 非同期アクション - バイタルデータの取得
export const fetchPatientVitals = createAsyncThunk(
    'vitals/fetchPatientVitals',
    async (params: FetchVitalsParams, { rejectWithValue }) => {
        try {
            const { patientId, vitalType, days } = params;
            const query = new URLSearchParams();
            if (vitalType) query.append('vital_type', vitalType);
            if (days) query.append('days', days.toString());

            const response = await api.get(
                `/vital-signs/patient/${patientId}?${query.toString()}`
            );
            return response.data;
        } catch (error) {
            return rejectWithValue(error.response?.data || 'データの取得に失敗しました');
        }
    }
);

// 非同期アクション - バイタルデータの登録
export const createVitalSign = createAsyncThunk(
    'vitals/createVitalSign',
    async (vitalData: Omit<VitalSign, 'id' | 'is_abnormal'>, { rejectWithValue }) => {
        try {
            const response = await api.post('/vital-signs/', vitalData);
            return response.data;
        } catch (error) {
            return rejectWithValue(error.response?.data || 'データの登録に失敗しました');
        }
    }
);

const initialState: VitalState = {
    vitalSigns: [],
    abnormalCount: 0,
    loading: false,
    error: null
};

const vitalSlice = createSlice({
    name: 'vitals',
    initialState,
    reducers: {
        clearVitals: (state) => {
            state.vitalSigns = [];
            state.abnormalCount = 0;
        }
    },
    extraReducers: (builder) => {
        builder
            // fetchPatientVitals
            .addCase(fetchPatientVitals.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(fetchPatientVitals.fulfilled, (state, action) => {
                state.loading = false;
                state.vitalSigns = action.payload.vital_signs;
                state.abnormalCount = action.payload.abnormal_count;
            })
            .addCase(fetchPatientVitals.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload as string;
            })
            // createVitalSign
            .addCase(createVitalSign.fulfilled, (state, action) => {
                state.vitalSigns.push(action.payload);
                if (action.payload.is_abnormal) {
                    state.abnormalCount += 1;
                }
            });
    }
});

export const { clearVitals } = vitalSlice.actions;
export default vitalSlice.reducer;