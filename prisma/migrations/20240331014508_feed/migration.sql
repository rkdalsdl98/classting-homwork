/*
  Warnings:

  - You are about to drop the column `userId` on the `newsfeed` table. All the data in the column will be lost.
  - Added the required column `email` to the `newsfeed` table without a default value. This is not possible if the table is not empty.

*/
-- DropIndex
DROP INDEX "newsfeed_uuid_userId_idx";

-- AlterTable
ALTER TABLE "newsfeed" DROP COLUMN "userId",
ADD COLUMN     "email" TEXT NOT NULL;

-- CreateIndex
CREATE INDEX "newsfeed_uuid_email_idx" ON "newsfeed"("uuid", "email");
