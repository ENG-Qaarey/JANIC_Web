-- Creates the engagement tables declared in prisma/schema.prisma but never migrated.
-- Only CREATE TABLE plus their own foreign keys -- no ALTERs against existing tables,
-- so current data is untouched.

-- CreateTable
CREATE TABLE `TrainingComment` (
    `id` VARCHAR(191) NOT NULL,
    `trainingId` VARCHAR(191) NOT NULL,
    `userId` VARCHAR(191) NOT NULL,
    `userName` VARCHAR(191) NOT NULL,
    `userAvatar` TEXT NULL,
    `message` TEXT NOT NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    INDEX `TrainingComment_trainingId_idx`(`trainingId`),
    INDEX `TrainingComment_userId_idx`(`userId`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `TrainingLike` (
    `id` VARCHAR(191) NOT NULL,
    `trainingId` VARCHAR(191) NOT NULL,
    `userId` VARCHAR(191) NOT NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    INDEX `TrainingLike_trainingId_idx`(`trainingId`),
    UNIQUE INDEX `TrainingLike_trainingId_userId_key`(`trainingId`, `userId`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `TrainingRating` (
    `id` VARCHAR(191) NOT NULL,
    `trainingId` VARCHAR(191) NOT NULL,
    `userId` VARCHAR(191) NOT NULL,
    `stars` INTEGER NOT NULL DEFAULT 5,
    `feedback` TEXT NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    INDEX `TrainingRating_trainingId_idx`(`trainingId`),
    UNIQUE INDEX `TrainingRating_trainingId_userId_key`(`trainingId`, `userId`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `ResearchComment` (
    `id` VARCHAR(191) NOT NULL,
    `paperId` VARCHAR(191) NOT NULL,
    `userId` VARCHAR(191) NOT NULL,
    `userName` VARCHAR(191) NOT NULL,
    `userAvatar` TEXT NULL,
    `message` TEXT NOT NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    INDEX `ResearchComment_paperId_idx`(`paperId`),
    INDEX `ResearchComment_userId_idx`(`userId`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `ResearchLike` (
    `id` VARCHAR(191) NOT NULL,
    `paperId` VARCHAR(191) NOT NULL,
    `userId` VARCHAR(191) NOT NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    INDEX `ResearchLike_paperId_idx`(`paperId`),
    UNIQUE INDEX `ResearchLike_paperId_userId_key`(`paperId`, `userId`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `ResearchRating` (
    `id` VARCHAR(191) NOT NULL,
    `paperId` VARCHAR(191) NOT NULL,
    `userId` VARCHAR(191) NOT NULL,
    `stars` INTEGER NOT NULL DEFAULT 5,
    `feedback` TEXT NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    INDEX `ResearchRating_paperId_idx`(`paperId`),
    UNIQUE INDEX `ResearchRating_paperId_userId_key`(`paperId`, `userId`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `CommentReaction` (
    `id` VARCHAR(191) NOT NULL,
    `commentId` VARCHAR(191) NOT NULL,
    `visitorId` VARCHAR(191) NOT NULL,
    `emoji` VARCHAR(32) NOT NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    INDEX `idx_commentId`(`commentId`),
    UNIQUE INDEX `uq_comment_visitor_emoji`(`commentId`, `visitorId`, `emoji`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

ALTER TABLE `TrainingComment` ADD CONSTRAINT `TrainingComment_trainingId_fkey` FOREIGN KEY (`trainingId`) REFERENCES `TrainingProgram`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE `TrainingLike` ADD CONSTRAINT `TrainingLike_trainingId_fkey` FOREIGN KEY (`trainingId`) REFERENCES `TrainingProgram`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE `TrainingRating` ADD CONSTRAINT `TrainingRating_trainingId_fkey` FOREIGN KEY (`trainingId`) REFERENCES `TrainingProgram`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE `ResearchComment` ADD CONSTRAINT `ResearchComment_paperId_fkey` FOREIGN KEY (`paperId`) REFERENCES `ResearchPaper`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE `ResearchLike` ADD CONSTRAINT `ResearchLike_paperId_fkey` FOREIGN KEY (`paperId`) REFERENCES `ResearchPaper`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE `ResearchRating` ADD CONSTRAINT `ResearchRating_paperId_fkey` FOREIGN KEY (`paperId`) REFERENCES `ResearchPaper`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;
