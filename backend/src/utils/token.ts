import jwt from "jsonwebtoken";

const JWT_SECRET = process.env.JWT_SECRET as string;
const JWT_EXPIRES_IN = (process.env.JWT_EXPIRES_IN ?? "7d") as string;

export interface TokenPayload {
    userId: string;
}

export const createToken = (payload: TokenPayload): string => {
    if (!JWT_SECRET) {
        throw new Error("JWT_SECRET is not defined in environment variables");
    }
    return jwt.sign(payload, JWT_SECRET, { expiresIn: JWT_EXPIRES_IN as jwt.SignOptions["expiresIn"] });
};

export const verifyToken = (token: string): TokenPayload | null => {
    if (!JWT_SECRET) {
        throw new Error("JWT_SECRET is not defined in environment variables");
    }
    try {
        return jwt.verify(token, JWT_SECRET) as TokenPayload;
    } catch {
        return null;
    }
};
