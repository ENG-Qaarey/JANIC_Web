import { CommunityServiceRepository } from "@/lib/repositories/community-service.repository";
import { notifyServiceRequestStatusChange } from "@/lib/mailer";
import type {
  ServiceRequestStatus,
  ServiceRequestPriority,
  OrgType,
  OrganizationCategory,
  FundingStatus,
} from "@prisma/client";

const VALID_STATUSES: ServiceRequestStatus[] = [
  "SUBMITTED",
  "UNDER_REVIEW",
  "ADDITIONAL_INFO_REQUIRED",
  "APPROVED",
  "IN_PROGRESS",
  "COMPLETED",
  "REJECTED",
  "CANCELLED",
];

const VALID_ORG_TYPES: OrgType[] = ["FOR_PROFIT", "NONPROFIT"];

const VALID_ORG_CATEGORIES: OrganizationCategory[] = [
  "PRIVATE_COMPANY",
  "STARTUP_SMALL_BUSINESS",
  "NGO",
  "COMMUNITY_BASED_ORGANIZATION",
  "EDUCATIONAL_INSTITUTION",
  "FOUNDATION_CHARITY",
  "YOUTH_ORGANIZATION",
  "OTHER",
];

const VALID_FUNDING_STATUSES: FundingStatus[] = [
  "FUNDED",
  "PARTIALLY_FUNDED",
  "SEEKING_FUNDING",
  "NOT_YET_DETERMINED",
];

const VALID_PRIORITIES: ServiceRequestPriority[] = ["LOW", "MEDIUM", "HIGH", "URGENT"];

const STATUS_TRANSITIONS: Record<ServiceRequestStatus, ServiceRequestStatus[]> = {
  SUBMITTED: ["UNDER_REVIEW", "ADDITIONAL_INFO_REQUIRED", "REJECTED", "CANCELLED"],
  UNDER_REVIEW: ["APPROVED", "ADDITIONAL_INFO_REQUIRED", "REJECTED", "CANCELLED"],
  ADDITIONAL_INFO_REQUIRED: ["UNDER_REVIEW", "REJECTED", "CANCELLED"],
  APPROVED: ["IN_PROGRESS", "CANCELLED"],
  IN_PROGRESS: ["COMPLETED", "CANCELLED"],
  COMPLETED: [],
  REJECTED: [],
  CANCELLED: [],
};

export class CommunityServiceService {
  static validateRequest(data: any, isUpdate = false) {
    const errors: Record<string, string> = {};

    if (!isUpdate || data.organizationName !== undefined) {
      if (!data.organizationName?.trim()) errors.organizationName = "Organization name is required";
      else if (data.organizationName.length > 200) errors.organizationName = "Max 200 characters";
    }

    if (!isUpdate || data.organizationType !== undefined) {
      if (!data.organizationType) errors.organizationType = "Organization type is required";
      else if (!VALID_ORG_TYPES.includes(data.organizationType))
        errors.organizationType = "Invalid organization type";
    }

    if (!isUpdate || data.organizationCategory !== undefined) {
      if (!data.organizationCategory) errors.organizationCategory = "Organization category is required";
      else if (!VALID_ORG_CATEGORIES.includes(data.organizationCategory))
        errors.organizationCategory = "Invalid organization category";
    }

    if (!isUpdate || data.contactPerson !== undefined) {
      if (!data.contactPerson?.trim()) errors.contactPerson = "Contact person is required";
      else if (data.contactPerson.length > 150) errors.contactPerson = "Max 150 characters";
    }

    if (!isUpdate || data.email !== undefined) {
      if (!data.email?.trim()) errors.email = "Email is required";
      else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(data.email)) errors.email = "Invalid email format";
    }

    if (!isUpdate || data.phone !== undefined) {
      if (!data.phone?.trim()) errors.phone = "Phone number is required";
      else if (!/^\+?[\d\s\-()]{7,20}$/.test(data.phone)) errors.phone = "Invalid phone number";
    }

    if (!isUpdate || data.country !== undefined) {
      if (!data.country?.trim()) errors.country = "Country is required";
    }

    if (!isUpdate || data.city !== undefined) {
      if (!data.city?.trim()) errors.city = "City is required";
    }

    if (!isUpdate || data.serviceCategoryId !== undefined) {
      if (!data.serviceCategoryId) errors.serviceCategoryId = "Service category is required";
    }

    if (!isUpdate || data.serviceId !== undefined) {
      if (!data.serviceId) errors.serviceId = "Service is required";
    }

    if (!isUpdate || data.requestTitle !== undefined) {
      if (!data.requestTitle?.trim()) errors.requestTitle = "Request title is required";
      else if (data.requestTitle.length > 200) errors.requestTitle = "Max 200 characters";
    }

