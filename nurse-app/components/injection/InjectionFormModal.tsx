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
} from '@chakra-ui/react';
import { FC, useState } from 'react';
import { useAppDispatch } from '../../store/hooks';
import { Injection, addInjection } from '../../store/slices/injectionSlice';

interface InjectionFormModalProps {
    isOpen: boolean;
    onClose: () => void;
    injection?: Injection;
}

const InjectionFormModal: FC<InjectionFormModalProps> = ({ isOpen, onClose, injection }) => {
    const dispatch = useAppDispatch();
    const toast = useToast();
    
    const [formData, setFormData] = useState({
        patientId: injection?.patientId || '',
        patientName: injection?.patientName || '',
        medication: injection?.medication || '',
        dose: injection?.dose || '',
        route: injection?.route || '',
        scheduledTime: injection?.scheduledTime ? new Date(injection.scheduledTime).toISOString().slice(0, 16) : '',
        notes: injection?.notes || '',
    });

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const handleSubmit = async () => {
        try {
            const newInjection: Injection = {
                id: injection?.id || String(Date.now()),
                ...formData,
                status: injection?.status || 'scheduled',
                scheduledTime: new Date(formData.scheduledTime).toISOString(),
            };

            dispatch(addInjection(newInjection));
            toast({
                title: '注射記録を保存しました',
                status: 'success',
                duration: 3000,
                isClosable: true,
            });
            onClose();
        } catch (error) {
            toast({
                title: 'エラーが発生しました',
                description: error instanceof Error ? error.message : '注射記録の保存に失敗しました',
                status: 'error',
                duration: 5000,
                isClosable: true,
            });
        }
    };

    return (
        <Modal isOpen={isOpen} onClose={onClose}>
            <ModalOverlay />
            <ModalContent>
                <ModalHeader>{injection ? '注射記録の編集' : '新規注射記録'}</ModalHeader>
                <ModalCloseButton />
                <ModalBody>
                    <VStack spacing={4}>
                        <FormControl isRequired>
                            <FormLabel>患者ID</FormLabel>
                            <Input
                                name="patientId"
                                value={formData.patientId}
                                onChange={handleChange}
                                placeholder="P001"
                            />
                        </FormControl>
                        <FormControl isRequired>
                            <FormLabel>患者名</FormLabel>
                            <Input
                                name="patientName"
                                value={formData.patientName}
                                onChange={handleChange}
                                placeholder="山田 太郎"
                            />
                        </FormControl>
                        <FormControl isRequired>
                            <FormLabel>薬剤</FormLabel>
                            <Input
                                name="medication"
                                value={formData.medication}
                                onChange={handleChange}
                                placeholder="インスリン"
                            />
                        </FormControl>
                        <FormControl isRequired>
                            <FormLabel>用量</FormLabel>
                            <Input
                                name="dose"
                                value={formData.dose}
                                onChange={handleChange}
                                placeholder="10単位"
                            />
                        </FormControl>
                        <FormControl isRequired>
                            <FormLabel>投与経路</FormLabel>
                            <Select
                                name="route"
                                value={formData.route}
                                onChange={handleChange}
                                placeholder="投与経路を選択"
                            >
                                <option value="皮下注射">皮下注射</option>
                                <option value="筋肉注射">筋肉注射</option>
                                <option value="静脈注射">静脈注射</option>
                                <option value="皮内注射">皮内注射</option>
                            </Select>
                        </FormControl>
                        <FormControl isRequired>
                            <FormLabel>予定時間</FormLabel>
                            <Input
                                name="scheduledTime"
                                type="datetime-local"
                                value={formData.scheduledTime}
                                onChange={handleChange}
                            />
                        </FormControl>
                        <FormControl>
                            <FormLabel>備考</FormLabel>
                            <Textarea
                                name="notes"
                                value={formData.notes}
                                onChange={handleChange}
                                placeholder="備考があれば入力してください"
                            />
                        </FormControl>
                    </VStack>
                </ModalBody>
                <ModalFooter>
                    <Button variant="ghost" mr={3} onClick={onClose}>
                        キャンセル
                    </Button>
                    <Button colorScheme="blue" onClick={handleSubmit}>
                        保存
                    </Button>
                </ModalFooter>
            </ModalContent>
        </Modal>
    );
};

export default InjectionFormModal;