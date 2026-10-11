import { NextRequest, NextResponse } from "next/server";
import { CommunityServiceService } from "@/lib/services/community-service.service";
import { getCurrentUser } from "@/lib/auth/jwt";
import { hasPermission } from "@/lib/permissions/roles";

export async function POST(req: NextRequest) {
  try {
    const user = await getCurrentUser();
    if (!user || !hasPermission(user.role, "community_services:create")) {
      return NextResponse.json({ success: false, error: "FORBIDDEN" }, { status: 403 });
    }

    const body = await req.json();
    const service = await CommunityServiceService.createService({
      categoryId: body.categoryId,
      name: body.name,
      description: body.description,
      order: typeof body.order === "number" ? body.order : undefined,
    });

    return NextResponse.json({ success: true, data: service });
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : "Error";
    return NextResponse.json({ success: false, error: msg }, { status: 400 });
  }
}