import { NextRequest, NextResponse } from "next/server";
import { OrganizationTypeService } from "@/services/partnerships/organization-type.service";
import { requireAuth } from "@/lib/permissions/roles";

export async function GET() {
  try {
    await requireAuth(null, "partnerships:read");
    const types = await OrganizationTypeService.getAll();
    return NextResponse.json({ success: true, items: types });
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : "Error";
    const status = msg === "UNAUTHORIZED" ? 401 : msg === "FORBIDDEN" ? 403 : 500;
    return NextResponse.json({ success: false, error: msg }, { status });
  }
}

export async function POST(req: NextRequest) {
  try {
    await requireAuth(null, "partnerships:create");
    const body = await req.json();
    const { name } = body;

    const created = await OrganizationTypeService.create(name);
    return NextResponse.json({ success: true, item: created }, { status: 201 });
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : "Error";
    const status = msg === "UNAUTHORIZED" ? 401 : msg === "FORBIDDEN" ? 403 : 500;
    return NextResponse.json({ success: false, error: msg }, { status });
  }
}
