/*
  Warnings:

  - You are about to drop the column `type` on the `MissionReview` table. All the data in the column will be lost.
  - You are about to drop the `DiagnosticOption` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `DiagnosticQuestion` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `DiagnosticTestAttempt` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `DiagnosticUserAnswer` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `DiagnosticUserAnswerOption` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `MissionDiagnosticTest` table. If the table is not empty, all the data it contains will be lost.

*/
-- CreateEnum
CREATE TYPE "TestType" AS ENUM ('DIAGNOSTIC', 'REASSESSMENT');

-- DropForeignKey
ALTER TABLE "DiagnosticOption" DROP CONSTRAINT "DiagnosticOption_questionId_fkey";

-- DropForeignKey
ALTER TABLE "DiagnosticQuestion" DROP CONSTRAINT "DiagnosticQuestion_outcomeId_fkey";

-- DropForeignKey
ALTER TABLE "DiagnosticQuestion" DROP CONSTRAINT "DiagnosticQuestion_testId_fkey";

-- DropForeignKey
ALTER TABLE "DiagnosticTestAttempt" DROP CONSTRAINT "DiagnosticTestAttempt_testId_fkey";

-- DropForeignKey
ALTER TABLE "DiagnosticTestAttempt" DROP CONSTRAINT "DiagnosticTestAttempt_userId_fkey";

-- DropForeignKey
ALTER TABLE "DiagnosticUserAnswer" DROP CONSTRAINT "DiagnosticUserAnswer_attemptId_fkey";

-- DropForeignKey
ALTER TABLE "DiagnosticUserAnswer" DROP CONSTRAINT "DiagnosticUserAnswer_questionId_fkey";

-- DropForeignKey
ALTER TABLE "DiagnosticUserAnswerOption" DROP CONSTRAINT "DiagnosticUserAnswerOption_answerId_fkey";

-- DropForeignKey
ALTER TABLE "DiagnosticUserAnswerOption" DROP CONSTRAINT "DiagnosticUserAnswerOption_optionId_fkey";

-- DropForeignKey
ALTER TABLE "MissionDiagnosticTest" DROP CONSTRAINT "MissionDiagnosticTest_lessonId_fkey";

-- DropForeignKey
ALTER TABLE "StudentMistake" DROP CONSTRAINT "StudentMistake_questionId_fkey";

-- AlterTable
ALTER TABLE "MissionReview" DROP COLUMN "type";

-- DropTable
DROP TABLE "DiagnosticOption";

-- DropTable
DROP TABLE "DiagnosticQuestion";

-- DropTable
DROP TABLE "DiagnosticTestAttempt";

-- DropTable
DROP TABLE "DiagnosticUserAnswer";

-- DropTable
DROP TABLE "DiagnosticUserAnswerOption";

-- DropTable
DROP TABLE "MissionDiagnosticTest";

-- DropEnum
DROP TYPE "MissionType";

-- CreateTable
CREATE TABLE "MissionTest" (
    "id" SERIAL NOT NULL,
    "title" TEXT NOT NULL,
    "order" INTEGER NOT NULL,
    "testType" "TestType" NOT NULL DEFAULT 'DIAGNOSTIC',
    "createdForUserId" INTEGER,
    "lessonId" INTEGER NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "MissionTest_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "TestQuestion" (
    "id" SERIAL NOT NULL,
    "text" TEXT NOT NULL,
    "topic" TEXT NOT NULL,
    "type" "QuestionType" NOT NULL,
    "order" INTEGER NOT NULL,
    "testId" INTEGER NOT NULL,
    "outcomeId" INTEGER NOT NULL,

    CONSTRAINT "TestQuestion_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "TestOption" (
    "id" SERIAL NOT NULL,
    "text" TEXT NOT NULL,
    "isCorrect" BOOLEAN NOT NULL,
    "order" INTEGER NOT NULL,
    "questionId" INTEGER NOT NULL,

    CONSTRAINT "TestOption_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "TestAttempt" (
    "id" SERIAL NOT NULL,
    "userId" INTEGER NOT NULL,
    "testId" INTEGER NOT NULL,
    "attemptNumber" INTEGER NOT NULL DEFAULT 1,
    "score" DOUBLE PRECISION,
    "submittedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "TestAttempt_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "UserAnswer" (
    "id" SERIAL NOT NULL,
    "attemptId" INTEGER NOT NULL,
    "questionId" INTEGER NOT NULL,
    "isCorrect" BOOLEAN NOT NULL,

    CONSTRAINT "UserAnswer_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "UserAnswerOption" (
    "id" SERIAL NOT NULL,
    "answerId" INTEGER NOT NULL,
    "optionId" INTEGER NOT NULL,

    CONSTRAINT "UserAnswerOption_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "TestAttempt_userId_testId_key" ON "TestAttempt"("userId", "testId");

-- CreateIndex
CREATE UNIQUE INDEX "UserAnswer_attemptId_questionId_key" ON "UserAnswer"("attemptId", "questionId");

-- CreateIndex
CREATE UNIQUE INDEX "UserAnswerOption_answerId_optionId_key" ON "UserAnswerOption"("answerId", "optionId");

-- AddForeignKey
ALTER TABLE "MissionTest" ADD CONSTRAINT "MissionTest_createdForUserId_fkey" FOREIGN KEY ("createdForUserId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "MissionTest" ADD CONSTRAINT "MissionTest_lessonId_fkey" FOREIGN KEY ("lessonId") REFERENCES "Lesson"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "TestQuestion" ADD CONSTRAINT "TestQuestion_testId_fkey" FOREIGN KEY ("testId") REFERENCES "MissionTest"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "TestQuestion" ADD CONSTRAINT "TestQuestion_outcomeId_fkey" FOREIGN KEY ("outcomeId") REFERENCES "Outcome"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "TestOption" ADD CONSTRAINT "TestOption_questionId_fkey" FOREIGN KEY ("questionId") REFERENCES "TestQuestion"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "TestAttempt" ADD CONSTRAINT "TestAttempt_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "TestAttempt" ADD CONSTRAINT "TestAttempt_testId_fkey" FOREIGN KEY ("testId") REFERENCES "MissionTest"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "UserAnswer" ADD CONSTRAINT "UserAnswer_attemptId_fkey" FOREIGN KEY ("attemptId") REFERENCES "TestAttempt"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "UserAnswer" ADD CONSTRAINT "UserAnswer_questionId_fkey" FOREIGN KEY ("questionId") REFERENCES "TestQuestion"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "UserAnswerOption" ADD CONSTRAINT "UserAnswerOption_answerId_fkey" FOREIGN KEY ("answerId") REFERENCES "UserAnswer"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "UserAnswerOption" ADD CONSTRAINT "UserAnswerOption_optionId_fkey" FOREIGN KEY ("optionId") REFERENCES "TestOption"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "StudentMistake" ADD CONSTRAINT "StudentMistake_questionId_fkey" FOREIGN KEY ("questionId") REFERENCES "TestQuestion"("id") ON DELETE CASCADE ON UPDATE CASCADE;
