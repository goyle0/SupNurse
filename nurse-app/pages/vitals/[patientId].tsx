import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import {
    Box, Heading, Flex, Select, Button, Alert,
    AlertIcon, AlertTitle, useToast, Spinner
} from '@chakra-ui/react';
import VitalChart from '../../components/vitals/VitalChart';
import { useDispatch, useSelector } from 'react-redux';
import { fetchPatientVitals } from '../../store/slices/vitalSlice';

const VITAL_THRESHOLDS = {
    "temperature": { min: 35.0, max: 38.0, unit: "°C" },
    "blood_pressure_systolic": { min: 90, max: 140, unit: "mmHg" },
    "blood_pressure_diastolic": { min: 60, max: 90, unit: "mmHg" },
    "pulse": { min: 60, max: 100, unit: "bpm" },
    "spo2": { min: 95, max: 100, unit: "%" },
    "respiration": { min: 12, max: 20, unit: "bpm" }
};

const PatientVitals = () => {
    const router = useRouter();
    const { patientId } = router.query;
    const dispatch = useDispatch();
    const toast = useToast();

    const [selectedVitalType, setSelectedVitalType] = useState('temperature');
    const [timeRange, setTimeRange] = useState(7); // 表示日数

    const { vitalSigns, abnormalCount, loading, error } = useSelector(state => state.vitals);

    useEffect(() => {
        if (patientId) {
            // @ts-ignore
            dispatch(fetchPatientVitals({
                patientId: Number(patientId),
                vitalType: selectedVitalType,
                days: timeRange
            }));
        }
    }, [dispatch, patientId, selectedVitalType, timeRange]);

    // 異常値がある場合にアラートを表示
    useEffect(() => {
        if (abnormalCount > 0) {
            toast({
                title: "異常値検出",
                description: `${abnormalCount}件の異常値が検出されました。`,
                status: "warning",
                duration: 9000,
                isClosable: true,
                position: "top-right"
            });
        }
    }, [abnormalCount, toast]);

    const handleVitalTypeChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        setSelectedVitalType(e.target.value);
    };

    const handleTimeRangeChange = (days: number) => {
        setTimeRange(days);
    };

    // 選択中のバイタルサインの閾値を取得
    const currentThreshold = VITAL_THRESHOLDS[selectedVitalType] || {};

    if (loading) {
        return <Spinner size="xl" />;
    }

    if (error) {
        return (
            <Alert status="error">
                <AlertIcon />
                <AlertTitle>データの取得に失敗しました</AlertTitle>
            </Alert>
        );
    }

    return (
        <Box p={5}>
            <Heading mb={5}>患者ID: {patientId} - バイタルサイン管理</Heading>

            {abnormalCount > 0 && (
                <Alert status="warning" mb={5}>
                    <AlertIcon />
                    <AlertTitle>{abnormalCount}件の異常値が検出されました</AlertTitle>
                </Alert>
            )}

            <Flex mb={5} wrap="wrap" gap={4}>
                <Select
                    value={selectedVitalType}
                    onChange={handleVitalTypeChange}
                    maxWidth="300px"
                >
                    <option value="temperature">体温</option>
                    <option value="blood_pressure_systolic">収縮期血圧</option>
                    <option value="blood_pressure_diastolic">拡張期血圧</option>
                    <option value="pulse">脈拍</option>
                    <option value="spo2">SpO2</option>
                    <option value="respiration">呼吸数</option>
                </Select>

                <Flex gap={2}>
                    <Button
                        size="sm"
                        colorScheme={timeRange === 1 ? "blue" : "gray"}
                        onClick={() => handleTimeRangeChange(1)}
                    >
                        24時間
                    </Button>
                    <Button
                        size="sm"
                        colorScheme={timeRange === 7 ? "blue" : "gray"}
                        onClick={() => handleTimeRangeChange(7)}
                    >
                        1週間
                    </Button>
                    <Button
                        size="sm"
                        colorScheme={timeRange === 30 ? "blue" : "gray"}
                        onClick={() => handleTimeRangeChange(30)}
                    >
                        1ヶ月
                    </Button>
                </Flex>
            </Flex>

            {vitalSigns?.length > 0 ? (
                <VitalChart
                    data={vitalSigns}
                    vitalType={selectedVitalType}
                    unit={currentThreshold.unit || ''}
                    minThreshold={currentThreshold.min}
                    maxThreshold={currentThreshold.max}
                />
            ) : (
                <Alert status="info">
                    <AlertIcon />
                    表示するデータがありません
                </Alert>
            )}
        </Box>
    );
};

export default PatientVitals;