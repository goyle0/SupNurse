import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import { authAPI } from './api';

export const useAuth = (requireAuth = true) => {
    const router = useRouter();
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        // クライアントサイドでのみ実行
        if (typeof window !== 'undefined') {
            const authStatus = authAPI.checkAuth();
            setIsAuthenticated(authStatus);
            
            if (requireAuth && !authStatus) {
                // 認証が必要なページで未認証の場合
                router.push('/login');
            } else if (!requireAuth && authStatus) {
                // 認証済みユーザーがログインページなどにアクセスした場合
                router.push('/');
            }
            setIsLoading(false);
        }
    }, [requireAuth, router]);

    return { isAuthenticated, isLoading };
};