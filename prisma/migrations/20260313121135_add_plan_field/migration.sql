/*
  Warnings:

  - You are about to drop the column `packageId` on the `CreditTransaction` table. All the data in the column will be lost.
  - You are about to drop the column `paypalEmail` on the `Payout` table. All the data in the column will be lost.
  - Added the required column `payoutEmail` to the `Payout` table without a default value. This is not possible if the table is not empty.
  - Made the column `verificationStatus` on table `User` required. This step will fail if there are existing NULL values in that column.

*/
-- AlterEnum
ALTER TYPE "PayoutStatus" ADD VALUE 'FAILED';

-- AlterEnum
ALTER TYPE "TransactionType" ADD VALUE 'REFUND';

-- DropIndex
DROP INDEX "Appointment_status_startTime_idx";

-- AlterTable
ALTER TABLE "CreditTransaction" DROP COLUMN "packageId",
ADD COLUMN     "description" TEXT,
ADD COLUMN     "referenceId" TEXT;

-- AlterTable
ALTER TABLE "Payout" DROP COLUMN "paypalEmail",
ADD COLUMN     "payoutEmail" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "User" ADD COLUMN     "plan" TEXT NOT NULL DEFAULT 'free_user',
ALTER COLUMN "credits" SET DEFAULT 0,
ALTER COLUMN "verificationStatus" SET NOT NULL;

-- CreateIndex
CREATE INDEX "Appointment_patientId_startTime_idx" ON "Appointment"("patientId", "startTime");

-- CreateIndex
CREATE INDEX "Appointment_status_idx" ON "Appointment"("status");

-- CreateIndex
CREATE INDEX "User_role_idx" ON "User"("role");
