/*
  Warnings:

  - Added the required column `reset_password_expiration` to the `users` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "users" ADD COLUMN     "reset_password_expiration" TEXT NOT NULL,
ADD COLUMN     "reset_password_token" TEXT;
