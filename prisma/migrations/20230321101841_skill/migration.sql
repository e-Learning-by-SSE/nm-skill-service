-- CreateTable
CREATE TABLE "skill-repositories" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT,
    "taxonomy" TEXT,
    "version" TEXT NOT NULL DEFAULT '',
    "userId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "skill-repositories_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "skills" (
    "id" TEXT NOT NULL,
    "skill" TEXT NOT NULL,
    "level" INTEGER NOT NULL,
    "description" TEXT,
    "repositoryId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "skills_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "_parentSkills" (
    "A" TEXT NOT NULL,
    "B" TEXT NOT NULL
);

-- CreateIndex
CREATE UNIQUE INDEX "skill-repositories_userId_name_version_key" ON "skill-repositories"("userId", "name", "version");

-- CreateIndex
CREATE UNIQUE INDEX "skills_repositoryId_skill_key" ON "skills"("repositoryId", "skill");

-- CreateIndex
CREATE UNIQUE INDEX "_parentSkills_AB_unique" ON "_parentSkills"("A", "B");

-- CreateIndex
CREATE INDEX "_parentSkills_B_index" ON "_parentSkills"("B");

-- AddForeignKey
ALTER TABLE "skill-repositories" ADD CONSTRAINT "skill-repositories_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "skills" ADD CONSTRAINT "skills_repositoryId_fkey" FOREIGN KEY ("repositoryId") REFERENCES "skill-repositories"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_parentSkills" ADD CONSTRAINT "_parentSkills_A_fkey" FOREIGN KEY ("A") REFERENCES "skills"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_parentSkills" ADD CONSTRAINT "_parentSkills_B_fkey" FOREIGN KEY ("B") REFERENCES "skills"("id") ON DELETE CASCADE ON UPDATE CASCADE;
