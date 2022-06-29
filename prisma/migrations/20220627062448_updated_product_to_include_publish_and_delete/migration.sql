/*
  Warnings:

  - A unique constraint covering the columns `[uuid]` on the table `Item` will be added. If there are existing duplicate values, this will fail.

*/
-- AlterTable
ALTER TABLE "Item" ADD COLUMN     "deletedAt" TIMESTAMP(3),
ADD COLUMN     "isDeleted" BOOLEAN,
ADD COLUMN     "isDraft" BOOLEAN,
ADD COLUMN     "publishedAt" TIMESTAMP(3);

-- CreateIndex
CREATE UNIQUE INDEX "Item_uuid_key" ON "Item"("uuid");
