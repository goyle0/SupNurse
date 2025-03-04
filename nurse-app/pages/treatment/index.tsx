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
    Textarea,
} from '@chakra-ui/react';
import { AddIcon, EditIcon } from '@chakra-ui/icons';
import { FC, useEffect, useState } from 'react';
import { Header } from '../../components/Header';
import { useAppDispatch, useAppSelector } from '../../store/hooks';
import { Treatment, fetchTreatmentStart, fetchTreatmentSuccess, fetchTreatmentFailure, addTreatment } from '../../store/slices/treatmentSlice';
import Head from 'next/head';
import { treatmentAPI } from '../../utils/api';

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
    const { isOpen, onOpen, onClose } = useDisclosure();

    // 新規処置記録用の状態
    const [newTreatment, setNewTreatment] = useState<Partial<Treatment>>({
        patientId: '',
        patientName: '',
        treatmentType: '',
        description: '',
        scheduledTime: '',
        status: 'scheduled',
    });

    // 入力フィールドの変更ハンドラ
    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        setNewTreatment({
            ...newTreatment,
            [name]: value,
        });
    };

    // 新規処置記録の送信ハンドラ
    const handleSubmit = async () => {
        try {
            // 必須フィールドの検証
            if (!newTreatment.patientId || !newTreatment.patientName || !newTreatment.treatmentType ||
                !newTreatment.description || !newTreatment.scheduledTime) {
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

            const treatmentData: Treatment = {
                id: tempId,
                ...newTreatment as Omit<Treatment, 'id'>,
            };

            // Reduxストアに追加
            dispatch(addTreatment(treatmentData));

            // APIを使用してバックエンドに送信（実際のアプリで使用）
            // const response = await treatmentAPI.create(treatmentData);
            // dispatch(addTreatment(response)); // バックエンドから返されたデータで更新

            toast({
                title: '成功',
                description: '処置記録が作成されました',
                status: 'success',
                duration: 5000,
                isClosable: true,
            });

            // フォームをリセットしてモーダルを閉じる
            setNewTreatment({
                patientId: '',
                patientName: '',
                treatmentType: '',
                description: '',
                scheduledTime: '',
                status: 'scheduled',
            });
            onClose();
        } catch (error) {
            toast({
                title: 'エラー',
                description: '処置記録の作成に失敗しました',
                status: 'error',
                duration: 5000,
                isClosable: true,
            });
            console.error('処置記録作成エラー:', error);
        }
    };

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

            {/* 新規処置記録作成モーダル */}
            <Modal isOpen={isOpen} onClose={onClose}>
                <ModalOverlay />
                <ModalContent>
                    <ModalHeader>新規処置記録作成</ModalHeader>
                    <ModalCloseButton />
                    <ModalBody pb={6}>
                        <FormControl isRequired mb={4}>
                            <FormLabel>患者ID</FormLabel>
                            <Input
                                name="patientId"
                                value={newTreatment.patientId}
                                onChange={handleInputChange}
                                placeholder="患者ID"
                            />
                        </FormControl>

                        <FormControl isRequired mb={4}>
                            <FormLabel>患者名</FormLabel>
                            <Input
                                name="patientName"
                                value={newTreatment.patientName}
                                onChange={handleInputChange}
                                placeholder="患者名"
                            />
                        </FormControl>

                        <FormControl isRequired mb={4}>
                            <FormLabel>処置種類</FormLabel>
                            <Select
                                name="treatmentType"
                                value={newTreatment.treatmentType}
                                onChange={handleInputChange}
                                placeholder="処置種類を選択"
                            >
                                <option value="褥瘡処置">褥瘡処置</option>
                                <option value="創傷処置">創傷処置</option>
                                <option value="点滴交換">点滴交換</option>
                                <option value="カテーテル管理">カテーテル管理</option>
                                <option value="その他">その他</option>
                            </Select>
                        </FormControl>

                        <FormControl isRequired mb={4}>
                            <FormLabel>詳細</FormLabel>
                            <Textarea
                                name="description"
                                value={newTreatment.description}
                                onChange={handleInputChange}
                                placeholder="処置の詳細を入力"
                                rows={3}
                            />
                        </FormControl>

                        <FormControl isRequired mb={4}>
                            <FormLabel>予定時間</FormLabel>
                            <Input
                                name="scheduledTime"
                                type="datetime-local"
                                value={newTreatment.scheduledTime}
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

export default TreatmentPage;