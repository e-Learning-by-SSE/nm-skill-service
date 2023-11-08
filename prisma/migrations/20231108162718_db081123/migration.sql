/*
  Warnings:

  - You are about to drop the column `version` on the `paths` table. All the data in the column will be lost.
  - You are about to drop the `_pathTeachingGoal` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `path_goals` table. If the table is not empty, all the data it contains will be lost.
  - A unique constraint covering the columns `[id]` on the table `LearningUnit` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `owner` to the `paths` table without a default value. This is not possible if the table is not empty.

*/
-- CreateEnum
CREATE TYPE "LIFECYCLE" AS ENUM ('DRAFT', 'POOL', 'ARCHIVED');

-- DropForeignKey
ALTER TABLE "Nugget" DROP CONSTRAINT "Nugget_learningUnitId_fkey";

-- DropForeignKey
ALTER TABLE "_pathGoals" DROP CONSTRAINT "_pathGoals_B_fkey";

-- DropForeignKey
ALTER TABLE "_pathTeachingGoal" DROP CONSTRAINT "_pathTeachingGoal_A_fkey";

-- DropForeignKey
ALTER TABLE "_pathTeachingGoal" DROP CONSTRAINT "_pathTeachingGoal_B_fkey";

-- DropIndex
DROP INDEX "paths_title_version_key";

-- AlterTable
ALTER TABLE "LearningUnit" ADD COLUMN     "lifecycle" "LIFECYCLE" NOT NULL DEFAULT 'DRAFT',
ADD COLUMN     "orga_id" TEXT NOT NULL DEFAULT '';

-- AlterTable
ALTER TABLE "paths" DROP COLUMN "version",
ADD COLUMN     "lifecycle" "LIFECYCLE" NOT NULL DEFAULT 'DRAFT',
ADD COLUMN     "owner" TEXT NOT NULL,
ADD COLUMN     "targetAudience" TEXT,
ALTER COLUMN "title" DROP NOT NULL;

-- AlterTable
ALTER TABLE "user" ALTER COLUMN "status" SET DEFAULT 'active';

-- DropTable
DROP TABLE "_pathTeachingGoal";

-- DropTable
DROP TABLE "path_goals";

-- CreateTable
CREATE TABLE "orderings" (
    "id" TEXT NOT NULL,
    "learningUnitId" TEXT,
    "orderId" TEXT NOT NULL,

    CONSTRAINT "orderings_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Feedback" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL DEFAULT 'Anonymous',
    "learningUnitId" TEXT NOT NULL,
    "learningValue" INTEGER NOT NULL DEFAULT 1,
    "presentation" INTEGER NOT NULL DEFAULT 1,
    "comprehensiveness" INTEGER NOT NULL DEFAULT 1,
    "structure" INTEGER NOT NULL DEFAULT 1,
    "overallRating" INTEGER NOT NULL DEFAULT 1,
    "optionalTextComment" TEXT DEFAULT '',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Feedback_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "_pathRequirements" (
    "A" TEXT NOT NULL,
    "B" TEXT NOT NULL
);

-- CreateTable
CREATE TABLE "_recommendedUnitsOfLEarningPath" (
    "A" TEXT NOT NULL,
    "B" TEXT NOT NULL
);

-- CreateTable
CREATE TABLE "_suggestedSkills" (
    "A" TEXT NOT NULL,
    "B" TEXT NOT NULL
);

-- CreateIndex
CREATE UNIQUE INDEX "orderings_learningUnitId_orderId_key" ON "orderings"("learningUnitId", "orderId");

-- CreateIndex
CREATE UNIQUE INDEX "_pathRequirements_AB_unique" ON "_pathRequirements"("A", "B");

-- CreateIndex
CREATE INDEX "_pathRequirements_B_index" ON "_pathRequirements"("B");

-- CreateIndex
CREATE UNIQUE INDEX "_recommendedUnitsOfLEarningPath_AB_unique" ON "_recommendedUnitsOfLEarningPath"("A", "B");

-- CreateIndex
CREATE INDEX "_recommendedUnitsOfLEarningPath_B_index" ON "_recommendedUnitsOfLEarningPath"("B");

-- CreateIndex
CREATE UNIQUE INDEX "_suggestedSkills_AB_unique" ON "_suggestedSkills"("A", "B");

-- CreateIndex
CREATE INDEX "_suggestedSkills_B_index" ON "_suggestedSkills"("B");

-- CreateIndex
CREATE UNIQUE INDEX "LearningUnit_id_key" ON "LearningUnit"("id");

-- AddForeignKey
ALTER TABLE "orderings" ADD CONSTRAINT "orderings_learningUnitId_fkey" FOREIGN KEY ("learningUnitId") REFERENCES "LearningUnit"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Feedback" ADD CONSTRAINT "Feedback_learningUnitId_fkey" FOREIGN KEY ("learningUnitId") REFERENCES "LearningUnit"("id") ON DELETE CASCADE ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "_pathGoals" ADD CONSTRAINT "_pathGoals_B_fkey" FOREIGN KEY ("B") REFERENCES "skills"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_pathRequirements" ADD CONSTRAINT "_pathRequirements_A_fkey" FOREIGN KEY ("A") REFERENCES "paths"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_pathRequirements" ADD CONSTRAINT "_pathRequirements_B_fkey" FOREIGN KEY ("B") REFERENCES "skills"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_recommendedUnitsOfLEarningPath" ADD CONSTRAINT "_recommendedUnitsOfLEarningPath_A_fkey" FOREIGN KEY ("A") REFERENCES "paths"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_recommendedUnitsOfLEarningPath" ADD CONSTRAINT "_recommendedUnitsOfLEarningPath_B_fkey" FOREIGN KEY ("B") REFERENCES "LearningUnit"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_suggestedSkills" ADD CONSTRAINT "_suggestedSkills_A_fkey" FOREIGN KEY ("A") REFERENCES "orderings"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_suggestedSkills" ADD CONSTRAINT "_suggestedSkills_B_fkey" FOREIGN KEY ("B") REFERENCES "skills"("id") ON DELETE CASCADE ON UPDATE CASCADE;
