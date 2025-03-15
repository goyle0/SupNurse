import axios from 'axios';

// APIクライアントの設定
const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8001';

// モードフラグ（開発環境ではモックデータを使用するかどうかを制御）
const USE_MOCK_DATA = true;

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

// 認証トークン設定/削除のヘルパー関数
export const setAuthToken = (token: string) => {
    localStorage.setItem('token', token);
    apiClient.defaults.headers.common.Authorization = `Bearer ${token}`;
};

export const removeAuthToken = () => {
    localStorage.removeItem('token');
    delete apiClient.defaults.headers.common.Authorization;
};

// モックデータ
export const mockData = {
    treatments: [
        {
            id: '1',
            patientId: 'P001',
            patientName: '山田 太郎',
            treatmentType: '褥瘡ケア',
            description: '背部の褥瘡処置',
            scheduledTime: '2025-03-02T09:00:00',
            status: 'scheduled',
        },
        {
            id: '2',
            patientId: 'P002',
            patientName: '佐藤 花子',
            treatmentType: '創傷ケア',
            description: '左膝の創傷処置',
            scheduledTime: '2025-03-02T10:30:00',
            completedTime: '2025-03-02T10:35:00',
            completedBy: '鈴木 看護師',
            status: 'completed',
            notes: '問題なく処置完了',
        },
    ],
    injections: [
        {
            id: '1',
            patientId: 'P001',
            patientName: '山田 太郎',
            medication: 'インスリン',
            dose: '10単位',
            route: '皮下注射',
            scheduledTime: '2025-03-02T09:00:00',
            status: 'scheduled',
        },
        {
            id: '2',
            patientId: 'P002',
            patientName: '佐藤 花子',
            medication: '抗生剤',
            dose: '500mg',
            route: '静脈注射',
            scheduledTime: '2025-03-02T10:30:00',
            administeredTime: '2025-03-02T10:35:00',
            administeredBy: '鈴木 看護師',
            status: 'administered',
        },
        {
            id: '3',
            patientId: 'P003',
            patientName: '田中 次郎',
            medication: '鎮痛剤',
            dose: '50mg',
            route: '筋肉注射',
            scheduledTime: '2025-03-02T14:00:00',
            status: 'scheduled',
        },
    ],
    nursingPlans: [
        {
            id: '1',
            patientId: 'P001',
            patientName: '山田 太郎',
            problem: '転倒リスク',
            goal: '入院中の転倒を防止する',
            interventions: ['ベッドの高さを低くする', '移動時は介助者が付き添う', '夜間はセンサーマットを使用する'],
            startDate: '2025-03-01',
            targetDate: '2025-03-15',
            status: 'active',
            createdBy: '鈴木 看護師',
        },
        {
            id: '2',
            patientId: 'P002',
            patientName: '佐藤 花子',
            problem: '疼痛管理',
            goal: '疼痛レベルを3以下に維持する（10段階評価）',
            interventions: ['定期的な疼痛評価', '薬物療法の効果確認', '非薬物療法（氷罨法）の実施'],
            startDate: '2025-03-02',
            targetDate: '2025-03-10',
            status: 'active',
            createdBy: '田中 看護師',
        }
    ],
    nursingRecords: [
        {
            id: '1',
            patientId: 'P001',
            patientName: '山田 太郎',
            recordType: 'observation',
            content: '体温37.2℃、脈拍72回/分、血圧138/85mmHg、SpO2 98%。呼吸音清明。',
            recordTime: '2025-03-02T08:00:00',
            vitalSigns: {
                temperature: 37.2,
                heartRate: 72,
                respiratoryRate: 16,
                bloodPressure: '138/85',
                oxygenSaturation: 98,
            },
            createdBy: '鈴木 看護師',
        },
        {
            id: '2',
            patientId: 'P002',
            patientName: '佐藤 花子',
            recordType: 'assessment',
            content: '左膝の創部に軽度の発赤あり。浸出液や臭気なし。疼痛は2/10と報告。',
            recordTime: '2025-03-02T10:00:00',
            createdBy: '田中 看護師',
        }
    ],
    vitals: [
        {
            id: '1',
            patientId: 'P001',
            patientName: '山田 太郎',
            temperature: 37.2,
            heartRate: 72,
            respiratoryRate: 16,
            bloodPressure: '138/85',
            oxygenSaturation: 98,
            painLevel: 0,
            recordedAt: '2023-03-01T08:00:00',
            recordedBy: '鈴木 看護師',
            notes: '安静時'
        },
        {
            id: '2',
            patientId: 'P001',
            patientName: '山田 太郎',
            temperature: 37.5,
            heartRate: 78,
            respiratoryRate: 18,
            bloodPressure: '142/88',
            oxygenSaturation: 97,
            painLevel: 2,
            recordedAt: '2023-03-01T12:00:00',
            recordedBy: '鈴木 看護師',
            notes: '昼食後'
        }
    ]
};

