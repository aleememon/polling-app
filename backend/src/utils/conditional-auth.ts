import { Request, Response, NextFunction } from "express";
import { verifyToken } from "./token";

declare global {
  namespace Express {
    interface Request {
      user?: {
        userId: string;
      };
    }
  }
}

export const conditionalAuthMiddleware = (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  const authHeader = req.headers.authorization;

  // If no authorization header, continue without authentication
  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return next();
  }

  const token = authHeader.split(" ")[1];
  const payload = verifyToken(token);

  // If token is invalid, continue without user (don't reject)
  if (!payload) {
    return next();
  }

  // Token is valid, attach user to request
  req.user = payload;
  next();
};
