import { NextRequest, NextResponse } from "next/server";
import { CommunityServiceRepository } from "@/lib/repositories/community-service.repository";
import { CommunityServiceService } from "@/lib/services/community-service.service";
import { getCurrentUser } from "@/lib/auth/jwt";
import { hasPermission } from "@/lib/permissions/roles";

type Params = { params: Promise<{ id: string }> };

export async function GET(_req: NextRequest, { params }: Params) {
  try {
    const { id } = await params;
    const request = await CommunityServiceRepository.findById(id);
    if (!request) return NextResponse.json({ success: false, error: "Not found" }, { status: 404 });
    return NextResponse.json({ success: true, data: request });
  } catch (err: any) {
    const msg = err instanceof Error ? err.message : "Error";
    return NextResponse.json({ success: false, error: msg }, { status: 500 });
  }
}

export async function PUT(req: NextRequest, { params }: Params) {
  try {
    const user = await getCurrentUser();
    if (!user || !hasPermission(user.role, "community_services:update")) {
      return NextResponse.json({ success: false, error: "FORBIDDEN" }, { status: 403 });
    }

    const { id } = await params;
    const body = await req.json();
    const action = body.action;

    let result;
    switch (action) {
      case "status":
        result = await CommunityServiceService.updateStatus(id, body.status, user.id, body.notes);
        break;
      case "assign":
        result = await CommunityServiceService.assignRequest(id, body.assigneeId, user.id);
        break;
      case "priority":
        result = await CommunityServiceService.setPriority(id, body.priority, user.id);
        break;
      case "reject":
        result = await CommunityServiceService.rejectRequest(id, user.id, body.reason);
        break;
      case "note":
        result = await CommunityServiceService.addInternalNote(id, user.id, body.content);
        break;
      default:
        return NextResponse.json({ success: false, error: "Invalid action" }, { status: 400 });
    }

    return NextResponse.json({ success: true, data: result });
  } catch (err: any) {
    const msg = err instanceof Error ? err.message : "Error";
    const status = msg === "FORBIDDEN" ? 403 : msg === "UNAUTHORIZED" ? 401 : 400;
    return NextResponse.json({ success: false, error: msg }, { status });
  }
}

export async function DELETE(_req: NextRequest, { params }: Params) {
  try {
    const user = await getCurrentUser();
    if (!user || !hasPermission(user.role, "community_services:delete")) {
      return NextResponse.json({ success: false, error: "FORBIDDEN" }, { status: 403 });
    }

    const { id } = await params;
    await CommunityServiceRepository.delete(id);
    return NextResponse.json({ success: true });
  } catch (err: any) {
    const msg = err instanceof Error ? err.message : "Error";
    return NextResponse.json({ success: false, error: msg }, { status: 500 });
  }
}
