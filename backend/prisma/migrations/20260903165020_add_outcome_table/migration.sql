-- CreateTable
CREATE TABLE "Outcome" (
    "id" SERIAL NOT NULL,
    "text" TEXT NOT NULL,
    "lessonId" INTEGER NOT NULL,

    CONSTRAINT "Outcome_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "Outcome" ADD CONSTRAINT "Outcome_lessonId_fkey" FOREIGN KEY ("lessonId") REFERENCES "Lesson"("id") ON DELETE CASCADE ON UPDATE CASCADE;
