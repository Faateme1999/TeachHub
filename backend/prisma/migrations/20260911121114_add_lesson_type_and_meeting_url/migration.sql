-- CreateEnum
CREATE TYPE "LessonType" AS ENUM ('RECORDED', 'LIVE');

-- AlterTable
ALTER TABLE "Lesson" ADD COLUMN     "meetingUrl" TEXT,
ADD COLUMN     "type" "LessonType" NOT NULL DEFAULT 'RECORDED',
ALTER COLUMN "content" DROP NOT NULL;
