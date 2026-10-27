import prisma from "@/lib/db/prisma";

export interface OpportunityInput {
  title: string;
  type: string;
  deadline: string;
  department: string;
  description: string;
  eligibility: string;
  actionUrl: string;
  actionLabel?: string;
  status?: string;
  order?: number;
  isActive?: boolean;
}

export class OpportunityRepository {
  static async findActive() {
    return (prisma as any).opportunity.findMany({
      where: { isActive: true },
      orderBy: { order: "asc" },
    });
  }

  static async findAllAdmin() {
    return (prisma as any).opportunity.findMany({
      orderBy: { order: "asc" },
    });
  }

  static async findById(id: string) {
    return (prisma as any).opportunity.findUnique({
      where: { id },
    });
  }

  static async create(data: OpportunityInput) {
    return (prisma as any).opportunity.create({
      data,
    });
  }

  static async update(id: string, data: Partial<OpportunityInput>) {
    return (prisma as any).opportunity.update({
      where: { id },
      data,
    });
  }

  static async delete(id: string) {
    return (prisma as any).opportunity.delete({
      where: { id },
    });
  }

  static async count() {
    return (prisma as any).opportunity.count();
  }
}
