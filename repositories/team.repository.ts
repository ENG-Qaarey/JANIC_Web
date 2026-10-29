import prisma from "@/lib/db/prisma";
import { Prisma } from "@prisma/client";

export class TeamRepository {
  static async findActive() {
    return prisma.teamMember.findMany({
      where: { isActive: true },
      orderBy: { order: "asc" },
    });
  }

  static async findAllAdmin() {
    return prisma.teamMember.findMany({
      orderBy: { order: "asc" },
    });
  }

  static async create(data: any) {
    try {
      return await prisma.teamMember.create({ data });
    } catch (err: any) {
      if (err?.message?.includes("isFounder") || err?.message?.includes("Unknown argument")) {
        const { isFounder, ...rest } = data;
        const item = await prisma.teamMember.create({ data: rest });
        if (isFounder !== undefined) {
          await prisma.$executeRawUnsafe(
            "UPDATE TeamMember SET isFounder = ? WHERE id = ?",
            isFounder ? 1 : 0,
            item.id
          );
          return { ...item, isFounder: Boolean(isFounder) };
        }
        return item;
      }
      throw err;
    }
  }

  static async update(id: string, data: any) {
    try {
      return await prisma.teamMember.update({ where: { id }, data });
    } catch (err: any) {
      if (err?.message?.includes("isFounder") || err?.message?.includes("Unknown argument")) {
        const { isFounder, ...rest } = data;
        const item = await prisma.teamMember.update({ where: { id }, data: rest });
        if (isFounder !== undefined) {
          await prisma.$executeRawUnsafe(
            "UPDATE TeamMember SET isFounder = ? WHERE id = ?",
            isFounder ? 1 : 0,
            id
          );
          return { ...item, isFounder: Boolean(isFounder) };
        }
        return item;
      }
      throw err;
    }
  }

  static async delete(id: string) {
    return prisma.teamMember.delete({ where: { id } });
  }
}
