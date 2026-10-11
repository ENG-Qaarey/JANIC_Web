import prisma from "@/lib/db/prisma";
import { ContentStatus, Prisma } from "@prisma/client";

export interface ResearchAuthorData {
  id?: string;
  name: string;
  avatar?: string;
  affiliation?: string;
  link?: string;
}

async function attachStatsToPapers(papers: any[]) {
  if (!papers || papers.length === 0) return [];
  const paperIds = papers.map((p) => p.id);
  const inPlaceholders = paperIds.map(() => "?").join(",");

  const commentsMap: Record<string, number> = {};
  const likesMap: Record<string, number> = {};
  const ratingsMap: Record<string, number[]> = {};
  const extraDataMap: Record<string, { authorsData?: string; allowComments?: boolean; allowInteractions?: boolean }> = {};

  try {
    const [rawComments, rawLikes, rawRatings, rawExtras] = await Promise.all([
      prisma.$queryRawUnsafe<any[]>(
        `SELECT paperId, COUNT(*) as cnt FROM researchcomment WHERE paperId IN (${inPlaceholders}) GROUP BY paperId`,
        ...paperIds
      ).catch(() => []),
      prisma.$queryRawUnsafe<any[]>(
        `SELECT paperId, COUNT(*) as cnt FROM researchlike WHERE paperId IN (${inPlaceholders}) GROUP BY paperId`,
        ...paperIds
      ).catch(() => []),
      prisma.$queryRawUnsafe<any[]>(
        `SELECT paperId, stars FROM researchrating WHERE paperId IN (${inPlaceholders})`,
        ...paperIds
      ).catch(() => []),
      prisma.$queryRawUnsafe<any[]>(
        `SELECT id, authorsData, allowComments, allowInteractions FROM ResearchPaper WHERE id IN (${inPlaceholders})`,
        ...paperIds
      ).catch(() => []),
    ]);

    for (const c of rawComments || []) {
      if (c && c.paperId) commentsMap[c.paperId] = Number(c.cnt || 0);
    }
    for (const l of rawLikes || []) {
      if (l && l.paperId) likesMap[l.paperId] = Number(l.cnt || 0);
    }
    for (const r of rawRatings || []) {
      if (r && r.paperId) {
        if (!ratingsMap[r.paperId]) ratingsMap[r.paperId] = [];
        ratingsMap[r.paperId].push(Number(r.stars));
      }
    }
    for (const a of rawExtras || []) {
      if (a && a.id) {
        extraDataMap[a.id] = {
          authorsData: a.authorsData,
          allowComments: a.allowComments !== undefined ? Boolean(a.allowComments) : true,
          allowInteractions: a.allowInteractions !== undefined ? Boolean(a.allowInteractions) : true,
        };
      }
    }
  } catch {
    // fallback
  }

  return papers.map((paper) => {
    const starsList = ratingsMap[paper.id] || [];
    const avgRating =
      starsList.length > 0
        ? Number(
            (starsList.reduce((acc, s) => acc + s, 0) / starsList.length).toFixed(1)
          )
        : 0;

    const extra = extraDataMap[paper.id];
    const rawAuthorsData = paper.authorsData || extra?.authorsData;
    const allowComments = paper.allowComments ?? extra?.allowComments ?? true;
    const allowInteractions = paper.allowInteractions ?? extra?.allowInteractions ?? true;

    let authorsList: ResearchAuthorData[] = [];
    if (rawAuthorsData) {
      try {
        authorsList =
          typeof rawAuthorsData === "string"
            ? JSON.parse(rawAuthorsData)
            : rawAuthorsData;
      } catch {
        authorsList = [];
      }
    }

    if (authorsList.length === 0 && paper.authors) {
      const rawNames = paper.authors.split(",").map((s: string) => s.trim()).filter(Boolean);
      authorsList = rawNames.map((name: string) => ({
        name,
        affiliation: paper.journalOrConference || "Faculty of CS & IT, Jazeera University",
      }));
    }

    return {
      ...paper,
      authorsData: rawAuthorsData,
      authorsList,
      allowComments,
      allowInteractions,
      stats: {
        commentsCount: commentsMap[paper.id] || 0,
        likesCount: likesMap[paper.id] || 0,
        ratingsCount: starsList.length,
        avgRating,
      },
    };
  });
}

