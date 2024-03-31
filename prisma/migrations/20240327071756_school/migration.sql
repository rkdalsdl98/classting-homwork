/*
  Warnings:

  - You are about to drop the column `newsId` on the `newsdetail` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[detailId]` on the table `news` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `detailId` to the `news` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "newsdetail" DROP CONSTRAINT "newsdetail_newsId_fkey";

-- DropIndex
DROP INDEX "newsdetail_newsId_key";

-- AlterTable
ALTER TABLE "news" ADD COLUMN     "detailId" CHAR(32) NOT NULL;

-- AlterTable
ALTER TABLE "newsdetail" DROP COLUMN "newsId";

-- CreateIndex
CREATE UNIQUE INDEX "news_detailId_key" ON "news"("detailId");

-- AddForeignKey
ALTER TABLE "news" ADD CONSTRAINT "news_detailId_fkey" FOREIGN KEY ("detailId") REFERENCES "newsdetail"("uuid") ON DELETE RESTRICT ON UPDATE CASCADE;
