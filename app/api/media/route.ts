import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/db/prisma";
import { ATTACHMENT_SOURCE } from "@/lib/media/post-media";

export async function GET() {
  const media = await prisma.media.findMany({
    where: { source: { not: ATTACHMENT_SOURCE } },
    orderBy: { createdAt: "desc" },
    omit: { data: true },
  });
  return NextResponse.json(media);
}

export async function POST(req: NextRequest) {
  const body = await req.json();
  const media = await prisma.media.create({
    data: {
      fileName: body.fileName,
      url: body.url,
      alt: body.alt,
      mimeType: body.mimeType,
      sizeBytes: body.sizeBytes,
      folder: body.folder || "general",
      caption: body.caption,
    },
    omit: { data: true },
  });
  return NextResponse.json(media);
}
