export interface VitalThreshold {
    normal: {
        min: number;
        max: number;
    };
    warning: {
        min: number;
        max: number;
    };
    critical: {
        min: number;
        max: number;
    };
}

interface VitalThresholds {
    [key: string]: VitalThreshold;
}

export const DEFAULT_VITAL_THRESHOLDS: VitalThresholds = {
    temperature: {
        normal: { min: 36.0, max: 37.2 },
        warning: { min: 35.5, max: 37.5 },
        critical: { min: 35.0, max: 38.5 }
    },
    blood_pressure_systolic: {
        normal: { min: 100, max: 130 },
        warning: { min: 90, max: 140 },
        critical: { min: 80, max: 180 }
    },
    blood_pressure_diastolic: {
        normal: { min: 60, max: 85 },
        warning: { min: 55, max: 90 },
        critical: { min: 50, max: 110 }
    },
    heart_rate: {
        normal: { min: 60, max: 90 },
        warning: { min: 50, max: 100 },
        critical: { min: 40, max: 120 }
    },
    oxygen_saturation: {
        normal: { min: 95, max: 100 },
        warning: { min: 92, max: 100 },
        critical: { min: 90, max: 100 }
    }
};

export type VitalSeverity = 'normal' | 'warning' | 'critical';

export const checkVitalSeverity = (
    value: number,
    thresholds: VitalThreshold
): VitalSeverity => {
    if (value < thresholds.critical.min || value > thresholds.critical.max) {
        return 'critical';
    }
    if (value < thresholds.warning.min || value > thresholds.warning.max) {
        return 'warning';
    }
    if (value >= thresholds.normal.min && value <= thresholds.normal.max) {
        return 'normal';
    }
    return 'warning';
};

export const getVitalLabel = (vitalType: string): string => {
    const labels: { [key: string]: string } = {
        temperature: '体温',
        blood_pressure_systolic: '収縮期血圧',
        blood_pressure_diastolic: '拡張期血圧',
        heart_rate: '心拍数',
        oxygen_saturation: '酸素飽和度'
    };
    return labels[vitalType] || vitalType;
};

export const getVitalUnit = (vitalType: string): string => {
    const units: { [key: string]: string } = {
        temperature: '°C',
        blood_pressure_systolic: 'mmHg',
        blood_pressure_diastolic: 'mmHg',
        heart_rate: 'bpm',
        oxygen_saturation: '%'
    };
    return units[vitalType] || '';
};