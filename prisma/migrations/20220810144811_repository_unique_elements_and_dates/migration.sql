/*
  Warnings:

  - A unique constraint covering the columns `[userId,name,version]` on the table `repositories` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `updatedAt` to the `repositories` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "repositories" ADD COLUMN     "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN     "updatedAt" TIMESTAMP(3) NOT NULL,
ALTER COLUMN "description" DROP NOT NULL,
ALTER COLUMN "version" DROP NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "repositories_userId_name_version_key" ON "repositories"("userId", "name", "version");
