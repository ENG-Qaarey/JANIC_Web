import { NextRequest, NextResponse } from "next/server";
import { CommunityServiceService } from "@/lib/services/community-service.service";
import { getCurrentUser } from "@/lib/auth/jwt";
import { hasPermission } from "@/lib/permissions/roles";

export async function GET() {
  try {
    const categories = await CommunityServiceService.listCategories();
    return NextResponse.json({ success: true, data: categories });
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : "Error";
    return NextResponse.json({ success: false, error: msg }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const user = await getCurrentUser();
    if (!user || !hasPermission(user.role, "community_services:create")) {
      return NextResponse.json({ success: false, error: "FORBIDDEN" }, { status: 403 });
    }

    const body = await req.json();
    const category = await CommunityServiceService.createCategory({
      name: body.name,
      description: body.description,
      icon: body.icon,
      order: typeof body.order === "number" ? body.order : undefined,
    });

    return NextResponse.json({ success: true, data: category });
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : "Error";
    return NextResponse.json({ success: false, error: msg }, { status: 400 });
  }
}