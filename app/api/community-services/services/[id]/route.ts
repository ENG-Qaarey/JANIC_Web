import { NextRequest, NextResponse } from "next/server";
import { CommunityServiceService } from "@/lib/services/community-service.service";
import { getCurrentUser } from "@/lib/auth/jwt";
import { hasPermission } from "@/lib/permissions/roles";

type Params = { params: Promise<{ id: string }> };

export async function PUT(req: NextRequest, { params }: Params) {
  try {
    const user = await getCurrentUser();
    if (!user || !hasPermission(user.role, "community_services:update")) {
      return NextResponse.json({ success: false, error: "FORBIDDEN" }, { status: 403 });
    }

    const { id } = await params;
    const body = await req.json();

    const data: Record<string, unknown> = {};
    if (typeof body.name === "string" && body.name.trim()) data.name = body.name.trim();
    if (body.description !== undefined) data.description = body.description ?? null;
    if (typeof body.order === "number") data.order = body.order;
    if (typeof body.isActive === "boolean") data.isActive = body.isActive;
    if (typeof body.categoryId === "string" && body.categoryId) data.categoryId = body.categoryId;

    const service = await CommunityServiceService.updateService(id, data);
    return NextResponse.json({ success: true, data: service });
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : "Error";
    return NextResponse.json({ success: false, error: msg }, { status: 400 });
  }
}

export async function DELETE(_req: NextRequest, { params }: Params) {
  try {
    const user = await getCurrentUser();
    if (!user || !hasPermission(user.role, "community_services:delete")) {
      return NextResponse.json({ success: false, error: "FORBIDDEN" }, { status: 403 });
    }

    const { id } = await params;
    await CommunityServiceService.deleteService(id);
    return NextResponse.json({ success: true });
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : "Error";
    return NextResponse.json({ success: false, error: msg }, { status: 400 });
  }
}