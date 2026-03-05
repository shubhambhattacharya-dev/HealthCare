/*
  Warnings:

  - The values [APPROVED] on the enum `VerificationStatus` will be removed. If these variants are still used in the database, this will fail.
  - You are about to drop the column `deletedAt` on the `Appointment` table. All the data in the column will be lost.
  - You are about to drop the column `updatedAt` on the `CreditTransaction` table. All the data in the column will be lost.
  - You are about to drop the column `credentialURL` on the `User` table. All the data in the column will be lost.
  - You are about to drop the column `deletedAt` on the `User` table. All the data in the column will be lost.
  - You are about to drop the column `speciality` on the `User` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[doctorId,startTime]` on the table `Availability` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateEnum
CREATE TYPE "PayoutStatus" AS ENUM ('PROCESSING', 'PROCESSED');

-- AlterEnum
BEGIN;
CREATE TYPE "VerificationStatus_new" AS ENUM ('PENDING', 'VERIFIED', 'REJECTED');
ALTER TABLE "public"."User" ALTER COLUMN "verificationStatus" DROP DEFAULT;
ALTER TABLE "User" ALTER COLUMN "verificationStatus" TYPE "VerificationStatus_new" USING ("verificationStatus"::text::"VerificationStatus_new");
ALTER TYPE "VerificationStatus" RENAME TO "VerificationStatus_old";
ALTER TYPE "VerificationStatus_new" RENAME TO "VerificationStatus";
DROP TYPE "public"."VerificationStatus_old";
ALTER TABLE "User" ALTER COLUMN "verificationStatus" SET DEFAULT 'PENDING';
COMMIT;

-- DropForeignKey
ALTER TABLE "Appointment" DROP CONSTRAINT "Appointment_doctorId_fkey";

-- DropForeignKey
ALTER TABLE "Appointment" DROP CONSTRAINT "Appointment_patientId_fkey";

-- DropIndex
DROP INDEX "Appointment_doctorId_startTime_key";

-- DropIndex
DROP INDEX "Appointment_patientId_startTime_idx";

-- DropIndex
DROP INDEX "Availability_status_idx";

-- DropIndex
DROP INDEX "User_role_idx";

-- DropIndex
DROP INDEX "User_verificationStatus_idx";

-- AlterTable
ALTER TABLE "Appointment" DROP COLUMN "deletedAt";

-- AlterTable
ALTER TABLE "CreditTransaction" DROP COLUMN "updatedAt";

-- AlterTable
ALTER TABLE "User" DROP COLUMN "credentialURL",
DROP COLUMN "deletedAt",
DROP COLUMN "speciality",
ADD COLUMN     "credentialUrl" TEXT,
ADD COLUMN     "specialty" TEXT,
ALTER COLUMN "verificationStatus" DROP NOT NULL;

-- CreateTable
CREATE TABLE "Payout" (
    "id" TEXT NOT NULL,
    "doctorId" TEXT NOT NULL,
    "amount" DECIMAL(10,2) NOT NULL,
    "credits" INTEGER NOT NULL,
    "platformFee" DECIMAL(10,2) NOT NULL,
    "netAmount" DECIMAL(10,2) NOT NULL,
    "paypalEmail" TEXT NOT NULL,
    "status" "PayoutStatus" NOT NULL DEFAULT 'PROCESSING',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "processedAt" TIMESTAMP(3),
    "processedBy" TEXT,

    CONSTRAINT "Payout_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "Payout_status_createdAt_idx" ON "Payout"("status", "createdAt");

-- CreateIndex
CREATE INDEX "Payout_doctorId_status_idx" ON "Payout"("doctorId", "status");

-- CreateIndex
CREATE UNIQUE INDEX "Availability_doctorId_startTime_key" ON "Availability"("doctorId", "startTime");

-- AddForeignKey
ALTER TABLE "Appointment" ADD CONSTRAINT "Appointment_patientId_fkey" FOREIGN KEY ("patientId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Appointment" ADD CONSTRAINT "Appointment_doctorId_fkey" FOREIGN KEY ("doctorId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Payout" ADD CONSTRAINT "Payout_doctorId_fkey" FOREIGN KEY ("doctorId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;
