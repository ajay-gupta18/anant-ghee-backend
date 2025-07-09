/*
  Warnings:

  - A unique constraint covering the columns `[orderId]` on the table `order_tracking` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "order_tracking_orderId_key" ON "order_tracking"("orderId");
