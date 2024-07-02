/*
  Warnings:

  - A unique constraint covering the columns `[skillId,learningHistoryId]` on the table `LearningProgress` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "LearningProgress_skillId_learningHistoryId_key" ON "LearningProgress"("skillId", "learningHistoryId");
