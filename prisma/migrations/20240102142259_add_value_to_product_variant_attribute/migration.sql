/*
  Warnings:

  - A unique constraint covering the columns `[variantId,attributeId,value]` on the table `ProductVariantAttribute` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `value` to the `ProductVariantAttribute` table without a default value. This is not possible if the table is not empty.

*/
-- DropIndex
DROP INDEX "ProductVariantAttribute_variantId_attributeId_key";

-- AlterTable
ALTER TABLE "ProductVariantAttribute" ADD COLUMN     "value" TEXT NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "ProductVariantAttribute_variantId_attributeId_value_key" ON "ProductVariantAttribute"("variantId", "attributeId", "value");
