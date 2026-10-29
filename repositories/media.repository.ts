import prisma from "@/lib/db/prisma";
import { ATTACHMENT_SOURCE } from "@/lib/media/post-media";

export class MediaRepository {
  static async findAll(folder?: string) {
    return prisma.media.findMany({
      // Gallery child rows only exist to hold bytes for a multi-image post.
      where: { source: { not: ATTACHMENT_SOURCE }, ...(folder ? { folder } : {}) },
      orderBy: { createdAt: "desc" },
      omit: { data: true },
    });
  }
}
