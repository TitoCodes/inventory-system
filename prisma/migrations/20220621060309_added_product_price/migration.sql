/*
  Warnings:

  - Added the required column `updatedBy` to the `Product` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Product" ADD COLUMN     "updatedBy" INTEGER NOT NULL;

-- CreateTable
CREATE TABLE "Price" (
    "id" SERIAL NOT NULL,
    "uuid" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "updatedBy" INTEGER NOT NULL,
    "suggestedRetailPrice" DECIMAL(65,30) NOT NULL,
    "originalPrice" DECIMAL(65,30) NOT NULL,
    "discountedPrice" DECIMAL(65,30) NOT NULL,
    "productId" INTEGER NOT NULL,

    CONSTRAINT "Price_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Price_productId_key" ON "Price"("productId");

-- AddForeignKey
ALTER TABLE "Price" ADD CONSTRAINT "Price_productId_fkey" FOREIGN KEY ("productId") REFERENCES "Product"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
