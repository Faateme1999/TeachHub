-- CreateTable
CREATE TABLE "StudentMistake" (
    "id" SERIAL NOT NULL,
    "userId" INTEGER NOT NULL,
    "courseId" INTEGER NOT NULL,
    "lessonId" INTEGER NOT NULL,
    "questionId" INTEGER NOT NULL,
    "outcomeId" INTEGER NOT NULL,
    "topic" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "StudentMistake_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "StudentMistake_userId_courseId_idx" ON "StudentMistake"("userId", "courseId");

-- CreateIndex
CREATE INDEX "StudentMistake_userId_lessonId_idx" ON "StudentMistake"("userId", "lessonId");

-- CreateIndex
CREATE INDEX "StudentMistake_userId_outcomeId_idx" ON "StudentMistake"("userId", "outcomeId");

-- AddForeignKey
ALTER TABLE "StudentMistake" ADD CONSTRAINT "StudentMistake_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "StudentMistake" ADD CONSTRAINT "StudentMistake_courseId_fkey" FOREIGN KEY ("courseId") REFERENCES "Course"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "StudentMistake" ADD CONSTRAINT "StudentMistake_lessonId_fkey" FOREIGN KEY ("lessonId") REFERENCES "Lesson"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "StudentMistake" ADD CONSTRAINT "StudentMistake_questionId_fkey" FOREIGN KEY ("questionId") REFERENCES "DiagnosticQuestion"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "StudentMistake" ADD CONSTRAINT "StudentMistake_outcomeId_fkey" FOREIGN KEY ("outcomeId") REFERENCES "Outcome"("id") ON DELETE CASCADE ON UPDATE CASCADE;
