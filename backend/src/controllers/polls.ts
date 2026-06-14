import { Request, Response } from "express";
import { db } from "../db";
import { createPollSchema, submitResponseSchema } from "../validators/poll";
import { nanoid } from "nanoid";
import slugify from "slugify";
import { answers, polls, questions, responses } from "../model";
import { and, eq, gt, ilike, lte, SQL } from "drizzle-orm";
import { io } from "..";

interface AuthenticatedRequest extends Request {
  user?: {
    userId: string;
  };
}

export const createPoll = async (req: AuthenticatedRequest, res: Response) => {
  const validateData = await createPollSchema.parseAsync(req.body);

  const creatorId = req.user?.userId;
  if (!creatorId) {
    return res.status(401).json({ error: "Unauthorized" });
  }

  const slugId = nanoid(6).toLowerCase();
  const slug = `${slugify(validateData.title, {
    lower: true,
    strict: true,
  })}-${slugId}`;

  const expiresAt = new Date(validateData.expiresAt);

  // Adding a Poll
  const newPollData = await db.transaction(async (tx) => {
    const [insertedPoll] = await tx
      .insert(polls)
      .values({
        creatorId,
        slug,
        title: validateData.title,
        isAnonymous: validateData.isAnonymous,
        expiresAt,
        isPublished: false,
      })
      .returning({
        id: polls.id,
        slug: polls.slug,
        title: polls.title,
      });

    // Adding Questions
    const questionsToInsert = validateData.questions.map((q) => ({
      pollId: insertedPoll.id,
      text: q.text,
      isMandatory: q.isMandatory,
      options: q.options,
    }));

    const insertedQuestions = await tx
      .insert(questions)
      .values(questionsToInsert)
      .returning();

    return {
      ...insertedPoll,
      questions: insertedQuestions,
    };
  });

  return res.status(201).json({
    success: true,
    message: "Poll created successfully",
    data: newPollData,
  });
};

export const getAllPolls = async (req: AuthenticatedRequest, res: Response) => {
  const creatorId = req.user?.userId;
  if (!creatorId) {
    return res.status(401).json({ error: "Unauthorized" });
  }

  const userPolls = await db
    .select()
    .from(polls)
    .where(eq(polls.creatorId, creatorId));

  return res.status(200).json({
    success: true,
    data: userPolls,
  });
};

export const getPollAnalytics = async (
  req: AuthenticatedRequest,
  res: Response,
) => {
  const { id: pollId } = req.params as { id: string };
  const creatorId = req.user?.userId;

  if (!creatorId) {
    return res.status(401).json({ error: "Unauthorized" });
  }

  const [poll] = await db
    .select()
    .from(polls)
    .where(and(eq(polls.id, pollId), eq(polls.creatorId, creatorId)));

  if (!poll) {
    return res.status(404).json({ error: "Poll not found" });
  }

  if (poll.creatorId !== creatorId) {
    return res
      .status(403)
      .json({ error: "Unauthorized to view analytics for this poll" });
  }

  // Fetch all the poll questions
  const pollQuestions = await db
    .select()
    .from(questions)
    .where(eq(questions.pollId, pollId));

  // Fetch all responses for the poll
  const allResponses = await db
    .select()
    .from(responses)
    .where(eq(responses.pollId, pollId));

  const allAnswers = await db
    .select({
      id: answers.id,
      questionId: answers.questionId,
      chosenOption: answers.chosenOption,
    })
    .from(answers)
    .innerJoin(questions, eq(answers.questionId, questions.id))
    .where(eq(questions.pollId, pollId));

  // Calculate Participation Insights
  let anonymousCount = 0;
  let authenticatedCount = 0;

  allResponses.forEach((response) => {
    if (response.creatorId) {
      anonymousCount++;
    } else {
      authenticatedCount++;
    }
  });

  // Compile Options Per Question
  const questionsSummary = pollQuestions.map((question) => {
    const questionAnswers = allAnswers.filter(
      (answer) => answer.questionId === question.id,
    );

    const optionCounts: Record<string, number> = {};

    question.options.forEach((option) => {
      optionCounts[option] = 0;
    });

    questionAnswers.forEach((answer) => {
      const chosen = Array.isArray(answer.chosenOption)
        ? answer.chosenOption
        : [answer.chosenOption];

      chosen.forEach((opt) => {
        if (opt && optionCounts[opt] !== undefined) {
          optionCounts[opt]++;
        }
      });
    });

    const results = Object.keys(optionCounts).map((option) => ({
      option: option,
      count: optionCounts[option],
    }));

    return {
      questionId: question.id,
      questionText: question.text,
      totalVotesForQuestion: questionAnswers.length,
      results: results,
    };
  });

  return res.status(200).json({
    success: true,
    analytics: {
      totalResponses: allResponses.length,
      participationInsights: {
        anonymousCount,
        authenticatedCount,
      },
      questionsSummary,
    },
  });
};

