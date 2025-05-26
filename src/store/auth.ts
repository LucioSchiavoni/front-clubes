import { create } from "zustand";
import { persist } from "zustand/middleware";
import { createUser } from "@/interface/create-user";
import { loginRequest, authRequest, registerRequest } from "@/api/auth";

type State = {
    token: string;
    profile: any;
    isAuth: boolean;
}

type Actions = {
    setToken: (token: string) => void;
    setProfile: (profile: any) => void;
    logout: () => void;
    createUser: (user: createUser) => Promise<any>;
    login: (user: { email: string; password: string }) => Promise<any>;
    checkAuth: () => Promise<any>;
}

export const useAuthStore = create(persist<State & Actions>(
    (set:any) => ({
        token: "",
        profile: null,
        isAuth: false,

        setToken: (token: string) => set(() => ({
            token,
            isAuth: true
        })),

        setProfile: (profile: any) => set(() => ({
            profile
        })),

        createUser: async (user: createUser) => {
            try {
                const res = await registerRequest(user);
                return res;
            } catch (error) {
                console.log("Error en el state al crear el user: ", error);
            }
        },

        login: async (user:any) => {
            try {
                const res = await loginRequest(user);
                set({
                    token: res.data.token,
                    isAuth: true,
                    profile: res.data.user
                });
                return res;
            } catch (error) {
                console.log("Error en login: ", error);
                throw error;
            }
        },

        checkAuth: async () => {
            try {
                const res = await authRequest();
                set({
                    isAuth: true,
                    profile: res.data.user
                });
                return res;
            } catch (error) {
                set({
                    isAuth: false,
                    token: "",
                    profile: null
                });
                console.log("No autenticado: ", error);
            }
        },

        logout: () => set(() => ({
            token: '',
            isAuth: false,
            profile: null
        }))
    }), {
        name: 'auth',
    }
));