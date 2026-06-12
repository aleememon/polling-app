import { Router } from "express";
import { authMiddleware } from "../utils/auth-middleware";
import { asyncHandler } from "../utils/async-handler";
import {
  createPoll,
  getAllPolls,
  getPollAnalytics,
  getPublicPollById,
  publishPoll,
  submitPollResponse,
  deletePoll,
  getPublicPolls,
} from "../controllers/polls";
import { conditionalAuthMiddleware } from "../utils/conditional-auth";

const pollRouter = Router();

// Public Polls
pollRouter.get("/", conditionalAuthMiddleware, asyncHandler(getPublicPolls));

pollRouter.post(
  "/:id/responses",
  conditionalAuthMiddleware,
  asyncHandler(submitPollResponse),
);

// private Polls
pollRouter.post("/create", authMiddleware, asyncHandler(createPoll));

pollRouter.get("/dashboard", authMiddleware, asyncHandler(getAllPolls));

pollRouter.get(
  "/:id/analytics",
  authMiddleware,
  asyncHandler(getPollAnalytics),
);

pollRouter.get(
  "/:id",
  conditionalAuthMiddleware,
  asyncHandler(getPublicPollById),
);

pollRouter.patch("/:id/publish", authMiddleware, asyncHandler(publishPoll));

pollRouter.delete("/:id/delete", authMiddleware, asyncHandler(deletePoll));

export default pollRouter;
