/*
  Warnings:

  - A unique constraint covering the columns `[newsId]` on the table `newsfeed` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "newsfeed_newsId_key" ON "newsfeed"("newsId");

-- AddForeignKey
ALTER TABLE "newsfeed" ADD CONSTRAINT "newsfeed_newsId_fkey" FOREIGN KEY ("newsId") REFERENCES "news"("uuid") ON DELETE RESTRICT ON UPDATE CASCADE;
