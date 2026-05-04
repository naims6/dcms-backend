/*
  Warnings:

  - You are about to drop the column `admissionDate` on the `Student` table. All the data in the column will be lost.
  - You are about to drop the column `classApplying` on the `Student` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "Student" DROP COLUMN "admissionDate",
DROP COLUMN "classApplying";
