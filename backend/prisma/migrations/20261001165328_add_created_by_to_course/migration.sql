-- Drop old foreign key
ALTER TABLE "Course" DROP CONSTRAINT "Course_teacherId_fkey";

-- Add createdById temporarily nullable
ALTER TABLE "Course" ADD COLUMN "createdById" INTEGER;

-- Assign all existing courses to Admin id 4
UPDATE "Course"
SET "createdById" = 4;

-- Make createdById required
ALTER TABLE "Course"
ALTER COLUMN "createdById" SET NOT NULL;

-- Remove old teacherId
ALTER TABLE "Course" DROP COLUMN "teacherId";

-- Add new foreign key
ALTER TABLE "Course"
ADD CONSTRAINT "Course_createdById_fkey"
FOREIGN KEY ("createdById")
REFERENCES "User"("id")
ON DELETE RESTRICT
ON UPDATE CASCADE;