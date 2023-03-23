/*
  Warnings:

  - You are about to drop the column `ContentCreator` on the `LearningUnit` table. All the data in the column will be lost.
  - You are about to drop the column `ContentProvider` on the `LearningUnit` table. All the data in the column will be lost.
  - You are about to drop the column `ContentTags` on the `LearningUnit` table. All the data in the column will be lost.
  - You are about to drop the column `ContextTags` on the `LearningUnit` table. All the data in the column will be lost.
  - You are about to drop the column `LinkToHelpMaterial` on the `LearningUnit` table. All the data in the column will be lost.
  - You are about to drop the column `Rating` on the `LearningUnit` table. All the data in the column will be lost.
  - You are about to drop the column `SemanticDensity` on the `LearningUnit` table. All the data in the column will be lost.
  - You are about to drop the column `SemanticGravity` on the `LearningUnit` table. All the data in the column will be lost.
  - You are about to drop the column `TargetAudience` on the `LearningUnit` table. All the data in the column will be lost.
  - Added the required column `linkToHelpMaterial` to the `LearningUnit` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "LearningUnit" DROP COLUMN "ContentCreator",
DROP COLUMN "ContentProvider",
DROP COLUMN "ContentTags",
DROP COLUMN "ContextTags",
DROP COLUMN "LinkToHelpMaterial",
DROP COLUMN "Rating",
DROP COLUMN "SemanticDensity",
DROP COLUMN "SemanticGravity",
DROP COLUMN "TargetAudience",
ADD COLUMN     "contentCreator" TEXT NOT NULL DEFAULT '',
ADD COLUMN     "contentProvider" TEXT NOT NULL DEFAULT '',
ADD COLUMN     "contentTags" TEXT[],
ADD COLUMN     "contextTags" TEXT[],
ADD COLUMN     "linkToHelpMaterial" TEXT NOT NULL,
ADD COLUMN     "rating" TEXT NOT NULL DEFAULT '',
ADD COLUMN     "semanticDensity" TEXT NOT NULL DEFAULT '',
ADD COLUMN     "semanticGravity" TEXT NOT NULL DEFAULT '',
ADD COLUMN     "targetAudience" TEXT NOT NULL DEFAULT '';

-- AlterTable
ALTER TABLE "Nugget" ADD COLUMN     "learningUnitId" INTEGER;

-- AlterTable
ALTER TABLE "skills" ADD COLUMN     "learningUnitId" INTEGER,
ADD COLUMN     "requirementslearningUnitId" INTEGER;

-- AddForeignKey
ALTER TABLE "skills" ADD CONSTRAINT "skills_learningUnitId_fkey" FOREIGN KEY ("learningUnitId") REFERENCES "LearningUnit"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "skills" ADD CONSTRAINT "skills_requirementslearningUnitId_fkey" FOREIGN KEY ("requirementslearningUnitId") REFERENCES "LearningUnit"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Nugget" ADD CONSTRAINT "Nugget_learningUnitId_fkey" FOREIGN KEY ("learningUnitId") REFERENCES "LearningUnit"("id") ON DELETE SET NULL ON UPDATE CASCADE;
