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

  /**
   * Active hubs whose public link is switched on, ordered for public surfaces
   * (main navigation, footer). A hub is absent here while its link toggle is off.
   */
  static async findPublicLinks(): Promise<{ name: string; href: string }[]> {
    const hubs = (await this.findActive()) as any[];
    return hubs
      .filter((h) => typeof h.link === "string" && h.link.trim().length > 0)
      .map((h) => ({ name: h.name as string, href: (h.link as string).trim() }));
  }

  /**
   * Every hub for the public directory, ordered for display. Inactive hubs are
   * included so the page can list them as non-clickable "Inactive" cards.
   */
  static async findDirectory() {
    return (prisma as any).hub.findMany({
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
