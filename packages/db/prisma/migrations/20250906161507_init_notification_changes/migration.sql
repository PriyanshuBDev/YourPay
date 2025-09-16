/*
  Warnings:

  - Changed the type of `type` on the `Notification` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.

*/
-- CreateEnum
CREATE TYPE "public"."NotificationType" AS ENUM ('Transaction', 'Reminder', 'System', 'Custom');

-- DropForeignKey
ALTER TABLE "public"."Notification" DROP CONSTRAINT "Notification_senderId_fkey";

-- AlterTable
ALTER TABLE "public"."Notification" ADD COLUMN     "onRampTransactionId" TEXT,
ADD COLUMN     "p2pTransactionId" TEXT,
DROP COLUMN "type",
ADD COLUMN     "type" "public"."NotificationType" NOT NULL,
ALTER COLUMN "senderId" DROP NOT NULL;

-- AddForeignKey
ALTER TABLE "public"."Notification" ADD CONSTRAINT "Notification_senderId_fkey" FOREIGN KEY ("senderId") REFERENCES "public"."User"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."Notification" ADD CONSTRAINT "Notification_onRampTransactionId_fkey" FOREIGN KEY ("onRampTransactionId") REFERENCES "public"."OnRampTransaction"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."Notification" ADD CONSTRAINT "Notification_p2pTransactionId_fkey" FOREIGN KEY ("p2pTransactionId") REFERENCES "public"."P2PTransaction"("id") ON DELETE SET NULL ON UPDATE CASCADE;
