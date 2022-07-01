-- AlterTable
ALTER TABLE "User" ADD COLUMN     "deactivatedBy" INTEGER,
ADD COLUMN     "deletedAt" TIMESTAMP(3),
ADD COLUMN     "deletedBy" INTEGER,
ADD COLUMN     "isDeleted" BOOLEAN;
