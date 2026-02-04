/*
  Warnings:

  - You are about to drop the column `avatarEffects` on the `User` table. All the data in the column will be lost.
  - You are about to drop the column `image` on the `User` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[alias]` on the table `User` will be added. If there are existing duplicate values, this will fail.

*/
-- AlterTable
ALTER TABLE "User" DROP COLUMN "avatarEffects",
DROP COLUMN "image",
ADD COLUMN     "alias" TEXT;

-- CreateIndex
CREATE UNIQUE INDEX "User_alias_key" ON "User"("alias");
