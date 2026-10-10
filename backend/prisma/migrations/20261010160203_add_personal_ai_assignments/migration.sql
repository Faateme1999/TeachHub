-- CreateEnum
CREATE TYPE "AssignmentSource" AS ENUM ('TEACHER', 'AI');

-- AlterTable
ALTER TABLE "Assignment" ADD COLUMN     "createdForUserId" INTEGER,
ADD COLUMN     "source" "AssignmentSource" NOT NULL DEFAULT 'TEACHER';

-- CreateIndex
CREATE INDEX "Assignment_lessonId_source_idx" ON "Assignment"("lessonId", "source");

-- CreateIndex
CREATE INDEX "Assignment_createdForUserId_idx" ON "Assignment"("createdForUserId");

-- AddForeignKey
ALTER TABLE "Assignment" ADD CONSTRAINT "Assignment_createdForUserId_fkey" FOREIGN KEY ("createdForUserId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;
