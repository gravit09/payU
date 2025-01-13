/*
  Warnings:

  - Added the required column `password` to the `BankUser` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "BankUser" ADD COLUMN     "password" TEXT NOT NULL;
