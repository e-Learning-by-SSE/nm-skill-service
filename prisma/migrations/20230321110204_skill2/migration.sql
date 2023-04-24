/*
  Warnings:

  - You are about to drop the column `level` on the `skills` table. All the data in the column will be lost.
  - You are about to drop the column `skill` on the `skills` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[repositoryId,name]` on the table `skills` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `bloomLevel` to the `skills` table without a default value. This is not possible if the table is not empty.
  - Added the required column `name` to the `skills` table without a default value. This is not possible if the table is not empty.

*/
-- DropIndex
DROP INDEX "skills_repositoryId_skill_key";

-- AlterTable
ALTER TABLE "skills" DROP COLUMN "level",
DROP COLUMN "skill",
ADD COLUMN     "bloomLevel" INTEGER NOT NULL,
ADD COLUMN     "name" TEXT NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "skills_repositoryId_name_key" ON "skills"("repositoryId", "name");
