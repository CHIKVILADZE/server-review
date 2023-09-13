/*
  Warnings:

  - Added the required column `group` to the `Book` table without a default value. This is not possible if the table is not empty.
  - Added the required column `group` to the `Game` table without a default value. This is not possible if the table is not empty.
  - Added the required column `group` to the `Movie` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE `book` ADD COLUMN `group` VARCHAR(191) NOT NULL;

-- AlterTable
ALTER TABLE `game` ADD COLUMN `group` VARCHAR(191) NOT NULL;

-- AlterTable
ALTER TABLE `movie` ADD COLUMN `group` VARCHAR(191) NOT NULL;
