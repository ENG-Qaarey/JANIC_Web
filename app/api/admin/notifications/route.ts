import { NextRequest, NextResponse } from "next/server";
import { getCurrentUser } from "@/lib/auth/jwt";
import prisma from "@/lib/db/prisma";

export const dynamic = "force-dynamic";

export async function GET() {
  try {
    const user = await getCurrentUser();
    if (!user || (user.role !== "ADMIN" && user.role !== "STAFF")) {
      return NextResponse.json({ error: "UNAUTHORIZED" }, { status: 401 });
    }

    const [unreadMessages, recentMessages, pendingPartnerships, pendingSubmissions] =
      await Promise.all([
        prisma.contactMessage.count({ where: { status: "UNREAD" } }),
        prisma.contactMessage.findMany({
          orderBy: { createdAt: "desc" },
          take: 8,
          select: {
            id: true,
            name: true,
            email: true,
            subject: true,
            message: true,
            status: true,
            createdAt: true,
          },
        }),
        (prisma.partnershipInquiry as any).findMany({
          where: { isApproved: false, isRejected: false },
          orderBy: { createdAt: "desc" },
          take: 5,
          select: {
            id: true,
            organizationName: true,
            contactName: true,
            collaborationArea: true,
            createdAt: true,
          },
        }),
        prisma.innovationSubmission.findMany({
          where: { status: "PENDING" },
          orderBy: { createdAt: "desc" },
          take: 5,
          select: {
            id: true,
            title: true,
            submitterName: true,
            category: true,
            createdAt: true,
          },
        }),
      ]);

    const totalUnread = unreadMessages + pendingPartnerships.length + pendingSubmissions.length;

    return NextResponse.json({
      success: true,
      unreadCount: totalUnread,
      unreadMessagesCount: unreadMessages,
      messages: recentMessages,
      partnerships: pendingPartnerships,
      submissions: pendingSubmissions,
    });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : "Internal error";
    return NextResponse.json({ success: false, error: message }, { status: 500 });
  }
}

export async function PUT(req: NextRequest) {
  try {
    const user = await getCurrentUser();
    if (!user || (user.role !== "ADMIN" && user.role !== "STAFF")) {
      return NextResponse.json({ error: "UNAUTHORIZED" }, { status: 401 });
    }

    const body = await req.json().catch(() => ({}));

    if (body.markAllRead) {
      await prisma.contactMessage.updateMany({
        where: { status: "UNREAD" },
        data: { status: "READ" },
      });
      return NextResponse.json({ success: true, message: "All marked as read" });
    }

    if (body.id) {
      await prisma.contactMessage.update({
        where: { id: body.id },
        data: { status: "READ" },
      });
      return NextResponse.json({ success: true, message: "Message marked as read" });
    }

    return NextResponse.json({ success: false, error: "Invalid action" }, { status: 400 });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : "Internal error";
    return NextResponse.json({ success: false, error: message }, { status: 500 });
  }
}
