/*
  Warnings:

  - You are about to drop the column `address` on the `Student` table. All the data in the column will be lost.
  - You are about to drop the column `city` on the `Student` table. All the data in the column will be lost.
  - You are about to drop the column `postalCode` on the `Student` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "Student" DROP COLUMN "address",
DROP COLUMN "city",
DROP COLUMN "postalCode";
