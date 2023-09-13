/*
  Warnings:

  - You are about to drop the column `bookId` on the `comment` table. All the data in the column will be lost.
  - You are about to drop the column `gameId` on the `comment` table. All the data in the column will be lost.
  - You are about to drop the column `movieId` on the `comment` table. All the data in the column will be lost.

*/
-- DropForeignKey
ALTER TABLE `comment` DROP FOREIGN KEY `Comment_bookId_fkey`;

-- DropForeignKey
ALTER TABLE `comment` DROP FOREIGN KEY `Comment_gameId_fkey`;

-- DropForeignKey
ALTER TABLE `comment` DROP FOREIGN KEY `Comment_movieId_fkey`;

-- AlterTable
ALTER TABLE `comment` DROP COLUMN `bookId`,
    DROP COLUMN `gameId`,
    DROP COLUMN `movieId`;
