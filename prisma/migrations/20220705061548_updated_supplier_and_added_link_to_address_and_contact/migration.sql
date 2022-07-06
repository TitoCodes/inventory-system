/*
  Warnings:

  - You are about to drop the column `supplierAddressId` on the `Supplier` table. All the data in the column will be lost.
  - You are about to drop the column `supplierContactId` on the `Supplier` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "Supplier" DROP COLUMN "supplierAddressId",
DROP COLUMN "supplierContactId",
ADD COLUMN     "addressId" INTEGER,
ADD COLUMN     "contactId" INTEGER;

-- AddForeignKey
ALTER TABLE "Supplier" ADD CONSTRAINT "Supplier_contactId_fkey" FOREIGN KEY ("contactId") REFERENCES "Contact"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Supplier" ADD CONSTRAINT "Supplier_addressId_fkey" FOREIGN KEY ("addressId") REFERENCES "Address"("id") ON DELETE SET NULL ON UPDATE CASCADE;
