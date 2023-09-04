/*
  Warnings:

  - Made the column `authMethod` on table `user` required. This step will fail if there are existing NULL values in that column.

*/
-- AlterTable
ALTER TABLE `user` MODIFY `authMethod` VARCHAR(191) NOT NULL;
