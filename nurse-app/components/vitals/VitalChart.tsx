import React from 'react';
import { Box, Alert, AlertIcon, AlertTitle, AlertDescription, Tooltip } from '@chakra-ui/react';
import {
    LineChart,
    Line,
    XAxis,
    YAxis,
    CartesianGrid,
    ReferenceLine,
    ResponsiveContainer,
    Tooltip as RechartsTooltip
} from 'recharts';
import { VitalThreshold, VitalSeverity, checkVitalSeverity, getVitalLabel, getVitalUnit } from '../../utils/vitalThresholds';

interface VitalChartProps {
    data: Array<{
        timestamp: string;
        value: number;
    }>;
    type: string;
    thresholds: VitalThreshold;
}

export const VitalChart: React.FC<VitalChartProps> = ({ data, type, thresholds }) => {
    const getSeverityColor = (severity: VitalSeverity) => {
        switch (severity) {
            case 'critical':
                return 'red.500';
            case 'warning':
                return 'orange.400';
            default:
                return 'green.500';
        }
    };

    const CustomTooltip = ({ active, payload, label }: any) => {
        if (active && payload && payload.length) {
            const value = payload[0].value;
            const severity = checkVitalSeverity(value, thresholds);
            const color = getSeverityColor(severity);
            const timestamp = new Date(label).toLocaleString();

            return (
                <Box
                    bg="white"
                    p={3}
                    boxShadow="lg"
                    borderRadius="md"
                    border="1px solid"
                    borderColor={color}
                >
                    <Box fontWeight="bold" mb={2}>
                        {getVitalLabel(type)}: {value}{getVitalUnit(type)}
                    </Box>
                    <Box fontSize="sm" color="gray.600">
                        計測時刻: {timestamp}
                    </Box>
                    {severity !== 'normal' && (
                        <Alert status={severity === 'critical' ? 'error' : 'warning'} mt={2} size="sm">
                            <AlertIcon />
                            {severity === 'critical' ? '危険値' : '注意値'}
                        </Alert>
                    )}
                </Box>
            );
        }
        return null;
    };

    const renderReferenceLines = () => {
        const lines = [];
        if (thresholds.critical) {
            lines.push(
                <ReferenceLine
                    key="critical-min"
                    y={thresholds.critical.min}
                    stroke="red"
                    strokeDasharray="3 3"
                    label={{ value: '危険下限', fill: 'red', fontSize: 12 }}
                />,
                <ReferenceLine
                    key="critical-max"
                    y={thresholds.critical.max}
                    stroke="red"
                    strokeDasharray="3 3"
                    label={{ value: '危険上限', fill: 'red', fontSize: 12 }}
                />
            );
        }
        if (thresholds.warning) {
            lines.push(
                <ReferenceLine
                    key="warning-min"
                    y={thresholds.warning.min}
                    stroke="orange"
                    strokeDasharray="3 3"
                    label={{ value: '注意下限', fill: 'orange', fontSize: 12 }}
                />,
                <ReferenceLine
                    key="warning-max"
                    y={thresholds.warning.max}
                    stroke="orange"
                    strokeDasharray="3 3"
                    label={{ value: '注意上限', fill: 'orange', fontSize: 12 }}
                />
            );
        }
        return lines;
    };

    const getDataPointColor = (value: number) => {
        const severity = checkVitalSeverity(value, thresholds);
        return getSeverityColor(severity);
    };

    return (
        <Box h="400px" w="100%">
            <ResponsiveContainer>
                <LineChart data={data} margin={{ top: 20, right: 30, left: 20, bottom: 20 }}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis
                        dataKey="timestamp"
                        tickFormatter={(timestamp) => new Date(timestamp).toLocaleTimeString()}
                    />
                    <YAxis
                        tickFormatter={(value) => `${value}${getVitalUnit(type)}`}
                        domain={['auto', 'auto']}
                    />
                    <RechartsTooltip content={<CustomTooltip />} />
                    {renderReferenceLines()}
                    <Line
                        type="monotone"
                        dataKey="value"
                        stroke="#2196f3"
                        strokeWidth={2}
                        dot={{
                            r: 4,
                            fill: (props: any) => getDataPointColor(props.payload.value),
                            strokeWidth: 0
                        }}
                        activeDot={{ r: 6, strokeWidth: 0 }}
                    />
                </LineChart>
            </ResponsiveContainer>
        </Box>
    );
};