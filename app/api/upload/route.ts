import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/db/prisma";
import { getCurrentUser } from "@/lib/auth/jwt";
import { hasPermission } from "@/lib/permissions/roles";
import { Role } from "@prisma/client";
import { ATTACHMENT_SOURCE, formatPostCaption } from "@/lib/media/post-media";

/**
 * Cloudflare Workers have no writable filesystem, so uploads can no longer be
 * written to `public/uploads` (that threw `operation not permitted`). The bytes
 * are stored in `Media.data` on Postgres instead and served by
 * `GET /api/media/[id]/raw`.
 */
async function storeFile(
  file: File,
  bytes: Uint8Array<ArrayBuffer>,
  folder: string,
  alt: string,
  source: string,
  caption: string | null
) {
  // Generating the id up-front means the public URL is known before the insert.
  const id = crypto.randomUUID();
  return prisma.media.create({
    data: {
      id,
      fileName: file.name,
      url: `/api/media/${id}/raw`,
      alt,
      mimeType: file.type || null,
      sizeBytes: file.size,
      data: bytes,
      folder,
      caption,
      source,
    },
    // Never echo the raw bytes back in the response.
    omit: { data: true },
  });
}

export async function POST(req: NextRequest) {
  try {
    // 1. Authenticate user
    const user = await getCurrentUser();
    if (!user) {
      return NextResponse.json({ success: false, error: "UNAUTHORIZED" }, { status: 401 });
    }

    // 2. Parse form data
    const formData = await req.formData();
    const folder = (formData.get("folder") as string) || "general";
    const alt = (formData.get("alt") as string) || "";
    const caption = (formData.get("caption") as string) || "";
    const groupPost = formData.get("groupPost") === "true";
    const source = (formData.get("source") as string) || "post";

    // 3. Permission check: Avatar uploads allowed for any authenticated user.
    // For other folders, require media:create or media:update unless admin.
    if (folder !== "avatars" && user.role !== Role.ADMIN) {
      const canCreate = await hasPermission(user.role, "media:create");
      const canUpdate = await hasPermission(user.role, "media:update");
      if (!canCreate && !canUpdate) {
        return NextResponse.json({ success: false, error: "FORBIDDEN" }, { status: 403 });
      }
    }

    // Support both single "file" and multiple "files" or multiple "file" entries
    const allFiles: File[] = [];
    const singleFile = formData.get("file") as File | null;
    const multiFiles = formData.getAll("files") as File[];
    const allFileEntries = formData.getAll("file") as File[];

    if (multiFiles.length > 0) {
      allFiles.push(...multiFiles.filter((f) => f instanceof File));
    } else if (allFileEntries.length > 1) {
      allFiles.push(...allFileEntries.filter((f) => f instanceof File));
    } else if (singleFile && singleFile instanceof File) {
      allFiles.push(singleFile);
    }

    if (allFiles.length === 0) {
      return NextResponse.json({ success: false, error: "No file provided" }, { status: 400 });
    }

    // Video vs Image validation rule:
    // User can post 1 image, or 2+ images on one card, but video MUST be 1 at a time!
    const isVideoFile = (f: File) =>
      f.type.startsWith("video/") || /\.(mp4|webm|ogg|mov|m4v|avi)$/i.test(f.name);
    const videoFiles = allFiles.filter(isVideoFile);
    const imageFiles = allFiles.filter((f) => !isVideoFile(f));

    if (videoFiles.length > 1) {
      return NextResponse.json(
        {
          success: false,
          error: "Only one video can be uploaded at a time. Please upload each video individually.",
        },
        { status: 400 }
      );
    }

    if (videoFiles.length === 1 && imageFiles.length > 0) {
      return NextResponse.json(
        {
          success: false,
          error: "Videos cannot be combined with images in the same post. Please upload the video separately.",
        },
        { status: 400 }
      );
    }

    // MULTI-IMAGE POST: 2 or more images grouped into one card.
    // Each image is persisted as its own hidden "attachment" row (that is what
    // holds the bytes); the visible post is the row whose caption carries the
    // gallery marker.
    if (groupPost && imageFiles.length > 1) {
      const uploadedUrls: string[] = [];

      for (const file of imageFiles) {
        const bytes = new Uint8Array(await file.arrayBuffer());
        const attachment = await storeFile(
          file,
          bytes,
          folder,
          alt || file.name,
          ATTACHMENT_SOURCE,
          null
        );
        uploadedUrls.push(attachment.url);
      }

      const primaryFile = imageFiles[0];
      const formattedCaption = formatPostCaption(caption, uploadedUrls);

      const mediaRecord = await prisma.media.create({
        data: {
          fileName: `${primaryFile.name} (+${imageFiles.length - 1} photos)`,
          url: uploadedUrls[0],
          alt: alt || formattedCaption || primaryFile.name,
          mimeType: primaryFile.type || null,
          sizeBytes: imageFiles.reduce((acc, f) => acc + f.size, 0),
          folder,
          caption: formattedCaption,
          source,
        },
        omit: { data: true },
      });

      return NextResponse.json({
        success: true,
        url: mediaRecord.url,
        media: mediaRecord,
        items: [mediaRecord],
      });
    }

    // Standard individual upload loop (for single image, single video, or ungrouped files)
    const createdRecords = [];

    for (const file of allFiles) {
      const bytes = new Uint8Array(await file.arrayBuffer());
      const mediaRecord = await storeFile(
        file,
        bytes,
        folder,
        alt || caption || file.name,
        source,
        null
      );
      createdRecords.push(mediaRecord);
    }

    // Return the primary media (for backward compatibility) and array of all created items
    return NextResponse.json({
      success: true,
      url: createdRecords[0].url,
      media: createdRecords[0],
      items: createdRecords,
    });
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : "Error uploading file";
    const status = msg === "UNAUTHORIZED" ? 401 : msg === "FORBIDDEN" ? 403 : 500;
    return NextResponse.json({ success: false, error: msg }, { status });
  }
}