export class ResearchRepository {
  static async findPublished(options?: {
    category?: string;
    isFeatured?: boolean;
    limit?: number;
  }) {
    const where: Prisma.ResearchPaperWhereInput = {
      status: ContentStatus.PUBLISHED,
    };

    if (options?.category && options.category !== "all") {
      where.category = { contains: options.category };
    }

    if (options?.isFeatured !== undefined) {
      where.isFeatured = options.isFeatured;
    }

    const papers = await prisma.researchPaper.findMany({
      where,
      orderBy: [{ isFeatured: "desc" }, { publicationDate: "desc" }],
      take: options?.limit,
    });

    return attachStatsToPapers(papers);
  }

  static async findBySlug(slug: string) {
    const paper = await prisma.researchPaper.findUnique({
      where: { slug },
    });

    if (!paper) return null;
    const [withStats] = await attachStatsToPapers([paper]);
    return withStats || null;
  }

  static async findById(id: string) {
    const paper = await prisma.researchPaper.findUnique({
      where: { id },
    });

    if (!paper) return null;
    const [withStats] = await attachStatsToPapers([paper]);
    return withStats || null;
  }

  static async findAllAdmin(options?: {
    status?: ContentStatus;
    search?: string;
  }) {
    const where: Prisma.ResearchPaperWhereInput = {};
    if (options?.status) where.status = options.status;
    if (options?.search) {
      where.OR = [
        { title: { contains: options.search } },
        { authors: { contains: options.search } },
        { category: { contains: options.search } },
        { journalOrConference: { contains: options.search } },
      ];
    }

    const papers = await prisma.researchPaper.findMany({
      where,
      orderBy: { updatedAt: "desc" },
    });

    return attachStatsToPapers(papers);
  }

  static async create(data: Prisma.ResearchPaperCreateInput) {
    try {
      return await prisma.researchPaper.create({ data });
    } catch (err: any) {
      const msg = err?.message || "";
      if (
        msg.includes("authorsData") ||
        msg.includes("allowComments") ||
        msg.includes("allowInteractions") ||
        msg.includes("Unknown argument")
      ) {
        const { authorsData, allowComments, allowInteractions, ...withoutExtras } = data as any;
        const created = await prisma.researchPaper.create({ data: withoutExtras });

        const sets: string[] = [];
        const params: any[] = [];

        if (authorsData) {
          sets.push("authorsData = ?");
          params.push(typeof authorsData === "string" ? authorsData : JSON.stringify(authorsData));
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
              `UPDATE ResearchPaper SET ${sets.join(", ")} WHERE id = ?`,
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

  static async update(id: string, data: Prisma.ResearchPaperUpdateInput) {
    try {
      return await prisma.researchPaper.update({ where: { id }, data });
    } catch (err: any) {
      const msg = err?.message || "";
      if (
        msg.includes("authorsData") ||
        msg.includes("allowComments") ||
        msg.includes("allowInteractions") ||
        msg.includes("Unknown argument")
      ) {
        const { authorsData, allowComments, allowInteractions, ...withoutExtras } = data as any;
        const updated = await prisma.researchPaper.update({
          where: { id },
          data: withoutExtras,
        });

        const sets: string[] = [];
        const params: any[] = [];

        if (authorsData !== undefined) {
          sets.push("authorsData = ?");
          params.push(typeof authorsData === "string" ? authorsData : JSON.stringify(authorsData));
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
              `UPDATE ResearchPaper SET ${sets.join(", ")} WHERE id = ?`,
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
    return prisma.researchPaper.delete({ where: { id } });
  }
}
