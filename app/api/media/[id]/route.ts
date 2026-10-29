import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/db/prisma";
import { requireAuth } from "@/lib/permissions/roles";
import { ATTACHMENT_SOURCE, extractMediaGallery } from "@/lib/media/post-media";

export async function PUT(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    await requireAuth(null, "media:update");
    const { id } = await params;
    const body = await req.json();

    const updated = await prisma.media.update({
      where: { id },
      data: {
        alt: body.alt ?? undefined,
        folder: body.folder ?? undefined,
      },
      omit: { data: true },
    });
    return NextResponse.json({ success: true, item: updated });
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : "Error";
    const status = msg === "UNAUTHORIZED" ? 401 : msg === "FORBIDDEN" ? 403 : 500;
    return NextResponse.json({ success: false, error: msg }, { status });
  }
}

export async function DELETE(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    await requireAuth(null, "media:update");
    const { id } = await params;

    const media = await prisma.media.findUnique({
      where: { id },
      select: { url: true, caption: true },
    });
    if (!media) {
      return NextResponse.json({ success: false, error: "Not found" }, { status: 404 });
    }

    // Deleting the row also deletes its stored bytes.
    await prisma.media.delete({ where: { id } });

    // A multi-image post keeps its images in separate hidden attachment rows;
    // remove them too so their bytes are not orphaned in the database.
    const childIds = extractMediaGallery(media)
      .map((url) => /^\/api\/media\/([^/]+)\/raw$/.exec(url)?.[1])
      .filter((childId): childId is string => Boolean(childId));
    if (childIds.length > 0) {
      await prisma.media.deleteMany({
        where: { id: { in: childIds }, source: ATTACHMENT_SOURCE },
      });
    }

    return NextResponse.json({ success: true });
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : "Error";
    const status = msg === "UNAUTHORIZED" ? 401 : msg === "FORBIDDEN" ? 403 : 500;
    return NextResponse.json({ success: false, error: msg }, { status });
  }
}
