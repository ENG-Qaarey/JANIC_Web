-- Community Services module
-- Creates only new tables/enums; does not alter or drop existing data.






-- CreateTable
CREATE TABLE `ServiceCategory` (
    `id` VARCHAR(191) NOT NULL,
    `name` VARCHAR(191) NOT NULL,
    `description` TEXT NULL,
    `icon` VARCHAR(191) NULL,
    `order` INTEGER NOT NULL DEFAULT 0,
    `isActive` BOOLEAN NOT NULL DEFAULT true,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    UNIQUE INDEX `ServiceCategory_name_key`(`name`),
    INDEX `ServiceCategory_isActive_order_idx`(`isActive`, `order`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Service` (
    `id` VARCHAR(191) NOT NULL,
    `categoryId` VARCHAR(191) NOT NULL,
    `name` VARCHAR(191) NOT NULL,
    `description` TEXT NULL,
    `order` INTEGER NOT NULL DEFAULT 0,
    `isActive` BOOLEAN NOT NULL DEFAULT true,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    INDEX `Service_categoryId_isActive_order_idx`(`categoryId`, `isActive`, `order`),
    PRIMARY KEY (`id`),
    CONSTRAINT `Service_categoryId_fkey` FOREIGN KEY (`categoryId`) REFERENCES `ServiceCategory`(`id`) ON DELETE CASCADE ON UPDATE CASCADE
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `ServiceRequest` (
    `id` VARCHAR(191) NOT NULL,
    `requestNumber` VARCHAR(191) NOT NULL,
    `organizationName` VARCHAR(191) NOT NULL,
    `organizationType` ENUM('FOR_PROFIT', 'NONPROFIT') NOT NULL,
    `organizationCategory` ENUM('PRIVATE_COMPANY', 'STARTUP_SMALL_BUSINESS', 'NGO', 'COMMUNITY_BASED_ORGANIZATION', 'EDUCATIONAL_INSTITUTION', 'FOUNDATION_CHARITY', 'YOUTH_ORGANIZATION', 'OTHER') NOT NULL,
    `contactPerson` VARCHAR(191) NOT NULL,
    `email` VARCHAR(191) NOT NULL,
    `phone` VARCHAR(191) NOT NULL,
    `website` VARCHAR(191) NULL,
    `country` VARCHAR(191) NOT NULL,
    `city` VARCHAR(191) NOT NULL,
    `address` VARCHAR(191) NULL,
    `serviceCategoryId` VARCHAR(191) NOT NULL,
    `serviceId` VARCHAR(191) NOT NULL,
    `requestTitle` VARCHAR(191) NOT NULL,
    `description` TEXT NOT NULL,
    `expectedOutcomes` TEXT NULL,
    `beneficiaries` TEXT NULL,
    `startDate` DATETIME(3) NULL,
    `preferredCompletionDate` DATETIME(3) NULL,
    `budget` VARCHAR(191) NULL,
    `preferredContactMethod` VARCHAR(191) NOT NULL DEFAULT 'EMAIL',
    `businessSector` VARCHAR(191) NULL,
    `businessOutcome` TEXT NULL,
    `isExistingBusiness` BOOLEAN NULL,
    `commercialRequirements` TEXT NULL,
    `organizationMission` TEXT NULL,
    `socialProblem` TEXT NULL,
    `targetBeneficiaries` TEXT NULL,
    `socialImpact` TEXT NULL,
    `fundingStatus` ENUM('FUNDED', 'PARTIALLY_FUNDED', 'SEEKING_FUNDING', 'NOT_YET_DETERMINED') NULL,
    `isExistingCommunityProject` BOOLEAN NULL,
    `additionalNotes` TEXT NULL,
    `status` ENUM('SUBMITTED', 'UNDER_REVIEW', 'ADDITIONAL_INFO_REQUIRED', 'APPROVED', 'IN_PROGRESS', 'COMPLETED', 'REJECTED', 'CANCELLED') NOT NULL DEFAULT 'SUBMITTED',
    `priority` ENUM('LOW', 'MEDIUM', 'HIGH', 'URGENT') NOT NULL DEFAULT 'MEDIUM',
    `rejectionReason` TEXT NULL,
    `submittedById` VARCHAR(191) NULL,
    `assignedToId` VARCHAR(191) NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,
    `reviewedAt` DATETIME(3) NULL,
    `completedAt` DATETIME(3) NULL,

    UNIQUE INDEX `ServiceRequest_requestNumber_key`(`requestNumber`),
    INDEX `ServiceRequest_status_createdAt_idx`(`status`, `createdAt`),
    INDEX `ServiceRequest_organizationType_status_idx`(`organizationType`, `status`),
    INDEX `ServiceRequest_serviceCategoryId_status_idx`(`serviceCategoryId`, `status`),
    INDEX `ServiceRequest_assignedToId_status_idx`(`assignedToId`, `status`),
    PRIMARY KEY (`id`),
    CONSTRAINT `ServiceRequest_serviceCategoryId_fkey` FOREIGN KEY (`serviceCategoryId`) REFERENCES `ServiceCategory`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT `ServiceRequest_serviceId_fkey` FOREIGN KEY (`serviceId`) REFERENCES `Service`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `ServiceRequestNote` (
    `id` VARCHAR(191) NOT NULL,
    `requestId` VARCHAR(191) NOT NULL,
    `authorId` VARCHAR(191) NOT NULL,
    `content` TEXT NOT NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    INDEX `ServiceRequestNote_requestId_idx`(`requestId`),
    PRIMARY KEY (`id`),
    CONSTRAINT `ServiceRequestNote_requestId_fkey` FOREIGN KEY (`requestId`) REFERENCES `ServiceRequest`(`id`) ON DELETE CASCADE ON UPDATE CASCADE
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `ServiceRequestAttachment` (
    `id` VARCHAR(191) NOT NULL,
    `requestId` VARCHAR(191) NOT NULL,
    `fileName` VARCHAR(191) NOT NULL,
    `fileUrl` VARCHAR(191) NOT NULL,
    `fileSize` INTEGER NOT NULL,
    `mimeType` VARCHAR(191) NOT NULL,
    `uploadedById` VARCHAR(191) NOT NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    INDEX `ServiceRequestAttachment_requestId_idx`(`requestId`),
    PRIMARY KEY (`id`),
    CONSTRAINT `ServiceRequestAttachment_requestId_fkey` FOREIGN KEY (`requestId`) REFERENCES `ServiceRequest`(`id`) ON DELETE CASCADE ON UPDATE CASCADE
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `ServiceRequestHistory` (
    `id` VARCHAR(191) NOT NULL,
    `requestId` VARCHAR(191) NOT NULL,
    `action` VARCHAR(191) NOT NULL,
    `fromStatus` ENUM('SUBMITTED', 'UNDER_REVIEW', 'ADDITIONAL_INFO_REQUIRED', 'APPROVED', 'IN_PROGRESS', 'COMPLETED', 'REJECTED', 'CANCELLED') NULL,
    `toStatus` ENUM('SUBMITTED', 'UNDER_REVIEW', 'ADDITIONAL_INFO_REQUIRED', 'APPROVED', 'IN_PROGRESS', 'COMPLETED', 'REJECTED', 'CANCELLED') NULL,
    `actorId` VARCHAR(191) NOT NULL,
    `notes` TEXT NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    INDEX `ServiceRequestHistory_requestId_createdAt_idx`(`requestId`, `createdAt`),
    PRIMARY KEY (`id`),
    CONSTRAINT `ServiceRequestHistory_requestId_fkey` FOREIGN KEY (`requestId`) REFERENCES `ServiceRequest`(`id`) ON DELETE CASCADE ON UPDATE CASCADE
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- Seed default service catalog
INSERT INTO `ServiceCategory` (`id`, `name`, `description`, `order`, `isActive`, `createdAt`, `updatedAt`) VALUES
('cat_software', 'Software and Application Development', 'Custom software, desktop and mobile applications', 1, true, NOW(3), NOW(3)),
('cat_web', 'Website and Digital Platform Development', 'Modern websites, web apps and digital platforms', 2, true, NOW(3), NOW(3)),
('cat_it', 'IT Consulting and Technical Support', 'Expert guidance, audits and ongoing technical support', 3, true, NOW(3), NOW(3)),
('cat_digital', 'Digital Transformation and Automation', 'Streamlining operations through digital tools', 4, true, NOW(3), NOW(3)),
('cat_training', 'Technology Training and Capacity Building', 'Professional and technical skills development', 5, true, NOW(3), NOW(3)),
('cat_research', 'Research and Innovation', 'Collaborative research, consulting and innovation', 6, true, NOW(3), NOW(3)),
('cat_community', 'Community Technology Programs', 'Technology programs designed for communities', 7, true, NOW(3), NOW(3)),
('cat_collab', 'Project Collaboration and Technical Partnerships', 'Joint projects and long-term technical partnerships', 8, true, NOW(3), NOW(3));

INSERT INTO `Service` (`id`, `categoryId`, `name`, `description`, `order`, `isActive`, `createdAt`, `updatedAt`) VALUES
('svc_web_app', 'cat_software', 'Web Application Development', 'Build secure, scalable web applications', 1, true, NOW(3), NOW(3)),
('svc_mobile_app', 'cat_software', 'Mobile Application Development', 'Native and cross-platform mobile apps', 2, true, NOW(3), NOW(3)),
('svc_custom_system', 'cat_software', 'Custom Software Solutions', 'Bespoke software built around your workflows', 3, true, NOW(3), NOW(3)),
('svc_website', 'cat_web', 'Corporate Website Development', 'Professional, responsive web presence', 1, true, NOW(3), NOW(3)),
('svc_ecommerce', 'cat_web', 'E-commerce Platform', 'Online store and digital commerce solutions', 2, true, NOW(3), NOW(3)),
('svc_portal', 'cat_web', 'Information Portal Development', 'Content portals and database-driven sites', 3, true, NOW(3), NOW(3)),
('svc_it_consult', 'cat_it', 'IT Consulting', 'Technology strategy and infrastructure advice', 1, true, NOW(3), NOW(3)),
('svc_tech_support', 'cat_it', 'Technical Support', 'Ongoing helpdesk and maintenance services', 2, true, NOW(3), NOW(3)),
('svc_network', 'cat_it', 'Network and Infrastructure Setup', 'Network design and system setup', 3, true, NOW(3), NOW(3)),
('svc_automation', 'cat_digital', 'Process Automation', 'Automate repetitive manual processes', 1, true, NOW(3), NOW(3)),
('svc_digital_strategy', 'cat_digital', 'Digital Transformation Strategy', 'Roadmaps for adopting technology effectively', 2, true, NOW(3), NOW(3)),
('svc_cloud', 'cat_digital', 'Cloud and Digital Migration', 'Migrate systems and data to modern platforms', 3, true, NOW(3), NOW(3)),
('svc_prof_training', 'cat_training', 'Professional Technology Training', 'Workforce upskilling for organizations', 1, true, NOW(3), NOW(3)),
('svc_digital_literacy', 'cat_training', 'Digital Literacy Training', 'Basic to advanced digital skills for communities', 2, true, NOW(3), NOW(3)),
('svc_youth_program', 'cat_training', 'Youth Technology Programs', 'Technology education for young people', 3, true, NOW(3), NOW(3)),
('svc_research_support', 'cat_research', 'Research and Technical Consultation', 'Academic research support and expert consultation', 1, true, NOW(3), NOW(3)),
('svc_impact_assessment', 'cat_research', 'Impact Assessment', 'Evaluate social and educational outcomes', 2, true, NOW(3), NOW(3)),
('svc_innovation', 'cat_research', 'Innovation and Product Development', 'Prototype and innovate new products', 3, true, NOW(3), NOW(3)),
('svc_community_tech', 'cat_community', 'Community Digital Tools', 'Digital tools designed for community projects', 1, true, NOW(3), NOW(3)),
('svc_awareness', 'cat_community', 'Technology Awareness Programs', 'Community awareness and outreach programs', 2, true, NOW(3), NOW(3)),
('svc_ngo_system', 'cat_community', 'NGO Information Systems', 'Record and reporting systems for nonprofits', 3, true, NOW(3), NOW(3)),
('svc_joint_project', 'cat_collab', 'Joint Project Collaboration', 'Partner with JANIC on joint initiatives', 1, true, NOW(3), NOW(3)),
('svc_tech_partnership', 'cat_collab', 'Technical Partnership', 'Long-term technical partnership programs', 2, true, NOW(3), NOW(3)),
('svc_innovation_hub', 'cat_collab', 'Innovation Hub Access', 'Access to JANIC innovation facilities and mentorship', 3, true, NOW(3), NOW(3));