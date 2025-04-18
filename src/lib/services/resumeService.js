import axios from 'axios';
import { getToken } from '@/lib/auth';

const resumeService = {
    // 创建新简历
    async create(resumeTitle, resumeData) {
        const API_URL = process.env.NEXT_PUBLIC_API_URL;
        if (!API_URL) {
            throw new Error('API URL is not configured');
        }

        const token = getToken();
        if (!token) {
            throw new Error('Authentication required');
        }

        try {
            const response = await axios.post(`${API_URL}/resumes`, {
                title: resumeTitle,
                data: resumeData
            }, {
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json'
                }
            });

            return response.data;
        } catch (error) {
            handleApiError(error);
        }
    },

    // 获取单个简历
    async get(resumeId) {
        const API_URL = process.env.NEXT_PUBLIC_API_URL;
        if (!API_URL) {
            throw new Error('API URL is not configured');
        }

        const token = getToken();
        if (!token) {
            throw new Error('Authentication required');
        }

        try {
            const response = await axios.get(`${API_URL}/resumes/${resumeId}`, {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });

            return response.data;
        } catch (error) {
            handleApiError(error);
        }
    },

    // 获取用户的所有简历
    async list() {
        const API_URL = process.env.NEXT_PUBLIC_API_URL;
        if (!API_URL) {
            throw new Error('API URL is not configured');
        }

        const token = getToken();
        if (!token) {
            throw new Error('Authentication required');
        }

        try {
            const response = await axios.get(`${API_URL}/resumes`, {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });

            return response.data;
        } catch (error) {
            handleApiError(error);
        }
    },

    // 更新简历
    async update(resumeId, updateData) {
        const API_URL = process.env.NEXT_PUBLIC_API_URL;
        if (!API_URL) {
            throw new Error('API URL is not configured');
        }

        const token = getToken();
        if (!token) {
            throw new Error('Authentication required');
        }

        try {
            const response = await axios.put(`${API_URL}/resumes/${resumeId}`, updateData, {
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json'
                }
            });

            return response.data;
        } catch (error) {
            handleApiError(error);
        }
    },

    // 删除简历
    async delete(resumeId) {
        const API_URL = process.env.NEXT_PUBLIC_API_URL;
        if (!API_URL) {
            throw new Error('API URL is not configured');
        }

        const token = getToken();
        if (!token) {
            throw new Error('Authentication required');
        }

        try {
            const response = await axios.delete(`${API_URL}/resumes/${resumeId}`, {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });

            return response.data;
        } catch (error) {
            handleApiError(error);
        }
    }
};

// 统一处理API错误
function handleApiError(error) {
    if (axios.isAxiosError(error)) {
        const status = error.response?.status;
        const message = error.response?.data?.message || error.message;

        switch (status) {
            case 401:
                throw new Error('Authentication required');
            case 403:
                throw new Error('Permission denied');
            case 404:
                throw new Error('Resume not found');
            case 400:
                throw new Error(`Invalid request: ${message}`);
            case 500:
                throw new Error('Server error');
            default:
                throw new Error(message || 'Network error');
        }
    }
    throw error;
}

export default resumeService;