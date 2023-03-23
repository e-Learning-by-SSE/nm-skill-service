/*
  Warnings:

  - You are about to drop the column `skillIdReq` on the `LearningPaths` table. All the data in the column will be lost.

*/
-- DropForeignKey
ALTER TABLE "LearningPaths" DROP CONSTRAINT "LearningPaths_skillIdReq_fkey";

-- AlterTable
ALTER TABLE "LearningPaths" DROP COLUMN "skillIdReq";
