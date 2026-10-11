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

    let count = 0;
    let mine: any = null;

    if ((prisma as any).trainingLike?.count) {
      [count, mine] = await Promise.all([
        (prisma as any).trainingLike.count({ where: { trainingId: id } }),
        user
          ? (prisma as any).trainingLike.findUnique({
              where: { trainingId_userId: { trainingId: id, userId: user.id } },
            })
          : null,
      ]);
    } else {
      const countRows: any = await prisma.$queryRawUnsafe(
        `SELECT COUNT(*) as count FROM traininglike WHERE trainingId = ?`,
        id
      );
      count = Number(countRows[0]?.count || 0);
      if (user) {
        const mineRows: any = await prisma.$queryRawUnsafe(
          `SELECT id FROM traininglike WHERE trainingId = ? AND userId = ? LIMIT 1`,
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
        { success: false, error: "UNAUTHORIZED", message: "Please sign in to like training programs" },
        { status: 401 }
      );
    }

    const { id } = await params;

    // Verify interactions are allowed
    try {
      const rows: any = await prisma.$queryRawUnsafe(
        `SELECT allowInteractions FROM TrainingProgram WHERE id = ? LIMIT 1`,
        id
      );
      if (rows && rows.length > 0 && rows[0].allowInteractions !== undefined && !rows[0].allowInteractions) {
        return NextResponse.json(
          { success: false, error: "Interactions are disabled for this training program" },
          { status: 403 }
        );
      }
    } catch {}

    let existing: any = null;
    if ((prisma as any).trainingLike?.findUnique) {
      existing = await (prisma as any).trainingLike.findUnique({
        where: { trainingId_userId: { trainingId: id, userId: user.id } },
      });
    } else {
      const rows: any = await prisma.$queryRawUnsafe(
        `SELECT id FROM traininglike WHERE trainingId = ? AND userId = ? LIMIT 1`,
        id,
        user.id
      );
      existing = rows[0] || null;
    }

    let liked = false;
    if (existing) {
      if ((prisma as any).trainingLike?.delete) {
        await (prisma as any).trainingLike.delete({ where: { id: existing.id } });
      } else {
        await prisma.$executeRawUnsafe(`DELETE FROM traininglike WHERE id = ?`, existing.id);
      }
    } else {
      if ((prisma as any).trainingLike?.create) {
        await (prisma as any).trainingLike.create({
          data: { trainingId: id, userId: user.id },
        });
      } else {
        const likeId = `tl_${Date.now()}_${Math.random().toString(36).substring(2, 9)}`;
        await prisma.$executeRawUnsafe(
          `INSERT INTO traininglike (id, trainingId, userId, createdAt) VALUES (?, ?, ?, NOW())`,
          likeId,
          id,
          user.id
        );
      }
      liked = true;
    }

    let count = 0;
    if ((prisma as any).trainingLike?.count) {
      count = await (prisma as any).trainingLike.count({ where: { trainingId: id } });
    } else {
      const countRows: any = await prisma.$queryRawUnsafe(
        `SELECT COUNT(*) as count FROM traininglike WHERE trainingId = ?`,
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
