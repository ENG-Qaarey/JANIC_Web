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

  const [commentCounts, likeCounts, ratings] = await Promise.all([
    prisma.researchComment.groupBy({
      by: ["paperId"],
      where: { paperId: { in: paperIds } },
      _count: { _all: true },
    }),
    prisma.researchLike.groupBy({
      by: ["paperId"],
      where: { paperId: { in: paperIds } },
      _count: { _all: true },
    }),
    prisma.researchRating.findMany({
      where: { paperId: { in: paperIds } },
      select: { paperId: true, stars: true },
    }),
  ]);

  const commentsMap = new Map<string, number>();
  for (const c of commentCounts) commentsMap.set(c.paperId, c._count._all);

  const likesMap = new Map<string, number>();
  for (const l of likeCounts) likesMap.set(l.paperId, l._count._all);

  const ratingsMap = new Map<string, number[]>();
  for (const r of ratings) {
    const list = ratingsMap.get(r.paperId);
    if (list) list.push(r.stars);
    else ratingsMap.set(r.paperId, [r.stars]);
  }

  return papers.map((paper) => {
    const starsList = ratingsMap.get(paper.id) || [];
    const avgRating =
      starsList.length > 0
        ? Number(
            (starsList.reduce((acc, s) => acc + s, 0) / starsList.length).toFixed(1)
          )
        : 0;

    const rawAuthorsData = paper.authorsData;

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
      authorsList,
      allowComments: paper.allowComments ?? true,
      allowInteractions: paper.allowInteractions ?? true,
      stats: {
        commentsCount: commentsMap.get(paper.id) || 0,
        likesCount: likesMap.get(paper.id) || 0,
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
