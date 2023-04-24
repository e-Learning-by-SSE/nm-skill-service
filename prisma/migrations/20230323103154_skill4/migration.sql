-- AlterTable
ALTER TABLE "skills" ADD COLUMN     "requirementsId" TEXT NOT NULL DEFAULT '';

-- AddForeignKey
ALTER TABLE "skills" ADD CONSTRAINT "skills_requirementsId_fkey" FOREIGN KEY ("requirementsId") REFERENCES "LearningPaths"("id") ON DELETE CASCADE ON UPDATE CASCADE;
