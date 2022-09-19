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
CREATE TABLE "_requires" (
    "A" TEXT NOT NULL,
    "B" TEXT NOT NULL
);

-- CreateTable
CREATE TABLE "_offers" (
    "A" TEXT NOT NULL,
    "B" TEXT NOT NULL
);

-- CreateIndex
CREATE UNIQUE INDEX "lo-repositories_userId_name_key" ON "lo-repositories"("userId", "name");

-- CreateIndex
CREATE UNIQUE INDEX "learning_objects_loRepositoryId_name_key" ON "learning_objects"("loRepositoryId", "name");

-- CreateIndex
CREATE UNIQUE INDEX "_requires_AB_unique" ON "_requires"("A", "B");

-- CreateIndex
CREATE INDEX "_requires_B_index" ON "_requires"("B");

-- CreateIndex
CREATE UNIQUE INDEX "_offers_AB_unique" ON "_offers"("A", "B");

-- CreateIndex
CREATE INDEX "_offers_B_index" ON "_offers"("B");

-- AddForeignKey
ALTER TABLE "lo-repositories" ADD CONSTRAINT "lo-repositories_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "learning_objects" ADD CONSTRAINT "learning_objects_loRepositoryId_fkey" FOREIGN KEY ("loRepositoryId") REFERENCES "lo-repositories"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_requires" ADD CONSTRAINT "_requires_A_fkey" FOREIGN KEY ("A") REFERENCES "learning_objects"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_requires" ADD CONSTRAINT "_requires_B_fkey" FOREIGN KEY ("B") REFERENCES "ueber_competencies"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_offers" ADD CONSTRAINT "_offers_A_fkey" FOREIGN KEY ("A") REFERENCES "learning_objects"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_offers" ADD CONSTRAINT "_offers_B_fkey" FOREIGN KEY ("B") REFERENCES "ueber_competencies"("id") ON DELETE CASCADE ON UPDATE CASCADE;
