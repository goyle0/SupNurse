import {
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalFooter,
  ModalBody,
  ModalCloseButton,
  Button,
  FormControl,
  FormLabel,
  Input,
  Textarea,
  VStack,
  Text,
  useToast,
  Box,
} from '@chakra-ui/react';
import { FC, useEffect, useState } from 'react';
import { Treatment } from '../../store/slices/treatmentSlice';

interface TreatmentCompletionModalProps {
  isOpen: boolean;
  onClose: () => void;
  onComplete: (treatment: Treatment) => void;
  treatment: Treatment | null;
}

const TreatmentCompletionModal: FC<TreatmentCompletionModalProps> = ({
  isOpen,
  onClose,
  onComplete,
  treatment,
}) => {
  const toast = useToast();
  const [completedTime, setCompletedTime] = useState('');
  const [completedBy, setCompletedBy] = useState('');
  const [notes, setNotes] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (isOpen && treatment) {
      setCompletedTime(new Date().toISOString().slice(0, 16));
      setCompletedBy('');
      setNotes('');
    }
  }, [isOpen, treatment]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!treatment) return;

    setIsSubmitting(true);
    try {
      // バリデーション
      if (!completedTime || !completedBy) {
        throw new Error('実施日時と実施者は必須です');
      }

      const updatedTreatment: Treatment = {
        ...treatment,
        completedTime,
        completedBy,
        notes,
        status: 'completed',
      };

      onComplete(updatedTreatment);
    } catch (error) {
      toast({
        title: 'エラー',
        description: error instanceof Error ? error.message : '処置実施の記録に失敗しました',
        status: 'error',
        duration: 5000,
        isClosable: true,
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!treatment) return null;

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
    <Modal isOpen={isOpen} onClose={onClose} size="lg">
      <ModalOverlay />
      <ModalContent as="form" onSubmit={handleSubmit}>
        <ModalHeader>処置実施記録</ModalHeader>
        <ModalCloseButton />
        <ModalBody>
          <VStack spacing={4} align="stretch">
            <Box p={3} bg="gray.50" borderRadius="md">
              <Text fontWeight="bold">患者: {treatment.patientName} ({treatment.patientId})</Text>
              <Text>処置: {treatment.treatmentType}</Text>
              <Text>内容: {treatment.description}</Text>
              <Text>予定時間: {formatDateTime(treatment.scheduledTime)}</Text>
            </Box>

            <FormControl isRequired>
              <FormLabel>実施日時</FormLabel>
              <Input
                type="datetime-local"
                value={completedTime}
                onChange={(e) => setCompletedTime(e.target.value)}
              />
            </FormControl>
            <FormControl isRequired>
              <FormLabel>実施者</FormLabel>
              <Input
                value={completedBy}
                onChange={(e) => setCompletedBy(e.target.value)}
                placeholder="実施者の氏名"
              />
            </FormControl>
            <FormControl>
              <FormLabel>備考</FormLabel>
              <Textarea
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                placeholder="実施内容や患者の状態について"
              />
            </FormControl>
          </VStack>
        </ModalBody>
        <ModalFooter>
          <Button variant="ghost" mr={3} onClick={onClose}>
            キャンセル
          </Button>
          <Button
            colorScheme="green"
            type="submit"
            isLoading={isSubmitting}
          >
            実施完了を記録
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
};

export default TreatmentCompletionModal;
