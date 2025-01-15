/*
  Warnings:

  - You are about to drop the `Balance` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "Balance" DROP CONSTRAINT "Balance_userId_fkey";

-- AlterTable
ALTER TABLE "User" ADD COLUMN     "Balance" INTEGER NOT NULL DEFAULT 0;

-- DropTable
DROP TABLE "Balance";
