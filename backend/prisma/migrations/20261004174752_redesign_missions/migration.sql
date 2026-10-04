/*
  Warnings:

  - You are about to drop the `LessonReview` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `Mission` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `MissionResult` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `Option` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `Question` table. If the table is not empty, all the data it contains will be lost.

*/
-- CreateEnum
CREATE TYPE "MissionType" AS ENUM ('REVIEW', 'DIAGNOSTIC');

-- DropForeignKey
ALTER TABLE "LessonReview" DROP CONSTRAINT "LessonReview_lessonId_fkey";

-- DropForeignKey
ALTER TABLE "Mission" DROP CONSTRAINT "Mission_outcomeId_fkey";

-- DropForeignKey
ALTER TABLE "MissionResult" DROP CONSTRAINT "MissionResult_missionId_fkey";

-- DropForeignKey
ALTER TABLE "MissionResult" DROP CONSTRAINT "MissionResult_userId_fkey";

-- DropForeignKey
ALTER TABLE "Option" DROP CONSTRAINT "Option_questionId_fkey";

-- DropForeignKey
ALTER TABLE "Question" DROP CONSTRAINT "Question_missionId_fkey";

-- DropTable
DROP TABLE "LessonReview";

-- DropTable
DROP TABLE "Mission";

-- DropTable
DROP TABLE "MissionResult";

-- DropTable
DROP TABLE "Option";

-- DropTable
DROP TABLE "Question";

-- CreateTable
CREATE TABLE "MissionReview" (
    "id" SERIAL NOT NULL,
    "title" TEXT NOT NULL,
    "type" "MissionType" NOT NULL,
    "order" INTEGER NOT NULL,
    "lessonId" INTEGER NOT NULL,
    "content" JSONB NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "MissionReview_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "MissionDiagnosticTest" (
    "id" SERIAL NOT NULL,
    "title" TEXT NOT NULL,
    "type" "MissionType" NOT NULL,
    "order" INTEGER NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "MissionDiagnosticTest_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "DiagnosticQuestion" (
    "id" SERIAL NOT NULL,
    "text" TEXT NOT NULL,
    "type" "QuestionType" NOT NULL,
    "order" INTEGER NOT NULL,
    "testId" INTEGER NOT NULL,
    "outcomeId" INTEGER NOT NULL,

    CONSTRAINT "DiagnosticQuestion_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "DiagnosticOption" (
    "id" SERIAL NOT NULL,
    "text" TEXT NOT NULL,
    "isCorrect" BOOLEAN NOT NULL,
    "order" INTEGER NOT NULL,
    "questionId" INTEGER NOT NULL,

    CONSTRAINT "DiagnosticOption_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "MissionReview_lessonId_key" ON "MissionReview"("lessonId");

-- AddForeignKey
ALTER TABLE "MissionReview" ADD CONSTRAINT "MissionReview_lessonId_fkey" FOREIGN KEY ("lessonId") REFERENCES "Lesson"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "DiagnosticQuestion" ADD CONSTRAINT "DiagnosticQuestion_testId_fkey" FOREIGN KEY ("testId") REFERENCES "MissionDiagnosticTest"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "DiagnosticQuestion" ADD CONSTRAINT "DiagnosticQuestion_outcomeId_fkey" FOREIGN KEY ("outcomeId") REFERENCES "Outcome"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "DiagnosticOption" ADD CONSTRAINT "DiagnosticOption_questionId_fkey" FOREIGN KEY ("questionId") REFERENCES "DiagnosticQuestion"("id") ON DELETE CASCADE ON UPDATE CASCADE;
