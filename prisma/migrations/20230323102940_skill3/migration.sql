-- AlterTable
ALTER TABLE "skills" ADD COLUMN     "pathTeachingGoalId" TEXT NOT NULL DEFAULT '',
ADD COLUMN     "requirementsId" TEXT NOT NULL DEFAULT '';

-- CreateTable
CREATE TABLE "LearningPaths" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT,
    "version" TEXT NOT NULL DEFAULT '',
    "userId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "LearningPaths_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "LearningPaths_id_name_version_key" ON "LearningPaths"("id", "name", "version");

-- AddForeignKey
ALTER TABLE "skills" ADD CONSTRAINT "skills_pathTeachingGoalId_fkey" FOREIGN KEY ("pathTeachingGoalId") REFERENCES "LearningPaths"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "skills" ADD CONSTRAINT "skills_requirementsId_fkey" FOREIGN KEY ("requirementsId") REFERENCES "LearningPaths"("id") ON DELETE CASCADE ON UPDATE CASCADE;
