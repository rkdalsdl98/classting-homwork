/*
  Warnings:

  - You are about to drop the column `detailId` on the `news` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[newsId]` on the table `newsdetail` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `newsId` to the `newsdetail` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "news" DROP CONSTRAINT "news_detailId_fkey";

-- DropIndex
DROP INDEX "news_detailId_key";

-- AlterTable
ALTER TABLE "news" DROP COLUMN "detailId";

-- AlterTable
ALTER TABLE "newsdetail" ADD COLUMN     "newsId" CHAR(32) NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "newsdetail_newsId_key" ON "newsdetail"("newsId");

-- AddForeignKey
ALTER TABLE "newsdetail" ADD CONSTRAINT "newsdetail_newsId_fkey" FOREIGN KEY ("newsId") REFERENCES "news"("uuid") ON DELETE CASCADE ON UPDATE NO ACTION;
