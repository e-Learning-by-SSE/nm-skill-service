-- CreateTable
CREATE TABLE "lo-repositories" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT,
    "userId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "lo-repositories_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "learning_objects" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT,
    "loRepositoryId" TEXT NOT NULL,

    CONSTRAINT "learning_objects_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "_requiredCompetencies" (
    "A" TEXT NOT NULL,
    "B" TEXT NOT NULL
);

-- CreateTable
CREATE TABLE "_offeredCompetencies" (
    "A" TEXT NOT NULL,
    "B" TEXT NOT NULL
);

-- CreateTable
CREATE TABLE "_requiredUeberCompetencies" (
    "A" TEXT NOT NULL,
    "B" TEXT NOT NULL
);

-- CreateTable
CREATE TABLE "_offeredUeberCompetencies" (
    "A" TEXT NOT NULL,
    "B" TEXT NOT NULL
);

-- CreateIndex
CREATE UNIQUE INDEX "lo-repositories_userId_name_key" ON "lo-repositories"("userId", "name");

-- CreateIndex
CREATE UNIQUE INDEX "learning_objects_loRepositoryId_name_key" ON "learning_objects"("loRepositoryId", "name");

-- CreateIndex
CREATE UNIQUE INDEX "_requiredCompetencies_AB_unique" ON "_requiredCompetencies"("A", "B");

-- CreateIndex
CREATE INDEX "_requiredCompetencies_B_index" ON "_requiredCompetencies"("B");

-- CreateIndex
CREATE UNIQUE INDEX "_offeredCompetencies_AB_unique" ON "_offeredCompetencies"("A", "B");

-- CreateIndex
CREATE INDEX "_offeredCompetencies_B_index" ON "_offeredCompetencies"("B");

-- CreateIndex
CREATE UNIQUE INDEX "_requiredUeberCompetencies_AB_unique" ON "_requiredUeberCompetencies"("A", "B");

-- CreateIndex
CREATE INDEX "_requiredUeberCompetencies_B_index" ON "_requiredUeberCompetencies"("B");

-- CreateIndex
CREATE UNIQUE INDEX "_offeredUeberCompetencies_AB_unique" ON "_offeredUeberCompetencies"("A", "B");

-- CreateIndex
CREATE INDEX "_offeredUeberCompetencies_B_index" ON "_offeredUeberCompetencies"("B");

-- AddForeignKey
ALTER TABLE "lo-repositories" ADD CONSTRAINT "lo-repositories_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "learning_objects" ADD CONSTRAINT "learning_objects_loRepositoryId_fkey" FOREIGN KEY ("loRepositoryId") REFERENCES "lo-repositories"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_requiredCompetencies" ADD CONSTRAINT "_requiredCompetencies_A_fkey" FOREIGN KEY ("A") REFERENCES "competencies"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_requiredCompetencies" ADD CONSTRAINT "_requiredCompetencies_B_fkey" FOREIGN KEY ("B") REFERENCES "learning_objects"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_offeredCompetencies" ADD CONSTRAINT "_offeredCompetencies_A_fkey" FOREIGN KEY ("A") REFERENCES "competencies"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_offeredCompetencies" ADD CONSTRAINT "_offeredCompetencies_B_fkey" FOREIGN KEY ("B") REFERENCES "learning_objects"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_requiredUeberCompetencies" ADD CONSTRAINT "_requiredUeberCompetencies_A_fkey" FOREIGN KEY ("A") REFERENCES "learning_objects"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_requiredUeberCompetencies" ADD CONSTRAINT "_requiredUeberCompetencies_B_fkey" FOREIGN KEY ("B") REFERENCES "ueber_competencies"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_offeredUeberCompetencies" ADD CONSTRAINT "_offeredUeberCompetencies_A_fkey" FOREIGN KEY ("A") REFERENCES "learning_objects"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_offeredUeberCompetencies" ADD CONSTRAINT "_offeredUeberCompetencies_B_fkey" FOREIGN KEY ("B") REFERENCES "ueber_competencies"("id") ON DELETE CASCADE ON UPDATE CASCADE;
