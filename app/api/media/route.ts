import { NextRequest, NextResponse } from "next/server";
import { getPrismaClient } from "@/lib/db/prisma";

export async function GET() {
  const prisma = await getPrismaClient();
  const media = await prisma.media.findMany({
    orderBy: { order: "asc" },
  });
  return NextResponse.json(media);
}

export async function POST(req: NextRequest) {
  const prisma = await getPrismaClient();
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
  });
  return NextResponse.json(media);
}
