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
  const inPlaceholders = programIds.map(() => "?").join(",");

  const commentsMap: Record<string, number> = {};
  const likesMap: Record<string, number> = {};
  const ratingsMap: Record<string, number[]> = {};
  const extraColsMap: Record<string, { trainers?: string; startDate?: Date | null; endDate?: Date | null; allowComments?: boolean; allowInteractions?: boolean }> = {};

  try {
    const [rawComments, rawLikes, rawRatings, rawExtras] = await Promise.all([
      prisma.$queryRawUnsafe<any[]>(
        `SELECT trainingId, COUNT(*) as cnt FROM trainingcomment WHERE trainingId IN (${inPlaceholders}) GROUP BY trainingId`,
        ...programIds
      ).catch(() => []),
      prisma.$queryRawUnsafe<any[]>(
        `SELECT trainingId, COUNT(*) as cnt FROM traininglike WHERE trainingId IN (${inPlaceholders}) GROUP BY trainingId`,
        ...programIds
      ).catch(() => []),
      prisma.$queryRawUnsafe<any[]>(
        `SELECT trainingId, stars FROM trainingrating WHERE trainingId IN (${inPlaceholders})`,
        ...programIds
      ).catch(() => []),
      prisma.$queryRawUnsafe<any[]>(
        `SELECT id, trainers, startDate, endDate, allowComments, allowInteractions FROM TrainingProgram WHERE id IN (${inPlaceholders})`,
        ...programIds
      ).catch(() => []),
    ]);

    for (const c of rawComments || []) {
      if (c && c.trainingId) commentsMap[c.trainingId] = Number(c.cnt || 0);
    }
    for (const l of rawLikes || []) {
      if (l && l.trainingId) likesMap[l.trainingId] = Number(l.cnt || 0);
    }
    for (const r of rawRatings || []) {
      if (r && r.trainingId) {
        if (!ratingsMap[r.trainingId]) ratingsMap[r.trainingId] = [];
        ratingsMap[r.trainingId].push(Number(r.stars));
      }
    }
    for (const x of rawExtras || []) {
      if (x && x.id) {
        extraColsMap[x.id] = {
          trainers: x.trainers,
          startDate: x.startDate,
          endDate: x.endDate,
          allowComments: x.allowComments !== undefined ? Boolean(x.allowComments) : true,
          allowInteractions: x.allowInteractions !== undefined ? Boolean(x.allowInteractions) : true,
        };
      }
    }
  } catch {
    // fallback
  }

  return programs.map((program) => {
    const starsList = ratingsMap[program.id] || [];
    const avgRating =
      starsList.length > 0
        ? Number(
            (starsList.reduce((acc, s) => acc + s, 0) / starsList.length).toFixed(1)
          )
        : 0;

    const extra = extraColsMap[program.id];
    const trainersRaw = program.trainers || extra?.trainers;
    const startDate = program.startDate ?? extra?.startDate;
    const endDate = program.endDate ?? extra?.endDate;
    const allowComments = program.allowComments ?? extra?.allowComments ?? true;
    const allowInteractions = program.allowInteractions ?? extra?.allowInteractions ?? true;

    let trainersList: TrainerData[] = [];
    if (trainersRaw) {
      try {
        trainersList =
          typeof trainersRaw === "string"
            ? JSON.parse(trainersRaw)
            : trainersRaw;
      } catch {
        trainersList = [];
      }
    }

    return {
      ...program,
      startDate,
      endDate,
      trainers: trainersRaw,
      trainersList,
      allowComments,
      allowInteractions,
      stats: {
        commentsCount: commentsMap[program.id] || 0,
        likesCount: likesMap[program.id] || 0,
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
