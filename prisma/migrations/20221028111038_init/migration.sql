-- CreateTable
CREATE TABLE "users" (
    "id" TEXT NOT NULL,
    "name" TEXT,
    "email" TEXT NOT NULL,
    "pw" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "users_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "repositories" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT,
    "taxonomy" TEXT,
    "version" TEXT NOT NULL DEFAULT '',
    "userId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "repositories_pkey" PRIMARY KEY ("id")
);

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

-- CreateTable
CREATE TABLE "ueber_competencies" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT,
    "repositoryId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "ueber_competencies_pkey" PRIMARY KEY ("id")
);

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
CREATE TABLE "grouped_learning_objects" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT,
    "loRepositoryId" TEXT NOT NULL,

    CONSTRAINT "grouped_learning_objects_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "learning_goals" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT,
    "loRepositoryId" TEXT NOT NULL,

    CONSTRAINT "learning_goals_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "_CompetenceToUeberCompetence" (
    "A" TEXT NOT NULL,
    "B" TEXT NOT NULL
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
CREATE TABLE "_lowlevelGoals" (
    "A" TEXT NOT NULL,
    "B" TEXT NOT NULL
);

-- CreateTable
CREATE TABLE "_nesting" (
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

-- CreateTable
CREATE TABLE "_GroupedLearningObjectsToLearningObject" (
    "A" TEXT NOT NULL,
    "B" TEXT NOT NULL
);

-- CreateTable
CREATE TABLE "_nesting_of_grouped_los" (
    "A" TEXT NOT NULL,
    "B" TEXT NOT NULL
);

-- CreateTable
CREATE TABLE "_highlevelGoals" (
    "A" TEXT NOT NULL,
    "B" TEXT NOT NULL
);

-- CreateIndex
CREATE UNIQUE INDEX "users_email_key" ON "users"("email");

-- CreateIndex
CREATE UNIQUE INDEX "repositories_userId_name_version_key" ON "repositories"("userId", "name", "version");

-- CreateIndex
CREATE UNIQUE INDEX "competencies_repositoryId_skill_key" ON "competencies"("repositoryId", "skill");

-- CreateIndex
CREATE UNIQUE INDEX "ueber_competencies_repositoryId_name_key" ON "ueber_competencies"("repositoryId", "name");

-- CreateIndex
CREATE UNIQUE INDEX "lo-repositories_userId_name_key" ON "lo-repositories"("userId", "name");

-- CreateIndex
CREATE UNIQUE INDEX "learning_objects_loRepositoryId_name_key" ON "learning_objects"("loRepositoryId", "name");

-- CreateIndex
CREATE UNIQUE INDEX "grouped_learning_objects_loRepositoryId_name_key" ON "grouped_learning_objects"("loRepositoryId", "name");

-- CreateIndex
CREATE UNIQUE INDEX "learning_goals_loRepositoryId_name_key" ON "learning_goals"("loRepositoryId", "name");

-- CreateIndex
CREATE UNIQUE INDEX "_CompetenceToUeberCompetence_AB_unique" ON "_CompetenceToUeberCompetence"("A", "B");

-- CreateIndex
CREATE INDEX "_CompetenceToUeberCompetence_B_index" ON "_CompetenceToUeberCompetence"("B");

-- CreateIndex
CREATE UNIQUE INDEX "_requiredCompetencies_AB_unique" ON "_requiredCompetencies"("A", "B");

-- CreateIndex
CREATE INDEX "_requiredCompetencies_B_index" ON "_requiredCompetencies"("B");

-- CreateIndex
CREATE UNIQUE INDEX "_offeredCompetencies_AB_unique" ON "_offeredCompetencies"("A", "B");

-- CreateIndex
CREATE INDEX "_offeredCompetencies_B_index" ON "_offeredCompetencies"("B");

-- CreateIndex
CREATE UNIQUE INDEX "_lowlevelGoals_AB_unique" ON "_lowlevelGoals"("A", "B");

-- CreateIndex
CREATE INDEX "_lowlevelGoals_B_index" ON "_lowlevelGoals"("B");

-- CreateIndex
CREATE UNIQUE INDEX "_nesting_AB_unique" ON "_nesting"("A", "B");

-- CreateIndex
CREATE INDEX "_nesting_B_index" ON "_nesting"("B");

-- CreateIndex
CREATE UNIQUE INDEX "_requiredUeberCompetencies_AB_unique" ON "_requiredUeberCompetencies"("A", "B");

-- CreateIndex
CREATE INDEX "_requiredUeberCompetencies_B_index" ON "_requiredUeberCompetencies"("B");

-- CreateIndex
CREATE UNIQUE INDEX "_offeredUeberCompetencies_AB_unique" ON "_offeredUeberCompetencies"("A", "B");

-- CreateIndex
CREATE INDEX "_offeredUeberCompetencies_B_index" ON "_offeredUeberCompetencies"("B");

-- CreateIndex
CREATE UNIQUE INDEX "_GroupedLearningObjectsToLearningObject_AB_unique" ON "_GroupedLearningObjectsToLearningObject"("A", "B");

-- CreateIndex
CREATE INDEX "_GroupedLearningObjectsToLearningObject_B_index" ON "_GroupedLearningObjectsToLearningObject"("B");

-- CreateIndex
CREATE UNIQUE INDEX "_nesting_of_grouped_los_AB_unique" ON "_nesting_of_grouped_los"("A", "B");

-- CreateIndex
CREATE INDEX "_nesting_of_grouped_los_B_index" ON "_nesting_of_grouped_los"("B");

-- CreateIndex
CREATE UNIQUE INDEX "_highlevelGoals_AB_unique" ON "_highlevelGoals"("A", "B");

-- CreateIndex
CREATE INDEX "_highlevelGoals_B_index" ON "_highlevelGoals"("B");

-- AddForeignKey
ALTER TABLE "repositories" ADD CONSTRAINT "repositories_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "competencies" ADD CONSTRAINT "competencies_repositoryId_fkey" FOREIGN KEY ("repositoryId") REFERENCES "repositories"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ueber_competencies" ADD CONSTRAINT "ueber_competencies_repositoryId_fkey" FOREIGN KEY ("repositoryId") REFERENCES "repositories"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "lo-repositories" ADD CONSTRAINT "lo-repositories_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "learning_objects" ADD CONSTRAINT "learning_objects_loRepositoryId_fkey" FOREIGN KEY ("loRepositoryId") REFERENCES "lo-repositories"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "grouped_learning_objects" ADD CONSTRAINT "grouped_learning_objects_loRepositoryId_fkey" FOREIGN KEY ("loRepositoryId") REFERENCES "lo-repositories"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "learning_goals" ADD CONSTRAINT "learning_goals_loRepositoryId_fkey" FOREIGN KEY ("loRepositoryId") REFERENCES "lo-repositories"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_CompetenceToUeberCompetence" ADD CONSTRAINT "_CompetenceToUeberCompetence_A_fkey" FOREIGN KEY ("A") REFERENCES "competencies"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_CompetenceToUeberCompetence" ADD CONSTRAINT "_CompetenceToUeberCompetence_B_fkey" FOREIGN KEY ("B") REFERENCES "ueber_competencies"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_requiredCompetencies" ADD CONSTRAINT "_requiredCompetencies_A_fkey" FOREIGN KEY ("A") REFERENCES "competencies"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_requiredCompetencies" ADD CONSTRAINT "_requiredCompetencies_B_fkey" FOREIGN KEY ("B") REFERENCES "learning_objects"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_offeredCompetencies" ADD CONSTRAINT "_offeredCompetencies_A_fkey" FOREIGN KEY ("A") REFERENCES "competencies"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_offeredCompetencies" ADD CONSTRAINT "_offeredCompetencies_B_fkey" FOREIGN KEY ("B") REFERENCES "learning_objects"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_lowlevelGoals" ADD CONSTRAINT "_lowlevelGoals_A_fkey" FOREIGN KEY ("A") REFERENCES "competencies"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_lowlevelGoals" ADD CONSTRAINT "_lowlevelGoals_B_fkey" FOREIGN KEY ("B") REFERENCES "learning_goals"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_nesting" ADD CONSTRAINT "_nesting_A_fkey" FOREIGN KEY ("A") REFERENCES "ueber_competencies"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_nesting" ADD CONSTRAINT "_nesting_B_fkey" FOREIGN KEY ("B") REFERENCES "ueber_competencies"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_requiredUeberCompetencies" ADD CONSTRAINT "_requiredUeberCompetencies_A_fkey" FOREIGN KEY ("A") REFERENCES "learning_objects"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_requiredUeberCompetencies" ADD CONSTRAINT "_requiredUeberCompetencies_B_fkey" FOREIGN KEY ("B") REFERENCES "ueber_competencies"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_offeredUeberCompetencies" ADD CONSTRAINT "_offeredUeberCompetencies_A_fkey" FOREIGN KEY ("A") REFERENCES "learning_objects"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_offeredUeberCompetencies" ADD CONSTRAINT "_offeredUeberCompetencies_B_fkey" FOREIGN KEY ("B") REFERENCES "ueber_competencies"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_GroupedLearningObjectsToLearningObject" ADD CONSTRAINT "_GroupedLearningObjectsToLearningObject_A_fkey" FOREIGN KEY ("A") REFERENCES "grouped_learning_objects"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_GroupedLearningObjectsToLearningObject" ADD CONSTRAINT "_GroupedLearningObjectsToLearningObject_B_fkey" FOREIGN KEY ("B") REFERENCES "learning_objects"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_nesting_of_grouped_los" ADD CONSTRAINT "_nesting_of_grouped_los_A_fkey" FOREIGN KEY ("A") REFERENCES "grouped_learning_objects"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_nesting_of_grouped_los" ADD CONSTRAINT "_nesting_of_grouped_los_B_fkey" FOREIGN KEY ("B") REFERENCES "grouped_learning_objects"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_highlevelGoals" ADD CONSTRAINT "_highlevelGoals_A_fkey" FOREIGN KEY ("A") REFERENCES "learning_goals"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_highlevelGoals" ADD CONSTRAINT "_highlevelGoals_B_fkey" FOREIGN KEY ("B") REFERENCES "ueber_competencies"("id") ON DELETE CASCADE ON UPDATE CASCADE;
