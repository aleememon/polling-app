import express, { Application, Request, Response } from "express";
import cors from "cors";
import authRouter from "./routes/auth";
import pollRouter from "./routes/poll";
import { errorHandler } from "./utils/error-handler";


const app: Application = express();

app.use(cors());
app.use(express.json());


app.get("/health", (req: Request, res: Response) => {
    return res.json({ ok: true })
})

app.use("/api/auth", authRouter);
app.use("/api/polls", pollRouter);

app.use(errorHandler);
export default app