/*
  Warnings:

  - Added the required column `sumRating` to the `Post` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE `post` ADD COLUMN `sumRating` VARCHAR(191) NOT NULL;
