/*
  Warnings:

  - You are about to drop the column `desc` on the `book` table. All the data in the column will be lost.
  - You are about to drop the column `title` on the `book` table. All the data in the column will be lost.
  - You are about to drop the column `desc` on the `game` table. All the data in the column will be lost.
  - You are about to drop the column `title` on the `game` table. All the data in the column will be lost.
  - You are about to drop the column `desc` on the `movie` table. All the data in the column will be lost.
  - You are about to drop the column `title` on the `movie` table. All the data in the column will be lost.
  - Added the required column `name` to the `Book` table without a default value. This is not possible if the table is not empty.
  - Added the required column `rating` to the `Book` table without a default value. This is not possible if the table is not empty.
  - Added the required column `text` to the `Book` table without a default value. This is not possible if the table is not empty.
  - Added the required column `name` to the `Game` table without a default value. This is not possible if the table is not empty.
  - Added the required column `rating` to the `Game` table without a default value. This is not possible if the table is not empty.
  - Added the required column `text` to the `Game` table without a default value. This is not possible if the table is not empty.
  - Added the required column `name` to the `Movie` table without a default value. This is not possible if the table is not empty.
  - Added the required column `rating` to the `Movie` table without a default value. This is not possible if the table is not empty.
  - Added the required column `text` to the `Movie` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE `book` DROP COLUMN `desc`,
    DROP COLUMN `title`,
    ADD COLUMN `name` VARCHAR(191) NOT NULL,
    ADD COLUMN `rating` VARCHAR(191) NOT NULL,
    ADD COLUMN `text` VARCHAR(191) NOT NULL;

-- AlterTable
ALTER TABLE `game` DROP COLUMN `desc`,
    DROP COLUMN `title`,
    ADD COLUMN `name` VARCHAR(191) NOT NULL,
    ADD COLUMN `rating` VARCHAR(191) NOT NULL,
    ADD COLUMN `text` VARCHAR(191) NOT NULL;

-- AlterTable
ALTER TABLE `movie` DROP COLUMN `desc`,
    DROP COLUMN `title`,
    ADD COLUMN `name` VARCHAR(191) NOT NULL,
    ADD COLUMN `rating` VARCHAR(191) NOT NULL,
    ADD COLUMN `text` VARCHAR(191) NOT NULL;
