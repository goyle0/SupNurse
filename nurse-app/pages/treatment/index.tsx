import {
    Box,
    Button,
    Container,
    Flex,
    Heading,
    Table,
    Thead,
    Tbody,
    Tr,
    Th,
    Td,
    Badge,
    IconButton,
    useDisclosure,
    useToast,
} from '@chakra-ui/react';
import { AddIcon, EditIcon } from '@chakra-ui/icons';
import { FC, useEffect, useState } from 'react';
import { Header } from '../../components/Header';
import { useAppDispatch, useAppSelector } from '../../store/hooks';
import { Treatment, fetchTreatmentStart, fetchTreatmentSuccess, fetchTreatmentFailure } from '../../store/slices/treatmentSlice';
import Head from 'next/head';

// モックデータ
const mockTreatments: Treatment[] = [
    {
        id: '1',
        patientId: 'P001',
        patientName: '山田 太郎',
        treatmentType: '褥瘡処置',
        description: '仙骨部の褥瘡処置、消毒と被覆材交換',
        scheduledTime: '2025-03-02T09:30:00',
        status: 'scheduled',
    },
    {
        id: '2',
        patientId: 'P002',
        patientName: '佐藤 花子',
        treatmentType: '点滴交換',
        description: '末梢静脈ラインの交換',
        scheduledTime: '2025-03-02T11:00:00',
        performedTime: '2025-03-02T11:05:00',
        performedBy: '鈴木 看護師',
        status: 'performed',
    },
    {
        id: '3',
        patientId: 'P003',
        patientName: '田中 次郎',
        treatmentType: '創傷処置',
        description: '腹部手術創の消毒と包帯交換',
        scheduledTime: '2025-03-02T14:30:00',
        status: 'scheduled',
    },
];

const TreatmentPage: FC = () => {
    const dispatch = useAppDispatch();
    const { treatments, loading, error } = useAppSelector((state) => state.treatment);
    const toast = useToast();

    // 実際のアプリではAPIからデータを取得
    useEffect(() => {
        const fetchTreatments = async () => {
            try {
                dispatch(fetchTreatmentStart());
                // 実際のアプリではAPI呼び出し
                // const response = await axios.get('/api/treatments');
                // dispatch(fetchTreatmentSuccess(response.data));

                // モックデータを使用
                setTimeout(() => {
                    dispatch(fetchTreatmentSuccess(mockTreatments));
                }, 500);
            } catch (error) {
                dispatch(fetchTreatmentFailure('処置データの取得に失敗しました'));
                toast({
                    title: 'エラー',
                    description: '処置データの取得に失敗しました',
                    status: 'error',
                    duration: 5000,
                    isClosable: true,
                });
            }
        };

        fetchTreatments();
    }, [dispatch, toast]);

    const getStatusBadge = (status: Treatment['status']) => {
        switch (status) {
            case 'scheduled':
                return <Badge colorScheme="blue">予定</Badge>;
            case 'performed':
                return <Badge colorScheme="green">実施済</Badge>;
            case 'cancelled':
                return <Badge colorScheme="red">中止</Badge>;
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

    return (
        <>
            <Head>
                <title>処置実施 | 看護支援アプリ</title>
            </Head>

            <Header />

            <Container maxW="container.xl" py={10}>
                <Box as="main">
                    <Flex justify="space-between" align="center" mb={6}>
                        <Heading as="h1" size="xl">
                            処置実施
                        </Heading>
                        <Button leftIcon={<AddIcon />} colorScheme="blue">
                            新規登録
                        </Button>
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
                        <Table variant="simple">
                            <Thead>
                                <Tr>
                                    <Th>患者ID</Th>
                                    <Th>患者名</Th>
                                    <Th>処置種類</Th>
                                    <Th>詳細</Th>
                                    <Th>予定時間</Th>
                                    <Th>実施時間</Th>
                                    <Th>ステータス</Th>
                                    <Th>操作</Th>
                                </Tr>
                            </Thead>
                            <Tbody>
                                {treatments.map((treatment) => (
                                    <Tr key={treatment.id}>
                                        <Td>{treatment.patientId}</Td>
                                        <Td>{treatment.patientName}</Td>
                                        <Td>{treatment.treatmentType}</Td>
                                        <Td>{treatment.description}</Td>
                                        <Td>{formatDateTime(treatment.scheduledTime)}</Td>
                                        <Td>
                                            {treatment.performedTime
                                                ? formatDateTime(treatment.performedTime)
                                                : '-'}
                                        </Td>
                                        <Td>{getStatusBadge(treatment.status)}</Td>
                                        <Td>
                                            <IconButton
                                                aria-label="編集"
                                                icon={<EditIcon />}
                                                size="sm"
                                                mr={2}
                                            />
                                        </Td>
                                    </Tr>
                                ))}
                            </Tbody>
                        </Table>
                    )}
                </Box>
            </Container>
        </>
    );
};

export default TreatmentPage;