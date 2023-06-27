/*
  Warnings:

  - The primary key for the `LearningUnit` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - The primary key for the `Nugget` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - The primary key for the `SearchLearningUnit` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - The primary key for the `SelfLearningUnit` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to drop the column `learningUnitId` on the `skills` table. All the data in the column will be lost.
  - You are about to drop the column `requirementslearningUnitId` on the `skills` table. All the data in the column will be lost.
  - Added the required column `resource` to the `Nugget` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "Nugget" DROP CONSTRAINT "Nugget_learningUnitId_fkey";

-- DropForeignKey
ALTER TABLE "SearchLearningUnit" DROP CONSTRAINT "SearchLearningUnit_unitId_fkey";

-- DropForeignKey
ALTER TABLE "SelfLearningUnit" DROP CONSTRAINT "SelfLearningUnit_unitId_fkey";

-- DropForeignKey
ALTER TABLE "skills" DROP CONSTRAINT "skills_learningUnitId_fkey";

-- DropForeignKey
ALTER TABLE "skills" DROP CONSTRAINT "skills_requirementslearningUnitId_fkey";

-- AlterTable
ALTER TABLE "LearningUnit" DROP CONSTRAINT "LearningUnit_pkey",
ADD COLUMN     "resource" TEXT NOT NULL DEFAULT '',
ALTER COLUMN "id" DROP DEFAULT,
ALTER COLUMN "id" SET DATA TYPE TEXT,
ADD CONSTRAINT "LearningUnit_pkey" PRIMARY KEY ("id");
DROP SEQUENCE "LearningUnit_id_seq";

-- AlterTable
ALTER TABLE "Nugget" DROP CONSTRAINT "Nugget_pkey",
ADD COLUMN     "resource" TEXT NOT NULL,
ALTER COLUMN "id" DROP DEFAULT,
ALTER COLUMN "id" SET DATA TYPE TEXT,
ALTER COLUMN "learningUnitId" SET DATA TYPE TEXT,
ADD CONSTRAINT "Nugget_pkey" PRIMARY KEY ("id");
DROP SEQUENCE "Nugget_id_seq";

-- AlterTable
ALTER TABLE "SearchLearningUnit" DROP CONSTRAINT "SearchLearningUnit_pkey",
ALTER COLUMN "id" DROP DEFAULT,
ALTER COLUMN "id" SET DATA TYPE TEXT,
ALTER COLUMN "unitId" SET DATA TYPE TEXT,
ADD CONSTRAINT "SearchLearningUnit_pkey" PRIMARY KEY ("id");
DROP SEQUENCE "SearchLearningUnit_id_seq";

-- AlterTable
ALTER TABLE "SelfLearningUnit" DROP CONSTRAINT "SelfLearningUnit_pkey",
ALTER COLUMN "id" DROP DEFAULT,
ALTER COLUMN "id" SET DATA TYPE TEXT,
ALTER COLUMN "unitId" SET DATA TYPE TEXT,
ADD CONSTRAINT "SelfLearningUnit_pkey" PRIMARY KEY ("id");
DROP SEQUENCE "SelfLearningUnit_id_seq";

-- AlterTable
ALTER TABLE "skills" DROP COLUMN "learningUnitId",
DROP COLUMN "requirementslearningUnitId";

-- CreateTable
CREATE TABLE "User" (
    "id" TEXT NOT NULL,

    CONSTRAINT "User_pkey" PRIMARY KEY ("id")
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

    CONSTRAINT "LearningProfile_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "SkillProfile" (
    "id" TEXT NOT NULL,
    "jobHistory" TEXT NOT NULL DEFAULT '',
    "professionalInterests" TEXT NOT NULL DEFAULT '',
    "userId" TEXT NOT NULL,

    CONSTRAINT "SkillProfile_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "_teachingGoals" (
    "A" TEXT NOT NULL,
    "B" TEXT NOT NULL
);

-- CreateTable
CREATE TABLE "_requirementslearningUnit" (
    "A" TEXT NOT NULL,
    "B" TEXT NOT NULL
);

-- CreateIndex
CREATE UNIQUE INDEX "LearningProfile_userId_key" ON "LearningProfile"("userId");

-- CreateIndex
CREATE UNIQUE INDEX "SkillProfile_userId_key" ON "SkillProfile"("userId");

-- CreateIndex
CREATE UNIQUE INDEX "_teachingGoals_AB_unique" ON "_teachingGoals"("A", "B");

-- CreateIndex
CREATE INDEX "_teachingGoals_B_index" ON "_teachingGoals"("B");

-- CreateIndex
CREATE UNIQUE INDEX "_requirementslearningUnit_AB_unique" ON "_requirementslearningUnit"("A", "B");

-- CreateIndex
CREATE INDEX "_requirementslearningUnit_B_index" ON "_requirementslearningUnit"("B");

-- AddForeignKey
ALTER TABLE "Nugget" ADD CONSTRAINT "Nugget_learningUnitId_fkey" FOREIGN KEY ("learningUnitId") REFERENCES "LearningUnit"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "SearchLearningUnit" ADD CONSTRAINT "SearchLearningUnit_unitId_fkey" FOREIGN KEY ("unitId") REFERENCES "LearningUnit"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "SelfLearningUnit" ADD CONSTRAINT "SelfLearningUnit_unitId_fkey" FOREIGN KEY ("unitId") REFERENCES "LearningUnit"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "LearningProfile" ADD CONSTRAINT "LearningProfile_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "SkillProfile" ADD CONSTRAINT "SkillProfile_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_teachingGoals" ADD CONSTRAINT "_teachingGoals_A_fkey" FOREIGN KEY ("A") REFERENCES "LearningUnit"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_teachingGoals" ADD CONSTRAINT "_teachingGoals_B_fkey" FOREIGN KEY ("B") REFERENCES "skills"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_requirementslearningUnit" ADD CONSTRAINT "_requirementslearningUnit_A_fkey" FOREIGN KEY ("A") REFERENCES "LearningUnit"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_requirementslearningUnit" ADD CONSTRAINT "_requirementslearningUnit_B_fkey" FOREIGN KEY ("B") REFERENCES "skills"("id") ON DELETE CASCADE ON UPDATE CASCADE;
