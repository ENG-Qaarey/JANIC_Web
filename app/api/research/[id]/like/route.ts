import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/db/prisma";
import { getCurrentUser } from "@/lib/auth/jwt";

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const user = await getCurrentUser();

    const prismaAny = prisma as any;
    let count = 0;
    let mine: any = null;

    if (prismaAny.researchLike?.count) {
      [count, mine] = await Promise.all([
        prismaAny.researchLike.count({ where: { paperId: id } }),
        user
          ? prismaAny.researchLike.findUnique({
              where: { paperId_userId: { paperId: id, userId: user.id } },
            })
          : null,
      ]);
    } else {
      const countRows: any = await prisma.$queryRawUnsafe(
        `SELECT COUNT(*) as count FROM researchlike WHERE paperId = ?`,
        id
      );
      count = Number(countRows[0]?.count || 0);
      if (user) {
        const mineRows: any = await prisma.$queryRawUnsafe(
          `SELECT id FROM researchlike WHERE paperId = ? AND userId = ? LIMIT 1`,
          id,
          user.id
        );
        mine = mineRows[0] || null;
      }
    }

    return NextResponse.json({ success: true, count, liked: !!mine });
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : "Error";
    return NextResponse.json({ success: false, error: msg }, { status: 500 });
  }
}

export async function POST(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const user = await getCurrentUser();
    if (!user) {
      return NextResponse.json(
        { success: false, error: "UNAUTHORIZED", message: "Please sign in to like research papers" },
        { status: 401 }
      );
    }

    const { id } = await params;

    // Verify interactions are allowed
    try {
      const rows: any = await prisma.$queryRawUnsafe(
        `SELECT allowInteractions FROM ResearchPaper WHERE id = ? LIMIT 1`,
        id
      );
      if (rows && rows.length > 0 && rows[0].allowInteractions !== undefined && !rows[0].allowInteractions) {
        return NextResponse.json(
          { success: false, error: "Interactions are disabled for this research paper" },
          { status: 403 }
        );
      }
    } catch {}

    const prismaAny = prisma as any;

    let existing: any = null;
    if (prismaAny.researchLike?.findUnique) {
      existing = await prismaAny.researchLike.findUnique({
        where: { paperId_userId: { paperId: id, userId: user.id } },
      });
    } else {
      const rows: any = await prisma.$queryRawUnsafe(
        `SELECT id FROM researchlike WHERE paperId = ? AND userId = ? LIMIT 1`,
        id,
        user.id
      );
      existing = rows[0] || null;
    }

    let liked = false;
    if (existing) {
      if (prismaAny.researchLike?.delete) {
        await prismaAny.researchLike.delete({ where: { id: existing.id } });
      } else {
        await prisma.$executeRawUnsafe(`DELETE FROM researchlike WHERE id = ?`, existing.id);
      }
    } else {
      if (prismaAny.researchLike?.create) {
        await prismaAny.researchLike.create({
          data: { paperId: id, userId: user.id },
        });
      } else {
        const likeId = `rl_${Date.now()}_${Math.random().toString(36).substring(2, 9)}`;
        await prisma.$executeRawUnsafe(
          `INSERT INTO researchlike (id, paperId, userId, createdAt) VALUES (?, ?, ?, NOW())`,
          likeId,
          id,
          user.id
        );
      }
      liked = true;
    }

    let count = 0;
    if (prismaAny.researchLike?.count) {
      count = await prismaAny.researchLike.count({ where: { paperId: id } });
    } else {
      const countRows: any = await prisma.$queryRawUnsafe(
        `SELECT COUNT(*) as count FROM researchlike WHERE paperId = ?`,
        id
      );
      count = Number(countRows[0]?.count || 0);
    }

    return NextResponse.json({ success: true, liked, count });
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : "Error";
    return NextResponse.json({ success: false, error: msg }, { status: 500 });
  }
}
