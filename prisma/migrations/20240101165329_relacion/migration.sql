/*
  Warnings:

  - A unique constraint covering the columns `[variableId]` on the table `Stock` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "Stock_variableId_key" ON "Stock"("variableId");
