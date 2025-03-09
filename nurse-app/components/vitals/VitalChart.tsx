import React from 'react';
import {
    LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip,
    Legend, ResponsiveContainer, ReferenceLine
} from 'recharts';
import { Box, Text, useColorModeValue } from '@chakra-ui/react';
import { format } from 'date-fns';
import { ja } from 'date-fns/locale';

interface VitalReading {
    id: number;
    timestamp: string;
    value: number;
    is_abnormal: boolean;
}

interface VitalChartProps {
    data: VitalReading[];
    vitalType: string;
    unit: string;
    minThreshold?: number;
    maxThreshold?: number;
}

const VitalChart: React.FC<VitalChartProps> = ({
    data, vitalType, unit, minThreshold, maxThreshold
}) => {
    // チャートデータの整形
    const chartData = data.map(item => ({
        ...item,
        formattedTime: format(new Date(item.timestamp), 'MM/dd HH:mm', { locale: ja })
    }));

    // 異常値の色設定
    const normalColor = useColorModeValue('#3182CE', '#63B3ED');
    const abnormalColor = useColorModeValue('#E53E3E', '#FC8181');

    // 閾値の表示テキスト
    const thresholdText = () => {
        if (minThreshold && maxThreshold) {
            return `正常範囲: ${minThreshold}${unit} - ${maxThreshold}${unit}`;
        }
        return '';
    };

    // バイタルタイプごとの表示名
    const vitalTypeLabels: Record<string, string> = {
        'temperature': '体温',
        'blood_pressure_systolic': '収縮期血圧',
        'blood_pressure_diastolic': '拡張期血圧',
        'pulse': '脈拍',
        'spo2': 'SpO2',
        'respiration': '呼吸数'
    };

    return (
        <Box p={4} borderWidth="1px" borderRadius="lg" w="100%" h="400px">
            <Text fontSize="lg" fontWeight="bold" mb={2}>
                {vitalTypeLabels[vitalType] || vitalType} ({unit})
            </Text>
            <Text fontSize="sm" color="gray.500" mb={4}>
                {thresholdText()}
            </Text>
            <ResponsiveContainer width="100%" height="80%">
                <LineChart data={chartData} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="formattedTime" />
                    <YAxis domain={['auto', 'auto']} />
                    <Tooltip
                        formatter={(value) => [`${value}${unit}`, vitalTypeLabels[vitalType] || vitalType]}
                        labelFormatter={(time) => `${time}`}
                    />
                    <Legend />
                    {minThreshold && (
                        <ReferenceLine y={minThreshold} stroke="orange" strokeDasharray="3 3" label={`Min: ${minThreshold}${unit}`} />
                    )}
                    {maxThreshold && (
                        <ReferenceLine y={maxThreshold} stroke="red" strokeDasharray="3 3" label={`Max: ${maxThreshold}${unit}`} />
                    )}
                    <Line
                        type="monotone"
                        dataKey="value"
                        name={vitalTypeLabels[vitalType] || vitalType}
                        stroke={normalColor}
                        activeDot={{ r: 8 }}
                        dot={(props) => {
                            // @ts-ignore
                            const isAbnormal = chartData[props.index]?.is_abnormal;
                            return (
                                <circle
                                    cx={props.cx}
                                    cy={props.cy}
                                    r={isAbnormal ? 6 : 4}
                                    fill={isAbnormal ? abnormalColor : normalColor}
                                />
                            );
                        }}
                    />
                </LineChart>
            </ResponsiveContainer>
        </Box>
    );
};

export default VitalChart;