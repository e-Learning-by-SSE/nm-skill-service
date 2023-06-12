-- CreateEnum
CREATE TYPE "NuggetCategory" AS ENUM ('ANALYZE', 'INTRODUCTION', 'CONTENT', 'EXAMPLE', 'EXERCISE', 'TEST');

-- CreateTable
CREATE TABLE "skill-maps" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT,
    "taxonomy" TEXT NOT NULL DEFAULT 'Bloom',
    "version" TEXT NOT NULL DEFAULT '',
    "owner" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

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
    "learningUnitId" INTEGER,
    "requirementslearningUnitId" INTEGER,

    CONSTRAINT "skills_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "path_goals" (
    "id" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "targetAudience" TEXT,
    "description" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "path_goals_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "paths" (
    "id" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "description" TEXT,
    "version" TEXT NOT NULL DEFAULT '',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "paths_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Nugget" (
    "id" SERIAL NOT NULL,
    "language" TEXT NOT NULL,
    "name" TEXT,
    "isTypeOf" "NuggetCategory" NOT NULL DEFAULT 'CONTENT',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "processingTime" TEXT NOT NULL DEFAULT '',
    "presenter" TEXT NOT NULL DEFAULT '',
    "mediatype" TEXT NOT NULL DEFAULT '',
    "learningUnitId" INTEGER,

    CONSTRAINT "Nugget_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "LearningUnit" (
    "id" SERIAL NOT NULL,
    "language" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "LearningUnit_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "SearchLearningUnit" (
    "id" SERIAL NOT NULL,
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
    "unitId" INTEGER NOT NULL,

    CONSTRAINT "SearchLearningUnit_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "SelfLearningUnit" (
    "id" SERIAL NOT NULL,
    "order" INTEGER,
    "unitId" INTEGER NOT NULL,

    CONSTRAINT "SelfLearningUnit_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "_parentSkills" (
    "A" TEXT NOT NULL,
    "B" TEXT NOT NULL
);

-- CreateTable
CREATE TABLE "_pathTeachingGoal" (
    "A" TEXT NOT NULL,
    "B" TEXT NOT NULL
);

-- CreateTable
CREATE TABLE "_requirements" (
    "A" TEXT NOT NULL,
    "B" TEXT NOT NULL
);

-- CreateTable
CREATE TABLE "_pathGoals" (
    "A" TEXT NOT NULL,
    "B" TEXT NOT NULL
);

-- CreateIndex
CREATE UNIQUE INDEX "skill-maps_owner_name_version_key" ON "skill-maps"("owner", "name", "version");

-- CreateIndex
CREATE UNIQUE INDEX "skills_repositoryId_name_key" ON "skills"("repositoryId", "name");

-- CreateIndex
CREATE UNIQUE INDEX "paths_title_version_key" ON "paths"("title", "version");

-- CreateIndex
CREATE UNIQUE INDEX "SearchLearningUnit_unitId_key" ON "SearchLearningUnit"("unitId");

-- CreateIndex
CREATE UNIQUE INDEX "SelfLearningUnit_unitId_key" ON "SelfLearningUnit"("unitId");

-- CreateIndex
CREATE UNIQUE INDEX "_parentSkills_AB_unique" ON "_parentSkills"("A", "B");

-- CreateIndex
CREATE INDEX "_parentSkills_B_index" ON "_parentSkills"("B");

-- CreateIndex
CREATE UNIQUE INDEX "_pathTeachingGoal_AB_unique" ON "_pathTeachingGoal"("A", "B");

-- CreateIndex
CREATE INDEX "_pathTeachingGoal_B_index" ON "_pathTeachingGoal"("B");

-- CreateIndex
CREATE UNIQUE INDEX "_requirements_AB_unique" ON "_requirements"("A", "B");

-- CreateIndex
CREATE INDEX "_requirements_B_index" ON "_requirements"("B");

-- CreateIndex
CREATE UNIQUE INDEX "_pathGoals_AB_unique" ON "_pathGoals"("A", "B");

-- CreateIndex
CREATE INDEX "_pathGoals_B_index" ON "_pathGoals"("B");

-- AddForeignKey
ALTER TABLE "skills" ADD CONSTRAINT "skills_repositoryId_fkey" FOREIGN KEY ("repositoryId") REFERENCES "skill-maps"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "skills" ADD CONSTRAINT "skills_learningUnitId_fkey" FOREIGN KEY ("learningUnitId") REFERENCES "LearningUnit"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "skills" ADD CONSTRAINT "skills_requirementslearningUnitId_fkey" FOREIGN KEY ("requirementslearningUnitId") REFERENCES "LearningUnit"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Nugget" ADD CONSTRAINT "Nugget_learningUnitId_fkey" FOREIGN KEY ("learningUnitId") REFERENCES "LearningUnit"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "SearchLearningUnit" ADD CONSTRAINT "SearchLearningUnit_unitId_fkey" FOREIGN KEY ("unitId") REFERENCES "LearningUnit"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "SelfLearningUnit" ADD CONSTRAINT "SelfLearningUnit_unitId_fkey" FOREIGN KEY ("unitId") REFERENCES "LearningUnit"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_parentSkills" ADD CONSTRAINT "_parentSkills_A_fkey" FOREIGN KEY ("A") REFERENCES "skills"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_parentSkills" ADD CONSTRAINT "_parentSkills_B_fkey" FOREIGN KEY ("B") REFERENCES "skills"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_pathTeachingGoal" ADD CONSTRAINT "_pathTeachingGoal_A_fkey" FOREIGN KEY ("A") REFERENCES "path_goals"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_pathTeachingGoal" ADD CONSTRAINT "_pathTeachingGoal_B_fkey" FOREIGN KEY ("B") REFERENCES "skills"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_requirements" ADD CONSTRAINT "_requirements_A_fkey" FOREIGN KEY ("A") REFERENCES "path_goals"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_requirements" ADD CONSTRAINT "_requirements_B_fkey" FOREIGN KEY ("B") REFERENCES "skills"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_pathGoals" ADD CONSTRAINT "_pathGoals_A_fkey" FOREIGN KEY ("A") REFERENCES "paths"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_pathGoals" ADD CONSTRAINT "_pathGoals_B_fkey" FOREIGN KEY ("B") REFERENCES "path_goals"("id") ON DELETE CASCADE ON UPDATE CASCADE;
