/*
  Warnings:

  - You are about to drop the column `order` on the `MissionReview` table. All the data in the column will be lost.
  - You are about to drop the column `order` on the `MissionTest` table. All the data in the column will be lost.
  - Added the required column `testId` to the `StudentMistake` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "MissionReview" DROP COLUMN "order";

-- AlterTable
ALTER TABLE "MissionTest" DROP COLUMN "order";

-- AlterTable
ALTER TABLE "StudentMistake" ADD COLUMN     "testId" INTEGER NOT NULL;

-- AddForeignKey
ALTER TABLE "StudentMistake" ADD CONSTRAINT "StudentMistake_testId_fkey" FOREIGN KEY ("testId") REFERENCES "MissionTest"("id") ON DELETE CASCADE ON UPDATE CASCADE;
