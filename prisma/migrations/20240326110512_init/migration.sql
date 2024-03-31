-- CreateTable
CREATE TABLE "school" (
    "uuid" CHAR(32) NOT NULL,
    "name" CHAR(20) NOT NULL,

    CONSTRAINT "school_pkey" PRIMARY KEY ("uuid")
);

-- CreateTable
CREATE TABLE "news" (
    "uuid" CHAR(32) NOT NULL,
    "title" TEXT NOT NULL,
    "schoolId" CHAR(32) NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "news_pkey" PRIMARY KEY ("uuid")
);

-- CreateTable
CREATE TABLE "newsdetail" (
    "uuid" CHAR(32) NOT NULL,
    "contents" TEXT NOT NULL DEFAULT '',
    "views" INTEGER NOT NULL DEFAULT 0,
    "newsId" CHAR(32) NOT NULL,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "newsdetail_pkey" PRIMARY KEY ("uuid")
);

-- CreateTable
CREATE TABLE "user" (
    "uuid" CHAR(32) NOT NULL,
    "email" TEXT NOT NULL,
    "pass" TEXT NOT NULL,
    "authority" INTEGER NOT NULL DEFAULT 1,
    "subschool" TEXT[] DEFAULT ARRAY[]::TEXT[],

    CONSTRAINT "user_pkey" PRIMARY KEY ("uuid")
);

-- CreateIndex
CREATE UNIQUE INDEX "school_name_key" ON "school"("name");

-- CreateIndex
CREATE UNIQUE INDEX "news_schoolId_key" ON "news"("schoolId");

-- CreateIndex
CREATE UNIQUE INDEX "newsdetail_newsId_key" ON "newsdetail"("newsId");

-- CreateIndex
CREATE UNIQUE INDEX "user_email_key" ON "user"("email");

-- AddForeignKey
ALTER TABLE "news" ADD CONSTRAINT "news_schoolId_fkey" FOREIGN KEY ("schoolId") REFERENCES "school"("uuid") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "newsdetail" ADD CONSTRAINT "newsdetail_newsId_fkey" FOREIGN KEY ("newsId") REFERENCES "news"("uuid") ON DELETE RESTRICT ON UPDATE CASCADE;
