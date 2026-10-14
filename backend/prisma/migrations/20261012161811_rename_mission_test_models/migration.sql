
/*
  Reconcile the test tables with the existing Neon database.
  Keep users, courses, lessons, outcomes, and their data.
*/

-- CreateEnum: TestType, only if it does not already exist.
DO $$
BEGIN
    IF NOT EXISTS (
        SELECT 1
        FROM pg_type t
        JOIN pg_namespace n ON n.oid = t.typnamespace
        WHERE t.typname = 'TestType'
          AND n.nspname = current_schema()
    ) THEN
        CREATE TYPE "TestType" AS ENUM ('DIAGNOSTIC', 'REASSESSMENT');
    END IF;
END
$$;

-- Remove the old StudentMistake question foreign key if present.
ALTER TABLE "StudentMistake"
DROP CONSTRAINT IF EXISTS "StudentMistake_questionId_fkey";

-- Remove the obsolete MissionReview column if present.
ALTER TABLE "MissionReview"
DROP COLUMN IF EXISTS "type";

-- Remove legacy tables if they still exist.
DROP TABLE IF EXISTS "DiagnosticOption";
DROP TABLE IF EXISTS "DiagnosticQuestion";
DROP TABLE IF EXISTS "DiagnosticTestAttempt";
DROP TABLE IF EXISTS "DiagnosticUserAnswer";
DROP TABLE IF EXISTS "DiagnosticUserAnswerOption";
DROP TABLE IF EXISTS "MissionDiagnosticTest";

-- Remove the obsolete enum if it exists.
DROP TYPE IF EXISTS "MissionType";

