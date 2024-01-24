-- CreateEnum
CREATE TYPE "ACCESS_RIGHTS" AS ENUM ('PRIVATE', 'PUBLIC', 'COMPANY');

-- CreateEnum
CREATE TYPE "LIFECYCLE" AS ENUM ('DRAFT', 'POOL', 'ARCHIVED', 'IN_PROGRESS', 'FINISHED', 'DELETED', 'CREATED');

-- CreateEnum
CREATE TYPE "STATUS" AS ENUM ('OPEN', 'STARTED', 'IN_PROGRESS', 'FINISHED', 'DELETED');

-- CreateEnum
CREATE TYPE "USERSTATUS" AS ENUM ('ACTIVE', 'INACTIVE');

-- CreateEnum
CREATE TYPE "NuggetCategory" AS ENUM ('ANALYZE', 'INTRODUCTION', 'CONTENT', 'EXAMPLE', 'EXERCISE', 'TEST');

-- CreateTable
CREATE TABLE "skill-maps" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT,
    "taxonomy" TEXT NOT NULL DEFAULT 'Bloom',
    "version" TEXT NOT NULL DEFAULT '',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "access_rights" "ACCESS_RIGHTS" NOT NULL DEFAULT 'PRIVATE',
    "ownerId" TEXT NOT NULL,

    CONSTRAINT "skill-maps_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "skills" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "level" INTEGER NOT NULL,
    "description" TEXT,
    "repositoryId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "skills_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "paths" (
    "id" TEXT NOT NULL,
    "owner" TEXT NOT NULL,
    "title" TEXT,
    "targetAudience" TEXT,
    "description" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "recommendedUnitSequence" JSONB,
    "lifecycle" "LIFECYCLE" NOT NULL DEFAULT 'DRAFT',
    "assignedProposedPathId" TEXT[],

    CONSTRAINT "paths_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Nugget" (
    "id" TEXT NOT NULL,
    "resource" TEXT NOT NULL,
    "language" TEXT NOT NULL,
    "name" TEXT,
    "isTypeOf" "NuggetCategory" NOT NULL DEFAULT 'CONTENT',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "processingTime" TEXT NOT NULL DEFAULT '',
    "presenter" TEXT NOT NULL DEFAULT '',
    "mediatype" TEXT NOT NULL DEFAULT '',
    "learningUnitId" TEXT,

    CONSTRAINT "Nugget_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "LearningUnit" (
    "id" TEXT NOT NULL,
    "resource" TEXT NOT NULL DEFAULT '',
    "language" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "processingTime" TEXT NOT NULL DEFAULT '',
    "rating" TEXT NOT NULL DEFAULT '',
    "contentCreator" TEXT NOT NULL DEFAULT '',
    "contentProvider" TEXT NOT NULL DEFAULT '',
    "targetAudience" TEXT NOT NULL DEFAULT '',
    "semanticDensity" TEXT NOT NULL DEFAULT '',
    "semanticGravity" TEXT NOT NULL DEFAULT '',
    "contentTags" TEXT[],
    "contextTags" TEXT[],
    "linkToHelpMaterial" TEXT,
    "orga_id" TEXT NOT NULL DEFAULT '',
    "lifecycle" "LIFECYCLE" NOT NULL DEFAULT 'DRAFT',

    CONSTRAINT "LearningUnit_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "orderings" (
    "id" TEXT NOT NULL,
    "learningUnitId" TEXT,
    "orderId" TEXT NOT NULL,

    CONSTRAINT "orderings_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "user" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL DEFAULT '',
    "companyId" TEXT,
    "status" "USERSTATUS" NOT NULL DEFAULT 'ACTIVE',

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
CREATE TABLE "LearningProfile" (
    "id" TEXT NOT NULL,
    "semanticDensity" INTEGER NOT NULL,
    "semanticGravity" INTEGER NOT NULL,
    "mediaType" TEXT NOT NULL DEFAULT '',
    "language" TEXT NOT NULL DEFAULT '',
    "processingTimePerUnit" TEXT NOT NULL DEFAULT '',
    "userId" TEXT NOT NULL,
    "learningHistoryId" TEXT,
    "preferredDidacticMethod" TEXT,

    CONSTRAINT "LearningProfile_pkey" PRIMARY KEY ("id")
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
    "currentCompanyId" TEXT,
    "currentJobIdAtJobsNet" TEXT,
    "userId" TEXT NOT NULL,

    CONSTRAINT "CareerProfile_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ConsumedUnitData" (
    "id" TEXT NOT NULL,
    "actualPocessingTime" TEXT NOT NULL,
    "testPerformance" DECIMAL(5,2) NOT NULL,
    "consumedLUId" TEXT NOT NULL,
    "lbDataId" TEXT NOT NULL,
    "status" "STATUS" NOT NULL DEFAULT 'STARTED',
    "date" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "ConsumedUnitData_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "personalPaths" (
    "id" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "userProfileId" TEXT NOT NULL,
    "learningPathId" TEXT,
    "lifecycle" "LIFECYCLE" NOT NULL DEFAULT 'CREATED',

    CONSTRAINT "personalPaths_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "pathProgress" (
    "id" TEXT NOT NULL,
    "personalPathId" TEXT NOT NULL,
    "unitId" TEXT NOT NULL,

    CONSTRAINT "pathProgress_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "LearningBehaviorData" (
    "id" TEXT NOT NULL,
    "clickdata" TEXT[],
    "userId" TEXT NOT NULL,

    CONSTRAINT "LearningBehaviorData_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Qualification" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "year" INTEGER NOT NULL,
    "careerProfileId" TEXT,

    CONSTRAINT "Qualification_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Job" (
    "id" TEXT NOT NULL,
    "jobtitle" TEXT NOT NULL,
    "starttime" TIMESTAMP(3) NOT NULL,
    "endtime" TIMESTAMP(3) NOT NULL,
    "companyId" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "jobIdAtJobsNet" TEXT,

    CONSTRAINT "Job_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Company" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL DEFAULT '',

    CONSTRAINT "Company_pkey" PRIMARY KEY ("id")
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
CREATE TABLE "Bkgr" (
    "id" TEXT NOT NULL,
    "typId" TEXT NOT NULL,

    CONSTRAINT "Bkgr_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Typ" (
    "id" TEXT NOT NULL
);

-- CreateTable
CREATE TABLE "Beruf" (
    "id" TEXT NOT NULL,
    "kurzBezeichnungNeutral" TEXT NOT NULL,
    "bkgrId" TEXT NOT NULL,

    CONSTRAINT "Beruf_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "_parentSkills" (
    "A" TEXT NOT NULL,
    "B" TEXT NOT NULL
);

-- CreateTable
CREATE TABLE "_pathGoals" (
    "A" TEXT NOT NULL,
    "B" TEXT NOT NULL
);

-- CreateTable
CREATE TABLE "_pathRequirements" (
    "A" TEXT NOT NULL,
    "B" TEXT NOT NULL
);

-- CreateTable
CREATE TABLE "_requirements" (
    "A" TEXT NOT NULL,
    "B" TEXT NOT NULL
);

-- CreateTable
CREATE TABLE "_teachingGoals" (
    "A" TEXT NOT NULL,
    "B" TEXT NOT NULL
);

-- CreateTable
CREATE TABLE "_proposedUnitsOfLearningPath" (
    "A" TEXT NOT NULL,
    "B" TEXT NOT NULL
);

-- CreateTable
CREATE TABLE "_suggestedSkills" (
    "A" TEXT NOT NULL,
    "B" TEXT NOT NULL
);

-- CreateTable
CREATE TABLE "_pastJobs" (
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

-- CreateTable
CREATE TABLE "_startedBy" (
    "A" TEXT NOT NULL,
    "B" TEXT NOT NULL
);

-- CreateTable
CREATE TABLE "_proposedpathGoals" (
    "A" TEXT NOT NULL,
    "B" TEXT NOT NULL
);

-- CreateIndex
CREATE UNIQUE INDEX "skill-maps_ownerId_name_version_key" ON "skill-maps"("ownerId", "name", "version");

-- CreateIndex
CREATE UNIQUE INDEX "skills_repositoryId_name_key" ON "skills"("repositoryId", "name");

-- CreateIndex
CREATE UNIQUE INDEX "LearningUnit_id_key" ON "LearningUnit"("id");

-- CreateIndex
CREATE UNIQUE INDEX "orderings_learningUnitId_orderId_key" ON "orderings"("learningUnitId", "orderId");

-- CreateIndex
CREATE UNIQUE INDEX "user_companyId_name_key" ON "user"("companyId", "name");

-- CreateIndex
CREATE UNIQUE INDEX "LearningProfile_userId_key" ON "LearningProfile"("userId");

-- CreateIndex
CREATE UNIQUE INDEX "LearningHistory_userId_key" ON "LearningHistory"("userId");

-- CreateIndex
CREATE UNIQUE INDEX "CareerProfile_userId_key" ON "CareerProfile"("userId");

-- CreateIndex
CREATE UNIQUE INDEX "personalPaths_learningPathId_key" ON "personalPaths"("learningPathId");

-- CreateIndex
CREATE UNIQUE INDEX "pathProgress_personalPathId_key" ON "pathProgress"("personalPathId");

-- CreateIndex
CREATE UNIQUE INDEX "pathProgress_unitId_key" ON "pathProgress"("unitId");

-- CreateIndex
CREATE UNIQUE INDEX "LearningBehaviorData_userId_key" ON "LearningBehaviorData"("userId");

-- CreateIndex
CREATE UNIQUE INDEX "Job_userId_key" ON "Job"("userId");

-- CreateIndex
CREATE UNIQUE INDEX "Typ_id_key" ON "Typ"("id");

-- CreateIndex
CREATE UNIQUE INDEX "_parentSkills_AB_unique" ON "_parentSkills"("A", "B");

-- CreateIndex
CREATE INDEX "_parentSkills_B_index" ON "_parentSkills"("B");

-- CreateIndex
CREATE UNIQUE INDEX "_pathGoals_AB_unique" ON "_pathGoals"("A", "B");

-- CreateIndex
CREATE INDEX "_pathGoals_B_index" ON "_pathGoals"("B");

-- CreateIndex
CREATE UNIQUE INDEX "_pathRequirements_AB_unique" ON "_pathRequirements"("A", "B");

-- CreateIndex
CREATE INDEX "_pathRequirements_B_index" ON "_pathRequirements"("B");

-- CreateIndex
CREATE UNIQUE INDEX "_requirements_AB_unique" ON "_requirements"("A", "B");

-- CreateIndex
CREATE INDEX "_requirements_B_index" ON "_requirements"("B");

-- CreateIndex
CREATE UNIQUE INDEX "_teachingGoals_AB_unique" ON "_teachingGoals"("A", "B");

-- CreateIndex
CREATE INDEX "_teachingGoals_B_index" ON "_teachingGoals"("B");

-- CreateIndex
CREATE UNIQUE INDEX "_proposedUnitsOfLearningPath_AB_unique" ON "_proposedUnitsOfLearningPath"("A", "B");

-- CreateIndex
CREATE INDEX "_proposedUnitsOfLearningPath_B_index" ON "_proposedUnitsOfLearningPath"("B");

-- CreateIndex
CREATE UNIQUE INDEX "_suggestedSkills_AB_unique" ON "_suggestedSkills"("A", "B");

-- CreateIndex
CREATE INDEX "_suggestedSkills_B_index" ON "_suggestedSkills"("B");

-- CreateIndex
CREATE UNIQUE INDEX "_pastJobs_AB_unique" ON "_pastJobs"("A", "B");

-- CreateIndex
CREATE INDEX "_pastJobs_B_index" ON "_pastJobs"("B");

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
CREATE UNIQUE INDEX "_startedBy_AB_unique" ON "_startedBy"("A", "B");

-- CreateIndex
CREATE INDEX "_startedBy_B_index" ON "_startedBy"("B");

-- CreateIndex
CREATE UNIQUE INDEX "_proposedpathGoals_AB_unique" ON "_proposedpathGoals"("A", "B");

-- CreateIndex
CREATE INDEX "_proposedpathGoals_B_index" ON "_proposedpathGoals"("B");

-- AddForeignKey
ALTER TABLE "skills" ADD CONSTRAINT "skills_repositoryId_fkey" FOREIGN KEY ("repositoryId") REFERENCES "skill-maps"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "orderings" ADD CONSTRAINT "orderings_learningUnitId_fkey" FOREIGN KEY ("learningUnitId") REFERENCES "LearningUnit"("id") ON DELETE SET NULL ON UPDATE CASCADE;

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
ALTER TABLE "CareerProfile" ADD CONSTRAINT "CareerProfile_currentCompanyId_fkey" FOREIGN KEY ("currentCompanyId") REFERENCES "Company"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "CareerProfile" ADD CONSTRAINT "CareerProfile_userId_fkey" FOREIGN KEY ("userId") REFERENCES "user"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ConsumedUnitData" ADD CONSTRAINT "ConsumedUnitData_consumedLUId_fkey" FOREIGN KEY ("consumedLUId") REFERENCES "LearningUnit"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ConsumedUnitData" ADD CONSTRAINT "ConsumedUnitData_lbDataId_fkey" FOREIGN KEY ("lbDataId") REFERENCES "LearningBehaviorData"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "personalPaths" ADD CONSTRAINT "personalPaths_userProfileId_fkey" FOREIGN KEY ("userProfileId") REFERENCES "LearningHistory"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "personalPaths" ADD CONSTRAINT "personalPaths_learningPathId_fkey" FOREIGN KEY ("learningPathId") REFERENCES "paths"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "pathProgress" ADD CONSTRAINT "pathProgress_personalPathId_fkey" FOREIGN KEY ("personalPathId") REFERENCES "personalPaths"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "pathProgress" ADD CONSTRAINT "pathProgress_unitId_fkey" FOREIGN KEY ("unitId") REFERENCES "LearningUnit"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "LearningBehaviorData" ADD CONSTRAINT "LearningBehaviorData_userId_fkey" FOREIGN KEY ("userId") REFERENCES "user"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Qualification" ADD CONSTRAINT "Qualification_careerProfileId_fkey" FOREIGN KEY ("careerProfileId") REFERENCES "CareerProfile"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Job" ADD CONSTRAINT "Job_companyId_fkey" FOREIGN KEY ("companyId") REFERENCES "Company"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Job" ADD CONSTRAINT "Job_userId_fkey" FOREIGN KEY ("userId") REFERENCES "user"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Feedback" ADD CONSTRAINT "Feedback_learningUnitId_fkey" FOREIGN KEY ("learningUnitId") REFERENCES "LearningUnit"("id") ON DELETE CASCADE ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "Bkgr" ADD CONSTRAINT "Bkgr_typId_fkey" FOREIGN KEY ("typId") REFERENCES "Typ"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Beruf" ADD CONSTRAINT "Beruf_bkgrId_fkey" FOREIGN KEY ("bkgrId") REFERENCES "Bkgr"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_parentSkills" ADD CONSTRAINT "_parentSkills_A_fkey" FOREIGN KEY ("A") REFERENCES "skills"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_parentSkills" ADD CONSTRAINT "_parentSkills_B_fkey" FOREIGN KEY ("B") REFERENCES "skills"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_pathGoals" ADD CONSTRAINT "_pathGoals_A_fkey" FOREIGN KEY ("A") REFERENCES "paths"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_pathGoals" ADD CONSTRAINT "_pathGoals_B_fkey" FOREIGN KEY ("B") REFERENCES "skills"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_pathRequirements" ADD CONSTRAINT "_pathRequirements_A_fkey" FOREIGN KEY ("A") REFERENCES "paths"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_pathRequirements" ADD CONSTRAINT "_pathRequirements_B_fkey" FOREIGN KEY ("B") REFERENCES "skills"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_requirements" ADD CONSTRAINT "_requirements_A_fkey" FOREIGN KEY ("A") REFERENCES "LearningUnit"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_requirements" ADD CONSTRAINT "_requirements_B_fkey" FOREIGN KEY ("B") REFERENCES "skills"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_teachingGoals" ADD CONSTRAINT "_teachingGoals_A_fkey" FOREIGN KEY ("A") REFERENCES "LearningUnit"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_teachingGoals" ADD CONSTRAINT "_teachingGoals_B_fkey" FOREIGN KEY ("B") REFERENCES "skills"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_proposedUnitsOfLearningPath" ADD CONSTRAINT "_proposedUnitsOfLearningPath_A_fkey" FOREIGN KEY ("A") REFERENCES "LearningUnit"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_proposedUnitsOfLearningPath" ADD CONSTRAINT "_proposedUnitsOfLearningPath_B_fkey" FOREIGN KEY ("B") REFERENCES "personalPaths"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_suggestedSkills" ADD CONSTRAINT "_suggestedSkills_A_fkey" FOREIGN KEY ("A") REFERENCES "orderings"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_suggestedSkills" ADD CONSTRAINT "_suggestedSkills_B_fkey" FOREIGN KEY ("B") REFERENCES "skills"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_pastJobs" ADD CONSTRAINT "_pastJobs_A_fkey" FOREIGN KEY ("A") REFERENCES "CareerProfile"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_pastJobs" ADD CONSTRAINT "_pastJobs_B_fkey" FOREIGN KEY ("B") REFERENCES "Job"("id") ON DELETE CASCADE ON UPDATE CASCADE;

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

-- AddForeignKey
ALTER TABLE "_startedBy" ADD CONSTRAINT "_startedBy_A_fkey" FOREIGN KEY ("A") REFERENCES "ConsumedUnitData"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_startedBy" ADD CONSTRAINT "_startedBy_B_fkey" FOREIGN KEY ("B") REFERENCES "LearningHistory"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_proposedpathGoals" ADD CONSTRAINT "_proposedpathGoals_A_fkey" FOREIGN KEY ("A") REFERENCES "personalPaths"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_proposedpathGoals" ADD CONSTRAINT "_proposedpathGoals_B_fkey" FOREIGN KEY ("B") REFERENCES "skills"("id") ON DELETE CASCADE ON UPDATE CASCADE;
