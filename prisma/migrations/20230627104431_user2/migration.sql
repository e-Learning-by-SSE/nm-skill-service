-- CreateEnum
CREATE TYPE "RoleCategory" AS ENUM ('LEHRERNDER', 'LERNENDER');

-- AlterTable
ALTER TABLE "User" ADD COLUMN     "name" TEXT NOT NULL DEFAULT '';

-- CreateTable
CREATE TABLE "Company" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL DEFAULT '',

    CONSTRAINT "Company_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "RoleGroup" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "userId" TEXT NOT NULL,

    CONSTRAINT "RoleGroup_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Role" (
    "id" SERIAL NOT NULL,
    "isTypeOf" "RoleCategory" NOT NULL DEFAULT 'LERNENDER',

    CONSTRAINT "Role_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "_userOfComp" (
    "A" TEXT NOT NULL,
    "B" TEXT NOT NULL
);

-- CreateTable
CREATE TABLE "_RoleToRoleGroup" (
    "A" INTEGER NOT NULL,
    "B" INTEGER NOT NULL
);

-- CreateIndex
CREATE UNIQUE INDEX "RoleGroup_userId_key" ON "RoleGroup"("userId");

-- CreateIndex
CREATE UNIQUE INDEX "_userOfComp_AB_unique" ON "_userOfComp"("A", "B");

-- CreateIndex
CREATE INDEX "_userOfComp_B_index" ON "_userOfComp"("B");

-- CreateIndex
CREATE UNIQUE INDEX "_RoleToRoleGroup_AB_unique" ON "_RoleToRoleGroup"("A", "B");

-- CreateIndex
CREATE INDEX "_RoleToRoleGroup_B_index" ON "_RoleToRoleGroup"("B");

-- AddForeignKey
ALTER TABLE "RoleGroup" ADD CONSTRAINT "RoleGroup_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_userOfComp" ADD CONSTRAINT "_userOfComp_A_fkey" FOREIGN KEY ("A") REFERENCES "Company"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_userOfComp" ADD CONSTRAINT "_userOfComp_B_fkey" FOREIGN KEY ("B") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_RoleToRoleGroup" ADD CONSTRAINT "_RoleToRoleGroup_A_fkey" FOREIGN KEY ("A") REFERENCES "Role"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_RoleToRoleGroup" ADD CONSTRAINT "_RoleToRoleGroup_B_fkey" FOREIGN KEY ("B") REFERENCES "RoleGroup"("id") ON DELETE CASCADE ON UPDATE CASCADE;
