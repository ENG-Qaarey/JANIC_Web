import prisma from "@/lib/db/prisma";
import { ContentStatus, Prisma } from "@prisma/client";

export interface TrainerData {
  id?: string;
  name: string;
  bio?: string;
  avatar?: string;
  socials?: {
    linkedin?: string;
    twitter?: string;
    github?: string;
    website?: string;
  };
}

async function attachStatsToPrograms(programs: any[]) {
  if (!programs || programs.length === 0) return [];
  const programIds = programs.map((p) => p.id);

  const [commentCounts, likeCounts, ratings] = await Promise.all([
    prisma.trainingComment.groupBy({
      by: ["trainingId"],
      where: { trainingId: { in: programIds } },
      _count: { _all: true },
    }),
    prisma.trainingLike.groupBy({
      by: ["trainingId"],
      where: { trainingId: { in: programIds } },
      _count: { _all: true },
    }),
    prisma.trainingRating.findMany({
      where: { trainingId: { in: programIds } },
      select: { trainingId: true, stars: true },
    }),
  ]);

  const commentsMap = new Map<string, number>();
  for (const c of commentCounts) commentsMap.set(c.trainingId, c._count._all);

  const likesMap = new Map<string, number>();
  for (const l of likeCounts) likesMap.set(l.trainingId, l._count._all);

  const ratingsMap = new Map<string, number[]>();
  for (const r of ratings) {
    const list = ratingsMap.get(r.trainingId);
    if (list) list.push(r.stars);
    else ratingsMap.set(r.trainingId, [r.stars]);
  }

  return programs.map((program) => {
    const starsList = ratingsMap.get(program.id) || [];
    const avgRating =
      starsList.length > 0
        ? Number(
            (starsList.reduce((acc, s) => acc + s, 0) / starsList.length).toFixed(1)
          )
        : 0;

    let trainersList: TrainerData[] = [];
    if (program.trainers) {
      try {
        trainersList =
          typeof program.trainers === "string"
            ? JSON.parse(program.trainers)
            : program.trainers;
      } catch {
        trainersList = [];
      }
    }

    return {
      ...program,
      trainersList,
      allowComments: program.allowComments ?? true,
      allowInteractions: program.allowInteractions ?? true,
      stats: {
        commentsCount: commentsMap.get(program.id) || 0,
        likesCount: likesMap.get(program.id) || 0,
        ratingsCount: starsList.length,
        avgRating,
      },
    };
  });
}

export class TrainingRepository {
  static async findPublished(options?: {
    category?: string;
    level?: string;
    isFeatured?: boolean;
    limit?: number;
  }) {
    const where: Prisma.TrainingProgramWhereInput = {
      status: ContentStatus.PUBLISHED,
    };

    if (options?.category && options.category !== "all") {
      where.category = { contains: options.category };
    }

    if (options?.level && options.level !== "all") {
      where.level = options.level;
    }

    if (options?.isFeatured !== undefined) {
      where.isFeatured = options.isFeatured;
    }

    const programs = await prisma.trainingProgram.findMany({
      where,
      orderBy: [{ isFeatured: "desc" }, { createdAt: "desc" }],
      take: options?.limit,
    });

    return attachStatsToPrograms(programs);
  }

  static async findBySlug(slug: string) {
    const program = await prisma.trainingProgram.findUnique({
      where: { slug },
    });

    if (!program) return null;
    const [withStats] = await attachStatsToPrograms([program]);
    return withStats || null;
  }

  static async findById(id: string) {
    const program = await prisma.trainingProgram.findUnique({
      where: { id },
    });

    if (!program) return null;
    const [withStats] = await attachStatsToPrograms([program]);
    return withStats || null;
  }

  static async findAllAdmin(options?: {
    status?: ContentStatus;
    search?: string;
  }) {
    const where: Prisma.TrainingProgramWhereInput = {};
    if (options?.status) where.status = options.status;
    if (options?.search) {
      where.OR = [
        { title: { contains: options.search } },
        { category: { contains: options.search } },
        { level: { contains: options.search } },
      ];
    }

    const programs = await prisma.trainingProgram.findMany({
      where,
      orderBy: { updatedAt: "desc" },
    });

    return attachStatsToPrograms(programs);
  }

  static async create(data: Prisma.TrainingProgramCreateInput) {
    try {
      return await prisma.trainingProgram.create({ data });
    } catch (err: any) {
      const msg = err?.message || "";
      if (
        msg.includes("startDate") ||
        msg.includes("endDate") ||
        msg.includes("trainers") ||
        msg.includes("allowComments") ||
        msg.includes("allowInteractions") ||
        msg.includes("Unknown argument")
      ) {
        const { startDate, endDate, trainers, allowComments, allowInteractions, ...withoutNewFields } = data as any;
        const created = await prisma.trainingProgram.create({ data: withoutNewFields });

        const sets: string[] = [];
        const params: any[] = [];

        if (startDate) {
          sets.push("startDate = ?");
          params.push(new Date(startDate));
        }
        if (endDate) {
          sets.push("endDate = ?");
          params.push(new Date(endDate));
        }
        if (trainers) {
          sets.push("trainers = ?");
          params.push(typeof trainers === "string" ? trainers : JSON.stringify(trainers));
        }
        if (allowComments !== undefined) {
          sets.push("allowComments = ?");
          params.push(allowComments ? 1 : 0);
        }
        if (allowInteractions !== undefined) {
          sets.push("allowInteractions = ?");
          params.push(allowInteractions ? 1 : 0);
        }

        if (sets.length > 0) {
          try {
            await prisma.$executeRawUnsafe(
              `UPDATE TrainingProgram SET ${sets.join(", ")} WHERE id = ?`,
              ...params,
              created.id
            );
          } catch {}
        }

        return created;
      }
      throw err;
    }
  }

  static async update(id: string, data: Prisma.TrainingProgramUpdateInput) {
    try {
      return await prisma.trainingProgram.update({ where: { id }, data });
    } catch (err: any) {
      const msg = err?.message || "";
      if (
        msg.includes("startDate") ||
        msg.includes("endDate") ||
        msg.includes("trainers") ||
        msg.includes("allowComments") ||
        msg.includes("allowInteractions") ||
        msg.includes("Unknown argument")
      ) {
        const { startDate, endDate, trainers, allowComments, allowInteractions, ...withoutNewFields } = data as any;
        const updated = await prisma.trainingProgram.update({
          where: { id },
          data: withoutNewFields,
        });

        const sets: string[] = [];
        const params: any[] = [];

        if (startDate !== undefined) {
          sets.push("startDate = ?");
          params.push(startDate ? new Date(startDate) : null);
        }
        if (endDate !== undefined) {
          sets.push("endDate = ?");
          params.push(endDate ? new Date(endDate) : null);
        }
        if (trainers !== undefined) {
          sets.push("trainers = ?");
          params.push(typeof trainers === "string" ? trainers : JSON.stringify(trainers));
        }
        if (allowComments !== undefined) {
          sets.push("allowComments = ?");
          params.push(allowComments ? 1 : 0);
        }
        if (allowInteractions !== undefined) {
          sets.push("allowInteractions = ?");
          params.push(allowInteractions ? 1 : 0);
        }

        if (sets.length > 0) {
          try {
            await prisma.$executeRawUnsafe(
              `UPDATE TrainingProgram SET ${sets.join(", ")} WHERE id = ?`,
              ...params,
              id
            );
          } catch {}
        }

        return updated;
      }
      throw err;
    }
  }

  static async delete(id: string) {
    return prisma.trainingProgram.delete({ where: { id } });
  }
}
