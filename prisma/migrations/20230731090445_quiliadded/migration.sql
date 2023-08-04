-- CreateTable
CREATE TABLE "ConsumedUnitData" (
    "id" TEXT NOT NULL,
    "actualPocessingTime" TEXT NOT NULL,
    "testPerformance" DECIMAL(5,2) NOT NULL,
    "lbDataId" TEXT NOT NULL,

    CONSTRAINT "ConsumedUnitData_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "LearningBehaviorData" (
    "id" TEXT NOT NULL,
    "clickdata" TEXT[],
    "userId" TEXT NOT NULL,

    CONSTRAINT "LearningBehaviorData_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Qualification" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "year" INTEGER NOT NULL,
    "userId" TEXT NOT NULL,

    CONSTRAINT "Qualification_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "_consumedLU" (
    "A" TEXT NOT NULL,
    "B" TEXT NOT NULL
);

-- CreateIndex
CREATE UNIQUE INDEX "LearningBehaviorData_userId_key" ON "LearningBehaviorData"("userId");

-- CreateIndex
CREATE UNIQUE INDEX "Qualification_userId_key" ON "Qualification"("userId");

-- CreateIndex
CREATE UNIQUE INDEX "_consumedLU_AB_unique" ON "_consumedLU"("A", "B");

-- CreateIndex
CREATE INDEX "_consumedLU_B_index" ON "_consumedLU"("B");

-- AddForeignKey
ALTER TABLE "ConsumedUnitData" ADD CONSTRAINT "ConsumedUnitData_lbDataId_fkey" FOREIGN KEY ("lbDataId") REFERENCES "LearningBehaviorData"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "LearningBehaviorData" ADD CONSTRAINT "LearningBehaviorData_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Qualification" ADD CONSTRAINT "Qualification_userId_fkey" FOREIGN KEY ("userId") REFERENCES "SkillProfile"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_consumedLU" ADD CONSTRAINT "_consumedLU_A_fkey" FOREIGN KEY ("A") REFERENCES "ConsumedUnitData"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_consumedLU" ADD CONSTRAINT "_consumedLU_B_fkey" FOREIGN KEY ("B") REFERENCES "LearningUnit"("id") ON DELETE CASCADE ON UPDATE CASCADE;
