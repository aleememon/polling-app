import { z } from "zod";

export const registerUserSchema = z.object({
    name: z.string().min(3, {error: "Name must be at least 3 characters long"}),
    email: z.string().email({error: "Invalid email address"}),
    password: z.string().min(6, {error: "Password must be at least 6 characters long"}),
});

export const loginUserSchema = z.object({
    email: z.string().email({error: "Invalid email address"}),
    password: z.string().min(6, {error: "Password must be at least 6 characters long"}),
});