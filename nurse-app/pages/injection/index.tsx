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
    Select,
} from '@chakra-ui/react';
import { AddIcon, EditIcon } from '@chakra-ui/icons';
import { FC, useEffect, useState } from 'react';
import { Header } from '../../components/Header';
import { useAppDispatch, useAppSelector } from '../../store/hooks';
import { Injection, fetchInjectionStart, fetchInjectionSuccess, fetchInjectionFailure, addInjection } from '../../store/slices/injectionSlice';
import Head from 'next/head';
import { v4 as uuidv4 } from 'uuid';
import { injectionAPI } from '../../utils/api';

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
    const toast = useToast();
    const { isOpen, onOpen, onClose } = useDisclosure();

    // 新規注射記録用の状態
    const [newInjection, setNewInjection] = useState<Partial<Injection>>({
        patientId: '',
        patientName: '',
        medication: '',
        dose: '',
        route: '',
        scheduledTime: '',
        status: 'scheduled',
    });

    // 入力フィールドの変更ハンドラ
    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        setNewInjection({
            ...newInjection,
            [name]: value,
        });
    };

    // 新規注射記録の送信ハンドラ
    const handleSubmit = async () => {
        try {
            // 必須フィールドの検証
            if (!newInjection.patientId || !newInjection.patientName || !newInjection.medication ||
                !newInjection.dose || !newInjection.route || !newInjection.scheduledTime) {
                toast({
                    title: 'エラー',
                    description: '必須項目をすべて入力してください',
                    status: 'error',
                    duration: 5000,
                    isClosable: true,
                });
                return;
            }

            // 一時的なIDを生成（実際のアプリではバックエンドが生成）
            const tempId = 'temp-' + Math.random().toString(36).substr(2, 9);

            const injectionData: Injection = {
                id: tempId,
                ...newInjection as Omit<Injection, 'id'>,
            };

            // Reduxストアに追加
            dispatch(addInjection(injectionData));

            // APIを使用してバックエンドに送信（実際のアプリで使用）
            // const response = await injectionAPI.create(injectionData);
            // dispatch(addInjection(response)); // バックエンドから返されたデータで更新

            toast({
                title: '成功',
                description: '注射記録が作成されました',
                status: 'success',
                duration: 5000,
                isClosable: true,
            });

            // フォームをリセットしてモーダルを閉じる
            setNewInjection({
                patientId: '',
                patientName: '',
                medication: '',
                dose: '',
                route: '',
                scheduledTime: '',
                status: 'scheduled',
            });
            onClose();
        } catch (error) {
            toast({
                title: 'エラー',
                description: '注射記録の作成に失敗しました',
                status: 'error',
                duration: 5000,
                isClosable: true,
            });
            console.error('注射記録作成エラー:', error);
        }
    };

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

            {/* 新規注射記録作成モーダル */}
            <Modal isOpen={isOpen} onClose={onClose}>
                <ModalOverlay />
                <ModalContent>
                    <ModalHeader>新規注射記録作成</ModalHeader>
                    <ModalCloseButton />
                    <ModalBody pb={6}>
                        <FormControl isRequired mb={4}>
                            <FormLabel>患者ID</FormLabel>
                            <Input
                                name="patientId"
                                value={newInjection.patientId}
                                onChange={handleInputChange}
                                placeholder="患者ID"
                            />
                        </FormControl>

                        <FormControl isRequired mb={4}>
                            <FormLabel>患者名</FormLabel>
                            <Input
                                name="patientName"
                                value={newInjection.patientName}
                                onChange={handleInputChange}
                                placeholder="患者名"
                            />
                        </FormControl>

                        <FormControl isRequired mb={4}>
                            <FormLabel>薬剤</FormLabel>
                            <Input
                                name="medication"
                                value={newInjection.medication}
                                onChange={handleInputChange}
                                placeholder="薬剤名"
                            />
                        </FormControl>

                        <FormControl isRequired mb={4}>
                            <FormLabel>用量</FormLabel>
                            <Input
                                name="dose"
                                value={newInjection.dose}
                                onChange={handleInputChange}
                                placeholder="用量"
                            />
                        </FormControl>

                        <FormControl isRequired mb={4}>
                            <FormLabel>投与経路</FormLabel>
                            <Select
                                name="route"
                                value={newInjection.route}
                                onChange={handleInputChange}
                                placeholder="投与経路を選択"
                            >
                                <option value="皮下注射">皮下注射</option>
                                <option value="筋肉注射">筋肉注射</option>
                                <option value="静脈注射">静脈注射</option>
                                <option value="点滴静注">点滴静注</option>
                            </Select>
                        </FormControl>

                        <FormControl isRequired mb={4}>
                            <FormLabel>予定時間</FormLabel>
                            <Input
                                name="scheduledTime"
                                type="datetime-local"
                                value={newInjection.scheduledTime}
                                onChange={handleInputChange}
                            />
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

export default InjectionPage;