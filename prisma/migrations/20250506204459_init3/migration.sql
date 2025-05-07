/*
  Warnings:

  - You are about to drop the column `createdAt` on the `Employee` table. All the data in the column will be lost.
  - You are about to drop the column `establishmentId` on the `Employee` table. All the data in the column will be lost.
  - You are about to drop the column `firstName` on the `Employee` table. All the data in the column will be lost.
  - You are about to drop the column `lastName` on the `Employee` table. All the data in the column will be lost.
  - You are about to drop the column `phone` on the `Employee` table. All the data in the column will be lost.
  - You are about to drop the column `updatedAt` on the `Employee` table. All the data in the column will be lost.
  - You are about to drop the column `establishmentId` on the `Feedback` table. All the data in the column will be lost.
  - You are about to drop the column `orderId` on the `Feedback` table. All the data in the column will be lost.
  - You are about to drop the column `action` on the `Log` table. All the data in the column will be lost.
  - You are about to drop the column `createdAt` on the `Log` table. All the data in the column will be lost.
  - You are about to drop the column `details` on the `Log` table. All the data in the column will be lost.
  - You are about to drop the column `createdAt` on the `Menu` table. All the data in the column will be lost.
  - You are about to drop the column `description` on the `Menu` table. All the data in the column will be lost.
  - You are about to drop the column `establishmentId` on the `Menu` table. All the data in the column will be lost.
  - You are about to drop the column `updatedAt` on the `Menu` table. All the data in the column will be lost.
  - You are about to drop the column `establishmentId` on the `Order` table. All the data in the column will be lost.
  - You are about to drop the column `totalAmount` on the `Order` table. All the data in the column will be lost.
  - You are about to drop the column `updatedAt` on the `Order` table. All the data in the column will be lost.
  - You are about to drop the column `createdAt` on the `Partner` table. All the data in the column will be lost.
  - You are about to drop the column `firstName` on the `Partner` table. All the data in the column will be lost.
  - You are about to drop the column `lastName` on the `Partner` table. All the data in the column will be lost.
  - You are about to drop the column `phone` on the `Partner` table. All the data in the column will be lost.
  - You are about to drop the column `updatedAt` on the `Partner` table. All the data in the column will be lost.
  - You are about to drop the `Admin` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `Establishment` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `MenuItem` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `OrderItem` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `Rating` table. If the table is not empty, all the data it contains will be lost.
  - A unique constraint covering the columns `[userId]` on the table `Employee` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[userId]` on the table `Partner` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `locationId` to the `Employee` table without a default value. This is not possible if the table is not empty.
  - Added the required column `name` to the `Employee` table without a default value. This is not possible if the table is not empty.
  - Added the required column `userId` to the `Employee` table without a default value. This is not possible if the table is not empty.
  - Added the required column `locationId` to the `Feedback` table without a default value. This is not possible if the table is not empty.
  - Made the column `comment` on table `Feedback` required. This step will fail if there are existing NULL values in that column.
  - Added the required column `endpoint` to the `Log` table without a default value. This is not possible if the table is not empty.
  - Added the required column `method` to the `Log` table without a default value. This is not possible if the table is not empty.
  - Added the required column `role` to the `Log` table without a default value. This is not possible if the table is not empty.
  - Added the required column `locationId` to the `Menu` table without a default value. This is not possible if the table is not empty.
  - Added the required column `price` to the `Menu` table without a default value. This is not possible if the table is not empty.
  - Added the required column `locationId` to the `Order` table without a default value. This is not possible if the table is not empty.
  - Added the required column `total` to the `Order` table without a default value. This is not possible if the table is not empty.
  - Added the required column `userId` to the `Partner` table without a default value. This is not possible if the table is not empty.

*/
-- CreateEnum
CREATE TYPE "Role" AS ENUM ('ADMIN', 'PARTNER', 'EMPLOYEE');

-- DropForeignKey
ALTER TABLE "Employee" DROP CONSTRAINT "Employee_establishmentId_fkey";

-- DropForeignKey
ALTER TABLE "Establishment" DROP CONSTRAINT "Establishment_adminId_fkey";

-- DropForeignKey
ALTER TABLE "Establishment" DROP CONSTRAINT "Establishment_partnerId_fkey";

-- DropForeignKey
ALTER TABLE "Feedback" DROP CONSTRAINT "Feedback_establishmentId_fkey";

-- DropForeignKey
ALTER TABLE "Feedback" DROP CONSTRAINT "Feedback_orderId_fkey";

-- DropForeignKey
ALTER TABLE "Menu" DROP CONSTRAINT "Menu_establishmentId_fkey";

-- DropForeignKey
ALTER TABLE "MenuItem" DROP CONSTRAINT "MenuItem_menuId_fkey";

-- DropForeignKey
ALTER TABLE "Order" DROP CONSTRAINT "Order_establishmentId_fkey";

-- DropForeignKey
ALTER TABLE "OrderItem" DROP CONSTRAINT "OrderItem_menuItemId_fkey";

-- DropForeignKey
ALTER TABLE "OrderItem" DROP CONSTRAINT "OrderItem_orderId_fkey";

-- DropForeignKey
ALTER TABLE "Rating" DROP CONSTRAINT "Rating_employeeId_fkey";

