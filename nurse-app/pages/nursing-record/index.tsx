import {
    Box,
    Button,
    Container,
    Flex,
    Heading,
    Text,
    IconButton,
    VStack,
    HStack,
    Card,
    CardHeader,
    CardBody,
    CardFooter,
    Divider,
    Badge,
    Avatar,
    Select,
    useToast,
    SimpleGrid,
    useDisclosure,
    Modal,
    ModalOverlay,
    ModalContent,
    ModalHeader,
    ModalFooter,
    ModalBody,
    ModalCloseButton,
    FormControl,
    FormLabel,
    Input,
    Textarea,
    RadioGroup,
    Radio,
    Stack,
    NumberInput,
    NumberInputField,
    NumberInputStepper,
    NumberIncrementStepper,
    NumberDecrementStepper,
    Checkbox,
    FormHelperText,
} from '@chakra-ui/react';
import { AddIcon, EditIcon, TimeIcon } from '@chakra-ui/icons';
import { FC, useEffect, useState } from 'react';
import { Header } from '../../components/Header';
import { useAppDispatch, useAppSelector } from '../../store/hooks';
import { NursingRecord, fetchNursingRecordStart, fetchNursingRecordSuccess, fetchNursingRecordFailure, addNursingRecord } from '../../store/slices/nursingRecordSlice';
import Head from 'next/head';
import { nursingRecordAPI } from '../../utils/api';

// モックデータ
const mockNursingRecords: NursingRecord[] = [
    {
        id: '1',
        patientId: 'P001',
        patientName: '山田 太郎',
        recordType: 'observation',
        content: '血圧140/85mmHg、脈拍72回/分、体温36.8℃。呼吸音清明、咳嗽なし。',
        recordTime: '2025-03-02T08:30:00',
        vitalSigns: {
            temperature: 36.8,
            heartRate: 72,
            respiratoryRate: 16,
            bloodPressure: '140/85',
            oxygenSaturation: 98,
        },
        createdBy: '鈴木 看護師',
    },
    {
        id: '2',
        patientId: 'P001',
        patientName: '山田 太郎',
        recordType: 'intervention',
        content: '左前腕の末梢静脈ラインを交換。22Gカテーテルを使用。刺入部の発赤や腫脹なし。',
        recordTime: '2025-03-02T10:15:00',
        createdBy: '鈴木 看護師',
    },
    {
        id: '3',
        patientId: 'P002',
        patientName: '佐藤 花子',
        recordType: 'assessment',
        content: '食事摂取量は全量の約70%。水分摂取は良好。嚥下障害の兆候なし。',
        recordTime: '2025-03-02T12:45:00',
        createdBy: '田中 看護師',
    },
    {
        id: '4',
        patientId: 'P003',
        patientName: '田中 次郎',
        recordType: 'evaluation',
        content: '術後疼痛は鎮痛剤投与後、NRSで2/10に軽減。安静時の痛みはほぼなし。体動時に軽度の痛みあり。',
        recordTime: '2025-03-02T14:20:00',
        createdBy: '佐藤 看護師',
    },
];

