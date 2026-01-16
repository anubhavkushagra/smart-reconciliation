import axios from 'axios';
import type { AxiosInstance, AxiosError } from 'axios';

// Remove trailing slash if present to avoid double slashes
const envUrl = import.meta.env.VITE_API_URL || 'http://localhost:5000';
export const API_URL = envUrl.replace(/\/$/, '');

// Create axios instance
const api: AxiosInstance = axios.create({
    baseURL: `${API_URL}/api`,
    headers: {
        'Content-Type': 'application/json',
    },
});

// Request interceptor to add auth token
api.interceptors.request.use(
    (config) => {
        const token = localStorage.getItem('smart-recon-token');
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

// Response interceptor for error handling
api.interceptors.response.use(
    (response) => response,
    (error: AxiosError<{ message?: string }>) => {
        // Handle authentication errors
        if (error.response?.status === 401) {
            localStorage.removeItem('smart-recon-token');
            localStorage.removeItem('smart-recon-user');
            // Optional: Redirect to login if needed, or handle in UI
            // window.location.href = '/'; 
        }

        const message = error.response?.data?.message || 'An error occurred';
        return Promise.reject(new Error(message));
    }
);

// Auth API
export const authAPI = {
    signup: async (name: string, email: string, password: string) => {
        const { data } = await api.post('/auth/signup', { name, email, password });
        return data;
    },

    login: async (email: string, password: string) => {
        const { data } = await api.post('/auth/login', { email, password });
        return data;
    },

    getMe: async () => {
        const { data } = await api.get('/auth/me');
        return data;
    },
};

// Reconciliation API
export const reconciliationAPI = {
    save: async (reconciliationData: {
        fileNameA: string;
        fileNameB: string;
        summary: any;
        results: any;
    }) => {
        const { data } = await api.post('/reconciliations', reconciliationData);
        return data;
    },

    getAll: async (page: number = 1, limit: number = 10) => {
        const { data } = await api.get('/reconciliations', {
            params: { page, limit },
        });
        return data;
    },

    getById: async (id: string) => {
        const { data } = await api.get(`/reconciliations/${id}`);
        return data;
    },

    delete: async (id: string) => {
        const { data } = await api.delete(`/reconciliations/${id}`);
        return data;
    },
};

export default api;
