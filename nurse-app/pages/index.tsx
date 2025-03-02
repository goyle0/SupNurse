import { Box, Container, Heading, SimpleGrid, Text, VStack } from '@chakra-ui/react';
import Head from 'next/head';
import Link from 'next/link';
import { FC } from 'react';
import { Header } from '../components/Header';
import { FeatureCard } from '../components/FeatureCard';

const Home: FC = () => {
    return (
        <>
            <Head>
                <title>看護支援アプリ</title>
                <meta name="description" content="看護師のための支援アプリケーション" />
                <link rel="icon" href="/favicon.ico" />
            </Head>

            <Header />

            <Container maxW="container.xl" py={10}>
                <VStack spacing={8} as="main">
                    <Box textAlign="center" py={10}>
                        <Heading as="h1" size="2xl" mb={4}>
                            看護支援アプリケーション
                        </Heading>
                        <Text fontSize="xl" color="gray.600">
                            看護業務を効率化し、患者ケアの質を向上させるための総合支援ツール
                        </Text>
                    </Box>

                    <SimpleGrid columns={{ base: 1, md: 2 }} spacing={10} width="100%">
                        <FeatureCard
                            title="注射実施"
                            description="患者の注射スケジュール管理と実施記録を簡単に行えます。"
                            icon="injection"
                            href="/injection"
                        />
                        <FeatureCard
                            title="処置実施"
                            description="各種処置の計画と実施状況を一元管理します。"
                            icon="treatment"
                            href="/treatment"
                        />
                        <FeatureCard
                            title="看護計画"
                            description="患者ごとの看護計画を作成し、進捗を追跡します。"
                            icon="plan"
                            href="/nursing-plan"
                        />
                        <FeatureCard
                            title="看護記録"
                            description="日々の観察や介入内容を簡単に記録・閲覧できます。"
                            icon="record"
                            href="/nursing-record"
                        />
                    </SimpleGrid>
                </VStack>
            </Container>
        </>
    );
};

export default Home;