-- Create the new tables only if they do not already exist.
CREATE TABLE IF NOT EXISTS "MissionTest" (
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

-- Ensure the existing MissionTest table has testType.
ALTER TABLE "MissionTest"
ADD COLUMN IF NOT EXISTS "testType" "TestType" NOT NULL DEFAULT 'DIAGNOSTIC';

CREATE TABLE IF NOT EXISTS "TestQuestion" (
    "id" SERIAL NOT NULL,
    "text" TEXT NOT NULL,
    "topic" TEXT NOT NULL,
    "type" "QuestionType" NOT NULL,
    "order" INTEGER NOT NULL,
    "testId" INTEGER NOT NULL,
    "outcomeId" INTEGER NOT NULL,
    CONSTRAINT "TestQuestion_pkey" PRIMARY KEY ("id")
);

CREATE TABLE IF NOT EXISTS "TestOption" (
    "id" SERIAL NOT NULL,
    "text" TEXT NOT NULL,
    "isCorrect" BOOLEAN NOT NULL,
    "order" INTEGER NOT NULL,
    "questionId" INTEGER NOT NULL,
    CONSTRAINT "TestOption_pkey" PRIMARY KEY ("id")
);

CREATE TABLE IF NOT EXISTS "TestAttempt" (
    "id" SERIAL NOT NULL,
    "userId" INTEGER NOT NULL,
    "testId" INTEGER NOT NULL,
    "attemptNumber" INTEGER NOT NULL DEFAULT 1,
    "score" DOUBLE PRECISION,
    "submittedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "TestAttempt_pkey" PRIMARY KEY ("id")
);

CREATE TABLE IF NOT EXISTS "UserAnswer" (
    "id" SERIAL NOT NULL,
    "attemptId" INTEGER NOT NULL,
    "questionId" INTEGER NOT NULL,
    "isCorrect" BOOLEAN NOT NULL,
    CONSTRAINT "UserAnswer_pkey" PRIMARY KEY ("id")
);

CREATE TABLE IF NOT EXISTS "UserAnswerOption" (
    "id" SERIAL NOT NULL,
    "answerId" INTEGER NOT NULL,
    "optionId" INTEGER NOT NULL,
    CONSTRAINT "UserAnswerOption_pkey" PRIMARY KEY ("id")
);

-- Create unique indexes only if they do not already exist.
CREATE UNIQUE INDEX IF NOT EXISTS "TestAttempt_userId_testId_key"
ON "TestAttempt"("userId", "testId");

CREATE UNIQUE INDEX IF NOT EXISTS "UserAnswer_attemptId_questionId_key"
ON "UserAnswer"("attemptId", "questionId");

CREATE UNIQUE INDEX IF NOT EXISTS "UserAnswerOption_answerId_optionId_key"
ON "UserAnswerOption"("answerId", "optionId");

-- Add foreign keys only when they are missing.
DO $$
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM pg_constraint
        WHERE conname = 'MissionTest_createdForUserId_fkey'
          AND conrelid = '"MissionTest"'::regclass
    ) THEN
        ALTER TABLE "MissionTest"
        ADD CONSTRAINT "MissionTest_createdForUserId_fkey"
        FOREIGN KEY ("createdForUserId") REFERENCES "User"("id")
        ON DELETE CASCADE ON UPDATE CASCADE;
    END IF;

    IF NOT EXISTS (
        SELECT 1 FROM pg_constraint
        WHERE conname = 'MissionTest_lessonId_fkey'
          AND conrelid = '"MissionTest"'::regclass
    ) THEN
        ALTER TABLE "MissionTest"
        ADD CONSTRAINT "MissionTest_lessonId_fkey"
        FOREIGN KEY ("lessonId") REFERENCES "Lesson"("id")
        ON DELETE CASCADE ON UPDATE CASCADE;
    END IF;

    IF NOT EXISTS (
        SELECT 1 FROM pg_constraint
        WHERE conname = 'TestQuestion_testId_fkey'
          AND conrelid = '"TestQuestion"'::regclass
    ) THEN
        ALTER TABLE "TestQuestion"
        ADD CONSTRAINT "TestQuestion_testId_fkey"
        FOREIGN KEY ("testId") REFERENCES "MissionTest"("id")
        ON DELETE CASCADE ON UPDATE CASCADE;
    END IF;

    IF NOT EXISTS (
        SELECT 1 FROM pg_constraint
        WHERE conname = 'TestQuestion_outcomeId_fkey'
          AND conrelid = '"TestQuestion"'::regclass
    ) THEN
        ALTER TABLE "TestQuestion"
        ADD CONSTRAINT "TestQuestion_outcomeId_fkey"
        FOREIGN KEY ("outcomeId") REFERENCES "Outcome"("id")
        ON DELETE CASCADE ON UPDATE CASCADE;
    END IF;

    IF NOT EXISTS (
        SELECT 1 FROM pg_constraint
        WHERE conname = 'TestOption_questionId_fkey'
          AND conrelid = '"TestOption"'::regclass
    ) THEN
        ALTER TABLE "TestOption"
        ADD CONSTRAINT "TestOption_questionId_fkey"
        FOREIGN KEY ("questionId") REFERENCES "TestQuestion"("id")
        ON DELETE CASCADE ON UPDATE CASCADE;
    END IF;

    IF NOT EXISTS (
        SELECT 1 FROM pg_constraint
        WHERE conname = 'TestAttempt_userId_fkey'
          AND conrelid = '"TestAttempt"'::regclass
    ) THEN
        ALTER TABLE "TestAttempt"
        ADD CONSTRAINT "TestAttempt_userId_fkey"
        FOREIGN KEY ("userId") REFERENCES "User"("id")
        ON DELETE CASCADE ON UPDATE CASCADE;
    END IF;

    IF NOT EXISTS (
        SELECT 1 FROM pg_constraint
        WHERE conname = 'TestAttempt_testId_fkey'
          AND conrelid = '"TestAttempt"'::regclass
    ) THEN
        ALTER TABLE "TestAttempt"
        ADD CONSTRAINT "TestAttempt_testId_fkey"
        FOREIGN KEY ("testId") REFERENCES "MissionTest"("id")
        ON DELETE CASCADE ON UPDATE CASCADE;
    END IF;

    IF NOT EXISTS (
        SELECT 1 FROM pg_constraint
        WHERE conname = 'UserAnswer_attemptId_fkey'
          AND conrelid = '"UserAnswer"'::regclass
    ) THEN
        ALTER TABLE "UserAnswer"
        ADD CONSTRAINT "UserAnswer_attemptId_fkey"
        FOREIGN KEY ("attemptId") REFERENCES "TestAttempt"("id")
        ON DELETE CASCADE ON UPDATE CASCADE;
    END IF;

    IF NOT EXISTS (
        SELECT 1 FROM pg_constraint
        WHERE conname = 'UserAnswer_questionId_fkey'
          AND conrelid = '"UserAnswer"'::regclass
    ) THEN
        ALTER TABLE "UserAnswer"
        ADD CONSTRAINT "UserAnswer_questionId_fkey"
        FOREIGN KEY ("questionId") REFERENCES "TestQuestion"("id")
        ON DELETE CASCADE ON UPDATE CASCADE;
    END IF;

    IF NOT EXISTS (
        SELECT 1 FROM pg_constraint
        WHERE conname = 'UserAnswerOption_answerId_fkey'
          AND conrelid = '"UserAnswerOption"'::regclass
    ) THEN
        ALTER TABLE "UserAnswerOption"
        ADD CONSTRAINT "UserAnswerOption_answerId_fkey"
        FOREIGN KEY ("answerId") REFERENCES "UserAnswer"("id")
        ON DELETE CASCADE ON UPDATE CASCADE;
    END IF;

    IF NOT EXISTS (
        SELECT 1 FROM pg_constraint
        WHERE conname = 'UserAnswerOption_optionId_fkey'
          AND conrelid = '"UserAnswerOption"'::regclass
    ) THEN
        ALTER TABLE "UserAnswerOption"
        ADD CONSTRAINT "UserAnswerOption_optionId_fkey"
        FOREIGN KEY ("optionId") REFERENCES "TestOption"("id")
        ON DELETE CASCADE ON UPDATE CASCADE;
    END IF;

    IF NOT EXISTS (
        SELECT 1 FROM pg_constraint
        WHERE conname = 'StudentMistake_questionId_fkey'
          AND conrelid = '"StudentMistake"'::regclass
    ) THEN
        ALTER TABLE "StudentMistake"
        ADD CONSTRAINT "StudentMistake_questionId_fkey"
        FOREIGN KEY ("questionId") REFERENCES "TestQuestion"("id")
        ON DELETE CASCADE ON UPDATE CASCADE;
    END IF;
END
$$;
