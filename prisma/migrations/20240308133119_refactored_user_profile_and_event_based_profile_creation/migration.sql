/*
  Warnings:

  - You are about to drop the `Beruf` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "Beruf" DROP CONSTRAINT "Beruf_bkgrId_fkey";

-- AlterTable
ALTER TABLE "ConsumedUnitData" RENAME COLUMN "actualPocessingTime" TO "actualProcessingTime";

-- AlterTable
ALTER TABLE "Job" RENAME COLUMN "endtime" TO "endTime";
ALTER TABLE "Job" RENAME COLUMN "jobtitle" TO "jobTitle";
ALTER TABLE "Job" RENAME COLUMN "starttime" TO "startTime";

-- AlterTable
ALTER TABLE "LearningProfile" ALTER COLUMN "semanticDensity" SET DEFAULT 0,
ALTER COLUMN "semanticGravity" SET DEFAULT 0;

-- DropTable
DROP TABLE "Beruf";

-- CreateTable
CREATE TABLE "BerufeNetJob" (
    "id" TEXT NOT NULL,
    "kurzBezeichnungNeutral" TEXT NOT NULL,
    "bkgrId" TEXT NOT NULL,

    CONSTRAINT "BerufeNetJob_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "BerufeNetJob" ADD CONSTRAINT "BerufeNetJob_bkgrId_fkey" FOREIGN KEY ("bkgrId") REFERENCES "Bkgr"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