export const publishPoll = async (req: AuthenticatedRequest, res: Response) => {
  const { id: pollId } = req.params as { id: string };
  const creatorId = req.user?.userId as string;

  const [poll] = await db
    .select()
    .from(polls)
    .where(and(eq(polls.id, pollId), eq(polls.creatorId, creatorId)));

  if (!poll) {
    return res.status(404).json({ error: "Poll not found" });
  }

  if (poll.creatorId !== creatorId) {
    return res.status(403).json({ error: "Unauthorized to publish this poll" });
  }

  if (poll.isPublished) {
    return res.status(400).json({ error: "Poll is already published" });
  }

  try {
    const [updatedPoll] = await db
      .update(polls)
      .set({ isPublished: true })
      .where(eq(polls.id, pollId))
      .returning();

    io.to(`poll_${pollId}`).emit("poll_state_published", {
      pollId,
      slug: updatedPoll.slug,
    });

    return res.status(200).json({
      success: true,
      message: "Poll published successfully",
      data: updatedPoll,
    });
  } catch (wsError) {
    console.log(
      "(publishPoll) Failed to emit real-time WebSocket update:",
      wsError,
    );
  }
};

export const deletePoll = async (req: AuthenticatedRequest, res: Response) => {
  const { id: pollId } = req.params as { id: string };
  const creatorId = req.user?.userId as string;
  const [poll] = await db
    .select()
    .from(polls)
    .where(and(eq(polls.id, pollId), eq(polls.creatorId, creatorId)));

  if (!poll) {
    return res.status(404).json({ error: "Poll not found" });
  }

  const [deletedPoll] = await db
    .delete(polls)
    .where(eq(polls.id, pollId))
    .returning({
      id: polls.id,
    });

  return res.status(200).json({
    success: true,
    message: "Poll deleted successfully",
    data: deletedPoll.id,
  });
};

export const getPublicPollById = async (req: Request, res: Response) => {
  const pollId = req.params.id as string;

  // 1. UUID Structural Validation Gate
  const uuidRegex =
    /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;
  if (!uuidRegex.test(pollId)) {
    return res.status(404).json({ error: "Poll layout not found" });
  }

  try {
    // 2. Fetch the target Poll from PostgreSQL
    const [poll] = await db
      .select()
      .from(polls)
      .where(eq(polls.id, pollId))
      .limit(1);

    if (!poll) {
      return res.status(404).json({ error: "Poll records missing." });
    }

    // 3. Draft Security Block: If it's a private draft, block public access entirely
    if (!poll.isPublished) {
      return res.status(403).json({ 
        error: "This ballot structure is currently a private draft under review." 
      });
    }

    // 4. Fetch all corresponding questions for this poll schema
    const pollQuestions = await db
      .select()
      .from(questions)
      .where(eq(questions.pollId, pollId));

    // ⏱️ AUTOMATED CLOCK ASSESSMENT
    const currentDate = new Date();
    const hasExpired = currentDate > new Date(poll.expiresAt);

    if (hasExpired) {
      // 📊 MODE 2: POLL HAS EXPIRED -> Calculate aggregates correctly using your split schema
      
      // Find all parent response tracking rows connected to this poll
      const parentResponses = await db
        .select({ id: responses.id })
        .from(responses)
        .where(eq(responses.pollId, pollId));

      const analyticsPayload = await Promise.all(
        pollQuestions.map(async (q) => {
          // Fetch child option answers written specifically for this question identifier
          const currentQuestionAnswers = await db
            .select()
            .from(answers)
            .where(eq(answers.questionId, q.id));

          // Run a reduce matrix loop to tally the choice allocations cleanly based on q.options array
          const choiceDistribution = q.options.reduce((acc: Record<string, number>, option: string) => {
            acc[option] = currentQuestionAnswers.filter((a) => a.chosenOption === option).length;
            return acc;
          }, {});

          return {
            id: q.id,
            text: q.text,
            options: q.options,
            isMandatory: q.isMandatory,
            totalQuestionVotes: currentQuestionAnswers.length,
            results: choiceDistribution, // e.g., { "Option A": 5, "Option B": 12 }
          };
        })
      );

      return res.status(200).json({
        success: true,
        viewMode: "Results", // 👈 Signals frontend to render visual chart progress bars
        poll: {
          id: poll.id,
          title: poll.title,
          isAnonymous: poll.isAnonymous,
          expiresAt: poll.expiresAt,
          totalBallotsCast: parentResponses.length, // Total unique parent submittals
          analytics: analyticsPayload,
        },
      });
    }

    // 🗳️ MODE 1: POLL IS STILL ACTIVE -> Return standard voting inputs template
    return res.status(200).json({
      success: true,
      viewMode: "Voting Form", // 👈 Signals frontend to render choices form checkboxes
      poll: {
        id: poll.id,
        title: poll.title,
        isAnonymous: poll.isAnonymous,
        expiresAt: poll.expiresAt,
        isPublished: poll.isPublished,
        questions: pollQuestions.map((q) => ({
          id: q.id,
          text: q.text,
          isMandatory: q.isMandatory,
          options: q.options, // Already parsed native PostgreSQL array layout
        })),
      },
    });

  } catch (error: any) {
    console.error("Drizzle Query Compilation Crash:", error);
    return res.status(500).json({ error: "Internal cluster table aggregation failure." });
  }
};

