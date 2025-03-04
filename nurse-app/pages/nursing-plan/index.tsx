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
    Text,
    Accordion,
    AccordionItem,
    AccordionButton,
    AccordionPanel,
    AccordionIcon,
    useToast,
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
    Select,
    Textarea,
    Stack,
    HStack,
    VStack,
    InputGroup,
    InputRightElement,
} from '@chakra-ui/react';
import { AddIcon, EditIcon, DeleteIcon } from '@chakra-ui/icons';
import { FC, useEffect, useState } from 'react';
import { Header } from '../../components/Header';
import { useAppDispatch, useAppSelector } from '../../store/hooks';
import { NursingPlan, fetchNursingPlanStart, fetchNursingPlanSuccess, fetchNursingPlanFailure, addNursingPlan } from '../../store/slices/nursingPlanSlice';
import Head from 'next/head';
import { nursingPlanAPI } from '../../utils/api';

// モックデータ
const mockNursingPlans: NursingPlan[] = [
    {
        id: '1',
        patientId: 'P001',
        patientName: '山田 太郎',
        problem: '転倒リスク',
        goal: '入院中に転倒なく過ごすことができる',
        interventions: [
            '歩行時は必ず看護師が付き添う',
            'ベッド柵を常に上げておく',
            '夜間はセンサーマットを使用する',
            '転倒リスクについて患者に説明する',
        ],
        startDate: '2025-03-01',
        targetDate: '2025-03-15',
        status: 'active',
        createdBy: '鈴木 看護師',
    },
    {
        id: '2',
        patientId: 'P002',
        patientName: '佐藤 花子',
        problem: '栄養摂取不足',
        goal: '1週間以内に1日の必要カロリーを摂取できるようになる',
        interventions: [
            '食事摂取量を毎食記録する',
            '嗜好を考慮した食事を提供する',
            '食事時は座位を保持し、誤嚥予防に努める',
            '必要に応じて栄養補助食品を提供する',
        ],
        startDate: '2025-03-01',
        targetDate: '2025-03-08',
        status: 'active',
        createdBy: '田中 看護師',
    },
    {
        id: '3',
        patientId: 'P003',
        patientName: '田中 次郎',
        problem: '術後疼痛',
        goal: '疼痛スケールで3以下を維持できる',
        interventions: [
            '疼痛スケールを用いて定期的に評価する',
            '医師の指示に従い鎮痛剤を投与する',
            '体位の工夫や安楽な姿勢の保持を支援する',
            'リラクゼーション技法を指導する',
        ],
        startDate: '2025-03-02',
        targetDate: '2025-03-09',
        status: 'active',
        createdBy: '佐藤 看護師',
    },
];

