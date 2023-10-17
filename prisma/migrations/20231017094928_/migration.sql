/*
  Warnings:

  - You are about to drop the column `owner` on the `skill-maps` table. All the data in the column will be lost.
  - You are about to drop the `Role` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `RoleGroup` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `SearchLearningUnit` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `SelfLearningUnit` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `SkillProfile` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `User` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `_RoleToRoleGroup` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `_requirementslearningUnit` table. If the table is not empty, all the data it contains will be lost.
  - A unique constraint covering the columns `[ownerId,name,version]` on the table `skill-maps` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `ownerId` to the `skill-maps` table without a default value. This is not possible if the table is not empty.

*/
-- AlterEnum
ALTER TYPE "ACCESS_RIGHTS" ADD VALUE 'COMPANY';

-- DropForeignKey
ALTER TABLE "LearningBehaviorData" DROP CONSTRAINT "LearningBehaviorData_userId_fkey";

-- DropForeignKey
ALTER TABLE "LearningProfile" DROP CONSTRAINT "LearningProfile_userId_fkey";

-- DropForeignKey
ALTER TABLE "Qualification" DROP CONSTRAINT "Qualification_userId_fkey";

-- DropForeignKey
ALTER TABLE "RoleGroup" DROP CONSTRAINT "RoleGroup_userId_fkey";

-- DropForeignKey
ALTER TABLE "SearchLearningUnit" DROP CONSTRAINT "SearchLearningUnit_unitId_fkey";

-- DropForeignKey
ALTER TABLE "SelfLearningUnit" DROP CONSTRAINT "SelfLearningUnit_unitId_fkey";

-- DropForeignKey
ALTER TABLE "SkillProfile" DROP CONSTRAINT "SkillProfile_userId_fkey";

-- DropForeignKey
ALTER TABLE "User" DROP CONSTRAINT "User_companyId_fkey";

-- DropForeignKey
ALTER TABLE "_RoleToRoleGroup" DROP CONSTRAINT "_RoleToRoleGroup_A_fkey";

-- DropForeignKey
ALTER TABLE "_RoleToRoleGroup" DROP CONSTRAINT "_RoleToRoleGroup_B_fkey";

-- DropForeignKey
ALTER TABLE "_requirements" DROP CONSTRAINT "_requirements_A_fkey";

-- DropForeignKey
ALTER TABLE "_requirementslearningUnit" DROP CONSTRAINT "_requirementslearningUnit_A_fkey";

-- DropForeignKey
ALTER TABLE "_requirementslearningUnit" DROP CONSTRAINT "_requirementslearningUnit_B_fkey";

-- DropIndex
DROP INDEX "Qualification_userId_key";

-- DropIndex
DROP INDEX "skill-maps_owner_name_version_key";

-- AlterTable
ALTER TABLE "LearningProfile" ADD COLUMN     "learningHistoryId" TEXT;

-- AlterTable
ALTER TABLE "LearningUnit" ADD COLUMN     "contentCreator" TEXT NOT NULL DEFAULT '',
ADD COLUMN     "contentProvider" TEXT NOT NULL DEFAULT '',
ADD COLUMN     "contentTags" TEXT[],
ADD COLUMN     "contextTags" TEXT[],
ADD COLUMN     "learningHistoryId" TEXT,
ADD COLUMN     "linkToHelpMaterial" TEXT,
ADD COLUMN     "processingTime" TEXT NOT NULL DEFAULT '',
ADD COLUMN     "rating" TEXT NOT NULL DEFAULT '',
ADD COLUMN     "semanticDensity" TEXT NOT NULL DEFAULT '',
ADD COLUMN     "semanticGravity" TEXT NOT NULL DEFAULT '',
ADD COLUMN     "targetAudience" TEXT NOT NULL DEFAULT '';

-- AlterTable
ALTER TABLE "skill-maps" DROP COLUMN "owner",
ADD COLUMN     "ownerId" TEXT NOT NULL;

-- DropTable
DROP TABLE "Role";

-- DropTable
DROP TABLE "RoleGroup";

-- DropTable
DROP TABLE "SearchLearningUnit";

-- DropTable
DROP TABLE "SelfLearningUnit";

-- DropTable
DROP TABLE "SkillProfile";

-- DropTable
DROP TABLE "User";

-- DropTable
DROP TABLE "_RoleToRoleGroup";

-- DropTable
DROP TABLE "_requirementslearningUnit";

-- DropEnum
DROP TYPE "RoleCategory";

