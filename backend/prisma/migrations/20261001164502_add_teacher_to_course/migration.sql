-- Add teacherId temporarily nullable
ALTER TABLE "Course"
ADD COLUMN "teacherId" INTEGER;

-- Assign existing courses to Admin id 4
UPDATE "Course"
SET "teacherId" = 4;

-- Make teacherId required
ALTER TABLE "Course"
ALTER COLUMN "teacherId" SET NOT NULL;

-- Add foreign key
ALTER TABLE "Course"
ADD CONSTRAINT "Course_teacherId_fkey"
FOREIGN KEY ("teacherId")
REFERENCES "User"("id")
ON DELETE RESTRICT
ON UPDATE CASCADE;