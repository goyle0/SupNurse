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
} from '@chakra-ui/react';
import { AddIcon, EditIcon, TimeIcon } from '@chakra-ui/icons';
import { FC, useEffect, useState } from 'react';
import { Header } from '../../components/Header';
import { useAppDispatch, useAppSelector } from '../../store/hooks';
import { NursingRecord, fetchNursingRecordStart, fetchNursingRecordSuccess, fetchNursingRecordFailure } from '../../store/slices/nursingRecordSlice';
import Head from 'next/head';

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
                        <Button leftIcon={<AddIcon />} colorScheme="blue">
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
        </>
    );
};

export default NursingRecordPage;