// APIリクエストのヘルパー関数（モックデータを返すオプション付き）
const safeApiCall = async (apiCall: () => Promise<any>, mockData: any) => {
    if (!USE_MOCK_DATA) {
        try {
            return await apiCall();
        } catch (error) {
            console.warn('API呼び出し失敗、モックデータを使用します:', error);
            return mockData;
        }
    }
    
    // モックデータを使用する場合は、APIリクエストをシミュレート
    return new Promise((resolve) => {
        setTimeout(() => {
            resolve(mockData);
        }, 500); // 500ミリ秒の遅延を加えてAPI呼び出しをシミュレート
    });
};

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
            setAuthToken(response.data.access_token);
        }
        return response.data;
    },
    register: async (userData: any) => {
        const response = await apiClient.post('/register', userData);
        return response.data;
    },
    logout: () => {
        removeAuthToken();
    },
};

// 注射実施関連のAPI
export const injectionAPI = {
    getAll: async () => {
        return safeApiCall(
            async () => {
                const response = await apiClient.get('/api/injections');
                return response.data;
            }, 
            mockData.injections
        );
    },
    getById: async (id: string) => {
        return safeApiCall(
            async () => {
                const response = await apiClient.get(`/api/injections/${id}`);
                return response.data;
            },
            mockData.injections.find(item => item.id === id) || null
        );
    },
    create: async (injectionData: any) => {
        return safeApiCall(
            async () => {
                const response = await apiClient.post('/api/injections', injectionData);
                return response.data;
            },
            {
                ...injectionData,
                id: `new-${Date.now()}`
            }
        );
    },
    update: async (id: string, injectionData: any) => {
        return safeApiCall(
            async () => {
                const response = await apiClient.put(`/api/injections/${id}`, injectionData);
                return response.data;
            },
            injectionData
        );
    },
    delete: async (id: string) => {
        return safeApiCall(
            async () => {
                const response = await apiClient.delete(`/api/injections/${id}`);
                return response.data;
            },
            { success: true }
        );
    },
    administer: async (id: string, administrationData: any) => {
        return safeApiCall(
            async () => {
                const response = await apiClient.post(`/api/injections/${id}/administer`, administrationData);
                return response.data;
            },
            {
                ...mockData.injections.find(item => item.id === id),
                ...administrationData,
                status: 'administered'
            }
        );
    },
};

// 処置実施関連のAPI
export const treatmentAPI = {
    getAll: async () => {
        return safeApiCall(
            async () => {
                const response = await apiClient.get('/api/treatments');
                return response.data;
            }, 
            mockData.treatments
        );
    },
    getById: async (id: string) => {
        return safeApiCall(
            async () => {
                const response = await apiClient.get(`/api/treatments/${id}`);
                return response.data;
            },
            mockData.treatments.find(item => item.id === id) || null
        );
    },
    create: async (treatmentData: any) => {
        return safeApiCall(
            async () => {
                const response = await apiClient.post('/api/treatments', treatmentData);
                return response.data;
            },
            {
                ...treatmentData,
                id: `new-${Date.now()}`
            }
        );
    },
    update: async (id: string, treatmentData: any) => {
        return safeApiCall(
            async () => {
                const response = await apiClient.put(`/api/treatments/${id}`, treatmentData);
                return response.data;
            },
            treatmentData
        );
    },
    delete: async (id: string) => {
        return safeApiCall(
            async () => {
                const response = await apiClient.delete(`/api/treatments/${id}`);
                return response.data;
            },
            { success: true }
        );
    },
    // 処置実施の記録用メソッドを追加
    complete: async (id: string, completionData: any) => {
        return safeApiCall(
            async () => {
                const response = await apiClient.post(`/api/treatments/${id}/complete`, completionData);
                return response.data;
            },
            {
                ...mockData.treatments.find(item => item.id === id),
                ...completionData,
                status: 'completed'
            }
        );
    },
};

