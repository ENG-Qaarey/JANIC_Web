import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { ResourceDocumentRepository } from "@/repositories/resource-document.repository";
import { requireAuth } from "@/lib/permissions/roles";
import { revalidatePath } from "next/cache";

const documentSchema = z.object({
  title: z.string().min(2, "Title is required"),
  category: z.string().min(2, "Category is required"),
  format: z.string().default("PDF"),
  size: z.string().default("500 KB"),
  description: z.string().min(5, "Description is required"),
  fileUrl: z.string().optional().nullable(),
  order: z.number().default(0),
  isActive: z.boolean().default(true),
});

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const item = await ResourceDocumentRepository.findById(id);
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
    const parsed = documentSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json(
        { success: false, error: parsed.error.issues[0]?.message || "Invalid input" },
        { status: 400 }
      );
    }

    const item = await ResourceDocumentRepository.update(id, parsed.data as any);
    revalidatePath("/resources/downloads");
    return NextResponse.json({ success: true, item });
  } catch (err: unknown) {
    console.error("PUT /api/admin/downloads/[id] error:", err);
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
    await ResourceDocumentRepository.delete(id);
    revalidatePath("/resources/downloads");
    return NextResponse.json({ success: true });
  } catch (err: unknown) {
    console.error("DELETE /api/admin/downloads/[id] error:", err);
    const msg = err instanceof Error ? err.message : "Error";
    const status = msg === "UNAUTHORIZED" ? 401 : msg === "FORBIDDEN" ? 403 : 500;
    return NextResponse.json({ success: false, error: msg }, { status });
  }
}
