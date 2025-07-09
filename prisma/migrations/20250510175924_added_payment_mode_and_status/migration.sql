-- CreateEnum
CREATE TYPE "PaymentMode" AS ENUM ('COD', 'UPI', 'NET_BANKING');

-- CreateEnum
CREATE TYPE "PaymentStatus" AS ENUM ('NOT_INITIATED', 'PENDING', 'PROCESSING', 'AUTHORIZED', 'PAID', 'FAILED', 'CANCELLED', 'REFUNDED');

-- AlterTable
ALTER TABLE "orders" ADD COLUMN     "payment_mode" "PaymentMode" NOT NULL DEFAULT 'COD',
ADD COLUMN     "payment_status" "PaymentStatus" NOT NULL DEFAULT 'NOT_INITIATED';
