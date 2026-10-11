import { NextRequest, NextResponse } from "next/server";
import { getCurrentUser } from "@/lib/auth/jwt";
import { toggleCommentReaction } from "@/lib/db/comment-reactions";

export async function POST(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    await params;
    const body = await req.json();
    const { commentId, emoji } = body;

    if (!commentId || !emoji) {
      return NextResponse.json(
        { success: false, error: "commentId and emoji are required" },
        { status: 400 }
      );
    }

    const user = await getCurrentUser();
    let visitorId = user ? `user_${user.id}` : req.cookies.get("janic_visitor_id")?.value;
    let newCookie: string | null = null;

    if (!visitorId) {
      visitorId = `v_${Math.random().toString(36).substring(2, 14)}`;
      newCookie = visitorId;
    }

    const updated = await toggleCommentReaction(commentId, visitorId, emoji);

    const res = NextResponse.json({
      success: true,
      commentId,
      reactions: updated.reactions,
      userReactions: updated.userReactions,
    });

    if (newCookie) {
      res.cookies.set("janic_visitor_id", newCookie, {
        maxAge: 365 * 24 * 60 * 60,
        path: "/",
        sameSite: "lax",
      });
    }

    return res;
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : "Error updating reaction";
    return NextResponse.json({ success: false, error: msg }, { status: 500 });
  }
}