-- CreateTable
CREATE TABLE "user" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL DEFAULT '',
    "companyId" TEXT,
    "status" TEXT NOT NULL,

    CONSTRAINT "user_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "LearningProgress" (
    "id" TEXT NOT NULL,
    "skillId" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "learningHistoryId" TEXT,

    CONSTRAINT "LearningProgress_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "LearningHistory" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,

    CONSTRAINT "LearningHistory_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "CareerProfile" (
    "id" TEXT NOT NULL,
    "professionalInterests" TEXT NOT NULL DEFAULT '',
    "currentCompanyId" TEXT NOT NULL,
    "userId" TEXT NOT NULL,

    CONSTRAINT "CareerProfile_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Job" (
    "id" TEXT NOT NULL,
    "jobtitle" TEXT NOT NULL,
    "starttime" TIMESTAMP(3) NOT NULL,
    "endtime" TIMESTAMP(3) NOT NULL,
    "companyId" TEXT NOT NULL,
    "userId" TEXT NOT NULL,

    CONSTRAINT "Job_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "_startedBy" (
    "A" TEXT NOT NULL,
    "B" TEXT NOT NULL
);

-- CreateTable
CREATE TABLE "_completedBy" (
    "A" TEXT NOT NULL,
    "B" TEXT NOT NULL
);

-- CreateTable
CREATE TABLE "_pastJobs" (
    "A" TEXT NOT NULL,
    "B" TEXT NOT NULL
);

-- CreateTable
CREATE TABLE "_currentQualifications" (
    "A" TEXT NOT NULL,
    "B" TEXT NOT NULL
);

-- CreateTable
CREATE TABLE "_selfReportedSkill" (
    "A" TEXT NOT NULL,
    "B" TEXT NOT NULL
);

-- CreateTable
CREATE TABLE "_verifiedSkill" (
    "A" TEXT NOT NULL,
    "B" TEXT NOT NULL
);

-- CreateTable
CREATE TABLE "_workedAt" (
    "A" TEXT NOT NULL,
    "B" TEXT NOT NULL
);

-- CreateIndex
CREATE UNIQUE INDEX "user_companyId_name_key" ON "user"("companyId", "name");

-- CreateIndex
CREATE UNIQUE INDEX "LearningHistory_userId_key" ON "LearningHistory"("userId");

-- CreateIndex
CREATE UNIQUE INDEX "CareerProfile_userId_key" ON "CareerProfile"("userId");

-- CreateIndex
CREATE UNIQUE INDEX "Job_userId_key" ON "Job"("userId");

-- CreateIndex
CREATE UNIQUE INDEX "_startedBy_AB_unique" ON "_startedBy"("A", "B");

-- CreateIndex
CREATE INDEX "_startedBy_B_index" ON "_startedBy"("B");

-- CreateIndex
CREATE UNIQUE INDEX "_completedBy_AB_unique" ON "_completedBy"("A", "B");

-- CreateIndex
CREATE INDEX "_completedBy_B_index" ON "_completedBy"("B");

-- CreateIndex
CREATE UNIQUE INDEX "_pastJobs_AB_unique" ON "_pastJobs"("A", "B");

-- CreateIndex
CREATE INDEX "_pastJobs_B_index" ON "_pastJobs"("B");

-- CreateIndex
CREATE UNIQUE INDEX "_currentQualifications_AB_unique" ON "_currentQualifications"("A", "B");

-- CreateIndex
CREATE INDEX "_currentQualifications_B_index" ON "_currentQualifications"("B");

-- CreateIndex
CREATE UNIQUE INDEX "_selfReportedSkill_AB_unique" ON "_selfReportedSkill"("A", "B");

-- CreateIndex
CREATE INDEX "_selfReportedSkill_B_index" ON "_selfReportedSkill"("B");

-- CreateIndex
CREATE UNIQUE INDEX "_verifiedSkill_AB_unique" ON "_verifiedSkill"("A", "B");

-- CreateIndex
CREATE INDEX "_verifiedSkill_B_index" ON "_verifiedSkill"("B");

-- CreateIndex
CREATE UNIQUE INDEX "_workedAt_AB_unique" ON "_workedAt"("A", "B");

-- CreateIndex
CREATE INDEX "_workedAt_B_index" ON "_workedAt"("B");

-- CreateIndex
CREATE UNIQUE INDEX "skill-maps_ownerId_name_version_key" ON "skill-maps"("ownerId", "name", "version");