    if (!isUpdate || data.description !== undefined) {
      if (!data.description?.trim()) errors.description = "Description is required";
      else if (data.description.length > 5000) errors.description = "Max 5000 characters";
    }

    if (data.website && data.website.length > 300) errors.website = "Max 300 characters";
    if (data.address && data.address.length > 500) errors.address = "Max 500 characters";
    if (data.expectedOutcomes && data.expectedOutcomes.length > 3000) errors.expectedOutcomes = "Max 3000 characters";
    if (data.beneficiaries && data.beneficiaries.length > 2000) errors.beneficiaries = "Max 2000 characters";
    if (data.budget && data.budget.length > 100) errors.budget = "Max 100 characters";
    if (data.additionalNotes && data.additionalNotes.length > 3000) errors.additionalNotes = "Max 3000 characters";

    if (data.fundingStatus && !VALID_FUNDING_STATUSES.includes(data.fundingStatus))
      errors.fundingStatus = "Invalid funding status";

    if (data.startDate && isNaN(Date.parse(data.startDate)))
      errors.startDate = "Invalid start date";

    if (data.preferredCompletionDate && isNaN(Date.parse(data.preferredCompletionDate)))
      errors.preferredCompletionDate = "Invalid completion date";

    if (data.startDate && data.preferredCompletionDate) {
      const start = new Date(data.startDate);
      const completion = new Date(data.preferredCompletionDate);
      if (completion < start) errors.preferredCompletionDate = "Must be after start date";
    }

