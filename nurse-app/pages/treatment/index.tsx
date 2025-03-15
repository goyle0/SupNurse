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
  Spinner,
  Alert,
  AlertIcon,
} from '@chakra-ui/react';
import { AddIcon, EditIcon, CheckIcon } from '@chakra-ui/icons';
import { FC, useEffect, useState } from 'react';
import { Header } from '../../components/Header';
import { useAppDispatch, useAppSelector } from '../../store/hooks';
import { 
  Treatment, 
  fetchTreatmentStart, 
  fetchTreatmentSuccess, 
  fetchTreatmentFailure,
  updateTreatment,
  addTreatment,
} from '../../store/slices/treatmentSlice';
import Head from 'next/head';
import TreatmentRegistrationModal from '../../components/treatment/TreatmentRegistrationModal';
import TreatmentCompletionModal from '../../components/treatment/TreatmentCompletionModal';
import { treatmentAPI } from '../../utils/api';

const TreatmentPage: FC = () => {
  const dispatch = useAppDispatch();
  const { treatments, loading, error } = useAppSelector((state) => state.treatment);
  const toast = useToast();
  const [selectedTreatment, setSelectedTreatment] = useState<Treatment | null>(null);
  
  const {
    isOpen: isRegistrationOpen,
    onOpen: onRegistrationOpen,
    onClose: onRegistrationClose
  } = useDisclosure();
  
  const {
    isOpen: isCompletionOpen,
    onOpen: onCompletionOpen,
    onClose: onCompletionClose
  } = useDisclosure();

  // APIからデータを取得
  useEffect(() => {
    const fetchTreatments = async () => {
      try {
        dispatch(fetchTreatmentStart());
        const data = await treatmentAPI.getAll();
        dispatch(fetchTreatmentSuccess(data));
      } catch (error) {
        let errorMessage = '処置データの取得に失敗しました';
        if (error instanceof Error) {
          errorMessage = error.message;
        }
        dispatch(fetchTreatmentFailure(errorMessage));
        toast({
          title: 'エラー',
          description: errorMessage,
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
      case 'completed':
        return <Badge colorScheme="green">実施済</Badge>;
      case 'cancelled':
        return <Badge colorScheme="red">中止</Badge>;
      default:
        return null;
    }
  };

  const formatDateTime = (dateTimeString: string) => {
    if (!dateTimeString) return '-';
    
    const date = new Date(dateTimeString);
    return date.toLocaleString('ja-JP', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const handleEditClick = (treatment: Treatment) => {
    setSelectedTreatment(treatment);
    onRegistrationOpen();
  };

  const handleCompletionClick = (treatment: Treatment) => {
    setSelectedTreatment(treatment);
    onCompletionOpen();
  };

  const handleAddClick = () => {
    setSelectedTreatment(null);
    onRegistrationOpen();
  };

  const handleRegistrationComplete = async (treatment: Treatment) => {
    try {
      if (treatment.id && treatments.find(t => t.id === treatment.id)) {
        // 更新の場合
        await treatmentAPI.update(treatment.id, treatment);
        dispatch(updateTreatment(treatment));
        toast({
          title: '成功',
          description: '処置情報が更新されました',
          status: 'success',
          duration: 5000,
          isClosable: true,
        });
      } else {
        // 新規作成の場合
        const createdTreatment = await treatmentAPI.create(treatment);
        dispatch(addTreatment(createdTreatment));
        toast({
          title: '成功',
          description: '新しい処置が登録されました',
          status: 'success',
          duration: 5000,
          isClosable: true,
        });
      }
    } catch (error) {
      let errorMessage = '処置情報の保存に失敗しました';
      if (error instanceof Error) {
        errorMessage = error.message;
      }
      toast({
        title: 'エラー',
        description: errorMessage,
        status: 'error',
        duration: 5000,
        isClosable: true,
      });
    }
    onRegistrationClose();
  };

  const handleCompletionComplete = async (treatment: Treatment) => {
    try {
      if (!treatment.id) {
        throw new Error('処置IDが見つかりません');
      }
      
      const completionData = {
        completedTime: treatment.completedTime,
        completedBy: treatment.completedBy,
        notes: treatment.notes
      };
      
      // API呼び出し
      await treatmentAPI.complete(treatment.id, completionData);
      
      // ローカルステートを更新
      dispatch(updateTreatment({
        ...treatment,
        status: 'completed'
      }));
      
      toast({
        title: '成功',
        description: '処置実施が記録されました',
        status: 'success',
        duration: 5000,
        isClosable: true,
      });
    } catch (error) {
      let errorMessage = '処置実施の記録に失敗しました';
      if (error instanceof Error) {
        errorMessage = error.message;
      }
      toast({
        title: 'エラー',
        description: errorMessage,
        status: 'error',
        duration: 5000,
        isClosable: true,
      });
    }
    onCompletionClose();
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
            <Button leftIcon={<AddIcon />} colorScheme="blue" onClick={handleAddClick}>
              新規登録
            </Button>
          </Flex>
          
          {loading ? (
            <Box textAlign="center" py={10}>
              <Spinner size="xl" />
              <Box mt={4}>読み込み中...</Box>
            </Box>
          ) : error ? (
            <Alert status="error" variant="solid" borderRadius="md">
              <AlertIcon />
              {error}
            </Alert>
          ) : treatments.length === 0 ? (
            <Alert status="info" borderRadius="md">
              <AlertIcon />
              登録されている処置情報はありません。「新規登録」から処置を追加できます。
            </Alert>
          ) : (
            <Table variant="simple">
              <Thead>
                <Tr>
                  <Th>患者ID</Th>
                  <Th>患者名</Th>
                  <Th>処置種類</Th>
                  <Th>内容</Th>
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
                      {treatment.completedTime
                        ? formatDateTime(treatment.completedTime)
                        : '-'}
                    </Td>
                    <Td>{getStatusBadge(treatment.status)}</Td>
                    <Td>
                      <IconButton
                        aria-label="編集"
                        icon={<EditIcon />}
                        size="sm"
                        mr={2}
                        onClick={() => handleEditClick(treatment)}
                      />
                      {treatment.status === 'scheduled' && (
                        <IconButton
                          aria-label="実施"
                          icon={<CheckIcon />}
                          size="sm"
                          colorScheme="green"
                          onClick={() => handleCompletionClick(treatment)}
                        />
                      )}
                    </Td>
                  </Tr>
                ))}
              </Tbody>
            </Table>
          )}
        </Box>
      </Container>
      <TreatmentRegistrationModal
        isOpen={isRegistrationOpen}
        onClose={onRegistrationClose}
        onComplete={handleRegistrationComplete}
        initialData={selectedTreatment}
      />
      <TreatmentCompletionModal
        isOpen={isCompletionOpen}
        onClose={onCompletionClose}
        onComplete={handleCompletionComplete}
        treatment={selectedTreatment}
      />
    </>
  );
};

export default TreatmentPage;