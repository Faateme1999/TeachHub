/*
  Warnings:

  - You are about to drop the column `fileName` on the `Lesson` table. All the data in the column will be lost.
  - You are about to drop the column `fileUrl` on the `Lesson` table. All the data in the column will be lost.
  - You are about to drop the column `videoUrl` on the `Lesson` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "Lesson" DROP COLUMN "fileName",
DROP COLUMN "fileUrl",
DROP COLUMN "videoUrl",
ADD COLUMN     "videoData" BYTEA;
