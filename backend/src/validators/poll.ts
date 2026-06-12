import z from "zod";

export const createPollSchema = z.object({
    title: z.string().min(1, { error: "Title is required" }),
    isAnonymous: z.boolean().default(true),
    // Expecting an ISO Date String e.g. "2024-12-31T23:59:59Z"
    expiresAt: z.string().refine((dateStr) => !isNaN(Date.parse(dateStr)), {
        message: "Invalid date format. Expected ISO string.",
    }),
    // Validating the array of nested questions
    questions: z.array(z.object({
        text: z.string({ error: "Question text is required" })
        .min(1, { error: "Question text cannot be empty" }),
        isMandatory: z.boolean().default(true),
        options: z.array(z.string().min(1, {error: "Option text is required" }))
        .min(2, { error: "At least two options are required" }),
    })).min(1, { error: "At least one question is required" }),
});

export const submitResponseSchema = z.object({
    answers: z.array(
      z.object({
        questionId: z.string({ error: 'Question ID is required' }).uuid('Invalid Question ID format'),
        chosenOption: z.string({ error: 'Chosen option text is required' }).min(1, 'Option choice cannot be empty'),
      })
    )
    .min(1, 'You must answer at least one question to submit.'),
});
