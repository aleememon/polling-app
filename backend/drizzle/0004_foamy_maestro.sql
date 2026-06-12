ALTER TABLE "questions" DROP CONSTRAINT "questions_poll_id_polls_id_fk";
--> statement-breakpoint
ALTER TABLE "responses" DROP CONSTRAINT "responses_poll_id_polls_id_fk";
--> statement-breakpoint
ALTER TABLE "answers" DROP CONSTRAINT "answers_question_id_questions_id_fk";
--> statement-breakpoint
ALTER TABLE "answers" DROP CONSTRAINT "answers_response_id_responses_id_fk";
--> statement-breakpoint
ALTER TABLE "questions" ADD CONSTRAINT "questions_poll_id_polls_id_fk" FOREIGN KEY ("poll_id") REFERENCES "public"."polls"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "responses" ADD CONSTRAINT "responses_poll_id_polls_id_fk" FOREIGN KEY ("poll_id") REFERENCES "public"."polls"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "answers" ADD CONSTRAINT "answers_question_id_questions_id_fk" FOREIGN KEY ("question_id") REFERENCES "public"."questions"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "answers" ADD CONSTRAINT "answers_response_id_responses_id_fk" FOREIGN KEY ("response_id") REFERENCES "public"."responses"("id") ON DELETE cascade ON UPDATE no action;