/*
  Warnings:

  - The primary key for the `Role` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - The primary key for the `RoleGroup` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to drop the `_userOfComp` table. If the table is not empty, all the data it contains will be lost.
  - A unique constraint covering the columns `[companyId,name]` on the table `User` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `companyId` to the `User` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "_RoleToRoleGroup" DROP CONSTRAINT "_RoleToRoleGroup_A_fkey";

-- DropForeignKey
ALTER TABLE "_RoleToRoleGroup" DROP CONSTRAINT "_RoleToRoleGroup_B_fkey";

-- DropForeignKey
ALTER TABLE "_userOfComp" DROP CONSTRAINT "_userOfComp_A_fkey";

-- DropForeignKey
ALTER TABLE "_userOfComp" DROP CONSTRAINT "_userOfComp_B_fkey";

-- AlterTable
ALTER TABLE "Role" DROP CONSTRAINT "Role_pkey",
ALTER COLUMN "id" DROP DEFAULT,
ALTER COLUMN "id" SET DATA TYPE TEXT,
ADD CONSTRAINT "Role_pkey" PRIMARY KEY ("id");
DROP SEQUENCE "Role_id_seq";

-- AlterTable
ALTER TABLE "RoleGroup" DROP CONSTRAINT "RoleGroup_pkey",
ALTER COLUMN "id" DROP DEFAULT,
ALTER COLUMN "id" SET DATA TYPE TEXT,
ADD CONSTRAINT "RoleGroup_pkey" PRIMARY KEY ("id");
DROP SEQUENCE "RoleGroup_id_seq";

-- AlterTable
ALTER TABLE "User" ADD COLUMN     "companyId" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "_RoleToRoleGroup" ALTER COLUMN "A" SET DATA TYPE TEXT,
ALTER COLUMN "B" SET DATA TYPE TEXT;

-- DropTable
DROP TABLE "_userOfComp";

-- CreateIndex
CREATE UNIQUE INDEX "User_companyId_name_key" ON "User"("companyId", "name");

-- AddForeignKey
ALTER TABLE "User" ADD CONSTRAINT "User_companyId_fkey" FOREIGN KEY ("companyId") REFERENCES "Company"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_RoleToRoleGroup" ADD CONSTRAINT "_RoleToRoleGroup_A_fkey" FOREIGN KEY ("A") REFERENCES "Role"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_RoleToRoleGroup" ADD CONSTRAINT "_RoleToRoleGroup_B_fkey" FOREIGN KEY ("B") REFERENCES "RoleGroup"("id") ON DELETE CASCADE ON UPDATE CASCADE;
