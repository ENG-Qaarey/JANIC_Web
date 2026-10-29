/* eslint-disable @typescript-eslint/no-explicit-any */
import React from "react";
import prisma from "@/lib/db/prisma";
import { MediaManager } from "@/components/admin/MediaManager";
import { requireAuth } from "@/lib/permissions/roles";
import { ATTACHMENT_SOURCE } from "@/lib/media/post-media";

export const dynamic = "force-dynamic";

export default async function StaffMediaPage() {
  await requireAuth(null, "media:read");
  const media = await prisma.media.findMany({
    // Gallery child rows only exist to hold bytes for a multi-image post.
    where: { source: { not: ATTACHMENT_SOURCE } },
    orderBy: { createdAt: "desc" },
    omit: { data: true },
  });

  // Calculate detailed stats
  const totalFiles = media.length;
  const totalSizeBytes = media.reduce((acc, m) => acc + (m.sizeBytes || 0), 0);
  const imageCount = media.filter((m) => !m.mimeType || m.mimeType.startsWith("image")).length;
  const videoCount = media.filter((m) => !!m.mimeType?.startsWith("video")).length;
  const folderSet = Array.from(new Set(media.map((m) => m.folder || "general")));

  const stats = {
    totalFiles,
    totalSizeBytes,
    imageCount,
    videoCount,
    foldersCount: folderSet.length,
  };

  return (
    <div className="space-y-6 pb-12">
      {/* Top Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-gradient-to-r from-blue-900/10 via-blue-800/5 to-transparent p-6 rounded-3xl border border-border/80 backdrop-blur-sm">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-500/10 border border-blue-500/20 text-blue-600 dark:text-blue-400 text-xs font-semibold uppercase tracking-wider mb-2">
            <span>Asset Management System</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-black text-foreground tracking-tight">
            Posts & Media Library
          </h1>
          <p className="text-xs sm:text-sm text-muted-foreground mt-1 max-w-2xl">
            Upload, organize, inspect, and manage image assets, project media, video highlights, and documents across JANIC portal.
          </p>
        </div>
      </div>

      <MediaManager initialMedia={media as any} folders={folderSet} stats={stats} />
    </div>
  );
}
