/*
  Warnings:

  - Added the required column `topic` to the `DiagnosticQuestion` table without a default value. This is not possible if the table is not empty.
  - Added the required column `lessonId` to the `MissionDiagnosticTest` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "DiagnosticQuestion" ADD COLUMN     "topic" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "MissionDiagnosticTest" ADD COLUMN     "lessonId" INTEGER NOT NULL;

-- AddForeignKey
ALTER TABLE "MissionDiagnosticTest" ADD CONSTRAINT "MissionDiagnosticTest_lessonId_fkey" FOREIGN KEY ("lessonId") REFERENCES "Lesson"("id") ON DELETE CASCADE ON UPDATE CASCADE;
