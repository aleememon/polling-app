import { Request, Response } from "express";
import { registerUserSchema, loginUserSchema } from "../validators/auth";
import { db } from "../db";
import { users } from "../model";
import { eq } from "drizzle-orm";
import bcrypt from "bcrypt";
import { createToken } from "../utils/token";

export const register = async (req: Request, res: Response)  => {
    const {name, email, password} = await registerUserSchema.parseAsync(req.body);

    // Check if the user is in db or not with email
    const [userExists] = await db.select().from(users).where(eq(users.email, email));

    if (userExists) {
        return res.status(400).json({error: "User already exists"});
    }

    // creating a hashed password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // creating a user in db
    const [user] = await db.insert(users).values({
        name,
        email,
        password: hashedPassword,
        salt
    }).returning({
        id: users.id
    });

    return res.status(201).json({
        message: "user created successfully",
        userId: user.id
    });
};

export const login = async (req: Request, res: Response) => {
    const {email, password} = await loginUserSchema.parseAsync(req.body);

    const [userExists] = await db.select().from(users).where(eq(users.email, email));

    if (!userExists) {
        return res.status(401).json({error: "Invalid credentials"});
    }

    const isPasswordValid = await bcrypt.compare(password, userExists.password);

    if (!isPasswordValid) {
        return res.status(401).json({error: "Invalid credentials"});
    }

    const token = createToken({userId: userExists.id});

    return res.status(200).json({
        message: "user logged in successfully",
        token
    });
    
}
    