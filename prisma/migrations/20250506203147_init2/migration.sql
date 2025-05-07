/*
  Warnings:

  - You are about to drop the column `deletedAt` on the `Admin` table. All the data in the column will be lost.
  - You are about to drop the column `firstName` on the `Admin` table. All the data in the column will be lost.
  - You are about to drop the column `lastName` on the `Admin` table. All the data in the column will be lost.
  - You are about to drop the column `phone` on the `Admin` table. All the data in the column will be lost.
  - You are about to drop the column `userId` on the `Admin` table. All the data in the column will be lost.
  - You are about to drop the column `deletedAt` on the `Employee` table. All the data in the column will be lost.
  - You are about to drop the column `isActive` on the `Employee` table. All the data in the column will be lost.
  - You are about to drop the column `partnerId` on the `Employee` table. All the data in the column will be lost.
  - You are about to drop the column `userId` on the `Employee` table. All the data in the column will be lost.
  - You are about to drop the column `deletedAt` on the `Establishment` table. All the data in the column will be lost.
  - You are about to drop the column `isActive` on the `Establishment` table. All the data in the column will be lost.
  - You are about to drop the column `phone` on the `Establishment` table. All the data in the column will be lost.
  - You are about to drop the column `deletedAt` on the `Feedback` table. All the data in the column will be lost.
  - You are about to alter the column `userId` on the `Log` table. The data in that column could be lost. The data in that column will be cast from `Text` to `VarChar(50)`.
  - You are about to drop the column `categoryId` on the `MenuItem` table. All the data in the column will be lost.
  - You are about to drop the column `deletedAt` on the `MenuItem` table. All the data in the column will be lost.
  - You are about to drop the column `discount` on the `MenuItem` table. All the data in the column will be lost.
  - You are about to drop the column `isAvailable` on the `MenuItem` table. All the data in the column will be lost.
  - You are about to drop the column `customerPhone` on the `Order` table. All the data in the column will be lost.
  - You are about to drop the column `deletedAt` on the `Order` table. All the data in the column will be lost.
  - You are about to drop the column `orderType` on the `Order` table. All the data in the column will be lost.
  - You are about to drop the column `status` on the `Order` table. All the data in the column will be lost.
  - You are about to drop the column `tableNumber` on the `Order` table. All the data in the column will be lost.
  - You are about to drop the column `deletedAt` on the `Partner` table. All the data in the column will be lost.
  - You are about to drop the column `userId` on the `Partner` table. All the data in the column will be lost.
  - You are about to drop the column `comment` on the `Rating` table. All the data in the column will be lost.
  - You are about to drop the column `deletedAt` on the `Rating` table. All the data in the column will be lost.
  - You are about to drop the `MenuCategory` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `User` table. If the table is not empty, all the data it contains will be lost.
  - A unique constraint covering the columns `[login]` on the table `Admin` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `login` to the `Admin` table without a default value. This is not possible if the table is not empty.
  - Added the required column `password` to the `Admin` table without a default value. This is not possible if the table is not empty.
  - Made the column `phone` on table `Employee` required. This step will fail if there are existing NULL values in that column.
  - Added the required column `menuId` to the `MenuItem` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "Admin" DROP CONSTRAINT "Admin_userId_fkey";

-- DropForeignKey
ALTER TABLE "Employee" DROP CONSTRAINT "Employee_partnerId_fkey";

-- DropForeignKey
ALTER TABLE "Employee" DROP CONSTRAINT "Employee_userId_fkey";

-- DropForeignKey
ALTER TABLE "Log" DROP CONSTRAINT "Log_userId_fkey";

-- DropForeignKey
ALTER TABLE "MenuCategory" DROP CONSTRAINT "MenuCategory_establishmentId_fkey";

-- DropForeignKey
ALTER TABLE "MenuItem" DROP CONSTRAINT "MenuItem_categoryId_fkey";

-- DropForeignKey
ALTER TABLE "Partner" DROP CONSTRAINT "Partner_userId_fkey";

-- DropIndex
DROP INDEX "Admin_userId_idx";

-- DropIndex
DROP INDEX "Admin_userId_key";

-- DropIndex
DROP INDEX "Employee_isActive_idx";

-- DropIndex
DROP INDEX "Employee_partnerId_idx";

-- DropIndex
DROP INDEX "Employee_userId_idx";

-- DropIndex
DROP INDEX "Employee_userId_key";

-- DropIndex
DROP INDEX "Establishment_isActive_idx";

-- DropIndex
DROP INDEX "Feedback_createdAt_idx";

-- DropIndex
DROP INDEX "MenuItem_categoryId_idx";

-- DropIndex
DROP INDEX "MenuItem_isAvailable_idx";

-- DropIndex
DROP INDEX "Order_status_idx";

-- DropIndex
DROP INDEX "Partner_userId_idx";

-- DropIndex
DROP INDEX "Partner_userId_key";

-- DropIndex
DROP INDEX "Rating_createdAt_idx";

-- AlterTable
ALTER TABLE "Admin" DROP COLUMN "deletedAt",
DROP COLUMN "firstName",
DROP COLUMN "lastName",
DROP COLUMN "phone",
DROP COLUMN "userId",
ADD COLUMN     "login" VARCHAR(50) NOT NULL,
ADD COLUMN     "password" VARCHAR(255) NOT NULL;

-- AlterTable
ALTER TABLE "Employee" DROP COLUMN "deletedAt",
DROP COLUMN "isActive",
DROP COLUMN "partnerId",
DROP COLUMN "userId",
ALTER COLUMN "phone" SET NOT NULL;

-- AlterTable
ALTER TABLE "Establishment" DROP COLUMN "deletedAt",
DROP COLUMN "isActive",
DROP COLUMN "phone";

-- AlterTable
ALTER TABLE "Feedback" DROP COLUMN "deletedAt";

-- AlterTable
ALTER TABLE "Log" ALTER COLUMN "userId" SET DATA TYPE VARCHAR(50);

-- AlterTable
ALTER TABLE "MenuItem" DROP COLUMN "categoryId",
DROP COLUMN "deletedAt",
DROP COLUMN "discount",
DROP COLUMN "isAvailable",
ADD COLUMN     "menuId" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "Order" DROP COLUMN "customerPhone",
DROP COLUMN "deletedAt",
DROP COLUMN "orderType",
DROP COLUMN "status",
DROP COLUMN "tableNumber";

-- AlterTable
ALTER TABLE "Partner" DROP COLUMN "deletedAt",
DROP COLUMN "userId";

-- AlterTable
ALTER TABLE "Rating" DROP COLUMN "comment",
DROP COLUMN "deletedAt";

-- DropTable
DROP TABLE "MenuCategory";

-- DropTable
DROP TABLE "User";

-- DropEnum
DROP TYPE "OrderStatus";

-- DropEnum
DROP TYPE "OrderType";

-- DropEnum
DROP TYPE "Role";

-- CreateTable
CREATE TABLE "Menu" (
    "id" TEXT NOT NULL,
    "name" VARCHAR(255) NOT NULL,
    "description" TEXT,
    "establishmentId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Menu_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "Menu_establishmentId_idx" ON "Menu"("establishmentId");

-- CreateIndex
CREATE UNIQUE INDEX "Admin_login_key" ON "Admin"("login");

-- CreateIndex
CREATE INDEX "Admin_login_idx" ON "Admin"("login");

-- CreateIndex
CREATE INDEX "Employee_phone_idx" ON "Employee"("phone");

-- CreateIndex
CREATE INDEX "MenuItem_menuId_idx" ON "MenuItem"("menuId");

-- CreateIndex
CREATE INDEX "Partner_phone_idx" ON "Partner"("phone");

-- AddForeignKey
ALTER TABLE "Menu" ADD CONSTRAINT "Menu_establishmentId_fkey" FOREIGN KEY ("establishmentId") REFERENCES "Establishment"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "MenuItem" ADD CONSTRAINT "MenuItem_menuId_fkey" FOREIGN KEY ("menuId") REFERENCES "Menu"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
