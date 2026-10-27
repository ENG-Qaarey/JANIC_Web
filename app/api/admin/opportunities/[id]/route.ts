import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { OpportunityRepository } from "@/repositories/opportunity.repository";
import { requireAuth } from "@/lib/permissions/roles";
import { revalidatePath } from "next/cache";

const opportunitySchema = z.object({
  title: z.string().min(2, "Title is required"),
  type: z.string().min(2, "Type is required"),
  deadline: z.string().min(2, "Deadline is required"),
  department: z.string().min(2, "Department is required"),
  description: z.string().min(5, "Description is required"),
  eligibility: z.string().min(2, "Eligibility is required"),
  actionUrl: z.string().default("/submit-innovation"),
  actionLabel: z.string().default("Apply Now"),
  status: z.string().default("Active"),
  order: z.number().default(0),
  isActive: z.boolean().default(true),
});

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const item = await OpportunityRepository.findById(id);
    if (!item) return NextResponse.json({ success: false, error: "Not found" }, { status: 404 });
    return NextResponse.json({ success: true, item });
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : "Error";
    return NextResponse.json({ success: false, error: msg }, { status: 500 });
  }
}

export async function PUT(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    await requireAuth();
    const { id } = await params;
    const body = await req.json();
    const parsed = opportunitySchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json(
        { success: false, error: parsed.error.issues[0]?.message || "Invalid input" },
        { status: 400 }
      );
    }

    const item = await OpportunityRepository.update(id, parsed.data as any);
    revalidatePath("/resources/opportunities");
    return NextResponse.json({ success: true, item });
  } catch (err: unknown) {
    console.error("PUT /api/admin/opportunities/[id] error:", err);
    const msg = err instanceof Error ? err.message : "Error";
    const status = msg === "UNAUTHORIZED" ? 401 : msg === "FORBIDDEN" ? 403 : 500;
    return NextResponse.json({ success: false, error: msg }, { status });
  }
}

export async function DELETE(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    await requireAuth();
    const { id } = await params;
    await OpportunityRepository.delete(id);
    revalidatePath("/resources/opportunities");
    return NextResponse.json({ success: true });
  } catch (err: unknown) {
    console.error("DELETE /api/admin/opportunities/[id] error:", err);
    const msg = err instanceof Error ? err.message : "Error";
    const status = msg === "UNAUTHORIZED" ? 401 : msg === "FORBIDDEN" ? 403 : 500;
    return NextResponse.json({ success: false, error: msg }, { status });
  }
}
