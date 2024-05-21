/*
  Warnings:

  - You are about to drop the column `expiredAt` on the `user_vouchers` table. All the data in the column will be lost.
  - You are about to drop the column `expiredCode` on the `user_vouchers` table. All the data in the column will be lost.
  - You are about to drop the column `expiredAt` on the `vouchers` table. All the data in the column will be lost.
  - You are about to drop the column `expiredCode` on the `vouchers` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE `user_vouchers` DROP COLUMN `expiredAt`,
    DROP COLUMN `expiredCode`,
    ADD COLUMN `expired_at` DATETIME(3) NULL,
    ADD COLUMN `expired_code` VARCHAR(191) NULL;

-- AlterTable
ALTER TABLE `vouchers` DROP COLUMN `expiredAt`,
    DROP COLUMN `expiredCode`,
    ADD COLUMN `expired_at` DATETIME(3) NULL,
    ADD COLUMN `expired_code` VARCHAR(191) NULL;
