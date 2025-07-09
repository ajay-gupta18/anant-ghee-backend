-- CreateTable
CREATE TABLE "payment" (
    "id" SERIAL NOT NULL,
    "amount" INTEGER NOT NULL,
    "amount_due" INTEGER NOT NULL,
    "amount_paid" INTEGER NOT NULL,
    "attempts" INTEGER NOT NULL,
    "currency" TEXT NOT NULL,
    "entity" TEXT NOT NULL,
    "payment_order_id" TEXT NOT NULL,
    "receipt" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "payment_pkey" PRIMARY KEY ("id")
);
