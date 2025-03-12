// このファイルはAPI呼び出し設定を含みます

import axios from 'axios';

// APIクライアントの設定
const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000';

// Axiosインスタンスの作成
const apiClient = axios.create({
    baseURL: API_URL,
    headers: {
        'Content-Type': 'application/json',
    },
});

// リクエストインターセプター
apiClient.interceptors.request.use(
    (config) => {
        // ブラウザ環境でのみ実行
        if (typeof window !== 'undefined') {
            const token = localStorage.getItem('token');
            if (token) {
                config.headers.Authorization = `Bearer ${token}`;
            }
        }
        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

// レスポンスインターセプター
apiClient.interceptors.response.use(
    (response) => {
        return response;
    },
    (error) => {
        // 認証エラー（401）の場合、ログアウト処理
        if (error.response && error.response.status === 401) {
            if (typeof window !== 'undefined') {
                localStorage.removeItem('token');
                window.location.href = '/login';
            }
        }
        return Promise.reject(error);
    }
);

// 認証関連のAPI
export const authAPI = {
    login: async (username: string, password: string) => {
        const formData = new FormData();
        formData.append('username', username);
        formData.append('password', password);

        const response = await apiClient.post('/token', formData, {
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded',
            },
        });

        if (response.data.access_token) {
            localStorage.setItem('token', response.data.access_token);
        }

        return response.data;
    },

    register: async (userData: any) => {
        const response = await apiClient.post('/register', userData);
        return response.data;
    },

    logout: () => {
        localStorage.removeItem('token');
    },
};

// 注射実施関連のAPI
export const injectionAPI = {
    getAll: async () => {
        const response = await apiClient.get('/api/injections');
        return response.data;
    },

    getById: async (id: string) => {
        const response = await apiClient.get(`/api/injections/${id}`);
        return response.data;
    },

    create: async (injectionData: any) => {
        const response = await apiClient.post('/api/injections', injectionData);
        return response.data;
    },

    update: async (id: string, injectionData: any) => {
        const response = await apiClient.put(`/api/injections/${id}`, injectionData);
        return response.data;
    },

    delete: async (id: string) => {
        const response = await apiClient.delete(`/api/injections/${id}`);
        return response.data;
    },

    administer: async (id: string, administrationData: any) => {
        const response = await apiClient.post(`/api/injections/${id}/administer`, administrationData);
        return response.data;
    },
};

// 処置実施関連のAPI
export const treatmentAPI = {
    getAll: async () => {
        const response = await apiClient.get('/api/treatments');
        return response.data;
    },

    getById: async (id: string) => {
        const response = await apiClient.get(`/api/treatments/${id}`);
        return response.data;
    },

    create: async (treatmentData: any) => {
        const response = await apiClient.post('/api/treatments', treatmentData);
        return response.data;
    },

    update: async (id: string, treatmentData: any) => {
        const response = await apiClient.put(`/api/treatments/${id}`, treatmentData);
        return response.data;
    },

    delete: async (id: string) => {
        const response = await apiClient.delete(`/api/treatments/${id}`);
        return response.data;
    },

    // 処置実施の記録用メソッドを追加
    complete: async (id: string, completionData: any) => {
        const response = await apiClient.post(`/api/treatments/${id}/complete`, completionData);
        return response.data;
    },
};

// 看護計画関連のAPI
export const nursingPlanAPI = {
    getAll: async () => {
        const response = await apiClient.get('/api/nursing-plans');
        return response.data;
    },

    getById: async (id: string) => {
        const response = await apiClient.get(`/api/nursing-plans/${id}`);
        return response.data;
    },

    create: async (planData: any) => {
        const response = await apiClient.post('/api/nursing-plans', planData);
        return response.data;
    },

    update: async (id: string, planData: any) => {
        const response = await apiClient.put(`/api/nursing-plans/${id}`, planData);
        return response.data;
    },

    delete: async (id: string) => {
        const response = await apiClient.delete(`/api/nursing-plans/${id}`);
        return response.data;
    },
};

// 看護記録関連のAPI
export const nursingRecordAPI = {
    getAll: async () => {
        const response = await apiClient.get('/api/nursing-records');
        return response.data;
    },

    getById: async (id: string) => {
        const response = await apiClient.get(`/api/nursing-records/${id}`);
        return response.data;
    },

    create: async (recordData: any) => {
        const response = await apiClient.post('/api/nursing-records', recordData);
        return response.data;
    },

    update: async (id: string, recordData: any) => {
        const response = await apiClient.put(`/api/nursing-records/${id}`, recordData);
        return response.data;
    },

    delete: async (id: string) => {
        const response = await apiClient.delete(`/api/nursing-records/${id}`);
        return response.data;
    },
};

export default apiClient;