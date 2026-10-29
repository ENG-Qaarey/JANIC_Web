import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/db/prisma";

export const dynamic = "force-dynamic";

/**
 * Serves the bytes of an uploaded file from Postgres.
 *
 * Cloudflare Workers have no writable filesystem, so uploads cannot live under
 * `public/uploads`. `/api/upload` stores them in `Media.data` and points
 * `Media.url` here instead.
 */
export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const media = await prisma.media.findUnique({
      where: { id },
      select: { data: true, mimeType: true, fileName: true },
    });

    if (!media?.data) {
      return NextResponse.json({ success: false, error: "Not found" }, { status: 404 });
    }

    const bytes = media.data;
    const total = bytes.byteLength;
    const baseHeaders = {
      "Content-Type": media.mimeType || "application/octet-stream",
      "Content-Disposition": `inline; filename="${media.fileName.replace(/"/g, "")}"`,
      "Accept-Ranges": "bytes",
      // The bytes behind a given id never change, so they can be cached forever.
      "Cache-Control": "public, max-age=31536000, immutable",
    };

    // Video playback (especially on iOS/Safari) needs range requests.
    const match = /^bytes=(\d*)-(\d*)$/.exec((req.headers.get("range") || "").trim());
    if (match) {
      let start = match[1] === "" ? undefined : Number(match[1]);
      let end = match[2] === "" ? undefined : Number(match[2]);

      if (start === undefined && end !== undefined) {
        // Suffix range: the last `end` bytes.
        start = Math.max(total - end, 0);
        end = total - 1;
      } else {
        start ??= 0;
        if (end === undefined || end >= total) end = total - 1;
      }

      if (start > end || start >= total) {
        return new NextResponse(null, {
          status: 416,
          headers: { "Content-Range": `bytes */${total}` },
        });
      }

      const chunk = bytes.slice(start, end + 1);
      return new NextResponse(chunk as unknown as BodyInit, {
        status: 206,
        headers: {
          ...baseHeaders,
          "Content-Length": String(chunk.byteLength),
          "Content-Range": `bytes ${start}-${end}/${total}`,
        },
      });
    }

    return new NextResponse(bytes as unknown as BodyInit, {
      status: 200,
      headers: { ...baseHeaders, "Content-Length": String(total) },
    });
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : "Error";
    return NextResponse.json({ success: false, error: msg }, { status: 500 });
  }
}
