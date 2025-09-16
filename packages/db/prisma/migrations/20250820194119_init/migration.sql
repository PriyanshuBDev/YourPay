/*
  Warnings:

  - You are about to drop the column `startTime` on the `OnRampTransaction` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "public"."OnRampTransaction" DROP COLUMN "startTime",
ADD COLUMN     "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP;
