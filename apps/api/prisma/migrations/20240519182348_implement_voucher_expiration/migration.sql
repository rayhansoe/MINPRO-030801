-- AlterTable
ALTER TABLE `user_vouchers` ADD COLUMN `expiredAt` DATETIME(3) NULL,
    ADD COLUMN `expiredCode` VARCHAR(191) NULL;

-- AlterTable
ALTER TABLE `vouchers` ADD COLUMN `expiredAt` DATETIME(3) NULL,
    ADD COLUMN `expiredCode` VARCHAR(191) NULL;
