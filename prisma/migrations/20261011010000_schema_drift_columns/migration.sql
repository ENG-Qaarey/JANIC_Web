-- Adds columns that exist in prisma/schema.prisma but were never migrated.
-- Only ADD COLUMN statements so existing rows and data are preserved.
-- MariaDB-compatible: no CREATE TYPE (enums are declared inline).

-- ResearchPaper
ALTER TABLE `ResearchPaper`
    ADD COLUMN `authorsData` TEXT NULL,
    ADD COLUMN `allowComments` BOOLEAN NOT NULL DEFAULT true,
    ADD COLUMN `allowInteractions` BOOLEAN NOT NULL DEFAULT true;

-- TrainingProgram
ALTER TABLE `TrainingProgram`
    ADD COLUMN `startDate` DATETIME(3) NULL,
    ADD COLUMN `endDate` DATETIME(3) NULL,
    ADD COLUMN `trainers` TEXT NULL,
    ADD COLUMN `allowComments` BOOLEAN NOT NULL DEFAULT true,
    ADD COLUMN `allowInteractions` BOOLEAN NOT NULL DEFAULT true;