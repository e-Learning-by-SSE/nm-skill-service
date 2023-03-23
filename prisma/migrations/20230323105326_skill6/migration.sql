-- AlterTable
ALTER TABLE "LearningPaths" ADD COLUMN     "skillIdReq" TEXT NOT NULL DEFAULT '';

-- AddForeignKey
ALTER TABLE "LearningPaths" ADD CONSTRAINT "LearningPaths_skillIdReq_fkey" FOREIGN KEY ("skillIdReq") REFERENCES "skills"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
