/*
  Warnings:

  - The values [STARTED,DELETED] on the enum `STATUS` will be removed. If these variants are still used in the database, this will fail.
  - The primary key for the `CareerProfile` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to drop the column `currentCompanyId` on the `CareerProfile` table. All the data in the column will be lost.
  - You are about to drop the column `currentJobIdAtBerufeNet` on the `CareerProfile` table. All the data in the column will be lost.
  - You are about to drop the column `id` on the `CareerProfile` table. All the data in the column will be lost.
  - The `professionalInterests` column on the `CareerProfile` table would be dropped and recreated. This will lead to data loss if there is data in the column.
  - You are about to drop the column `companyId` on the `Job` table. All the data in the column will be lost.
  - You are about to drop the column `jobIdAtBerufeNet` on the `Job` table. All the data in the column will be lost.
  - You are about to drop the column `userId` on the `Job` table. All the data in the column will be lost.
  - The primary key for the `LearningHistory` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to drop the column `id` on the `LearningHistory` table. All the data in the column will be lost.
  - The primary key for the `LearningProfile` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to drop the column `id` on the `LearningProfile` table. All the data in the column will be lost.
  - You are about to drop the column `learningHistoryId` on the `LearningProfile` table. All the data in the column will be lost.
  - The `mediaType` column on the `LearningProfile` table would be dropped and recreated. This will lead to data loss if there is data in the column.
  - The `language` column on the `LearningProfile` table would be dropped and recreated. This will lead to data loss if there is data in the column.
  - The `processingTimePerUnit` column on the `LearningProfile` table would be dropped and recreated. This will lead to data loss if there is data in the column.
  - The `preferredDidacticMethod` column on the `LearningProfile` table would be dropped and recreated. This will lead to data loss if there is data in the column.
  - You are about to drop the column `userId` on the `LearningProgress` table. All the data in the column will be lost.
  - You are about to drop the column `description` on the `LearningUnit` table. All the data in the column will be lost.
  - You are about to drop the column `title` on the `LearningUnit` table. All the data in the column will be lost.
  - You are about to drop the column `name` on the `Qualification` table. All the data in the column will be lost.
  - You are about to drop the column `year` on the `Qualification` table. All the data in the column will be lost.
  - You are about to drop the column `userProfileId` on the `personalPaths` table. All the data in the column will be lost.
  - You are about to drop the column `companyId` on the `user` table. All the data in the column will be lost.
  - You are about to drop the column `name` on the `user` table. All the data in the column will be lost.
  - You are about to drop the `Company` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `ConsumedUnitData` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `LearningBehaviorData` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `Nugget` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `_pastJobs` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `_proposedUnitsOfLearningPath` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `_selfReportedSkill` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `_startedBy` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `_verifiedSkill` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `_workedAt` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `pathProgress` table. If the table is not empty, all the data it contains will be lost.
  - Added the required column `careerProfileId` to the `Job` table without a default value. This is not possible if the table is not empty.
  - Added the required column `company` to the `Job` table without a default value. This is not possible if the table is not empty.
  - Made the column `learningHistoryId` on table `LearningProgress` required. This step will fail if there are existing NULL values in that column.
  - Added the required column `date` to the `Qualification` table without a default value. This is not possible if the table is not empty.
  - Added the required column `title` to the `Qualification` table without a default value. This is not possible if the table is not empty.
  - Made the column `careerProfileId` on table `Qualification` required. This step will fail if there are existing NULL values in that column.
  - Added the required column `learningHistoryId` to the `personalPaths` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "_startedBy" DROP CONSTRAINT "_startedBy_A_fkey";

-- DropForeignKey
ALTER TABLE "_startedBy" DROP CONSTRAINT "_startedBy_B_fkey";

-- DropForeignKey
ALTER TABLE "ConsumedUnitData" DROP CONSTRAINT "ConsumedUnitData_consumedLUId_fkey";

-- DropForeignKey
ALTER TABLE "ConsumedUnitData" DROP CONSTRAINT "ConsumedUnitData_lbDataId_fkey";

-- DropTable
DROP TABLE "ConsumedUnitData";

-- AlterEnum
BEGIN;
CREATE TYPE "STATUS_new" AS ENUM ('OPEN', 'IN_PROGRESS', 'FINISHED', 'FAILED', 'RESTARTED');
ALTER TYPE "STATUS" RENAME TO "STATUS_old";
ALTER TYPE "STATUS_new" RENAME TO "STATUS";
DROP TYPE "STATUS_old";
COMMIT;

-- DropForeignKey
ALTER TABLE "CareerProfile" DROP CONSTRAINT "CareerProfile_currentCompanyId_fkey";

-- DropForeignKey
ALTER TABLE "CareerProfile" DROP CONSTRAINT "CareerProfile_userId_fkey";

-- DropForeignKey
ALTER TABLE "Job" DROP CONSTRAINT "Job_companyId_fkey";

-- DropForeignKey
ALTER TABLE "Job" DROP CONSTRAINT "Job_userId_fkey";

-- DropForeignKey
ALTER TABLE "LearningBehaviorData" DROP CONSTRAINT "LearningBehaviorData_userId_fkey";

-- DropForeignKey
ALTER TABLE "LearningHistory" DROP CONSTRAINT "LearningHistory_userId_fkey";

-- DropForeignKey
ALTER TABLE "LearningProfile" DROP CONSTRAINT "LearningProfile_learningHistoryId_fkey";

-- DropForeignKey
ALTER TABLE "LearningProfile" DROP CONSTRAINT "LearningProfile_userId_fkey";

-- DropForeignKey
ALTER TABLE "LearningProgress" DROP CONSTRAINT "LearningProgress_learningHistoryId_fkey";

-- DropForeignKey
ALTER TABLE "LearningProgress" DROP CONSTRAINT "LearningProgress_skillId_fkey";

-- DropForeignKey
ALTER TABLE "LearningProgress" DROP CONSTRAINT "LearningProgress_userId_fkey";

-- DropForeignKey
ALTER TABLE "Qualification" DROP CONSTRAINT "Qualification_careerProfileId_fkey";

-- DropForeignKey
ALTER TABLE "_pastJobs" DROP CONSTRAINT "_pastJobs_A_fkey";

-- DropForeignKey
ALTER TABLE "_pastJobs" DROP CONSTRAINT "_pastJobs_B_fkey";

-- DropForeignKey
ALTER TABLE "_proposedUnitsOfLearningPath" DROP CONSTRAINT "_proposedUnitsOfLearningPath_A_fkey";

-- DropForeignKey
ALTER TABLE "_proposedUnitsOfLearningPath" DROP CONSTRAINT "_proposedUnitsOfLearningPath_B_fkey";

-- DropForeignKey
ALTER TABLE "_selfReportedSkill" DROP CONSTRAINT "_selfReportedSkill_A_fkey";

-- DropForeignKey
ALTER TABLE "_selfReportedSkill" DROP CONSTRAINT "_selfReportedSkill_B_fkey";

-- DropForeignKey
ALTER TABLE "_verifiedSkill" DROP CONSTRAINT "_verifiedSkill_A_fkey";

-- DropForeignKey
ALTER TABLE "_verifiedSkill" DROP CONSTRAINT "_verifiedSkill_B_fkey";

-- DropForeignKey
ALTER TABLE "_workedAt" DROP CONSTRAINT "_workedAt_A_fkey";

-- DropForeignKey
ALTER TABLE "_workedAt" DROP CONSTRAINT "_workedAt_B_fkey";

-- DropForeignKey
ALTER TABLE "pathProgress" DROP CONSTRAINT "pathProgress_personalPathId_fkey";

-- DropForeignKey
ALTER TABLE "pathProgress" DROP CONSTRAINT "pathProgress_unitId_fkey";

-- DropForeignKey
ALTER TABLE "personalPaths" DROP CONSTRAINT "personalPaths_userProfileId_fkey";

-- DropForeignKey
ALTER TABLE "user" DROP CONSTRAINT "user_companyId_fkey";

-- DropIndex
DROP INDEX "Job_userId_key";

-- DropIndex
DROP INDEX "user_companyId_name_key";

-- AlterTable
ALTER TABLE "CareerProfile" DROP CONSTRAINT "CareerProfile_pkey",
DROP COLUMN "currentCompanyId",
DROP COLUMN "currentJobIdAtBerufeNet",
DROP COLUMN "id",
ADD COLUMN     "selfReportedSkills" TEXT[],
DROP COLUMN "professionalInterests",
ADD COLUMN     "professionalInterests" TEXT[] DEFAULT ARRAY[]::TEXT[];

-- AlterTable
ALTER TABLE "Job" DROP COLUMN "companyId",
DROP COLUMN "jobIdAtBerufeNet",
DROP COLUMN "userId",
ADD COLUMN     "careerProfileId" TEXT NOT NULL,
ADD COLUMN     "company" TEXT NOT NULL,
ALTER COLUMN "endTime" DROP NOT NULL;

-- AlterTable
ALTER TABLE "LearningHistory" DROP CONSTRAINT "LearningHistory_pkey",
DROP COLUMN "id";

-- AlterTable
ALTER TABLE "LearningProfile" DROP CONSTRAINT "LearningProfile_pkey",
DROP COLUMN "id",
DROP COLUMN "learningHistoryId",
ALTER COLUMN "semanticDensity" SET DEFAULT 0,
ALTER COLUMN "semanticDensity" SET DATA TYPE DOUBLE PRECISION,
ALTER COLUMN "semanticGravity" SET DEFAULT 0,
ALTER COLUMN "semanticGravity" SET DATA TYPE DOUBLE PRECISION,
DROP COLUMN "mediaType",
ADD COLUMN     "mediaType" TEXT[] DEFAULT ARRAY[]::TEXT[],
DROP COLUMN "language",
ADD COLUMN     "language" TEXT[] DEFAULT ARRAY[]::TEXT[],
DROP COLUMN "processingTimePerUnit",
ADD COLUMN     "processingTimePerUnit" INTEGER NOT NULL DEFAULT 0,
DROP COLUMN "preferredDidacticMethod",
ADD COLUMN     "preferredDidacticMethod" TEXT[] DEFAULT ARRAY[]::TEXT[];

-- AlterTable
ALTER TABLE "LearningProgress" DROP COLUMN "userId",
ALTER COLUMN "learningHistoryId" SET NOT NULL;

-- AlterTable
ALTER TABLE "LearningUnit" DROP COLUMN "description",
DROP COLUMN "title";

-- AlterTable
ALTER TABLE "Qualification" DROP COLUMN "name",
DROP COLUMN "year",
ADD COLUMN     "berufenetId" TEXT,
ADD COLUMN     "date" TIMESTAMP(3) NOT NULL,
ADD COLUMN     "title" TEXT NOT NULL,
ALTER COLUMN "careerProfileId" SET NOT NULL;

-- AlterTable
ALTER TABLE "personalPaths" DROP COLUMN "userProfileId",
ADD COLUMN     "learningHistoryId" TEXT NOT NULL,
ADD COLUMN     "status" "STATUS" NOT NULL DEFAULT 'OPEN';

-- AlterTable
ALTER TABLE "user" DROP COLUMN "companyId",
DROP COLUMN "name";

-- DropTable
DROP TABLE "Company";

-- DropTable
DROP TABLE "LearningBehaviorData";

-- DropTable
DROP TABLE "Nugget";

-- DropTable
DROP TABLE "_pastJobs";

-- DropTable
DROP TABLE "_proposedUnitsOfLearningPath";

-- DropTable
DROP TABLE "_selfReportedSkill";

-- DropTable
DROP TABLE "_startedBy";

-- DropTable
DROP TABLE "_verifiedSkill";

-- DropTable
DROP TABLE "_workedAt";

-- DropTable
DROP TABLE "pathProgress";

-- DropEnum
DROP TYPE "NuggetCategory";

-- CreateTable
CREATE TABLE "consumedUnits" (
    "id" TEXT NOT NULL,
    "actualProcessingTime" INTEGER NOT NULL DEFAULT 0,
    "testPerformance" DECIMAL(5,2) NOT NULL DEFAULT 0.0,
    "unitId" TEXT NOT NULL,
    "status" "STATUS" NOT NULL DEFAULT 'OPEN',
    "date" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "consumedUnits_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "pathSequence" (
    "id" TEXT NOT NULL,
    "position" INTEGER NOT NULL,
    "pathId" TEXT NOT NULL,
    "unitId" TEXT NOT NULL,

    CONSTRAINT "pathSequence_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "consumedUnits_unitId_key" ON "consumedUnits"("unitId");

-- CreateIndex
CREATE UNIQUE INDEX "pathSequence_pathId_position_key" ON "pathSequence"("pathId", "position");

-- AddForeignKey
ALTER TABLE "consumedUnits" ADD CONSTRAINT "consumedUnits_unitId_fkey" FOREIGN KEY ("unitId") REFERENCES "LearningUnit"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "pathSequence" ADD CONSTRAINT "pathSequence_pathId_fkey" FOREIGN KEY ("pathId") REFERENCES "personalPaths"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "pathSequence" ADD CONSTRAINT "pathSequence_unitId_fkey" FOREIGN KEY ("unitId") REFERENCES "consumedUnits"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "personalPaths" ADD CONSTRAINT "personalPaths_learningHistoryId_fkey" FOREIGN KEY ("learningHistoryId") REFERENCES "LearningHistory"("userId") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "LearningProfile" ADD CONSTRAINT "LearningProfile_userId_fkey" FOREIGN KEY ("userId") REFERENCES "user"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "LearningHistory" ADD CONSTRAINT "LearningHistory_userId_fkey" FOREIGN KEY ("userId") REFERENCES "user"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "LearningProgress" ADD CONSTRAINT "LearningProgress_skillId_fkey" FOREIGN KEY ("skillId") REFERENCES "skills"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "LearningProgress" ADD CONSTRAINT "LearningProgress_learningHistoryId_fkey" FOREIGN KEY ("learningHistoryId") REFERENCES "LearningHistory"("userId") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "CareerProfile" ADD CONSTRAINT "CareerProfile_userId_fkey" FOREIGN KEY ("userId") REFERENCES "user"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Qualification" ADD CONSTRAINT "Qualification_careerProfileId_fkey" FOREIGN KEY ("careerProfileId") REFERENCES "CareerProfile"("userId") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Job" ADD CONSTRAINT "Job_careerProfileId_fkey" FOREIGN KEY ("careerProfileId") REFERENCES "CareerProfile"("userId") ON DELETE CASCADE ON UPDATE CASCADE;
