import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/db/prisma";
import { getCurrentUser } from "@/lib/auth/jwt";
import { hasPermission } from "@/lib/permissions/roles";
import { getReactionsForComments } from "@/lib/db/comment-reactions";

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const user = await getCurrentUser();

    let comments: any[] = [];
    if ((prisma as any).researchComment?.findMany) {
      comments = await (prisma as any).researchComment.findMany({
        where: { paperId: id },
        orderBy: { createdAt: "desc" },
        take: 100,
      });
    } else {
      comments = await prisma.$queryRawUnsafe(
        `SELECT * FROM researchcomment WHERE paperId = ? ORDER BY createdAt DESC LIMIT 100`,
        id
      );
    }

    const cookieVisitor = req.cookies.get("janic_visitor_id")?.value;
    const visitorId = user ? `user_${user.id}` : cookieVisitor || "anon_visitor";
    const commentIds = comments.map((c) => c.id);
    const reactionsMap = await getReactionsForComments(commentIds, visitorId);

    const commentsWithReactions = comments.map((c) => ({
      ...c,
      reactions: reactionsMap[c.id]?.reactions || {},
      userReactions: reactionsMap[c.id]?.userReactions || [],
    }));

    return NextResponse.json({
      success: true,
      comments: commentsWithReactions,
      currentUser: user
        ? {
            id: user.id,
            name: user.name,
            username: user.username,
            avatar: user.avatar,
            role: user.role,
          }
        : null,
    });
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : "Error fetching comments";
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
        { success: false, error: "UNAUTHORIZED", message: "Please sign in to comment" },
        { status: 401 }
      );
    }

    const { id } = await params;

    // Verify comments are allowed
    try {
      const rows: any = await prisma.$queryRawUnsafe(
        `SELECT allowComments FROM ResearchPaper WHERE id = ? LIMIT 1`,
        id
      );
      if (rows && rows.length > 0 && rows[0].allowComments !== undefined && !rows[0].allowComments) {
        return NextResponse.json(
          { success: false, error: "Comments are disabled for this research paper" },
          { status: 403 }
        );
      }
    } catch {}

    const body = await req.json();
    const message = (body.message || "").toString().trim().slice(0, 1000);

    if (!message) {
      return NextResponse.json(
        { success: false, error: "Comment message cannot be empty" },
        { status: 400 }
      );
    }

    let comment: any;
    if ((prisma as any).researchComment?.create) {
      comment = await (prisma as any).researchComment.create({
        data: {
          paperId: id,
          userId: user.id,
          userName: user.username || user.name,
          userAvatar: user.avatar || null,
          message,
        },
      });
    } else {
      const commentId = `rc_${Date.now()}_${Math.random().toString(36).substring(2, 9)}`;
      await prisma.$executeRawUnsafe(
        `INSERT INTO researchcomment (id, paperId, userId, userName, userAvatar, message, createdAt, updatedAt) VALUES (?, ?, ?, ?, ?, ?, NOW(), NOW())`,
        commentId,
        id,
        user.id,
        user.username || user.name,
        user.avatar || null,
        message
      );
      comment = {
        id: commentId,
        paperId: id,
        userId: user.id,
        userName: user.username || user.name,
        userAvatar: user.avatar || null,
        message,
        createdAt: new Date(),
        updatedAt: new Date(),
      };
    }

    return NextResponse.json({
      success: true,
      comment: {
        ...comment,
        reactions: {},
        userReactions: [],
      },
    });
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : "Error creating comment";
    return NextResponse.json({ success: false, error: msg }, { status: 500 });
  }
}

export async function DELETE(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const user = await getCurrentUser();
    if (!user) {
      return NextResponse.json(
        { success: false, error: "UNAUTHORIZED", message: "Please sign in to delete comments" },
        { status: 401 }
      );
    }

    const { id: paperId } = await params;
    const searchParamId = req.nextUrl.searchParams.get("commentId");
    let commentId = searchParamId;

    if (!commentId) {
      try {
        const body = await req.json();
        commentId = body.commentId;
      } catch {
        // Body was not JSON
      }
    }

    if (!commentId) {
      return NextResponse.json(
        { success: false, error: "commentId is required" },
        { status: 400 }
      );
    }

    let existing: any = null;
    if ((prisma as any).researchComment?.findUnique) {
      existing = await (prisma as any).researchComment.findUnique({
        where: { id: commentId },
      });
    } else {
      const rows: any = await prisma.$queryRawUnsafe(
        `SELECT * FROM researchcomment WHERE id = ? LIMIT 1`,
        commentId
      );
      existing = rows[0] || null;
    }

    if (!existing || existing.paperId !== paperId) {
      return NextResponse.json(
        { success: false, error: "Comment not found" },
        { status: 404 }
      );
    }

    const isAuthor = existing.userId === user.id;
    const isStaff = await hasPermission(user.role, "research:update");

    if (!isAuthor && !isStaff && user.role !== "ADMIN") {
      return NextResponse.json(
        { success: false, error: "FORBIDDEN", message: "You can only delete your own comments" },
        { status: 403 }
      );
    }

    if ((prisma as any).researchComment?.delete) {
      await (prisma as any).researchComment.delete({
        where: { id: commentId },
      });
    } else {
      await prisma.$executeRawUnsafe(`DELETE FROM researchcomment WHERE id = ?`, commentId);
    }

    return NextResponse.json({ success: true, deletedId: commentId });
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : "Error deleting comment";
    return NextResponse.json({ success: false, error: msg }, { status: 500 });
  }
}
