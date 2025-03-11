import { useState, useEffect } from 'react';
import {
    Container,
    Box,
    Heading,
    FormControl,
    FormLabel,
    Input,
    Button,
    Stack,
    FormErrorMessage,
    useToast,
    VStack,
    Text,
    Progress,
    List,
    ListItem,
    ListIcon
} from '@chakra-ui/react';
import { CheckIcon, WarningIcon } from '@chakra-ui/icons';
import { useRouter } from 'next/router';
import Head from 'next/head';
import api from '../utils/api';
import { validatePassword, validateEmail, validateUsername } from '../utils/validation';

interface FormData {
    username: string;
    email: string;
    password: string;
}

interface FormErrors {
    username: string[];
    email: string[];
    password: string[];
}

export default function Register() {
    const [formData, setFormData] = useState<FormData>({
        username: '',
        email: '',
        password: '',
    });
    const [errors, setErrors] = useState<FormErrors>({
        username: [],
        email: [],
        password: [],
    });
    const [isLoading, setIsLoading] = useState(false);
    const toast = useToast();
    const router = useRouter();

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value,
        }));

        // リアルタイムバリデーション
        validateField(name, value);
    };

    const validateField = (name: string, value: string) => {
        let fieldErrors: string[] = [];
        
        switch (name) {
            case 'password':
                fieldErrors = validatePassword(value);
                break;
            case 'email':
                fieldErrors = validateEmail(value);
                break;
            case 'username':
                fieldErrors = validateUsername(value);
                break;
        }

        setErrors(prev => ({
            ...prev,
            [name]: fieldErrors,
        }));
    };

    const calculatePasswordStrength = (password: string): number => {
        if (!password) return 0;
        let strength = 0;

        if (password.length >= 8) strength += 20;
        if (/[A-Z]/.test(password)) strength += 20;
        if (/[a-z]/.test(password)) strength += 20;
        if (/\d/.test(password)) strength += 20;
        if (/[!@#$%^&*(),.?":{}|<>]/.test(password)) strength += 20;

        return strength;
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);

        // 全フィールドの再バリデーション
        validateField('username', formData.username);
        validateField('email', formData.email);
        validateField('password', formData.password);

        // エラーチェック
        const hasErrors = Object.values(errors).some(fieldErrors => fieldErrors.length > 0);
        if (hasErrors) {
            toast({
                title: '入力エラー',
                description: '入力内容を確認してください',
                status: 'error',
                duration: 5000,
                isClosable: true,
            });
            setIsLoading(false);
            return;
        }

        try {
            const response = await api.post('/auth/register', formData);
            toast({
                title: '登録成功',
                description: 'アカウントが作成されました',
                status: 'success',
                duration: 5000,
                isClosable: true,
            });
            router.push('/login');
        } catch (error: any) {
            const errorMessage = error.response?.data?.detail || '登録に失敗しました';
            toast({
                title: '登録エラー',
                description: errorMessage,
                status: 'error',
                duration: 5000,
                isClosable: true,
            });
        } finally {
            setIsLoading(false);
        }
    };

    const passwordStrength = calculatePasswordStrength(formData.password);

    return (
        <>
            <Head>
                <title>新規登録 | 看護支援アプリ</title>
            </Head>

            <Container maxW="md" py={12}>
                <Box p={8} borderWidth={1} borderRadius="lg" boxShadow="lg" bg="white">
                    <Stack spacing={6}>
                        <Heading as="h1" size="xl" textAlign="center">
                            看護支援アプリ
                        </Heading>
                        <form onSubmit={handleSubmit}>
                            <VStack spacing={4}>
                                <FormControl isInvalid={errors.username.length > 0}>
                                    <FormLabel>ユーザー名</FormLabel>
                                    <Input
                                        name="username"
                                        value={formData.username}
                                        onChange={handleChange}
                                    />
                                    {errors.username.map((error, index) => (
                                        <FormErrorMessage key={index}>{error}</FormErrorMessage>
                                    ))}
                                </FormControl>

                                <FormControl isInvalid={errors.email.length > 0}>
                                    <FormLabel>メールアドレス</FormLabel>
                                    <Input
                                        name="email"
                                        type="email"
                                        value={formData.email}
                                        onChange={handleChange}
                                    />
                                    {errors.email.map((error, index) => (
                                        <FormErrorMessage key={index}>{error}</FormErrorMessage>
                                    ))}
                                </FormControl>

                                <FormControl isInvalid={errors.password.length > 0}>
                                    <FormLabel>パスワード</FormLabel>
                                    <Input
                                        name="password"
                                        type="password"
                                        value={formData.password}
                                        onChange={handleChange}
                                    />
                                    <Box mt={2}>
                                        <Text fontSize="sm" mb={1}>パスワード強度:</Text>
                                        <Progress value={passwordStrength} colorScheme={
                                            passwordStrength <= 20 ? 'red' :
                                            passwordStrength <= 40 ? 'orange' :
                                            passwordStrength <= 60 ? 'yellow' :
                                            passwordStrength <= 80 ? 'blue' :
                                            'green'
                                        } />
                                    </Box>
                                    <List spacing={1} mt={2} fontSize="sm">
                                        {[
                                            { condition: formData.password.length >= 8, text: '8文字以上' },
                                            { condition: /[A-Z]/.test(formData.password), text: '大文字を含む' },
                                            { condition: /[a-z]/.test(formData.password), text: '小文字を含む' },
                                            { condition: /\d/.test(formData.password), text: '数字を含む' },
                                            { condition: /[!@#$%^&*(),.?":{}|<>]/.test(formData.password), text: '特殊文字を含む' },
                                        ].map((item, index) => (
                                            <ListItem key={index} color={item.condition ? 'green.500' : 'gray.500'}>
                                                <ListIcon as={item.condition ? CheckIcon : WarningIcon} color={item.condition ? 'green.500' : 'gray.500'} />
                                                {item.text}
                                            </ListItem>
                                        ))}
                                    </List>
                                    {errors.password.map((error, index) => (
                                        <FormErrorMessage key={index}>{error}</FormErrorMessage>
                                    ))}
                                </FormControl>

                                <Button
                                    type="submit"
                                    colorScheme="blue"
                                    width="full"
                                    isLoading={isLoading}
                                    loadingText="登録中..."
                                >
                                    登録
                                </Button>
                            </VStack>
                        </form>
                    </Stack>
                </Box>
            </Container>
        </>
    );
}