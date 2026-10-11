import { Prisma } from "@prisma/client";
import { prisma } from "@/lib/db/prisma";
import type {
  ServiceRequest,
  ServiceCategory,
  Service,
  ServiceRequestStatus,
  OrgType,
  ServiceRequestPriority,
} from "@prisma/client";

export class CommunityServiceRepository {
  static async generateRequestNumber(): Promise<string> {
    const year = new Date().getFullYear();
    const prefix = `JANIC-CS-${year}-`;

    const lastRequest = await prisma.serviceRequest.findFirst({
      where: { requestNumber: { startsWith: prefix } },
      orderBy: { requestNumber: "desc" },
      select: { requestNumber: true },
    });

    let nextNum = 1;
    if (lastRequest?.requestNumber) {
      const lastNum = parseInt(lastRequest.requestNumber.replace(prefix, ""), 10);
      if (!isNaN(lastNum)) nextNum = lastNum + 1;
    }

    return `${prefix}${String(nextNum).padStart(4, "0")}`;
  }

  static async create(
    data: Partial<ServiceRequest>
  ): Promise<
    ServiceRequest & {
      serviceCategoryRef: { id: string; name: string };
      serviceRef: { id: string; name: string };
    }
  > {
    // The number is derived from the highest existing value, so two concurrent
    // submissions can compute the same one. Retry on the unique-constraint violation
    // instead of surfacing an error to the user.
    const MAX_ATTEMPTS = 5;
    for (let attempt = 1; attempt <= MAX_ATTEMPTS; attempt++) {
      const requestNumber = await this.generateRequestNumber();
      try {
        return await prisma.serviceRequest.create({
          data: { ...data, requestNumber } as any,
          include: {
            serviceCategoryRef: { select: { id: true, name: true } },
            serviceRef: { select: { id: true, name: true } },
          },
        });
      } catch (err: unknown) {
        const isCollision =
          err instanceof Prisma.PrismaClientKnownRequestError && err.code === "P2002";
        if (!isCollision || attempt === MAX_ATTEMPTS) throw err;
      }
    }
    throw new Error("Could not allocate a unique request number");
  }

  static async findById(id: string) {
    return prisma.serviceRequest.findUnique({
      where: { id },
      include: {
        serviceCategoryRef: true,
        serviceRef: true,
        notes: { orderBy: { createdAt: "desc" } },
        attachments: true,
        history: { orderBy: { createdAt: "desc" } },
      },
    });
  }

  static async findByRequestNumber(requestNumber: string) {
    return prisma.serviceRequest.findUnique({
      where: { requestNumber },
      include: {
        serviceCategoryRef: true,
        serviceRef: true,
        notes: { orderBy: { createdAt: "desc" } },
        attachments: true,
        history: { orderBy: { createdAt: "desc" } },
      },
    });
  }

  static async list(options: {
    page?: number;
    limit?: number;
    status?: ServiceRequestStatus;
    organizationType?: OrgType;
    serviceCategoryId?: string;
    assignedToId?: string;
    priority?: ServiceRequestPriority;
    search?: string;
    sortBy?: string;
    sortOrder?: "asc" | "desc";
  }) {
    const {
      page = 1,
      limit = 20,
      status,
      organizationType,
      serviceCategoryId,
      assignedToId,
      priority,
      search,
      sortBy = "createdAt",
      sortOrder = "desc",
    } = options;

    const where: any = {};
    if (status) where.status = status;
    if (organizationType) where.organizationType = organizationType;
    if (serviceCategoryId) where.serviceCategoryId = serviceCategoryId;
    if (assignedToId) where.assignedToId = assignedToId;
    if (priority) where.priority = priority;
    if (search) {
      where.OR = [
        { organizationName: { contains: search } },
        { contactPerson: { contains: search } },
        { email: { contains: search } },
        { requestTitle: { contains: search } },
        { requestNumber: { contains: search } },
      ];
    }

    const [total, requests] = await Promise.all([
      prisma.serviceRequest.count({ where }),
      prisma.serviceRequest.findMany({
        where,
        include: {
          serviceCategoryRef: { select: { id: true, name: true } },
          serviceRef: { select: { id: true, name: true } },
        },
        orderBy: { [sortBy]: sortOrder },
        skip: (page - 1) * limit,
        take: limit,
      }),
    ]);

    return { total, requests, page, totalPages: Math.ceil(total / limit) };
  }

  static async update(id: string, data: Partial<ServiceRequest>): Promise<ServiceRequest> {
    return prisma.serviceRequest.update({ where: { id }, data });
  }

  static async delete(id: string): Promise<void> {
    await prisma.serviceRequest.delete({ where: { id } });
  }

  static async getStats() {
    const [total, byStatus, byOrgType] = await Promise.all([
      prisma.serviceRequest.count(),
      prisma.serviceRequest.groupBy({
        by: ["status"],
        _count: { status: true },
      }),
      prisma.serviceRequest.groupBy({
        by: ["organizationType"],
        _count: { organizationType: true },
      }),
    ]);

    const statusCounts: Record<string, number> = {};
    for (const s of byStatus) statusCounts[s.status] = s._count.status;

    const orgTypeCounts: Record<string, number> = {};
    for (const o of byOrgType) orgTypeCounts[o.organizationType] = o._count.organizationType;

    return { total, statusCounts, orgTypeCounts };
  }

  static async addNote(requestId: string, authorId: string, content: string) {
    return prisma.serviceRequestNote.create({
      data: { requestId, authorId, content },
    });
  }

  static async addHistory(
    requestId: string,
    action: string,
    actorId: string,
    fromStatus?: ServiceRequestStatus | null,
    toStatus?: ServiceRequestStatus | null,
    notes?: string
  ) {
    return prisma.serviceRequestHistory.create({
      data: { requestId, action, actorId, fromStatus, toStatus, notes },
    });
  }

  static async addAttachment(data: {
    requestId: string;
    fileName: string;
    fileUrl: string;
    fileSize: number;
    mimeType: string;
    uploadedById: string;
  }) {
    return prisma.serviceRequestAttachment.create({ data });
  }

  static async listCategories() {
    return prisma.serviceCategory.findMany({
      where: { isActive: true },
      include: { services: { where: { isActive: true }, orderBy: { order: "asc" } } },
      orderBy: { order: "asc" },
    });
  }

  static async createCategory(data: { name: string; description?: string; icon?: string; order?: number }) {
    return prisma.serviceCategory.create({ data });
  }

  static async updateCategory(id: string, data: Partial<ServiceCategory>) {
    return prisma.serviceCategory.update({ where: { id }, data });
  }

  static async deleteCategory(id: string) {
    return prisma.serviceCategory.delete({ where: { id } });
  }

  static async createService(data: { categoryId: string; name: string; description?: string; order?: number }) {
    return prisma.service.create({ data });
  }

  static async updateService(id: string, data: Partial<Service>) {
    return prisma.service.update({ where: { id }, data });
  }

  static async deleteService(id: string) {
    return prisma.service.delete({ where: { id } });
  }
}
