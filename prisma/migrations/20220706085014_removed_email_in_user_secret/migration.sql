/*
  Warnings:

  - You are about to drop the column `email` on the `UserSecret` table. All the data in the column will be lost.

*/
-- DropIndex
DROP INDEX "UserSecret_email_key";

-- AlterTable
ALTER TABLE "UserSecret" DROP COLUMN "email";
