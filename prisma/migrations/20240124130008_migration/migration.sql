/*
  Warnings:

  - You are about to drop the column `endtime` on the `Job` table. All the data in the column will be lost.
  - You are about to drop the column `jobtitle` on the `Job` table. All the data in the column will be lost.
  - You are about to drop the column `starttime` on the `Job` table. All the data in the column will be lost.
  - You are about to drop the `Beruf` table. If the table is not empty, all the data it contains will be lost.
  - Added the required column `endTime` to the `Job` table without a default value. This is not possible if the table is not empty.
  - Added the required column `jobTitle` to the `Job` table without a default value. This is not possible if the table is not empty.
  - Added the required column `startTime` to the `Job` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "Beruf" DROP CONSTRAINT "Beruf_bkgrId_fkey";

-- AlterTable
ALTER TABLE "Job" DROP COLUMN "endtime",
DROP COLUMN "jobtitle",
DROP COLUMN "starttime",
ADD COLUMN     "endTime" TIMESTAMP(3) NOT NULL,
ADD COLUMN     "jobTitle" TEXT NOT NULL,
ADD COLUMN     "startTime" TIMESTAMP(3) NOT NULL;

-- DropTable
DROP TABLE "Beruf";

-- CreateTable
CREATE TABLE "JobDescription" (
    "id" TEXT NOT NULL,
    "kurzBezeichnungNeutral" TEXT NOT NULL,
    "bkgrId" TEXT NOT NULL,

    CONSTRAINT "JobDescription_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "JobDescription" ADD CONSTRAINT "JobDescription_bkgrId_fkey" FOREIGN KEY ("bkgrId") REFERENCES "Bkgr"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
