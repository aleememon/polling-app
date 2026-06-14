ALTER TABLE "responses" DROP CONSTRAINT "responses_question_id_questions_id_fk";
--> statement-breakpoint
ALTER TABLE "responses" DROP COLUMN "question_id";