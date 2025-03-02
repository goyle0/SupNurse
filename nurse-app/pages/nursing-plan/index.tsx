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
} from '@chakra-ui/react';
import { AddIcon, EditIcon } from '@chakra-ui/icons';
import { FC, useEffect } from 'react';
import { Header } from '../../components/Header';
import { useAppDispatch, useAppSelector } from '../../store/hooks';
import { NursingPlan, fetchNursingPlanStart, fetchNursingPlanSuccess, fetchNursingPlanFailure } from '../../store/slices/nursingPlanSlice';
import Head from 'next/head';

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
                        <Button leftIcon={<AddIcon />} colorScheme="blue">
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
        </>
    );
};

export default NursingPlanPage;