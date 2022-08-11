/*
  Warnings:

  - Made the column `version` on table `repositories` required. This step will fail if there are existing NULL values in that column.

*/
-- AlterTable
ALTER TABLE "repositories" ALTER COLUMN "version" SET NOT NULL,
ALTER COLUMN "version" SET DEFAULT '';

-- CreateTable
CREATE TABLE "competencies" (
    "id" TEXT NOT NULL,
    "skill" TEXT NOT NULL,
    "level" INTEGER NOT NULL,
    "description" TEXT,
    "repositoryId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "competencies_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "competencies_repositoryId_skill_key" ON "competencies"("repositoryId", "skill");

-- AddForeignKey
ALTER TABLE "competencies" ADD CONSTRAINT "competencies_repositoryId_fkey" FOREIGN KEY ("repositoryId") REFERENCES "repositories"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
