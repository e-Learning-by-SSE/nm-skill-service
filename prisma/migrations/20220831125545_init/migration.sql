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
CREATE TABLE "_CompetenceToUeberCompetence" (
    "A" TEXT NOT NULL,
    "B" TEXT NOT NULL
);

-- CreateTable
CREATE TABLE "_nesting" (
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
CREATE UNIQUE INDEX "_CompetenceToUeberCompetence_AB_unique" ON "_CompetenceToUeberCompetence"("A", "B");

-- CreateIndex
CREATE INDEX "_CompetenceToUeberCompetence_B_index" ON "_CompetenceToUeberCompetence"("B");

-- CreateIndex
CREATE UNIQUE INDEX "_nesting_AB_unique" ON "_nesting"("A", "B");

-- CreateIndex
CREATE INDEX "_nesting_B_index" ON "_nesting"("B");

-- AddForeignKey
ALTER TABLE "repositories" ADD CONSTRAINT "repositories_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "competencies" ADD CONSTRAINT "competencies_repositoryId_fkey" FOREIGN KEY ("repositoryId") REFERENCES "repositories"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ueber_competencies" ADD CONSTRAINT "ueber_competencies_repositoryId_fkey" FOREIGN KEY ("repositoryId") REFERENCES "repositories"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_CompetenceToUeberCompetence" ADD CONSTRAINT "_CompetenceToUeberCompetence_A_fkey" FOREIGN KEY ("A") REFERENCES "competencies"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_CompetenceToUeberCompetence" ADD CONSTRAINT "_CompetenceToUeberCompetence_B_fkey" FOREIGN KEY ("B") REFERENCES "ueber_competencies"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_nesting" ADD CONSTRAINT "_nesting_A_fkey" FOREIGN KEY ("A") REFERENCES "ueber_competencies"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_nesting" ADD CONSTRAINT "_nesting_B_fkey" FOREIGN KEY ("B") REFERENCES "ueber_competencies"("id") ON DELETE CASCADE ON UPDATE CASCADE;
