import { ResearchRepository, ResearchAuthorData } from "@/repositories/research.repository";
import { slugify } from "@/lib/utils";
import { ContentStatus, Prisma } from "@prisma/client";

export class ResearchService {
  static async getFeaturedPapers(limit = 3) {
    return ResearchRepository.findPublished({ isFeatured: true, limit });
  }

  static async getPublishedPapers(options?: { category?: string; limit?: number }) {
    return ResearchRepository.findPublished(options);
  }

  static async getPaperBySlug(slug: string) {
    return ResearchRepository.findBySlug(slug);
  }

  static async getPaperById(id: string) {
    return ResearchRepository.findById(id);
  }

  static async getAllAdmin(options?: { status?: ContentStatus; search?: string }) {
    return ResearchRepository.findAllAdmin(options);
  }

  static async createPaper(data: {
    title: string;
    abstract: string;
    content?: string;
    authors?: string;
    authorsData?: ResearchAuthorData[] | string;
    category: string;
    publicationDate?: Date | string;
    journalOrConference?: string;
    doi?: string;
    pdfUrl?: string;
    status?: ContentStatus;
    isFeatured?: boolean;
    allowComments?: boolean;
    allowInteractions?: boolean;
  }) {
    let slug = slugify(data.title);
    const existing = await ResearchRepository.findBySlug(slug);
    if (existing) slug = `${slug}-${Date.now().toString().slice(-4)}`;

    let authorsString = data.authors || "";
    let authorsDataString = null;

    if (Array.isArray(data.authorsData)) {
      authorsDataString = JSON.stringify(data.authorsData);
      if (!authorsString) {
        authorsString = data.authorsData.map((a) => a.name).join(", ");
      }
    } else if (typeof data.authorsData === "string") {
      authorsDataString = data.authorsData;
    }

    if (!authorsString) {
      authorsString = "JANIC Research Fellow";
    }

    const createInput: any = {
      title: data.title,
      slug,
      abstract: data.abstract,
      content: data.content || null,
      authors: authorsString,
      authorsData: authorsDataString,
      category: data.category,
      publicationDate: data.publicationDate ? new Date(data.publicationDate) : new Date(),
      journalOrConference: data.journalOrConference || null,
      doi: data.doi || null,
      pdfUrl: data.pdfUrl || null,
      status: data.status || ContentStatus.DRAFT,
      isFeatured: !!data.isFeatured,
      allowComments: data.allowComments !== undefined ? Boolean(data.allowComments) : true,
      allowInteractions: data.allowInteractions !== undefined ? Boolean(data.allowInteractions) : true,
    };

    return ResearchRepository.create(createInput);
  }

  static async updatePaper(id: string, data: any) {
    const updatePayload: any = {};

    if (data.title !== undefined) updatePayload.title = data.title;
    if (data.abstract !== undefined) updatePayload.abstract = data.abstract;
    if (data.content !== undefined) updatePayload.content = data.content;
    if (data.category !== undefined) updatePayload.category = data.category;
    if (data.journalOrConference !== undefined) updatePayload.journalOrConference = data.journalOrConference;
    if (data.doi !== undefined) updatePayload.doi = data.doi;
    if (data.pdfUrl !== undefined) updatePayload.pdfUrl = data.pdfUrl;
    if (data.status !== undefined) updatePayload.status = data.status;
    if (data.isFeatured !== undefined) updatePayload.isFeatured = Boolean(data.isFeatured);
    if (data.allowComments !== undefined) updatePayload.allowComments = Boolean(data.allowComments);
    if (data.allowInteractions !== undefined) updatePayload.allowInteractions = Boolean(data.allowInteractions);

    if (data.publicationDate !== undefined) {
      updatePayload.publicationDate = data.publicationDate ? new Date(data.publicationDate) : null;
    }

    if (data.authorsData !== undefined) {
      if (Array.isArray(data.authorsData)) {
        updatePayload.authorsData = JSON.stringify(data.authorsData);
        if (!data.authors) {
          updatePayload.authors = (data.authorsData as ResearchAuthorData[])
            .map((a) => a.name)
            .join(", ");
        }
      } else {
        updatePayload.authorsData = data.authorsData;
      }
    }

    if (data.authors !== undefined) {
      updatePayload.authors = data.authors;
    }

    return ResearchRepository.update(id, updatePayload);
  }

  static async deletePaper(id: string) {
    return ResearchRepository.delete(id);
  }
}

