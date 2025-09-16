-- AlterTable
ALTER TABLE "public"."User" ADD COLUMN     "profileImg" TEXT;

-- CreateTable
CREATE TABLE "public"."QuickUser" (
    "id" TEXT NOT NULL,
    "qUserId" TEXT NOT NULL,
    "userId" TEXT NOT NULL,

    CONSTRAINT "QuickUser_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "QuickUser_userId_qUserId_key" ON "public"."QuickUser"("userId", "qUserId");

-- AddForeignKey
ALTER TABLE "public"."QuickUser" ADD CONSTRAINT "QuickUser_qUserId_fkey" FOREIGN KEY ("qUserId") REFERENCES "public"."User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."QuickUser" ADD CONSTRAINT "QuickUser_userId_fkey" FOREIGN KEY ("userId") REFERENCES "public"."User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
