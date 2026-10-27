import prisma from "@/lib/db/prisma";

export interface HubInput {
  name: string;
  slug: string;
  category: string;
  description: string;
  icon?: string | null;
  status?: string;
  link?: string | null;
  tags?: string | null;
  order?: number;
  isActive?: boolean;
}

export class HubRepository {
  static async findActive() {
    return (prisma as any).hub.findMany({
      where: { isActive: true },
      orderBy: { order: "asc" },
    });
  }

  static async findAllAdmin() {
    return (prisma as any).hub.findMany({
      orderBy: { order: "asc" },
    });
  }

  static async findById(id: string) {
    return (prisma as any).hub.findUnique({
      where: { id },
    });
  }

  static async findBySlug(slug: string) {
    return (prisma as any).hub.findUnique({
      where: { slug },
    });
  }

  static async create(data: HubInput) {
    return (prisma as any).hub.create({
      data,
    });
  }

  static async update(id: string, data: Partial<HubInput>) {
    return (prisma as any).hub.update({
      where: { id },
      data,
    });
  }

  static async delete(id: string) {
    return (prisma as any).hub.delete({
      where: { id },
    });
  }

  static async count() {
    return (prisma as any).hub.count();
  }
}