-- DropIndex
DROP INDEX "Employee_establishmentId_idx";

-- DropIndex
DROP INDEX "Employee_phone_idx";

-- DropIndex
DROP INDEX "Feedback_establishmentId_idx";

-- DropIndex
DROP INDEX "Feedback_orderId_key";

-- DropIndex
DROP INDEX "Feedback_rating_idx";

-- DropIndex
DROP INDEX "Log_action_idx";

-- DropIndex
DROP INDEX "Log_createdAt_idx";

-- DropIndex
DROP INDEX "Log_userId_idx";

-- DropIndex
DROP INDEX "Menu_establishmentId_idx";

-- DropIndex
DROP INDEX "Order_createdAt_idx";

-- DropIndex
DROP INDEX "Order_employeeId_idx";

-- DropIndex
DROP INDEX "Order_establishmentId_idx";

-- DropIndex
DROP INDEX "Partner_phone_idx";

-- AlterTable
ALTER TABLE "Employee" DROP COLUMN "createdAt",
DROP COLUMN "establishmentId",
DROP COLUMN "firstName",
DROP COLUMN "lastName",
DROP COLUMN "phone",
DROP COLUMN "updatedAt",
ADD COLUMN     "locationId" TEXT NOT NULL,
ADD COLUMN     "name" TEXT NOT NULL,
ADD COLUMN     "userId" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "Feedback" DROP COLUMN "establishmentId",
DROP COLUMN "orderId",
ADD COLUMN     "locationId" TEXT NOT NULL,
ALTER COLUMN "rating" SET DATA TYPE INTEGER,
ALTER COLUMN "comment" SET NOT NULL;

-- AlterTable
ALTER TABLE "Log" DROP COLUMN "action",
DROP COLUMN "createdAt",
DROP COLUMN "details",
ADD COLUMN     "endpoint" TEXT NOT NULL,
ADD COLUMN     "method" TEXT NOT NULL,
ADD COLUMN     "role" "Role" NOT NULL,
ADD COLUMN     "timestamp" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
ALTER COLUMN "userId" SET DATA TYPE TEXT;

-- AlterTable
ALTER TABLE "Menu" DROP COLUMN "createdAt",
DROP COLUMN "description",
DROP COLUMN "establishmentId",
DROP COLUMN "updatedAt",
ADD COLUMN     "isActive" BOOLEAN NOT NULL DEFAULT true,
ADD COLUMN     "locationId" TEXT NOT NULL,
ADD COLUMN     "price" DOUBLE PRECISION NOT NULL,
ALTER COLUMN "name" SET DATA TYPE TEXT;

-- AlterTable
ALTER TABLE "Order" DROP COLUMN "establishmentId",
DROP COLUMN "totalAmount",
DROP COLUMN "updatedAt",
ADD COLUMN     "locationId" TEXT NOT NULL,
ADD COLUMN     "total" DOUBLE PRECISION NOT NULL;

-- AlterTable
ALTER TABLE "Partner" DROP COLUMN "createdAt",
DROP COLUMN "firstName",
DROP COLUMN "lastName",
DROP COLUMN "phone",
DROP COLUMN "updatedAt",
ADD COLUMN     "userId" TEXT NOT NULL;

-- DropTable
DROP TABLE "Admin";

-- DropTable
DROP TABLE "Establishment";

-- DropTable
DROP TABLE "MenuItem";

-- DropTable
DROP TABLE "OrderItem";

-- DropTable
DROP TABLE "Rating";

-- CreateTable
CREATE TABLE "User" (
    "id" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "password" TEXT NOT NULL,
    "role" "Role" NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "User_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Location" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "address" TEXT NOT NULL,
    "partnerId" TEXT NOT NULL,

    CONSTRAINT "Location_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Device" (
    "id" TEXT NOT NULL,
    "login" TEXT NOT NULL,
    "password" TEXT NOT NULL,
    "locationId" TEXT NOT NULL,

    CONSTRAINT "Device_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "User_email_key" ON "User"("email");

-- CreateIndex
CREATE UNIQUE INDEX "Device_login_key" ON "Device"("login");

-- CreateIndex
CREATE UNIQUE INDEX "Employee_userId_key" ON "Employee"("userId");

-- CreateIndex
CREATE UNIQUE INDEX "Partner_userId_key" ON "Partner"("userId");

-- AddForeignKey
ALTER TABLE "Partner" ADD CONSTRAINT "Partner_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Location" ADD CONSTRAINT "Location_partnerId_fkey" FOREIGN KEY ("partnerId") REFERENCES "Partner"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Employee" ADD CONSTRAINT "Employee_locationId_fkey" FOREIGN KEY ("locationId") REFERENCES "Location"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Employee" ADD CONSTRAINT "Employee_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Device" ADD CONSTRAINT "Device_locationId_fkey" FOREIGN KEY ("locationId") REFERENCES "Location"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Menu" ADD CONSTRAINT "Menu_locationId_fkey" FOREIGN KEY ("locationId") REFERENCES "Location"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Order" ADD CONSTRAINT "Order_locationId_fkey" FOREIGN KEY ("locationId") REFERENCES "Location"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Feedback" ADD CONSTRAINT "Feedback_locationId_fkey" FOREIGN KEY ("locationId") REFERENCES "Location"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
