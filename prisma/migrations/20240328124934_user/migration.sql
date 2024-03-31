/*
  Warnings:

  - Added the required column `salt` to the `user` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "newsdetail" DROP CONSTRAINT "newsdetail_newsId_fkey";

-- AlterTable
ALTER TABLE "newsdetail" ALTER COLUMN "updatedAt" SET DEFAULT CURRENT_TIMESTAMP;

-- AlterTable
ALTER TABLE "user" ADD COLUMN     "salt" TEXT NOT NULL;

-- AddForeignKey
ALTER TABLE "newsdetail" ADD CONSTRAINT "newsdetail_newsId_fkey" FOREIGN KEY ("newsId") REFERENCES "news"("uuid") ON DELETE CASCADE ON UPDATE CASCADE;
