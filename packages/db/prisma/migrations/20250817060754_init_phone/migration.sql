/*
  Warnings:

  - You are about to drop the column `email` on the `Merchant` table. All the data in the column will be lost.
  - You are about to drop the column `email` on the `User` table. All the data in the column will be lost.

*/
-- DropIndex
DROP INDEX "public"."Merchant_email_key";

-- DropIndex
DROP INDEX "public"."User_email_key";

-- AlterTable
ALTER TABLE "public"."Merchant" DROP COLUMN "email";

-- AlterTable
ALTER TABLE "public"."User" DROP COLUMN "email",
ALTER COLUMN "number" DROP NOT NULL;
