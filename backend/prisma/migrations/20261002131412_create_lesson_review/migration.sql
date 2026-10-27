-- CreateTable
CREATE TABLE "LessonReview" (
    "id" SERIAL NOT NULL,
    "lessonId" INTEGER NOT NULL,
    "content" JSONB NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "LessonReview_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "LessonReview_lessonId_key" ON "LessonReview"("lessonId");

-- AddForeignKey
ALTER TABLE "LessonReview" ADD CONSTRAINT "LessonReview_lessonId_fkey" FOREIGN KEY ("lessonId") REFERENCES "Lesson"("id") ON DELETE CASCADE ON UPDATE CASCADE;
