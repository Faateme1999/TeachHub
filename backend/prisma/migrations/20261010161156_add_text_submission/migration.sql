-- AlterTable
ALTER TABLE "Submission" ADD COLUMN     "answerText" TEXT,
ALTER COLUMN "fileName" DROP NOT NULL,
ALTER COLUMN "fileData" DROP NOT NULL;
