-- CreateTable
CREATE TABLE "newsfeed" (
    "uuid" CHAR(32) NOT NULL,
    "userId" CHAR(32) NOT NULL,
    "schoolname" TEXT NOT NULL,
    "newsId" CHAR(32) NOT NULL,

    CONSTRAINT "newsfeed_pkey" PRIMARY KEY ("uuid")
);

-- CreateIndex
CREATE INDEX "newsfeed_uuid_userId_idx" ON "newsfeed"("uuid", "userId");
