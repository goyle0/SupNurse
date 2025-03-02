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

const LoginPage = () => {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState('');
    const toast = useToast();
    const router = useRouter();

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');
        setIsLoading(true);

        try {
            await authAPI.login(username, password);
            toast({
                title: 'ログイン成功',
                description: 'ダッシュボードにリダイレクトします',
                status: 'success',
                duration: 3000,
                isClosable: true,
            });
            router.push('/');
        } catch (error: any) {
            setError(
                error.response?.data?.detail || 'ログインに失敗しました。もう一度お試しください。'
            );
            toast({
                title: 'ログインエラー',
                description: error.response?.data?.detail || 'ログインに失敗しました',
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
                <title>ログイン | 看護支援アプリ</title>
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
                            ログイン
                        </Heading>

                        <form onSubmit={handleSubmit}>
                            <Stack spacing={4}>
                                <FormControl id="username" isRequired isInvalid={!!error}>
                                    <FormLabel>ユーザー名</FormLabel>
                                    <Input
                                        type="text"
                                        value={username}
                                        onChange={(e) => setUsername(e.target.value)}
                                    />
                                </FormControl>

                                <FormControl id="password" isRequired isInvalid={!!error}>
                                    <FormLabel>パスワード</FormLabel>
                                    <Input
                                        type="password"
                                        value={password}
                                        onChange={(e) => setPassword(e.target.value)}
                                    />
                                    {error && <FormErrorMessage>{error}</FormErrorMessage>}
                                </FormControl>

                                <Button
                                    type="submit"
                                    colorScheme="blue"
                                    size="lg"
                                    fontSize="md"
                                    isLoading={isLoading}
                                >
                                    ログイン
                                </Button>
                            </Stack>
                        </form>

                        <Flex justify="center">
                            <Text mr={2}>アカウントをお持ちでない方は</Text>
                            <NextLink href="/register" passHref>
                                <Text as="a" color="blue.500" fontWeight="bold">
                                    新規登録
                                </Text>
                            </NextLink>
                        </Flex>
                    </Stack>
                </Box>
            </Container>
        </>
    );
};

export default LoginPage;