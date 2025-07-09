-- AlterTable
ALTER TABLE "orders" ADD COLUMN     "total_actual_price" INTEGER NOT NULL DEFAULT 0,
ADD COLUMN     "total_price" INTEGER NOT NULL DEFAULT 0;