const NursingPlanPage: FC = () => {
    const dispatch = useAppDispatch();
    const { nursingPlans, loading, error } = useAppSelector((state) => state.nursingPlan);
    const toast = useToast();
    const { isOpen, onOpen, onClose } = useDisclosure();

    // 新規看護計画用の状態
    const [newPlan, setNewPlan] = useState<Partial<NursingPlan>>({
        patientId: '',
        patientName: '',
        problem: '',
        goal: '',
        interventions: [''],
        startDate: '',
        targetDate: '',
        status: 'active',
        createdBy: '現在のユーザー', // 実際のアプリでは認証済みユーザー名を使用
    });

    // 介入項目の追加
    const addIntervention = () => {
        if (newPlan.interventions) {
            setNewPlan({
                ...newPlan,
                interventions: [...newPlan.interventions, ''],
            });
        }
    };

    // 介入項目の削除
    const removeIntervention = (index: number) => {
        if (newPlan.interventions && newPlan.interventions.length > 1) {
            const updatedInterventions = [...newPlan.interventions];
            updatedInterventions.splice(index, 1);
            setNewPlan({
                ...newPlan,
                interventions: updatedInterventions,
            });
        }
    };

    // 介入項目の変更
    const handleInterventionChange = (index: number, value: string) => {
        if (newPlan.interventions) {
            const updatedInterventions = [...newPlan.interventions];
            updatedInterventions[index] = value;
            setNewPlan({
                ...newPlan,
                interventions: updatedInterventions,
            });
        }
    };

    // 入力フィールドの変更ハンドラ
    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        setNewPlan({
            ...newPlan,
            [name]: value,
        });
    };

    // 新規看護計画の送信ハンドラ
    const handleSubmit = async () => {
        try {
            // 必須フィールドの検証
            if (!newPlan.patientId || !newPlan.patientName || !newPlan.problem ||
                !newPlan.goal || !newPlan.startDate || !newPlan.targetDate ||
                !newPlan.interventions || newPlan.interventions.some(i => !i)) {
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

            const planData: NursingPlan = {
                id: tempId,
                ...newPlan as Omit<NursingPlan, 'id'>,
            };

            // Reduxストアに追加
            dispatch(addNursingPlan(planData));

            // APIを使用してバックエンドに送信（実際のアプリで使用）
            // const response = await nursingPlanAPI.create(planData);
            // dispatch(addNursingPlan(response)); // バックエンドから返されたデータで更新

            toast({
                title: '成功',
                description: '看護計画が作成されました',
                status: 'success',
                duration: 5000,
                isClosable: true,
            });

            // フォームをリセットしてモーダルを閉じる
            setNewPlan({
                patientId: '',
                patientName: '',
                problem: '',
                goal: '',
                interventions: [''],
                startDate: '',
                targetDate: '',
                status: 'active',
                createdBy: '現在のユーザー',
            });
            onClose();
        } catch (error) {
            toast({
                title: 'エラー',
                description: '看護計画の作成に失敗しました',
                status: 'error',
                duration: 5000,
                isClosable: true,
            });
            console.error('看護計画作成エラー:', error);
        }
    };

    // 実際のアプリではAPIからデータを取得
    useEffect(() => {
        const fetchNursingPlans = async () => {
            try {
                dispatch(fetchNursingPlanStart());
                // 実際のアプリではAPI呼び出し
                // const response = await axios.get('/api/nursing-plans');
                // dispatch(fetchNursingPlanSuccess(response.data));

                // モックデータを使用
                setTimeout(() => {
                    dispatch(fetchNursingPlanSuccess(mockNursingPlans));
                }, 500);
            } catch (error) {
                dispatch(fetchNursingPlanFailure('看護計画データの取得に失敗しました'));
                toast({
                    title: 'エラー',
                    description: '看護計画データの取得に失敗しました',
                    status: 'error',
                    duration: 5000,
                    isClosable: true,
                });
            }
        };

        fetchNursingPlans();
    }, [dispatch, toast]);

    const getStatusBadge = (status: NursingPlan['status']) => {
        switch (status) {
            case 'active':
                return <Badge colorScheme="green">実施中</Badge>;
            case 'completed':
                return <Badge colorScheme="blue">完了</Badge>;
            case 'cancelled':
                return <Badge colorScheme="red">中止</Badge>;
            default:
                return null;
        }
    };

    const formatDate = (dateString: string) => {
        const date = new Date(dateString);
        return date.toLocaleDateString('ja-JP', {
            year: 'numeric',
            month: '2-digit',
            day: '2-digit',
        });
    };

    return (
        <>
            <Head>
                <title>看護計画 | 看護支援アプリ</title>
            </Head>

            <Header />

            <Container maxW="container.xl" py={10}>
                <Box as="main">
                    <Flex justify="space-between" align="center" mb={6}>
                        <Heading as="h1" size="xl">
                            看護計画
                        </Heading>
                        <Button leftIcon={<AddIcon />} colorScheme="blue" onClick={onOpen}>
                            新規計画作成
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
                        <Accordion allowMultiple>
                            {nursingPlans.map((plan) => (
                                <AccordionItem key={plan.id}>
                                    <h2>
                                        <AccordionButton>
                                            <Box flex="1" textAlign="left">
                                                <Flex align="center" justify="space-between">
                                                    <Text fontWeight="bold">
                                                        {plan.patientName} - {plan.problem}
                                                    </Text>
                                                    <Flex align="center">
                                                        {getStatusBadge(plan.status)}
                                                        <Text ml={4} fontSize="sm" color="gray.500">
                                                            期間: {formatDate(plan.startDate)} 〜 {formatDate(plan.targetDate)}
                                                        </Text>
                                                    </Flex>
                                                </Flex>
                                            </Box>
                                            <AccordionIcon />
                                        </AccordionButton>
                                    </h2>
                                    <AccordionPanel pb={4}>
                                        <Box mb={4}>
                                            <Text fontWeight="bold">問題:</Text>
                                            <Text>{plan.problem}</Text>
                                        </Box>
                                        <Box mb={4}>
                                            <Text fontWeight="bold">目標:</Text>
                                            <Text>{plan.goal}</Text>
                                        </Box>
                                        <Box mb={4}>
                                            <Text fontWeight="bold">介入:</Text>
                                            <Box pl={4}>
                                                {plan.interventions.map((intervention, index) => (
                                                    <Text key={index} mb={1}>
                                                        • {intervention}
                                                    </Text>
                                                ))}
                                            </Box>
                                        </Box>
                                        <Flex justify="flex-end">
                                            <Button
                                                size="sm"
                                                leftIcon={<EditIcon />}
                                                colorScheme="blue"
                                                variant="outline"
                                            >
                                                編集
                                            </Button>
                                        </Flex>
                                    </AccordionPanel>
                                </AccordionItem>
                            ))}
                        </Accordion>
                    )}
                </Box>
            </Container>

            {/* 新規看護計画作成モーダル */}
            <Modal isOpen={isOpen} onClose={onClose} size="xl">
                <ModalOverlay />
                <ModalContent>
                    <ModalHeader>新規看護計画作成</ModalHeader>
                    <ModalCloseButton />
                    <ModalBody pb={6}>
                        <FormControl isRequired mb={4}>
                            <FormLabel>患者ID</FormLabel>
                            <Input
                                name="patientId"
                                value={newPlan.patientId}
                                onChange={handleInputChange}
                                placeholder="患者ID"
                            />
                        </FormControl>

                        <FormControl isRequired mb={4}>
                            <FormLabel>患者名</FormLabel>
                            <Input
                                name="patientName"
                                value={newPlan.patientName}
                                onChange={handleInputChange}
                                placeholder="患者名"
                            />
                        </FormControl>

                        <FormControl isRequired mb={4}>
                            <FormLabel>問題</FormLabel>
                            <Input
                                name="problem"
                                value={newPlan.problem}
                                onChange={handleInputChange}
                                placeholder="看護問題"
                            />
                        </FormControl>

                        <FormControl isRequired mb={4}>
                            <FormLabel>目標</FormLabel>
                            <Textarea
                                name="goal"
                                value={newPlan.goal}
                                onChange={handleInputChange}
                                placeholder="看護目標"
                                rows={2}
                            />
                        </FormControl>

                        <FormControl isRequired mb={4}>
                            <FormLabel>介入</FormLabel>
                            <VStack spacing={2} align="stretch">
                                {newPlan.interventions?.map((intervention, index) => (
                                    <HStack key={index}>
                                        <Input
                                            value={intervention}
                                            onChange={(e) => handleInterventionChange(index, e.target.value)}
                                            placeholder={`介入項目 ${index + 1}`}
                                        />
                                        <IconButton
                                            aria-label="介入項目を削除"
                                            icon={<DeleteIcon />}
                                            size="sm"
                                            colorScheme="red"
                                            isDisabled={newPlan.interventions?.length === 1}
                                            onClick={() => removeIntervention(index)}
                                        />
                                    </HStack>
                                ))}
                                <Button
                                    leftIcon={<AddIcon />}
                                    size="sm"
                                    onClick={addIntervention}
                                    alignSelf="flex-start"
                                >
                                    介入項目を追加
                                </Button>
                            </VStack>
                        </FormControl>

                        <HStack spacing={4} mb={4}>
                            <FormControl isRequired>
                                <FormLabel>開始日</FormLabel>
                                <Input
                                    name="startDate"
                                    type="date"
                                    value={newPlan.startDate}
                                    onChange={handleInputChange}
                                />
                            </FormControl>

                            <FormControl isRequired>
                                <FormLabel>目標日</FormLabel>
                                <Input
                                    name="targetDate"
                                    type="date"
                                    value={newPlan.targetDate}
                                    onChange={handleInputChange}
                                />
                            </FormControl>
                        </HStack>

                        <FormControl mb={4}>
                            <FormLabel>ステータス</FormLabel>
                            <Select
                                name="status"
                                value={newPlan.status}
                                onChange={handleInputChange}
                            >
                                <option value="active">実施中</option>
                                <option value="completed">完了</option>
                                <option value="cancelled">中止</option>
                            </Select>
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

export default NursingPlanPage;