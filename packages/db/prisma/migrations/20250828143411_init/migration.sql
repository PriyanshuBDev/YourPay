/*
  Warnings:

  - Made the column `publicId` on table `User` required. This step will fail if there are existing NULL values in that column.

*/
-- AlterTable
ALTER TABLE "public"."User" ALTER COLUMN "publicId" SET NOT NULL;