export const submitPollResponse = async (req: Request, res: Response) => {
  const pollId = req.params.id as string;
  const visitorId = (req as any).user?.userId;

  const [poll] = await db
    .select()
    .from(polls)
    .where(eq(polls.id, pollId))
    .limit(1);

  if (!poll) {
    return res.status(404).json({ error: "Poll not found" });
  }

  if (new Date() > new Date(poll.expiresAt) || !poll.isPublished) {
    return res
      .status(400)
      .json({ success: false, error: "Submissions are closed for this poll." });
  }

  if (!poll.isAnonymous && !visitorId) {
    return res.status(401).json({
      success: false,
      error: "Unauthorized",
      message: "This poll is trackable. Please log in to submit your response.",
    });
  }

  const { answers: incomingAnswers } = await submitResponseSchema.parseAsync(
    req.body,
  );
  try {
    const dbQuestions = await db
      .select()
      .from(questions)
      .where(eq(questions.pollId, pollId));

    const submittedQuestionIds = new Set(
      incomingAnswers.map((a) => a.questionId),
    );
    const missingMandatoryQuestions = dbQuestions.filter(
      (q) => q.isMandatory && !submittedQuestionIds.has(q.id),
    );

    if (missingMandatoryQuestions.length > 0) {
      return res.status(400).json({
        success: false,
        error: "Validation failed",
        message: "Some mandatory questions were not answered.",
        missingQuestions: missingMandatoryQuestions.map((q) => ({
          id: q.id,
          text: q.text,
        })),
      });
    }

    const outcome = await db.transaction(async (tx) => {
      const [newResponse] = await tx
        .insert(responses)
        .values({
          pollId,
          creatorId: visitorId || null,
        })
        .returning();

      const answersToInsert = incomingAnswers.map((answer) => ({
        responseId: newResponse.id,
        questionId: answer.questionId,
        chosenOption: answer.chosenOption,
      }));

      const recordedAnswers = await tx
        .insert(answers)
        .values(answersToInsert)
        .returning();

      return {
        responseId: newResponse.id,
        recordedAnswers,
      };
    });

    io.to(`poll_${pollId}`).emit("live_analytics_update", {
      pollId,
      outcome,
    });

    return res.status(201).json({
      success: true,
      message: "Your votes have been recorded successfully",
      data: outcome,
    });
  } catch (wsError) {
    console.log("Failed to emit real-time WebSocket update:", wsError);
  }
};

export const getPublicPolls = async (req: Request, res: Response) => {
  const search = req.query.search as string | undefined;
  const status = req.query.status as string | undefined;
  const isAnonymous = req.query.isAnonymous as string | undefined;

  const conditions: SQL[] = [];

  if (search) {
    conditions.push(ilike(polls.title, `%${search}%`));
  }

  const now = new Date();
  if (status === "active") {
    conditions.push(gt(polls.expiresAt, now));
  } else if (status === "expired") {
    conditions.push(lte(polls.expiresAt, now));
  }

  if (isAnonymous === "true") {
    conditions.push(eq(polls.isAnonymous, true));
  } else if (isAnonymous === "false") {
    conditions.push(eq(polls.isAnonymous, false));
  }

  const publicPolls = await db
    .select({
      id: polls.id,
      title: polls.title,
      slug: polls.slug,
      isAnonymous: polls.isAnonymous,
      isPublished: polls.isPublished,
      expiresAt: polls.expiresAt,
      createdAt: polls.createdAt,
    })
    .from(polls)
    .where(conditions.length > 0 ? and(...conditions) : undefined)
    .orderBy(polls.createdAt);

  return res.status(200).json({
    success: true,
    count: publicPolls.length,
    polls: publicPolls,
  });
};
