import api from "@/lib/api"
import { ILoginRequest, ILoginResponse, IRegisterRequest, IResponse } from "@/lib/types"

class AuthService {
        private baseUrl: string

        constructor() {
                this.baseUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8080/api"
        }
        async login(credentials: ILoginRequest): Promise<IResponse<ILoginResponse>> {
                const response = await api.post(`${this.baseUrl}/auth/login`, credentials)
                return response.data
        }

        async register(body: IRegisterRequest): Promise<IResponse<null>> {
                const response = await api.post(`${this.baseUrl}/auth/register`, body)
                return response.data
        }
}

export const authService = new AuthService()