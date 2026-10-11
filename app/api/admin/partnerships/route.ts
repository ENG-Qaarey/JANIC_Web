import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { PartnershipService } from "@/services/partnerships/partnership.service";
import { requireAuth } from "@/lib/permissions/roles";

const createSchema = z.object({
  organizationName: z.string().min(2),
  organizationType: z.string().min(2),
  contactName: z.string().min(2),
  email: z.string().email(),
  phone: z.string().optional(),
  collaborationArea: z.string().min(2),
  proposalDetails: z.string().min(10),
  status: z.string().optional(),
  adminNotes: z.string().optional(),
});

export async function POST(req: NextRequest) {
  try {
    await requireAuth(null, "partnerships:create");
    const body = await req.json();
    const parsed = createSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json(
        { success: false, error: parsed.error.issues[0]?.message || "Invalid input" },
        { status: 400 }
      );
    }

    const created = await PartnershipService.createByAdmin(parsed.data);

    return NextResponse.json({ success: true, item: created }, { status: 201 });
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : "Error";
    const status = msg === "UNAUTHORIZED" ? 401 : msg === "FORBIDDEN" ? 403 : 500;
    return NextResponse.json({ success: false, error: msg }, { status });
  }
}
