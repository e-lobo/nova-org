/*
  Warnings:

  - The values [UNDER_REVIEW] on the enum `KYCStatus` will be removed. If these variants are still used in the database, this will fail.

*/
-- AlterEnum
BEGIN;
CREATE TYPE "KYCStatus_new" AS ENUM ('PENDING', 'RETURNED', 'APPROVED', 'REJECTED');
ALTER TABLE "kyc" ALTER COLUMN "status" DROP DEFAULT;
ALTER TABLE "kyc" ALTER COLUMN "status" TYPE "KYCStatus_new" USING ("status"::text::"KYCStatus_new");
ALTER TYPE "KYCStatus" RENAME TO "KYCStatus_old";
ALTER TYPE "KYCStatus_new" RENAME TO "KYCStatus";
DROP TYPE "KYCStatus_old";
ALTER TABLE "kyc" ALTER COLUMN "status" SET DEFAULT 'PENDING';
COMMIT;
