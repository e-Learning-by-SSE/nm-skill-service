/*
  Warnings:

  - You are about to drop the column `pathId` on the `pathSequence` table. All the data in the column will be lost.
  - You are about to drop the column `unitId` on the `pathSequence` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[personalizedPathId,position]` on the table `pathSequence` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `personalizedPathId` to the `pathSequence` table without a default value. This is not possible if the table is not empty.
  - Added the required column `unitInstanceId` to the `pathSequence` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "pathSequence" DROP CONSTRAINT "pathSequence_pathId_fkey";

-- DropForeignKey
ALTER TABLE "pathSequence" DROP CONSTRAINT "pathSequence_unitId_fkey";

-- DropIndex
DROP INDEX "pathSequence_pathId_position_key";

-- pathSequence.pathId -> pathSequence.personalizedPathId
ALTER TABLE "pathSequence" RENAME COLUMN "pathId" TO "personalizedPathId";
-- pathSequence.unitId -> pathSequence.unitInstanceId
ALTER TABLE "pathSequence" RENAME COLUMN "unitId" TO "unitInstanceId";

-- CreateIndex
CREATE UNIQUE INDEX "pathSequence_personalizedPathId_position_key" ON "pathSequence"("personalizedPathId", "position");

-- AddForeignKey
ALTER TABLE "pathSequence" ADD CONSTRAINT "pathSequence_personalizedPathId_fkey" FOREIGN KEY ("personalizedPathId") REFERENCES "personalPaths"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "pathSequence" ADD CONSTRAINT "pathSequence_unitInstanceId_fkey" FOREIGN KEY ("unitInstanceId") REFERENCES "consumedUnits"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
