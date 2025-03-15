// このファイルは登録ページのコンポーネントです

import {
    Box,
    Button,
    Container,
    FormControl,
    FormLabel,
    Heading,
    Input,
    Stack,
    Text,
    useToast,
    FormErrorMessage,
    Flex,
} from '@chakra-ui/react';
import { useState } from 'react';
import { useRouter } from 'next/router';
import Head from 'next/head';
import NextLink from 'next/link';
import { authAPI } from '../utils/api';

const RegisterPage = () => {
    const [formData, setFormData] = useState({
        username: '',
        email: '',
        full_name: '',
        password: '',
        confirmPassword: '',
    });
    const [errors, setErrors] = useState<Record<string, string>>({});
    const [isLoading, setIsLoading] = useState(false);
    const toast = useToast();
    const router = useRouter();

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setFormData({
            ...formData,
            [name]: value,
        });
        // 入力時にエラーをクリア
        if (errors[name]) {
            setErrors({
                ...errors,
                [name]: '',
            });
        }
    };

    const validateForm = () => {
        const newErrors: Record<string, string> = {};

        if (!formData.username) {
            newErrors.username = 'ユーザー名は必須です';
        }

        if (!formData.email) {
            newErrors.email = 'メールアドレスは必須です';
        } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
            newErrors.email = '有効なメールアドレスを入力してください';
        }

        if (!formData.password) {
            newErrors.password = 'パスワードは必須です';
        } else if (formData.password.length < 6) {
            newErrors.password = 'パスワードは6文字以上である必要があります';
        }

        if (formData.password !== formData.confirmPassword) {
            newErrors.confirmPassword = 'パスワードが一致しません';
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!validateForm()) {
            return;
        }

        setIsLoading(true);

        try {
            const userData = {
                username: formData.username,
                email: formData.email,
                full_name: formData.full_name,
                password: formData.password,
            };

            await authAPI.register(userData);

            toast({
                title: '登録成功',
                description: 'アカウントが正常に作成されました。ログインしてください。',
                status: 'success',
                duration: 5000,
                isClosable: true,
            });

            router.push('/login');
        } catch (error: any) {
            const errorMessage = error.response?.data?.detail || '登録に失敗しました。もう一度お試しください。';

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

    return (
        <>
            <Head>
                <title>新規登録 | 看護支援アプリ</title>
            </Head>

            <Container maxW="md" py={12}>
                <Box
                    p={8}
                    borderWidth={1}
                    borderRadius="lg"
                    boxShadow="lg"
                    bg="white"
                >
                    <Stack spacing={6}>
                        <Heading as="h1" size="xl" textAlign="center">
                            看護支援アプリ
                        </Heading>
                        <Heading as="h2" size="md" textAlign="center" color="gray.600">
                            新規登録
                        </Heading>

                        <form onSubmit={handleSubmit}>
                            <Stack spacing={4}>
                                <FormControl id="username" isRequired isInvalid={!!errors.username}>
                                    <FormLabel>ユーザー名</FormLabel>
                                    <Input
                                        type="text"
                                        name="username"
                                        value={formData.username}
                                        onChange={handleChange}
                                    />
                                    {errors.username && (
                                        <FormErrorMessage>{errors.username}</FormErrorMessage>
                                    )}
                                </FormControl>

                                <FormControl id="email" isRequired isInvalid={!!errors.email}>
                                    <FormLabel>メールアドレス</FormLabel>
                                    <Input
                                        type="email"
                                        name="email"
                                        value={formData.email}
                                        onChange={handleChange}
                                    />
                                    {errors.email && (
                                        <FormErrorMessage>{errors.email}</FormErrorMessage>
                                    )}
                                </FormControl>

                                <FormControl id="full_name">
                                    <FormLabel>氏名</FormLabel>
                                    <Input
                                        type="text"
                                        name="full_name"
                                        value={formData.full_name}
                                        onChange={handleChange}
                                    />
                                </FormControl>

                                <FormControl id="password" isRequired isInvalid={!!errors.password}>
                                    <FormLabel>パスワード</FormLabel>
                                    <Input
                                        type="password"
                                        name="password"
                                        value={formData.password}
                                        onChange={handleChange}
                                    />
                                    {errors.password && (
                                        <FormErrorMessage>{errors.password}</FormErrorMessage>
                                    )}
                                </FormControl>

                                <FormControl
                                    id="confirmPassword"
                                    isRequired
                                    isInvalid={!!errors.confirmPassword}
                                >
                                    <FormLabel>パスワード（確認）</FormLabel>
                                    <Input
                                        type="password"
                                        name="confirmPassword"
                                        value={formData.confirmPassword}
                                        onChange={handleChange}
                                    />
                                    {errors.confirmPassword && (
                                        <FormErrorMessage>{errors.confirmPassword}</FormErrorMessage>
                                    )}
                                </FormControl>

                                <Button
                                    type="submit"
                                    colorScheme="blue"
                                    size="lg"
                                    fontSize="md"
                                    isLoading={isLoading}
                                    mt={6}
                                >
                                    登録
                                </Button>
                            </Stack>
                        </form>

                        <Flex justify="center">
                            <Text mr={2}>すでにアカウントをお持ちの方は</Text>
                            <NextLink href="/login" passHref>
                                <Text as="a" color="blue.500" fontWeight="bold">
                                    ログイン
                                </Text>
                            </NextLink>
                        </Flex>
                    </Stack>
                </Box>
            </Container>
        </>
    );
};

export default RegisterPage;