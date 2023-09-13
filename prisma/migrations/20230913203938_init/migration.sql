/*
  Warnings:

  - Added the required column `group` to the `Post` table without a default value. This is not possible if the table is not empty.
  - Added the required column `reviewName` to the `Post` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE `post` ADD COLUMN `group` VARCHAR(191) NOT NULL,
    ADD COLUMN `reviewName` VARCHAR(191) NOT NULL;
