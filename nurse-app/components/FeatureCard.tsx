import { Box, Heading, Text, Stack, useColorModeValue } from '@chakra-ui/react';
import NextLink from 'next/link';
import { FC } from 'react';
import { FaSyringe, FaFirstAid, FaClipboardList, FaBook } from 'react-icons/fa';

interface FeatureCardProps {
    title: string;
    description: string;
    icon: 'injection' | 'treatment' | 'plan' | 'record';
    href: string;
}

export const FeatureCard: FC<FeatureCardProps> = ({ title, description, icon, href }) => {
    const getIcon = () => {
        switch (icon) {
            case 'injection':
                return <FaSyringe size="2em" />;
            case 'treatment':
                return <FaFirstAid size="2em" />;
            case 'plan':
                return <FaClipboardList size="2em" />;
            case 'record':
                return <FaBook size="2em" />;
            default:
                return null;
        }
    };

    return (
        <Box
            as={NextLink}
            href={href}
            maxW={'445px'}
            w={'full'}
            bg={useColorModeValue('white', 'gray.900')}
            boxShadow={'2xl'}
            rounded={'md'}
            p={6}
            overflow={'hidden'}
            _hover={{
                transform: 'translateY(-5px)',
                transition: 'all .2s ease',
                boxShadow: '3xl',
            }}>
            <Stack>
                <Box
                    color={'blue.500'}
                    mb={4}>
                    {getIcon()}
                </Box>
                <Heading
                    color={useColorModeValue('gray.700', 'white')}
                    fontSize={'2xl'}
                    fontFamily={'body'}>
                    {title}
                </Heading>
                <Text color={'gray.500'}>
                    {description}
                </Text>
            </Stack>
        </Box>
    );
};