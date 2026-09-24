import type { AxiosResponse } from "axios";
import $api from "../../../shared/api/api";
import type { AuthResponse } from "../../../models/response/AuthResponse";

export default class AuthService {
    static async login(email: string, password: string): Promise<AxiosResponse<AuthResponse>> {
        return $api.post<AuthResponse>('/auth/login', { email, password })
    }

    static async register(email: string, password: string): Promise<AxiosResponse<AuthResponse>> {
        return $api.post<AuthResponse>('/auth/register', { email, password })
    }

    static async logout(): Promise<void> {
        return $api.post('/auth/logout')
    }
}