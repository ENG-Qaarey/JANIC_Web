import prisma from "@/lib/db/prisma";

export class OrganizationTypeRepository {
  static async findAll() {
    return prisma.organizationType.findMany({
      orderBy: { name: "asc" },
    });
  }

  static async create(name: string) {
    return prisma.organizationType.create({
      data: { name },
    });
  }

  static async delete(id: string) {
    return prisma.organizationType.delete({
      where: { id },
    });
  }
}
