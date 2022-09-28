-- CreateTable
CREATE TABLE "learning_goals" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT,
    "loRepositoryId" TEXT NOT NULL,

    CONSTRAINT "learning_goals_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "_lowlevelGoals" (
    "A" TEXT NOT NULL,
    "B" TEXT NOT NULL
);

-- CreateTable
CREATE TABLE "_highlevelGoals" (
    "A" TEXT NOT NULL,
    "B" TEXT NOT NULL
);

-- CreateIndex
CREATE UNIQUE INDEX "learning_goals_loRepositoryId_name_key" ON "learning_goals"("loRepositoryId", "name");

-- CreateIndex
CREATE UNIQUE INDEX "_lowlevelGoals_AB_unique" ON "_lowlevelGoals"("A", "B");

-- CreateIndex
CREATE INDEX "_lowlevelGoals_B_index" ON "_lowlevelGoals"("B");

-- CreateIndex
CREATE UNIQUE INDEX "_highlevelGoals_AB_unique" ON "_highlevelGoals"("A", "B");

-- CreateIndex
CREATE INDEX "_highlevelGoals_B_index" ON "_highlevelGoals"("B");

-- AddForeignKey
ALTER TABLE "learning_goals" ADD CONSTRAINT "learning_goals_loRepositoryId_fkey" FOREIGN KEY ("loRepositoryId") REFERENCES "lo-repositories"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_lowlevelGoals" ADD CONSTRAINT "_lowlevelGoals_A_fkey" FOREIGN KEY ("A") REFERENCES "competencies"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_lowlevelGoals" ADD CONSTRAINT "_lowlevelGoals_B_fkey" FOREIGN KEY ("B") REFERENCES "learning_goals"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_highlevelGoals" ADD CONSTRAINT "_highlevelGoals_A_fkey" FOREIGN KEY ("A") REFERENCES "learning_goals"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_highlevelGoals" ADD CONSTRAINT "_highlevelGoals_B_fkey" FOREIGN KEY ("B") REFERENCES "ueber_competencies"("id") ON DELETE CASCADE ON UPDATE CASCADE;
