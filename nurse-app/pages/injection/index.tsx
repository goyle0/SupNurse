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
import { Injection, fetchInjectionStart, fetchInjectionSuccess, fetchInjectionFailure } from '../../store/slices/injectionSlice';
import InjectionFormModal from '../../components/injection/InjectionFormModal';
import Head from 'next/head';

// モックデータ
const mockInjections: Injection[] = [
    {
        id: '1',
        patientId: 'P001',
        patientName: '山田 太郎',
        medication: 'インスリン',
        dose: '10単位',
        route: '皮下注射',
        scheduledTime: '2025-03-02T09:00:00',
        status: 'scheduled',
    },
    {
        id: '2',
        patientId: 'P002',
        patientName: '佐藤 花子',
        medication: '抗生剤',
        dose: '500mg',
        route: '静脈注射',
        scheduledTime: '2025-03-02T10:30:00',
        administeredTime: '2025-03-02T10:35:00',
        administeredBy: '鈴木 看護師',
        status: 'administered',
    },
    {
        id: '3',
        patientId: 'P003',
        patientName: '田中 次郎',
        medication: '鎮痛剤',
        dose: '50mg',
        route: '筋肉注射',
        scheduledTime: '2025-03-02T14:00:00',
        status: 'scheduled',
    },
];

const InjectionPage: FC = () => {
    const dispatch = useAppDispatch();
    const { injections, loading, error } = useAppSelector((state) => state.injection);
    const { isOpen, onOpen, onClose } = useDisclosure();
    const toast = useToast();

    // 実際のアプリではAPIからデータを取得
    useEffect(() => {
        const fetchInjections = async () => {
            try {
                dispatch(fetchInjectionStart());
                // 実際のアプリではAPI呼び出し
                // const response = await axios.get('/api/injections');
                // dispatch(fetchInjectionSuccess(response.data));

                // モックデータを使用
                setTimeout(() => {
                    dispatch(fetchInjectionSuccess(mockInjections));
                }, 500);
            } catch (error) {
                dispatch(fetchInjectionFailure('注射データの取得に失敗しました'));
                toast({
                    title: 'エラー',
                    description: '注射データの取得に失敗しました',
                    status: 'error',
                    duration: 5000,
                    isClosable: true,
                });
            }
        };

        fetchInjections();
    }, [dispatch, toast]);

    const getStatusBadge = (status: Injection['status']) => {
        switch (status) {
            case 'scheduled':
                return <Badge colorScheme="blue">予定</Badge>;
            case 'administered':
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
                <title>注射実施 | 看護支援アプリ</title>
            </Head>

            <Header />

            <Container maxW="container.xl" py={10}>
                <Box as="main">
                    <Flex justify="space-between" align="center" mb={6}>
                        <Heading as="h1" size="xl">
                            注射実施
                        </Heading>
                        <Button leftIcon={<AddIcon />} colorScheme="blue" onClick={onOpen}>
                            新規登録
                        </Button>
                        <InjectionFormModal isOpen={isOpen} onClose={onClose} />
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
                                    <Th>薬剤</Th>
                                    <Th>用量</Th>
                                    <Th>投与経路</Th>
                                    <Th>予定時間</Th>
                                    <Th>実施時間</Th>
                                    <Th>ステータス</Th>
                                    <Th>操作</Th>
                                </Tr>
                            </Thead>
                            <Tbody>
                                {injections.map((injection) => (
                                    <Tr key={injection.id}>
                                        <Td>{injection.patientId}</Td>
                                        <Td>{injection.patientName}</Td>
                                        <Td>{injection.medication}</Td>
                                        <Td>{injection.dose}</Td>
                                        <Td>{injection.route}</Td>
                                        <Td>{formatDateTime(injection.scheduledTime)}</Td>
                                        <Td>
                                            {injection.administeredTime
                                                ? formatDateTime(injection.administeredTime)
                                                : '-'}
                                        </Td>
                                        <Td>{getStatusBadge(injection.status)}</Td>
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

export default InjectionPage;