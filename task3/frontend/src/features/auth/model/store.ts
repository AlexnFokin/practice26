import { makeAutoObservable } from 'mobx';
import axios from 'axios';
import AuthService from '../api/AuthService';
import type { IUser } from '../../../models/User';
import type { AuthResponse } from '../../../models/response/AuthResponse';

const tokenName = import.meta.env.VITE_TOKEN_NAME;
const baseURL = import.meta.env.VITE_API_URL;

export default class Store {
    user = {} as IUser;
    isAuth = false;
    isLoading = false;

    constructor() {
        makeAutoObservable(this);

        // подписка на событие разлогина из $api
        window.addEventListener('auth:logout', () => {
            this.setAuth(false);
            this.setUser({} as IUser);
        });
    }

    setAuth(bool: boolean) {
        this.isAuth = bool;
    }

    setUser(user: IUser) {
        this.user = user;
    }

    setIsLoading(bool: boolean) {
        this.isLoading = bool;
    }

    async login(email: string, password: string) {
        try {
            const response = await AuthService.login(email, password);
            localStorage.setItem(tokenName, response.data.accessToken);
            this.setAuth(true);
            this.setUser(response.data.user);
        } catch (error: any) {
            console.log(error.response?.data?.message);
            throw error;
        }
    }

    async register(email: string, password: string) {
        try {
            const response = await AuthService.register(email, password);
            localStorage.setItem(tokenName, response.data.accessToken);
            this.setAuth(true);
            this.setUser(response.data.user);
        } catch (error: any) {
            console.log(error.response?.data?.message);
            throw error;
        }
    }

    async logout() {
        try {
            await AuthService.logout();
        } catch (error: any) {
            console.log(error.response?.data?.message);
        } finally {
            localStorage.removeItem(tokenName);
            this.setAuth(false);
            this.setUser({} as IUser);
        }
    }

    async checkAuth() {
        this.setIsLoading(true);
        try {
            const response = await axios.get<AuthResponse>(`${baseURL}/auth/refresh`, {
                withCredentials: true,
            });
            localStorage.setItem(tokenName, response.data.accessToken);
            this.setAuth(true);
            this.setUser(response.data.user);
        } catch (error) {
            // refresh не сработал — чистим состояние
            localStorage.removeItem(tokenName);
            this.setAuth(false);
            this.setUser({} as IUser);
        } finally {
            this.setIsLoading(false);
        }
    }
}