-- DropForeignKey
ALTER TABLE "news" DROP CONSTRAINT "news_schoolId_fkey";

-- DropForeignKey
ALTER TABLE "newsfeed" DROP CONSTRAINT "newsfeed_newsId_fkey";

-- AddForeignKey
ALTER TABLE "news" ADD CONSTRAINT "news_schoolId_fkey" FOREIGN KEY ("schoolId") REFERENCES "school"("uuid") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "newsfeed" ADD CONSTRAINT "newsfeed_newsId_fkey" FOREIGN KEY ("newsId") REFERENCES "news"("uuid") ON DELETE CASCADE ON UPDATE CASCADE;
