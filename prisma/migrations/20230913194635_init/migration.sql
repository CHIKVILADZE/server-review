/*
  Warnings:

  - You are about to drop the column `bookId` on the `like` table. All the data in the column will be lost.
  - You are about to drop the column `gameId` on the `like` table. All the data in the column will be lost.
  - You are about to drop the column `movieId` on the `like` table. All the data in the column will be lost.

*/
-- DropForeignKey
ALTER TABLE `like` DROP FOREIGN KEY `Like_bookId_fkey`;

-- DropForeignKey
ALTER TABLE `like` DROP FOREIGN KEY `Like_gameId_fkey`;

-- DropForeignKey
ALTER TABLE `like` DROP FOREIGN KEY `Like_movieId_fkey`;

-- AlterTable
ALTER TABLE `like` DROP COLUMN `bookId`,
    DROP COLUMN `gameId`,
    DROP COLUMN `movieId`;