-- AddForeignKey
ALTER TABLE "LearningUnit" ADD CONSTRAINT "LearningUnit_learningHistoryId_fkey" FOREIGN KEY ("learningHistoryId") REFERENCES "LearningHistory"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "user" ADD CONSTRAINT "user_companyId_fkey" FOREIGN KEY ("companyId") REFERENCES "Company"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "LearningProgress" ADD CONSTRAINT "LearningProgress_skillId_fkey" FOREIGN KEY ("skillId") REFERENCES "skills"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "LearningProgress" ADD CONSTRAINT "LearningProgress_userId_fkey" FOREIGN KEY ("userId") REFERENCES "user"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "LearningProgress" ADD CONSTRAINT "LearningProgress_learningHistoryId_fkey" FOREIGN KEY ("learningHistoryId") REFERENCES "LearningHistory"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "LearningProfile" ADD CONSTRAINT "LearningProfile_learningHistoryId_fkey" FOREIGN KEY ("learningHistoryId") REFERENCES "LearningHistory"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "LearningProfile" ADD CONSTRAINT "LearningProfile_userId_fkey" FOREIGN KEY ("userId") REFERENCES "user"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "LearningHistory" ADD CONSTRAINT "LearningHistory_userId_fkey" FOREIGN KEY ("userId") REFERENCES "user"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "CareerProfile" ADD CONSTRAINT "CareerProfile_currentCompanyId_fkey" FOREIGN KEY ("currentCompanyId") REFERENCES "Company"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "CareerProfile" ADD CONSTRAINT "CareerProfile_userId_fkey" FOREIGN KEY ("userId") REFERENCES "user"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "LearningBehaviorData" ADD CONSTRAINT "LearningBehaviorData_userId_fkey" FOREIGN KEY ("userId") REFERENCES "user"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Qualification" ADD CONSTRAINT "Qualification_userId_fkey" FOREIGN KEY ("userId") REFERENCES "user"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Job" ADD CONSTRAINT "Job_companyId_fkey" FOREIGN KEY ("companyId") REFERENCES "Company"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Job" ADD CONSTRAINT "Job_userId_fkey" FOREIGN KEY ("userId") REFERENCES "user"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_requirements" ADD CONSTRAINT "_requirements_A_fkey" FOREIGN KEY ("A") REFERENCES "LearningUnit"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_startedBy" ADD CONSTRAINT "_startedBy_A_fkey" FOREIGN KEY ("A") REFERENCES "LearningHistory"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_startedBy" ADD CONSTRAINT "_startedBy_B_fkey" FOREIGN KEY ("B") REFERENCES "LearningUnit"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_completedBy" ADD CONSTRAINT "_completedBy_A_fkey" FOREIGN KEY ("A") REFERENCES "LearningHistory"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_completedBy" ADD CONSTRAINT "_completedBy_B_fkey" FOREIGN KEY ("B") REFERENCES "LearningUnit"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_pastJobs" ADD CONSTRAINT "_pastJobs_A_fkey" FOREIGN KEY ("A") REFERENCES "CareerProfile"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_pastJobs" ADD CONSTRAINT "_pastJobs_B_fkey" FOREIGN KEY ("B") REFERENCES "Job"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_currentQualifications" ADD CONSTRAINT "_currentQualifications_A_fkey" FOREIGN KEY ("A") REFERENCES "CareerProfile"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_currentQualifications" ADD CONSTRAINT "_currentQualifications_B_fkey" FOREIGN KEY ("B") REFERENCES "Qualification"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_selfReportedSkill" ADD CONSTRAINT "_selfReportedSkill_A_fkey" FOREIGN KEY ("A") REFERENCES "CareerProfile"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_selfReportedSkill" ADD CONSTRAINT "_selfReportedSkill_B_fkey" FOREIGN KEY ("B") REFERENCES "skills"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_verifiedSkill" ADD CONSTRAINT "_verifiedSkill_A_fkey" FOREIGN KEY ("A") REFERENCES "CareerProfile"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_verifiedSkill" ADD CONSTRAINT "_verifiedSkill_B_fkey" FOREIGN KEY ("B") REFERENCES "skills"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_workedAt" ADD CONSTRAINT "_workedAt_A_fkey" FOREIGN KEY ("A") REFERENCES "CareerProfile"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_workedAt" ADD CONSTRAINT "_workedAt_B_fkey" FOREIGN KEY ("B") REFERENCES "Company"("id") ON DELETE CASCADE ON UPDATE CASCADE;
