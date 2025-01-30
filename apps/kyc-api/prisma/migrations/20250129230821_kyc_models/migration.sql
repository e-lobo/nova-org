-- CreateEnum
CREATE TYPE "KYCStatus" AS ENUM ('PENDING', 'UNDER_REVIEW', 'RETURNED', 'APPROVED', 'REJECTED');

-- CreateEnum
CREATE TYPE "DocumentType" AS ENUM ('PASSPORT', 'ADDRESS_PROOF', 'SELFIE');

-- AlterTable
ALTER TABLE "files" ADD COLUMN     "documentType" "DocumentType",
ADD COLUMN     "kycId" TEXT;

-- CreateTable
CREATE TABLE "kyc" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "status" "KYCStatus" NOT NULL DEFAULT 'PENDING',
    "fullName" TEXT,
    "dateOfBirth" TIMESTAMP(3),
    "nationality" TEXT,
    "address" TEXT,
    "phoneNumber" TEXT,
    "notes" TEXT,
    "reviewerId" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "kyc_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "kyc_userId_key" ON "kyc"("userId");

-- AddForeignKey
ALTER TABLE "files" ADD CONSTRAINT "files_kycId_fkey" FOREIGN KEY ("kycId") REFERENCES "kyc"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "kyc" ADD CONSTRAINT "kyc_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "kyc" ADD CONSTRAINT "kyc_reviewerId_fkey" FOREIGN KEY ("reviewerId") REFERENCES "users"("id") ON DELETE SET NULL ON UPDATE CASCADE;
