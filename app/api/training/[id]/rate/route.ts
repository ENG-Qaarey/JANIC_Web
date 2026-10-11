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
    let ratings: Array<{ stars: number; userId: string }> = [];

    if (prismaAny.trainingRating?.findMany) {
      ratings = await prismaAny.trainingRating.findMany({
        where: { trainingId: id },
        select: { stars: true, userId: true },
      });
    } else {
      const rows: any = await prisma.$queryRawUnsafe(
        `SELECT stars, userId FROM trainingrating WHERE trainingId = ?`,
        id
      );
      ratings = rows || [];
    }

    const totalRatings = ratings.length;
    const avgRating =
      totalRatings > 0
        ? Number((ratings.reduce((acc, r) => acc + r.stars, 0) / totalRatings).toFixed(1))
        : 0;

    const userRating = user
      ? ratings.find((r) => r.userId === user.id)?.stars || null
      : null;

    return NextResponse.json({
      success: true,
      avgRating,
      totalRatings,
      userRating,
    });
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
        { success: false, error: "UNAUTHORIZED", message: "Please sign in to rate" },
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

    const body = await req.json();
    const stars = Number(body.stars);
    const feedback = body.feedback ? String(body.feedback).trim().slice(0, 500) : null;

    if (isNaN(stars) || stars < 1 || stars > 5) {
      return NextResponse.json(
        { success: false, error: "Rating must be between 1 and 5 stars" },
        { status: 400 }
      );
    }

    const prismaAny = prisma as any;
    let currentStars = stars;

    if (prismaAny.trainingRating?.upsert) {
      const rating = await prismaAny.trainingRating.upsert({
        where: {
          trainingId_userId: {
            trainingId: id,
            userId: user.id,
          },
        },
        create: {
          trainingId: id,
          userId: user.id,
          stars,
          feedback,
        },
        update: {
          stars,
          feedback,
        },
      });
      currentStars = rating.stars;
    } else {
      const ratingId = `tr_${Date.now()}_${Math.random().toString(36).substring(2, 9)}`;
      await prisma.$executeRawUnsafe(
        `INSERT INTO trainingrating (id, trainingId, userId, stars, feedback, createdAt, updatedAt) 
         VALUES (?, ?, ?, ?, ?, NOW(), NOW())
         ON DUPLICATE KEY UPDATE stars = VALUES(stars), feedback = VALUES(feedback), updatedAt = NOW()`,
        ratingId,
        id,
        user.id,
        stars,
        feedback
      );
    }

    // Recompute average
    let allRatings: Array<{ stars: number }> = [];
    if (prismaAny.trainingRating?.findMany) {
      allRatings = await prismaAny.trainingRating.findMany({
        where: { trainingId: id },
        select: { stars: true },
      });
    } else {
      const rows: any = await prisma.$queryRawUnsafe(
        `SELECT stars FROM trainingrating WHERE trainingId = ?`,
        id
      );
      allRatings = rows || [];
    }

    const totalRatings = allRatings.length;
    const avgRating =
      totalRatings > 0
        ? Number((allRatings.reduce((acc, r) => acc + r.stars, 0) / totalRatings).toFixed(1))
        : 0;

    return NextResponse.json({
      success: true,
      userRating: currentStars,
      avgRating,
      totalRatings,
    });
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : "Error";
    return NextResponse.json({ success: false, error: msg }, { status: 500 });
  }
}
