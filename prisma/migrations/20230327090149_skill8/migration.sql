/*
  Warnings:

  - You are about to drop the column `name` on the `LearningPaths` table. All the data in the column will be lost.
  - You are about to drop the column `userId` on the `LearningPaths` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[id,title,version]` on the table `LearningPaths` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `tagetAudience` to the `LearningPaths` table without a default value. This is not possible if the table is not empty.
  - Added the required column `title` to the `LearningPaths` table without a default value. This is not possible if the table is not empty.

*/
-- DropIndex
DROP INDEX "LearningPaths_id_name_version_key";

-- AlterTable
ALTER TABLE "LearningPaths" DROP COLUMN "name",
DROP COLUMN "userId",
ADD COLUMN     "tagetAudience" TEXT NOT NULL,
ADD COLUMN     "title" TEXT NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "LearningPaths_id_title_version_key" ON "LearningPaths"("id", "title", "version");
