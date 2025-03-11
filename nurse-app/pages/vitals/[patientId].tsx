import { useEffect, useState } from 'react';
import {
    Box,
    Heading,
    Select,
    Flex,
    Alert,
    AlertIcon,
    AlertTitle,
    Spinner,
    Button,
    useToast,
    Modal,
    ModalOverlay,
    ModalContent,
    ModalHeader,
    ModalBody,
    ModalCloseButton,
    FormControl,
    FormLabel,
    NumberInput,
    NumberInputField,
    NumberInputStepper,
    NumberIncrementStepper,
    NumberDecrementStepper,
    VStack,
} from '@chakra-ui/react';
import { useRouter } from 'next/router';
import { useDispatch, useSelector } from '../../store/hooks';
import { fetchPatientVitals } from '../../store/slices/vitalSlice';
import { VitalChart } from '../../components/vitals/VitalChart';
import { DEFAULT_VITAL_THRESHOLDS, VitalThreshold, checkVitalSeverity, getVitalLabel } from '../../utils/vitalThresholds';

export default function PatientVitals() {
    const router = useRouter();
    const { patientId } = router.query;
    const dispatch = useDispatch();
    const toast = useToast();
    
    const [selectedVitalType, setSelectedVitalType] = useState('temperature');
    const [timeRange, setTimeRange] = useState(24);
    const [isCustomizing, setIsCustomizing] = useState(false);
    const [customThresholds, setCustomThresholds] = useState(DEFAULT_VITAL_THRESHOLDS);
    const { vitals, loading, error } = useSelector(state => state.vitals);

    useEffect(() => {
        if (patientId) {
            dispatch(fetchPatientVitals(patientId as string));
        }
    }, [dispatch, patientId]);

    // 異常値のチェックと通知
    useEffect(() => {
        if (!vitals || vitals.length === 0) return;

        const currentThresholds = customThresholds[selectedVitalType];
        const abnormalVitals = vitals.filter(vital => {
            const severity = checkVitalSeverity(vital.value, currentThresholds);
            return severity !== 'normal';
        });

        const criticalVitals = abnormalVitals.filter(vital => 
            checkVitalSeverity(vital.value, currentThresholds) === 'critical'
        );

        if (criticalVitals.length > 0) {
            toast({
                title: "重大な異常値を検出",
                description: `${criticalVitals.length}件の重大な異常値が検出されました。`,
                status: "error",
                duration: null,
                isClosable: true,
                position: "top-right"
            });
        } else if (abnormalVitals.length > 0) {
            toast({
                title: "異常値検出",
                description: `${abnormalVitals.length}件の異常値が検出されました。`,
                status: "warning",
                duration: 9000,
                isClosable: true,
                position: "top-right"
            });
        }
    }, [vitals, selectedVitalType, customThresholds, toast]);

    const handleThresholdChange = (
        vitalType: string,
        level: 'normal' | 'warning' | 'critical',
        bound: 'min' | 'max',
        value: number
    ) => {
        setCustomThresholds(prev => ({
            ...prev,
            [vitalType]: {
                ...prev[vitalType],
                [level]: {
                    ...prev[vitalType][level],
                    [bound]: value
                }
            }
        }));
    };

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
            <Flex justify="space-between" align="center" mb={5}>
                <Heading>患者ID: {patientId} - バイタルサイン管理</Heading>
                <Button onClick={() => setIsCustomizing(true)}>
                    アラート設定
                </Button>
            </Flex>

            <Flex mb={5} wrap="wrap" gap={4}>
                <Select
                    value={selectedVitalType}
                    onChange={(e) => setSelectedVitalType(e.target.value)}
                    maxWidth="300px"
                >
                    {Object.keys(customThresholds).map(type => (
                        <option key={type} value={type}>
                            {getVitalLabel(type)}
                        </option>
                    ))}
                </Select>

                <Select
                    value={timeRange}
                    onChange={(e) => setTimeRange(Number(e.target.value))}
                    maxWidth="200px"
                >
                    <option value={24}>24時間</option>
                    <option value={48}>48時間</option>
                    <option value={72}>72時間</option>
                    <option value={168}>1週間</option>
                </Select>
            </Flex>

            {vitals && vitals.length > 0 && (
                <VitalChart
                    data={vitals}
                    type={selectedVitalType}
                    thresholds={customThresholds[selectedVitalType]}
                />
            )}

            <Modal isOpen={isCustomizing} onClose={() => setIsCustomizing(false)} size="xl">
                <ModalOverlay />
                <ModalContent>
                    <ModalHeader>アラート設定</ModalHeader>
                    <ModalCloseButton />
                    <ModalBody pb={6}>
                        <VStack spacing={6}>
                            {Object.entries(customThresholds).map(([type, threshold]) => (
                                <Box key={type} w="100%" p={4} borderWidth={1} borderRadius="md">
                                    <Heading size="md" mb={4}>{getVitalLabel(type)}</Heading>
                                    {['normal', 'warning', 'critical'].map((level) => (
                                        <Flex key={level} gap={4} mb={4}>
                                            <FormControl>
                                                <FormLabel color={
                                                    level === 'critical' ? 'red.500' :
                                                    level === 'warning' ? 'orange.500' :
                                                    'green.500'
                                                }>
                                                    {level === 'critical' ? '危険域' :
                                                     level === 'warning' ? '注意域' :
                                                     '正常域'}（最小値）
                                                </FormLabel>
                                                <NumberInput
                                                    value={threshold[level].min}
                                                    onChange={(_, val) => handleThresholdChange(type, level as any, 'min', val)}
                                                    step={0.1}
                                                >
                                                    <NumberInputField />
                                                    <NumberInputStepper>
                                                        <NumberIncrementStepper />
                                                        <NumberDecrementStepper />
                                                    </NumberInputStepper>
                                                </NumberInput>
                                            </FormControl>
                                            <FormControl>
                                                <FormLabel color={
                                                    level === 'critical' ? 'red.500' :
                                                    level === 'warning' ? 'orange.500' :
                                                    'green.500'
                                                }>
                                                    {level === 'critical' ? '危険域' :
                                                     level === 'warning' ? '注意域' :
                                                     '正常域'}（最大値）
                                                </FormLabel>
                                                <NumberInput
                                                    value={threshold[level].max}
                                                    onChange={(_, val) => handleThresholdChange(type, level as any, 'max', val)}
                                                    step={0.1}
                                                >
                                                    <NumberInputField />
                                                    <NumberInputStepper>
                                                        <NumberIncrementStepper />
                                                        <NumberDecrementStepper />
                                                    </NumberInputStepper>
                                                </NumberInput>
                                            </FormControl>
                                        </Flex>
                                    ))}
                                </Box>
                            ))}
                        </VStack>
                    </ModalBody>
                </ModalContent>
            </Modal>
        </Box>
    );
}