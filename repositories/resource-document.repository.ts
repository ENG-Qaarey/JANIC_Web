import prisma from "@/lib/db/prisma";

export interface ResourceDocumentInput {
  title: string;
  category: string;
  format?: string;
  size?: string;
  description: string;
  fileUrl?: string | null;
  order?: number;
  isActive?: boolean;
}

export class ResourceDocumentRepository {
  static async findActive() {
    return (prisma as any).resourceDocument.findMany({
      where: { isActive: true },
      orderBy: { order: "asc" },
    });
  }

  static async findAllAdmin() {
    return (prisma as any).resourceDocument.findMany({
      orderBy: { order: "asc" },
    });
  }

  static async findById(id: string) {
    return (prisma as any).resourceDocument.findUnique({
      where: { id },
    });
  }

  static async create(data: ResourceDocumentInput) {
    return (prisma as any).resourceDocument.create({
      data,
    });
  }

  static async update(id: string, data: Partial<ResourceDocumentInput>) {
    return (prisma as any).resourceDocument.update({
      where: { id },
      data,
    });
  }

  static async delete(id: string) {
    return (prisma as any).resourceDocument.delete({
      where: { id },
    });
  }

  static async count() {
    return (prisma as any).resourceDocument.count();
  }
}
