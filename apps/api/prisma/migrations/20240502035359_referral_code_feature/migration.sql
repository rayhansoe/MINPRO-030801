/*
  Warnings:

  - A unique constraint covering the columns `[referral_code]` on the table `users` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `referral_code` to the `users` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE `users` ADD COLUMN `referral_code` VARCHAR(32) NOT NULL,
    ADD COLUMN `register_code` VARCHAR(32) NULL;

-- CreateIndex
CREATE UNIQUE INDEX `users_referral_code_key` ON `users`(`referral_code`);

-- CreateIndex
CREATE INDEX `display_name` ON `users`(`display_name`);

-- CreateIndex
CREATE INDEX `referral_code` ON `users`(`referral_code`);

-- CreateIndex
CREATE INDEX `register_code` ON `users`(`register_code`);

-- AddForeignKey
ALTER TABLE `users` ADD CONSTRAINT `users_register_code_fkey` FOREIGN KEY (`register_code`) REFERENCES `users`(`referral_code`) ON DELETE SET NULL ON UPDATE CASCADE;
