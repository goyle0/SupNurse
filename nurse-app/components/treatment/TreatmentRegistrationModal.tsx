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
  Select,
  Textarea,
  VStack,
  useToast,
  FormErrorMessage,
} from '@chakra-ui/react';
import { FC, useEffect, useState } from 'react';
import { Treatment, addTreatment } from '../../store/slices/treatmentSlice';
import { useAppDispatch } from '../../store/hooks';
import { v4 as uuidv4 } from 'uuid';
import { treatmentAPI } from '../../utils/api';

interface TreatmentRegistrationModalProps {
  isOpen: boolean;
  onClose: () => void;
  onComplete: (treatment: Treatment) => void;
  initialData: Treatment | null;
}

interface FormErrors {
  patientId?: string;
  patientName?: string;
  treatmentType?: string;
  scheduledTime?: string;
}

const TreatmentRegistrationModal: FC<TreatmentRegistrationModalProps> = ({
  isOpen,
  onClose,
  onComplete,
  initialData,
}) => {
  const dispatch = useAppDispatch();
  const toast = useToast();
  const [formData, setFormData] = useState<Partial<Treatment>>({
    patientId: '',
    patientName: '',
    treatmentType: '',
    description: '',
    scheduledTime: '',
    status: 'scheduled',
  });
  const [errors, setErrors] = useState<FormErrors>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (initialData) {
      setFormData({
        ...initialData,
      });
    } else {
      // 新規作成時はフォームをリセット
      setFormData({
        patientId: '',
        patientName: '',
        treatmentType: '',
        description: '',
        scheduledTime: new Date().toISOString().slice(0, 16),
        status: 'scheduled',
      });
    }
    // エラー状態もリセット
    setErrors({});
  }, [initialData, isOpen]);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
    
    // 入力されたらエラーを消す
    if (errors[name as keyof FormErrors]) {
      setErrors(prev => ({
        ...prev,
        [name]: undefined
      }));
    }
  };

  const validateForm = (): boolean => {
    const newErrors: FormErrors = {};
    
    if (!formData.patientId) {
      newErrors.patientId = '患者IDは必須です';
    }
    
    if (!formData.patientName) {
      newErrors.patientName = '患者名は必須です';
    }
    
    if (!formData.treatmentType) {
      newErrors.treatmentType = '処置種類は必須です';
    }
    
    if (!formData.scheduledTime) {
      newErrors.scheduledTime = '予定日時は必須です';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }
    
    setIsSubmitting(true);

    try {
      const treatment: Treatment = {
        id: initialData?.id || uuidv4(),
        patientId: formData.patientId!,
        patientName: formData.patientName!,
        treatmentType: formData.treatmentType!,
        description: formData.description || '',
        scheduledTime: formData.scheduledTime!,
        status: formData.status as Treatment['status'],
        completedTime: formData.completedTime,
        completedBy: formData.completedBy,
        notes: formData.notes,
      };

      onComplete(treatment);
    } catch (error) {
      toast({
        title: 'エラー',
        description: error instanceof Error ? error.message : '処置情報の保存に失敗しました',
        status: 'error',
        duration: 5000,
        isClosable: true,
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} size="lg">
      <ModalOverlay />
      <ModalContent as="form" onSubmit={handleSubmit}>
        <ModalHeader>
          {initialData ? '処置情報の編集' : '新規処置登録'}
        </ModalHeader>
        <ModalCloseButton />
        <ModalBody>
          <VStack spacing={4}>
            <FormControl isRequired isInvalid={!!errors.patientId}>
              <FormLabel>患者ID</FormLabel>
              <Input
                name="patientId"
                value={formData.patientId || ''}
                onChange={handleChange}
              />
              <FormErrorMessage>{errors.patientId}</FormErrorMessage>
            </FormControl>
            <FormControl isRequired isInvalid={!!errors.patientName}>
              <FormLabel>患者名</FormLabel>
              <Input
                name="patientName"
                value={formData.patientName || ''}
                onChange={handleChange}
              />
              <FormErrorMessage>{errors.patientName}</FormErrorMessage>
            </FormControl>
            <FormControl isRequired isInvalid={!!errors.treatmentType}>
              <FormLabel>処置種類</FormLabel>
              <Select
                name="treatmentType"
                value={formData.treatmentType || ''}
                onChange={handleChange}
                placeholder="処置種類を選択"
              >
                <option value="褥瘡ケア">褥瘡ケア</option>
                <option value="創傷処置">創傷処置</option>
                <option value="カテーテル交換">カテーテル交換</option>
                <option value="ドレーン管理">ドレーン管理</option>
                <option value="バイタル測定">バイタル測定</option>
                <option value="その他">その他</option>
              </Select>
              <FormErrorMessage>{errors.treatmentType}</FormErrorMessage>
            </FormControl>
            <FormControl>
              <FormLabel>内容</FormLabel>
              <Textarea
                name="description"
                value={formData.description || ''}
                onChange={handleChange}
              />
            </FormControl>
            <FormControl isRequired isInvalid={!!errors.scheduledTime}>
              <FormLabel>予定日時</FormLabel>
              <Input
                name="scheduledTime"
                type="datetime-local"
                value={formData.scheduledTime ? new Date(formData.scheduledTime).toISOString().slice(0, 16) : ''}
                onChange={handleChange}
              />
              <FormErrorMessage>{errors.scheduledTime}</FormErrorMessage>
            </FormControl>
            <FormControl>
              <FormLabel>状態</FormLabel>
              <Select
                name="status"
                value={formData.status || 'scheduled'}
                onChange={handleChange}
              >
                <option value="scheduled">予定</option>
                <option value="completed">実施済</option>
                <option value="cancelled">中止</option>
              </Select>
            </FormControl>
          </VStack>
        </ModalBody>
        <ModalFooter>
          <Button variant="ghost" mr={3} onClick={onClose}>
            キャンセル
          </Button>
          <Button
            colorScheme="blue"
            type="submit"
            isLoading={isSubmitting}
          >
            保存
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
};

export default TreatmentRegistrationModal;