const NursingRecordPage: FC = () => {
    const dispatch = useAppDispatch();
    const { nursingRecords, loading, error } = useAppSelector((state) => state.nursingRecord);
    const [selectedPatient, setSelectedPatient] = useState<string>('all');
    const toast = useToast();
    const { isOpen, onOpen, onClose } = useDisclosure();

    // 新規看護記録用の状態
    const [newRecord, setNewRecord] = useState<Partial<NursingRecord>>({
        patientId: '',
        patientName: '',
        recordType: 'observation',
        content: '',
        recordTime: new Date().toISOString().slice(0, 16), // 現在時刻をデフォルト値に
        vitalSigns: {
            temperature: undefined,
            heartRate: undefined,
            respiratoryRate: undefined,
            bloodPressure: '',
            oxygenSaturation: undefined,
        },
        createdBy: '現在のユーザー', // 実際のアプリでは認証済みユーザー名を使用
    });

    // バイタルサイン入力の表示制御
    const [showVitalSigns, setShowVitalSigns] = useState<boolean>(true);

    // 入力フィールドの変更ハンドラ
    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        setNewRecord({
            ...newRecord,
            [name]: value,
        });
    };

    // バイタルサイン入力の変更ハンドラ
    const handleVitalSignChange = (name: string, value: any) => {
        setNewRecord({
            ...newRecord,
            vitalSigns: {
                ...newRecord.vitalSigns,
                [name]: value,
            },
        });
    };

    // 新規看護記録の送信ハンドラ
    const handleSubmit = async () => {
        try {
            // 必須フィールドの検証
            if (!newRecord.patientId || !newRecord.patientName || !newRecord.recordType ||
                !newRecord.content || !newRecord.recordTime) {
                toast({
                    title: 'エラー',
                    description: '必須項目をすべて入力してください',
                    status: 'error',
                    duration: 5000,
                    isClosable: true,
                });
                return;
            }

            // バイタルサインが不要な場合は削除
            const recordData = { ...newRecord };
            if (!showVitalSigns) {
                delete recordData.vitalSigns;
            }

            // 一時的なIDを生成（実際のアプリではバックエンドが生成）
            const tempId = 'temp-' + Math.random().toString(36).substr(2, 9);

            const nursingRecordData: NursingRecord = {
                id: tempId,
                ...recordData as Omit<NursingRecord, 'id'>,
            };

            // Reduxストアに追加
            dispatch(addNursingRecord(nursingRecordData));

            // APIを使用してバックエンドに送信（実際のアプリで使用）
            // const response = await nursingRecordAPI.create(nursingRecordData);
            // dispatch(addNursingRecord(response)); // バックエンドから返されたデータで更新

            toast({
                title: '成功',
                description: '看護記録が作成されました',
                status: 'success',
                duration: 5000,
                isClosable: true,
            });

            // フォームをリセットしてモーダルを閉じる
            setNewRecord({
                patientId: '',
                patientName: '',
                recordType: 'observation',
                content: '',
                recordTime: new Date().toISOString().slice(0, 16),
                vitalSigns: {
                    temperature: undefined,
                    heartRate: undefined,
                    respiratoryRate: undefined,
                    bloodPressure: '',
                    oxygenSaturation: undefined,
                },
                createdBy: '現在のユーザー',
            });
            setShowVitalSigns(true);
            onClose();
        } catch (error) {
            toast({
                title: 'エラー',
                description: '看護記録の作成に失敗しました',
                status: 'error',
                duration: 5000,
                isClosable: true,
            });
            console.error('看護記録作成エラー:', error);
        }
    };

    // 実際のアプリではAPIからデータを取得
    useEffect(() => {
        const fetchNursingRecords = async () => {
            try {
                dispatch(fetchNursingRecordStart());
                // 実際のアプリではAPI呼び出し
                // const response = await axios.get('/api/nursing-records');
                // dispatch(fetchNursingRecordSuccess(response.data));

                // モックデータを使用
                setTimeout(() => {
                    dispatch(fetchNursingRecordSuccess(mockNursingRecords));
                }, 500);
            } catch (error) {
                dispatch(fetchNursingRecordFailure('看護記録データの取得に失敗しました'));
                toast({
                    title: 'エラー',
                    description: '看護記録データの取得に失敗しました',
                    status: 'error',
                    duration: 5000,
                    isClosable: true,
                });
            }
        };

        fetchNursingRecords();
    }, [dispatch, toast]);

    const getRecordTypeBadge = (recordType: NursingRecord['recordType']) => {
        switch (recordType) {
            case 'observation':
                return <Badge colorScheme="blue">観察</Badge>;
            case 'assessment':
                return <Badge colorScheme="green">アセスメント</Badge>;
            case 'intervention':
                return <Badge colorScheme="purple">介入</Badge>;
            case 'evaluation':
                return <Badge colorScheme="orange">評価</Badge>;
            default:
                return null;
        }
    };

    const formatDateTime = (dateTimeString: string) => {
        const date = new Date(dateTimeString);
        return date.toLocaleString('ja-JP', {
            year: 'numeric',
            month: '2-digit',
            day: '2-digit',
            hour: '2-digit',
            minute: '2-digit',
        });
    };

    // 患者フィルター用の一意の患者リストを取得
    const uniquePatients = Array.from(
        new Set(nursingRecords.map((record) => record.patientId))
    ).map((patientId) => {
        const record = nursingRecords.find((r) => r.patientId === patientId);
        return {
            id: patientId,
            name: record ? record.patientName : '',
        };
    });

    // 選択された患者でフィルタリングされた記録
    const filteredRecords = selectedPatient === 'all'
        ? nursingRecords
        : nursingRecords.filter((record) => record.patientId === selectedPatient);

    // 日付で降順にソート
    const sortedRecords = [...filteredRecords].sort((a, b) =>
        new Date(b.recordTime).getTime() - new Date(a.recordTime).getTime()
    );

    return (
        <>
            <Head>
                <title>看護記録 | 看護支援アプリ</title>
            </Head>

            <Header />

            <Container maxW="container.xl" py={10}>
                <Box as="main">
                    <Flex justify="space-between" align="center" mb={6}>
                        <Heading as="h1" size="xl">
                            看護記録
                        </Heading>
                        <Button leftIcon={<AddIcon />} colorScheme="blue" onClick={onOpen}>
                            新規記録作成
                        </Button>
                    </Flex>

                    <Flex mb={6}>
                        <Box>
                            <Select
                                placeholder="患者を選択"
                                value={selectedPatient}
                                onChange={(e) => setSelectedPatient(e.target.value)}
                                width="250px"
                            >
                                <option value="all">すべての患者</option>
                                {uniquePatients.map((patient) => (
                                    <option key={patient.id} value={patient.id}>
                                        {patient.name} ({patient.id})
                                    </option>
                                ))}
                            </Select>
                        </Box>
                    </Flex>

                    {loading ? (
                        <Box textAlign="center" py={10}>
                            読み込み中...
                        </Box>
                    ) : error ? (
                        <Box textAlign="center" py={10} color="red.500">
                            {error}
                        </Box>
                    ) : (
                        <SimpleGrid columns={{ base: 1, md: 2 }} spacing={6}>
                            {sortedRecords.map((record) => (
                                <Card key={record.id} boxShadow="md" borderRadius="lg">
                                    <CardHeader pb={0}>
                                        <Flex justify="space-between" align="center">
                                            <HStack>
                                                <Avatar size="sm" name={record.patientName} />
                                                <VStack align="start" spacing={0}>
                                                    <Text fontWeight="bold">{record.patientName}</Text>
                                                    <Text fontSize="xs" color="gray.500">
                                                        {record.patientId}
                                                    </Text>
                                                </VStack>
                                            </HStack>
                                            {getRecordTypeBadge(record.recordType)}
                                        </Flex>
                                    </CardHeader>
                                    <CardBody>
                                        <Text>{record.content}</Text>
                                        {record.vitalSigns && (
                                            <Box mt={3} p={3} bg="gray.50" borderRadius="md">
                                                <Text fontSize="sm" fontWeight="bold" mb={1}>
                                                    バイタルサイン:
                                                </Text>
                                                <SimpleGrid columns={2} spacing={2}>
                                                    {record.vitalSigns.temperature && (
                                                        <Text fontSize="sm">
                                                            体温: {record.vitalSigns.temperature}℃
                                                        </Text>
                                                    )}
                                                    {record.vitalSigns.heartRate && (
                                                        <Text fontSize="sm">
                                                            脈拍: {record.vitalSigns.heartRate}回/分
                                                        </Text>
                                                    )}
                                                    {record.vitalSigns.respiratoryRate && (
                                                        <Text fontSize="sm">
                                                            呼吸: {record.vitalSigns.respiratoryRate}回/分
                                                        </Text>
                                                    )}
                                                    {record.vitalSigns.bloodPressure && (
                                                        <Text fontSize="sm">
                                                            血圧: {record.vitalSigns.bloodPressure}mmHg
                                                        </Text>
                                                    )}
                                                    {record.vitalSigns.oxygenSaturation && (
                                                        <Text fontSize="sm">
                                                            SpO2: {record.vitalSigns.oxygenSaturation}%
                                                        </Text>
                                                    )}
                                                </SimpleGrid>
                                            </Box>
                                        )}
                                    </CardBody>
                                    <Divider />
                                    <CardFooter pt={2}>
                                        <Flex
                                            width="100%"
                                            justify="space-between"
                                            align="center"
                                            fontSize="sm"
                                        >
                                            <HStack>
                                                <TimeIcon />
                                                <Text>{formatDateTime(record.recordTime)}</Text>
                                            </HStack>
                                            <HStack>
                                                <Text color="gray.500">{record.createdBy}</Text>
                                                <IconButton
                                                    aria-label="編集"
                                                    icon={<EditIcon />}
                                                    size="sm"
                                                    variant="ghost"
                                                />
                                            </HStack>
                                        </Flex>
                                    </CardFooter>
                                </Card>
                            ))}
                        </SimpleGrid>
                    )}
                </Box>
            </Container>

            {/* 新規看護記録作成モーダル */}
            <Modal isOpen={isOpen} onClose={onClose} size="xl">
                <ModalOverlay />
                <ModalContent>
                    <ModalHeader>新規看護記録作成</ModalHeader>
                    <ModalCloseButton />
                    <ModalBody pb={6}>
                        <FormControl isRequired mb={4}>
                            <FormLabel>患者ID</FormLabel>
                            <Input
                                name="patientId"
                                value={newRecord.patientId}
                                onChange={handleInputChange}
                                placeholder="患者ID"
                            />
                        </FormControl>

                        <FormControl isRequired mb={4}>
                            <FormLabel>患者名</FormLabel>
                            <Input
                                name="patientName"
                                value={newRecord.patientName}
                                onChange={handleInputChange}
                                placeholder="患者名"
                            />
                        </FormControl>

                        <FormControl isRequired mb={4}>
                            <FormLabel>記録種類</FormLabel>
                            <RadioGroup
                                name="recordType"
                                value={newRecord.recordType}
                                onChange={(value) => setNewRecord({ ...newRecord, recordType: value as NursingRecord['recordType'] })}
                            >
                                <Stack direction="row" spacing={4}>
                                    <Radio value="observation">観察</Radio>
                                    <Radio value="assessment">アセスメント</Radio>
                                    <Radio value="intervention">介入</Radio>
                                    <Radio value="evaluation">評価</Radio>
                                </Stack>
                            </RadioGroup>
                        </FormControl>

                        <FormControl isRequired mb={4}>
                            <FormLabel>記録内容</FormLabel>
                            <Textarea
                                name="content"
                                value={newRecord.content}
                                onChange={handleInputChange}
                                placeholder="看護記録の内容を入力"
                                rows={4}
                            />
                        </FormControl>

                        <FormControl isRequired mb={4}>
                            <FormLabel>記録時間</FormLabel>
                            <Input
                                name="recordTime"
                                type="datetime-local"
                                value={newRecord.recordTime}
                                onChange={handleInputChange}
                            />
                        </FormControl>

                        <FormControl mb={4}>
                            <Flex align="center" mb={2}>
                                <FormLabel mb={0}>バイタルサイン</FormLabel>
                                <Checkbox
                                    isChecked={showVitalSigns}
                                    onChange={(e) => setShowVitalSigns(e.target.checked)}
                                    ml={2}
                                >
                                    バイタルサインを記録する
                                </Checkbox>
                            </Flex>

                            {showVitalSigns && (
                                <Box p={4} bg="gray.50" borderRadius="md">
                                    <SimpleGrid columns={{ base: 1, md: 2 }} spacing={4}>
                                        <FormControl>
                                            <FormLabel fontSize="sm">体温 (℃)</FormLabel>
                                            <NumberInput
                                                min={35}
                                                max={42}
                                                step={0.1}
                                                value={newRecord.vitalSigns?.temperature || ''}
                                                onChange={(value) => handleVitalSignChange('temperature', parseFloat(value) || undefined)}
                                            >
                                                <NumberInputField placeholder="36.0" />
                                                <NumberInputStepper>
                                                    <NumberIncrementStepper />
                                                    <NumberDecrementStepper />
                                                </NumberInputStepper>
                                            </NumberInput>
                                        </FormControl>

                                        <FormControl>
                                            <FormLabel fontSize="sm">脈拍 (回/分)</FormLabel>
                                            <NumberInput
                                                min={40}
                                                max={200}
                                                step={1}
                                                value={newRecord.vitalSigns?.heartRate || ''}
                                                onChange={(value) => handleVitalSignChange('heartRate', parseInt(value) || undefined)}
                                            >
                                                <NumberInputField placeholder="80" />
                                                <NumberInputStepper>
                                                    <NumberIncrementStepper />
                                                    <NumberDecrementStepper />
                                                </NumberInputStepper>
                                            </NumberInput>
                                        </FormControl>

                                        <FormControl>
                                            <FormLabel fontSize="sm">呼吸数 (回/分)</FormLabel>
                                            <NumberInput
                                                min={8}
                                                max={40}
                                                step={1}
                                                value={newRecord.vitalSigns?.respiratoryRate || ''}
                                                onChange={(value) => handleVitalSignChange('respiratoryRate', parseInt(value) || undefined)}
                                            >
                                                <NumberInputField placeholder="16" />
                                                <NumberInputStepper>
                                                    <NumberIncrementStepper />
                                                    <NumberDecrementStepper />
                                                </NumberInputStepper>
                                            </NumberInput>
                                        </FormControl>

                                        <FormControl>
                                            <FormLabel fontSize="sm">血圧 (mmHg)</FormLabel>
                                            <Input
                                                placeholder="120/80"
                                                value={newRecord.vitalSigns?.bloodPressure || ''}
                                                onChange={(e) => handleVitalSignChange('bloodPressure', e.target.value)}
                                            />
                                            <FormHelperText>例: 120/80</FormHelperText>
                                        </FormControl>

                                        <FormControl>
                                            <FormLabel fontSize="sm">SpO2 (%)</FormLabel>
                                            <NumberInput
                                                min={70}
                                                max={100}
                                                step={1}
                                                value={newRecord.vitalSigns?.oxygenSaturation || ''}
                                                onChange={(value) => handleVitalSignChange('oxygenSaturation', parseInt(value) || undefined)}
                                            >
                                                <NumberInputField placeholder="98" />
                                                <NumberInputStepper>
                                                    <NumberIncrementStepper />
                                                    <NumberDecrementStepper />
                                                </NumberInputStepper>
                                            </NumberInput>
                                        </FormControl>
                                    </SimpleGrid>
                                </Box>
                            )}
                        </FormControl>
                    </ModalBody>

                    <ModalFooter>
                        <Button colorScheme="blue" mr={3} onClick={handleSubmit}>
                            保存
                        </Button>
                        <Button onClick={onClose}>キャンセル</Button>
                    </ModalFooter>
                </ModalContent>
            </Modal>
        </>
    );
};

export default NursingRecordPage;