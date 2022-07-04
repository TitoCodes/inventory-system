-- AlterTable
ALTER TABLE "User" ADD COLUMN     "updatedBy" INTEGER;

-- AlterTable
ALTER TABLE "UserProfile" ALTER COLUMN "updatedBy" DROP NOT NULL;
