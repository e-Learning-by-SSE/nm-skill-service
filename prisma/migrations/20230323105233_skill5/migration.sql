/*
  Warnings:

  - You are about to drop the column `pathTeachingGoalId` on the `skills` table. All the data in the column will be lost.
  - You are about to drop the column `requirementsId` on the `skills` table. All the data in the column will be lost.

*/
-- DropForeignKey
ALTER TABLE "skills" DROP CONSTRAINT "skills_pathTeachingGoalId_fkey";

-- DropForeignKey
ALTER TABLE "skills" DROP CONSTRAINT "skills_requirementsId_fkey";

-- AlterTable
ALTER TABLE "LearningPaths" ADD COLUMN     "skillIdReq" TEXT NOT NULL DEFAULT '',
ADD COLUMN     "skillIdTG" TEXT NOT NULL DEFAULT '';

-- AlterTable
ALTER TABLE "skills" DROP COLUMN "pathTeachingGoalId",
DROP COLUMN "requirementsId";

-- AddForeignKey
ALTER TABLE "LearningPaths" ADD CONSTRAINT "LearningPaths_skillIdTG_fkey" FOREIGN KEY ("skillIdTG") REFERENCES "skills"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "LearningPaths" ADD CONSTRAINT "LearningPaths_skillIdReq_fkey" FOREIGN KEY ("skillIdReq") REFERENCES "skills"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
