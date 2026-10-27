import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { HubRepository } from "@/repositories/hub.repository";
import { requireAuth } from "@/lib/permissions/roles";
import { revalidatePath } from "next/cache";

const hubSchema = z.object({
  name: z.string().min(2, "Name is required"),
  slug: z.string().min(2, "Slug is required"),
  category: z.string().min(2, "Category is required"),
  description: z.string().min(5, "Description is required"),
  icon: z.string().optional().nullable(),
  status: z.string().default("Active"),
  link: z.string().optional().nullable(),
  tags: z.string().optional().nullable(),
  order: z.number().default(0),
  isActive: z.boolean().default(true),
});

export async function GET() {
  try {
    const items = await HubRepository.findAllAdmin();
    return NextResponse.json({ success: true, items });
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : "Error";
    return NextResponse.json({ success: false, error: msg }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    await requireAuth();
    const body = await req.json();
    const parsed = hubSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json(
        { success: false, error: parsed.error.issues[0]?.message || "Invalid input" },
        { status: 400 }
      );
    }

    const item = await HubRepository.create(parsed.data as any);
    revalidatePath("/hubs");
    revalidatePath("/");
    return NextResponse.json({ success: true, item });
  } catch (err: unknown) {
    console.error("POST /api/admin/hubs error:", err);
    const msg = err instanceof Error ? err.message : "Error";
    const status = msg === "UNAUTHORIZED" ? 401 : msg === "FORBIDDEN" ? 403 : 500;
    return NextResponse.json({ success: false, error: msg }, { status });
  }
}
