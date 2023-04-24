/*
  Warnings:

  - You are about to drop the column `requirementsId` on the `skills` table. All the data in the column will be lost.

*/
-- DropForeignKey
ALTER TABLE "skills" DROP CONSTRAINT "skills_requirementsId_fkey";

-- AlterTable
ALTER TABLE "skills" DROP COLUMN "requirementsId";
