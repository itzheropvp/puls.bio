/*
  Warnings:

  - You are about to drop the column `totalViews` on the `User` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "User" DROP COLUMN "totalViews";

-- CreateTable
CREATE TABLE "PageAnalytics" (
    "id" TEXT NOT NULL,
    "pageId" TEXT NOT NULL,
    "deviceType" TEXT NOT NULL DEFAULT 'desktop',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "PageAnalytics_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "PageAnalytics_pageId_createdAt_idx" ON "PageAnalytics"("pageId", "createdAt");

-- CreateIndex
CREATE INDEX "PageAnalytics_pageId_deviceType_idx" ON "PageAnalytics"("pageId", "deviceType");

-- AddForeignKey
ALTER TABLE "PageAnalytics" ADD CONSTRAINT "PageAnalytics_pageId_fkey" FOREIGN KEY ("pageId") REFERENCES "Page"("id") ON DELETE CASCADE ON UPDATE CASCADE;
