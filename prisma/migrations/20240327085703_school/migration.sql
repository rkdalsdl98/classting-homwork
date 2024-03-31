/*
  Warnings:

  - You are about to alter the column `title` on the `news` table. The data in that column could be lost. The data in that column will be cast from `Text` to `Char(50)`.

*/
-- DropIndex
DROP INDEX "news_schoolId_key";

-- AlterTable
ALTER TABLE "news" ALTER COLUMN "title" SET DATA TYPE CHAR(50);