// 看護計画関連のAPI
export const nursingPlanAPI = {
    getAll: async () => {
        return safeApiCall(
            async () => {
                const response = await apiClient.get('/api/nursing-plans');
                return response.data;
            }, 
            mockData.nursingPlans
        );
    },
    getById: async (id: string) => {
        return safeApiCall(
            async () => {
                const response = await apiClient.get(`/api/nursing-plans/${id}`);
                return response.data;
            },
            mockData.nursingPlans.find(item => item.id === id) || null
        );
    },
    create: async (planData: any) => {
        return safeApiCall(
            async () => {
                const response = await apiClient.post('/api/nursing-plans', planData);
                return response.data;
            },
            {
                ...planData,
                id: `new-${Date.now()}`
            }
        );
    },
    update: async (id: string, planData: any) => {
        return safeApiCall(
            async () => {
                const response = await apiClient.put(`/api/nursing-plans/${id}`, planData);
                return response.data;
            },
            planData
        );
    },
    delete: async (id: string) => {
        return safeApiCall(
            async () => {
                const response = await apiClient.delete(`/api/nursing-plans/${id}`);
                return response.data;
            },
            { success: true }
        );
    },
};

// 看護記録関連のAPI
export const nursingRecordAPI = {
    getAll: async () => {
        return safeApiCall(
            async () => {
                const response = await apiClient.get('/api/nursing-records');
                return response.data;
            }, 
            mockData.nursingRecords
        );
    },
    getById: async (id: string) => {
        return safeApiCall(
            async () => {
                const response = await apiClient.get(`/api/nursing-records/${id}`);
                return response.data;
            },
            mockData.nursingRecords.find(item => item.id === id) || null
        );
    },
    create: async (recordData: any) => {
        return safeApiCall(
            async () => {
                const response = await apiClient.post('/api/nursing-records', recordData);
                return response.data;
            },
            {
                ...recordData,
                id: `new-${Date.now()}`
            }
        );
    },
    update: async (id: string, recordData: any) => {
        return safeApiCall(
            async () => {
                const response = await apiClient.put(`/api/nursing-records/${id}`, recordData);
                return response.data;
            },
            recordData
        );
    },
    delete: async (id: string) => {
        return safeApiCall(
            async () => {
                const response = await apiClient.delete(`/api/nursing-records/${id}`);
                return response.data;
            },
            { success: true }
        );
    },
};

// バイタルサイン関連のAPI
export const vitalsAPI = {
    getAll: async (patientId?: string) => {
        return safeApiCall(
            async () => {
                const url = patientId ? `/api/vitals?patient_id=${patientId}` : '/api/vitals';
                const response = await apiClient.get(url);
                return response.data;
            }, 
            patientId 
              ? mockData.vitals.filter(v => v.patientId === patientId)
              : mockData.vitals
        );
    },
    getById: async (id: string) => {
        return safeApiCall(
            async () => {
                const response = await apiClient.get(`/api/vitals/${id}`);
                return response.data;
            },
            mockData.vitals.find(item => item.id === id) || null
        );
    },
    create: async (vitalData: any) => {
        return safeApiCall(
            async () => {
                const response = await apiClient.post('/api/vitals', vitalData);
                return response.data;
            },
            {
                ...vitalData,
                id: `new-${Date.now()}`
            }
        );
    },
    update: async (id: string, vitalData: any) => {
        return safeApiCall(
            async () => {
                const response = await apiClient.put(`/api/vitals/${id}`, vitalData);
                return response.data;
            },
            vitalData
        );
    },
    delete: async (id: string) => {
        return safeApiCall(
            async () => {
                const response = await apiClient.delete(`/api/vitals/${id}`);
                return response.data;
            },
            { success: true }
        );
    },
};

export default apiClient;
