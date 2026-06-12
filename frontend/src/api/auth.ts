import { api } from "./client";

export const authApi = {
    register: async (name: string, email: string, password: string) => {
        try {
            const response = await api.post("/api/auth/register", {
                name,
                email,
                password
            });

            return response.data;
        } catch (error : any) {
            throw new Error(error.response?.data?.message || "Registration failed");
        }
    },

    login: async(email: string, password: string) => {
        try {
            const response = await api.post("/api/auth/login", {
                email,
                password
            });

            if (response.data.token) {
                localStorage.setItem("token", response.data.token);
            }

            return response.data;
        } catch (error: any) {
            throw new Error(error.response?.data?.message || "Invalid credentials");
        }
    }
}