import axios, { AxiosError, InternalAxiosRequestConfig } from 'axios';

const baseURL = import.meta.env.VITE_API_URL;
const tokenName = import.meta.env.VITE_TOKEN_NAME;

const $api = axios.create({
    withCredentials: true,
    baseURL,
});

// --- Request interceptor ---
$api.interceptors.request.use((config) => {
    const token = localStorage.getItem(tokenName);
    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
});

// --- Response interceptor: refresh на 401 ---
let isRefreshing = false;
let failedQueue: Array<{
    resolve: (value: unknown) => void;
    reject: (reason?: unknown) => void;
}> = [];

function processQueue(error: unknown, token: string | null = null) {
    failedQueue.forEach((prom) => {
        if (error) prom.reject(error);
        else prom.resolve(token);
    });
    failedQueue = [];
}

$api.interceptors.response.use(
    (response) => response,
    async (error: AxiosError) => {
        const original = error.config as InternalAxiosRequestConfig & { _retry?: boolean };

        // если это не 401 или уже повторяли — пробрасываем
        if (error.response?.status !== 401 || original._retry) {
            return Promise.reject(error);
        }

        // если уже идёт refresh — ставим в очередь
        if (isRefreshing) {
            return new Promise((resolve, reject) => {
                failedQueue.push({ resolve, reject });
            })
                .then((token) => {
                    original.headers.Authorization = `Bearer ${token}`;
                    return $api(original);
                })
                .catch((err) => Promise.reject(err));
        }

        original._retry = true;
        isRefreshing = true;

        try {
            const { data } = await axios.get(`${baseURL}/auth/refresh`, {
                withCredentials: true,
            });

            localStorage.setItem(tokenName, data.accessToken);
            processQueue(null, data.accessToken);

            original.headers.Authorization = `Bearer ${data.accessToken}`;
            return $api(original);
        } catch (refreshError) {
            // refresh тоже протух — разлогиниваем
            processQueue(refreshError, null);
            localStorage.removeItem(tokenName);

            // сообщаем стору, что надо сбросить isAuth
            window.dispatchEvent(new Event('auth:logout'));

            return Promise.reject(refreshError);
        } finally {
            isRefreshing = false;
        }
    },
);

export default $api;