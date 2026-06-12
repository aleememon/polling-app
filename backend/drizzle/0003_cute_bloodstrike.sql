ALTER TABLE "responses" ALTER COLUMN "creator_id" DROP NOT NULL;--> statement-breakpoint
ALTER TABLE "answers" ALTER COLUMN "chosen_option" SET DATA TYPE text;