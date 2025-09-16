/*
  Warnings:

  - You are about to drop the column `number` on the `User` table. All the data in the column will be lost.
  - Made the column `email` on table `User` required. This step will fail if there are existing NULL values in that column.

*/
-- DropIndex
DROP INDEX "public"."User_number_key";

-- AlterTable
ALTER TABLE "public"."User" DROP COLUMN "number",
ALTER COLUMN "email" SET NOT NULL;