    return Object.keys(errors).length > 0 ? errors : null;
  }

  static validateStatusTransition(from: ServiceRequestStatus, to: ServiceRequestStatus): boolean {
    return STATUS_TRANSITIONS[from]?.includes(to) ?? false;
  }

  /**
   * Strips empty strings, unknown keys, and normalizes date input before hitting Prisma.
   * Empty strings are invalid for enums (FundingStatus, OrganizationCategory) and dates,
   * and would otherwise surface as an opaque Prisma invocation error.
   */
  static sanitizeRequestPayload(input: Record<string, unknown>): Record<string, unknown> {
    const ALLOWED = new Set([
      "organizationName",
      "organizationType",
      "organizationCategory",
      "contactPerson",
      "email",
      "phone",
      "website",
      "country",
      "city",
      "address",
      "serviceCategoryId",
      "serviceId",
      "requestTitle",
      "description",
      "expectedOutcomes",
      "beneficiaries",
      "startDate",
      "preferredCompletionDate",
      "budget",
      "preferredContactMethod",
      "businessSector",
      "businessOutcome",
      "isExistingBusiness",
      "commercialRequirements",
      "organizationMission",
      "socialProblem",
      "targetBeneficiaries",
      "socialImpact",
      "fundingStatus",
      "isExistingCommunityProject",
      "additionalNotes",
      "submittedById",
    ]);

    const out: Record<string, unknown> = {};

    for (const [key, raw] of Object.entries(input)) {
      if (!ALLOWED.has(key)) continue;

      if (raw === null || raw === undefined) continue;

      // Empty / whitespace-only strings mean "not provided" -> leave the column null.
      if (typeof raw === "string") {
        const trimmed = raw.trim();
        if (trimmed === "") continue;
        if (key === "fundingStatus") {
          if (!VALID_FUNDING_STATUSES.includes(trimmed as FundingStatus)) {
            throw new Error("Invalid funding status");
          }
          out[key] = trimmed;
          continue;
        }
        if (key === "organizationCategory" && !VALID_ORG_CATEGORIES.includes(trimmed as OrganizationCategory)) {
          throw new Error("Invalid organization category");
        }
        if (key === "organizationType" && !VALID_ORG_TYPES.includes(trimmed as OrgType)) {
          throw new Error("Invalid organization type");
        }
        out[key] = trimmed;
        continue;
      }

      // Dates
      if (key === "startDate" || key === "preferredCompletionDate") {
        const d = new Date(raw as string | number | Date);
        if (Number.isNaN(d.getTime())) throw new Error(`Invalid ${key}`);
        out[key] = d;
        continue;
      }

      // Booleans: treat "" / "false" / null consistently
      if (key === "isExistingBusiness" || key === "isExistingCommunityProject") {
        if (raw === "") continue;
        out[key] = raw === true || raw === "true";
        continue;
      }

      out[key] = raw;
    }

    return out;
  }

  static async createRequest(data: any) {
    const errors = this.validateRequest(data);
    if (errors) throw new Error(JSON.stringify(errors));

    const payload = this.sanitizeRequestPayload(data);

    const request = await CommunityServiceRepository.create(payload);
    await CommunityServiceRepository.addHistory(
      request.id,
      "CREATED",
      data.submittedById || "system",
      null,
      "SUBMITTED"
    );
    return request;
  }

  static async updateStatus(
    id: string,
    newStatus: ServiceRequestStatus,
    actorId: string,
    notes?: string
  ) {
    const request = await CommunityServiceRepository.findById(id);
    if (!request) throw new Error("Request not found");

    if (!VALID_STATUSES.includes(newStatus)) throw new Error("Invalid status");

    if (!this.validateStatusTransition(request.status, newStatus))
      throw new Error(`Cannot transition from ${request.status} to ${newStatus}`);

    const updateData: any = { status: newStatus };
    if (newStatus === "UNDER_REVIEW" && !request.reviewedAt) updateData.reviewedAt = new Date();
    if (newStatus === "COMPLETED") updateData.completedAt = new Date();

    const updated = await CommunityServiceRepository.update(id, updateData);
    await CommunityServiceRepository.addHistory(
      id,
      "STATUS_CHANGED",
      actorId,
      request.status,
      newStatus,
      notes
    );

    // Notify the requester. Best-effort — never blocks or rolls back the transition.
    void notifyServiceRequestStatusChange({
      requestNumber: request.requestNumber,
      toStatus: newStatus,
      toEmail: request.email,
      notes,
    });

    return updated;
  }

  static async assignRequest(id: string, assigneeId: string, actorId: string) {
    const updated = await CommunityServiceRepository.update(id, { assignedToId: assigneeId });
    await CommunityServiceRepository.addHistory(id, "ASSIGNED", actorId, null, null, `Assigned to ${assigneeId}`);
    return updated;
  }

  static async setPriority(id: string, priority: ServiceRequestPriority, actorId: string) {
    if (!VALID_PRIORITIES.includes(priority)) throw new Error("Invalid priority");
    const updated = await CommunityServiceRepository.update(id, { priority });
    await CommunityServiceRepository.addHistory(id, "PRIORITY_CHANGED", actorId, null, null, `Priority set to ${priority}`);
    return updated;
  }

  static async rejectRequest(id: string, actorId: string, reason: string) {
    const request = await CommunityServiceRepository.findById(id);
    if (!request) throw new Error("Request not found");

    if (!this.validateStatusTransition(request.status, "REJECTED"))
      throw new Error(`Cannot reject request in status ${request.status}`);

    const updated = await CommunityServiceRepository.update(id, {
      status: "REJECTED",
      rejectionReason: reason,
    });
    await CommunityServiceRepository.addHistory(id, "REJECTED", actorId, request.status, "REJECTED", reason);

    // Tell the requester why, not just that it was rejected.
    void notifyServiceRequestStatusChange({
      requestNumber: request.requestNumber,
      toStatus: "REJECTED",
      toEmail: request.email,
      notes: reason,
    });

    return updated;
  }

  static async addInternalNote(requestId: string, authorId: string, content: string) {
    return CommunityServiceRepository.addNote(requestId, authorId, content);
  }

  static async addAttachment(data: {
    requestId: string;
    fileName: string;
    fileUrl: string;
    fileSize: number;
    mimeType: string;
    uploadedById: string;
  }) {
    const allowedTypes = [
      "application/pdf",
      "application/msword",
      "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
      "image/png",
      "image/jpeg",
      "image/jpg",
    ];
    if (!allowedTypes.includes(data.mimeType)) throw new Error("File type not allowed");
    if (data.fileSize > 10 * 1024 * 1024) throw new Error("File too large (max 10MB)");

    return CommunityServiceRepository.addAttachment(data);
  }

  static async getStats() {
    return CommunityServiceRepository.getStats();
  }

  static async listCategories() {
    return CommunityServiceRepository.listCategories();
  }

  static async createCategory(data: { name: string; description?: string; icon?: string; order?: number }) {
    if (!data.name?.trim()) throw new Error("Category name is required");
    return CommunityServiceRepository.createCategory(data);
  }

  static async updateCategory(id: string, data: any) {
    return CommunityServiceRepository.updateCategory(id, data);
  }

  static async deleteCategory(id: string) {
    return CommunityServiceRepository.deleteCategory(id);
  }

  static async createService(data: { categoryId: string; name: string; description?: string; order?: number }) {
    if (!data.name?.trim()) throw new Error("Service name is required");
    if (!data.categoryId) throw new Error("Category is required");
    return CommunityServiceRepository.createService(data);
  }

  static async updateService(id: string, data: any) {
    return CommunityServiceRepository.updateService(id, data);
  }

  static async deleteService(id: string) {
    return CommunityServiceRepository.deleteService(id);
  }
}
