/*
  Warnings:

  - Added the required column `region` to the `school` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "school" ADD COLUMN     "region" CHAR(10) NOT NULL;
