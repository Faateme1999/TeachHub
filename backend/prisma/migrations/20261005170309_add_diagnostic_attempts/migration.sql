-- CreateTable
CREATE TABLE "DiagnosticTestAttempt" (
    "id" SERIAL NOT NULL,
    "userId" INTEGER NOT NULL,
    "testId" INTEGER NOT NULL,
    "attemptNumber" INTEGER NOT NULL DEFAULT 1,
    "score" DOUBLE PRECISION,
    "submittedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "DiagnosticTestAttempt_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "DiagnosticUserAnswer" (
    "id" SERIAL NOT NULL,
    "attemptId" INTEGER NOT NULL,
    "questionId" INTEGER NOT NULL,
    "isCorrect" BOOLEAN NOT NULL,

    CONSTRAINT "DiagnosticUserAnswer_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "DiagnosticUserAnswerOption" (
    "id" SERIAL NOT NULL,
    "answerId" INTEGER NOT NULL,
    "optionId" INTEGER NOT NULL,

    CONSTRAINT "DiagnosticUserAnswerOption_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "DiagnosticTestAttempt_userId_testId_key" ON "DiagnosticTestAttempt"("userId", "testId");

-- CreateIndex
CREATE UNIQUE INDEX "DiagnosticUserAnswer_attemptId_questionId_key" ON "DiagnosticUserAnswer"("attemptId", "questionId");

-- CreateIndex
CREATE UNIQUE INDEX "DiagnosticUserAnswerOption_answerId_optionId_key" ON "DiagnosticUserAnswerOption"("answerId", "optionId");

-- AddForeignKey
ALTER TABLE "DiagnosticTestAttempt" ADD CONSTRAINT "DiagnosticTestAttempt_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "DiagnosticTestAttempt" ADD CONSTRAINT "DiagnosticTestAttempt_testId_fkey" FOREIGN KEY ("testId") REFERENCES "MissionDiagnosticTest"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "DiagnosticUserAnswer" ADD CONSTRAINT "DiagnosticUserAnswer_attemptId_fkey" FOREIGN KEY ("attemptId") REFERENCES "DiagnosticTestAttempt"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "DiagnosticUserAnswer" ADD CONSTRAINT "DiagnosticUserAnswer_questionId_fkey" FOREIGN KEY ("questionId") REFERENCES "DiagnosticQuestion"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "DiagnosticUserAnswerOption" ADD CONSTRAINT "DiagnosticUserAnswerOption_answerId_fkey" FOREIGN KEY ("answerId") REFERENCES "DiagnosticUserAnswer"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "DiagnosticUserAnswerOption" ADD CONSTRAINT "DiagnosticUserAnswerOption_optionId_fkey" FOREIGN KEY ("optionId") REFERENCES "DiagnosticOption"("id") ON DELETE CASCADE ON UPDATE CASCADE;
