/*
  Warnings:

  - You are about to drop the column `approvedDate` on the `Admission` table. All the data in the column will be lost.
  - You are about to drop the column `rejectedDate` on the `Admission` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[studentId,relation]` on the table `Guardian` will be added. If there are existing duplicate values, this will fail.

*/
-- AlterTable
ALTER TABLE "Admission" DROP COLUMN "approvedDate",
DROP COLUMN "rejectedDate";

-- AlterTable
ALTER TABLE "User" ADD COLUMN     "isVerified" BOOLEAN NOT NULL DEFAULT false;

-- CreateTable
CREATE TABLE "Session" (
    "id" TEXT NOT NULL,
    "sessionId" TEXT NOT NULL,
    "expiresIn" TIMESTAMP(3) NOT NULL,
    "refreshToken" TEXT NOT NULL,
    "userId" TEXT NOT NULL,

    CONSTRAINT "Session_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Session_sessionId_key" ON "Session"("sessionId");

-- CreateIndex
CREATE UNIQUE INDEX "Session_refreshToken_key" ON "Session"("refreshToken");

-- CreateIndex
CREATE INDEX "Session_userId_idx" ON "Session"("userId");

-- CreateIndex
CREATE UNIQUE INDEX "Guardian_studentId_relation_key" ON "Guardian"("studentId", "relation");

-- CreateIndex
CREATE INDEX "User_phone_idx" ON "User"("phone");

-- AddForeignKey
ALTER TABLE "Session" ADD CONSTRAINT "Session_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
