import { Router, type Router as R } from "express";
import { register, login } from "../controllers/auth";
import { asyncHandler } from "../utils/async-handler";

const authRouter: R = Router();

authRouter.post("/register", asyncHandler(register));
authRouter.post("/login", asyncHandler(login));

export default authRouter;
