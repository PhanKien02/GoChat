import { create } from "zustand";
import { ILoginRequest, IRegisterRequest, IResponse, User } from "@/lib/types";
import api from "@/lib/api";
import { authService } from "../services/auth.service";
import { setCookie } from "@/lib/cookies";

interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;

  setUser: (user: User | null) => void;
  login: (credentials: ILoginRequest) => Promise<void>;
  register: (credentials: IRegisterRequest) => Promise<void>;
  logout: () => Promise<void>;
  checkAuth: () => Promise<void>;
}

export const useAuthStore = create<AuthState>((set) => ({
  user: null,
  isAuthenticated: false,
  isLoading: false,
  error: null,

  setUser: (user) => set({ user, isAuthenticated: !!user }),

  login: async (credentials: ILoginRequest) => {
    set({ isLoading: true, error: null });
    await authService
      .login(credentials)
      .then((data) => {
        if (data.isSuccess) {
          set({
            user: data.data.user,
            isAuthenticated: true,
            isLoading: false,
          });
          setCookie("accessToken", data.data.accessToken);
        }
      })
      .catch((error: IResponse<null>) => {
        console.log({ error });
        set({
          error: error.message,
          isLoading: false,
        });
      });
  },

  register: async (credentials: IRegisterRequest) => {
    set({ isLoading: true, error: null });
    await authService
      .register(credentials)
      .then((data) => {
        if (data.isSuccess) {
          set({
            isAuthenticated: true,
            isLoading: false,
          });
        }
      })
      .catch((error: IResponse<null>) => {
        console.log({ error });
        set({
          error: error.message,
          isLoading: false,
        });
      });
  },
  logout: async () => {
    set({ isLoading: true, error: null });
    try {
      await api.post("/auth/logout");
      set({ user: null, isAuthenticated: false, isLoading: false });
    } catch (error) {
      set({
        error: error instanceof Error ? error.message : "Failed to logout",
        isLoading: false,
      });
    }
  },

  checkAuth: async () => {
    set({ isLoading: true, error: null });
    try {
      const response = await api.get("/auth/me");
      set({
        user: response.data.user,
        isAuthenticated: true,
        isLoading: false,
      });
    } catch {
      set({
        user: null,
        isAuthenticated: false,
        isLoading: false,
      });
    }
  },
}));
