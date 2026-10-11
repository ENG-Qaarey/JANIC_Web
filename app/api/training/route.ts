/* eslint-disable @typescript-eslint/no-explicit-any */
import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { TrainingService } from "@/services/training/training.service";
import { requireAuth } from "@/lib/permissions/roles";
import { ContentStatus } from "@prisma/client";

const trainingSchema = z.object({
  title: z.string().min(2, "Title is required"),
  category: z.string().min(1, "Category is required"),
  summary: z.string().optional().nullable(),
  description: z.string().min(10, "Description is required"),
  level: z.string().default("Intermediate"),
  duration: z.string().optional().nullable(),
  schedule: z.string().optional().nullable(),
  startDate: z.string().optional().nullable(),
  endDate: z.string().optional().nullable(),
  mode: z.string().default("On-Campus"),
  certification: z.string().optional().nullable(),
  status: z.nativeEnum(ContentStatus).default(ContentStatus.DRAFT),
  isFeatured: z.preprocess((val) => Boolean(val), z.boolean().default(false)),
  coverImage: z.string().optional().nullable(),
  maxSeats: z.preprocess(
    (val) => (val === "" || val === null || val === undefined ? null : Number(val)),
    z.number().nullable().optional()
  ),
  syllabus: z.string().optional().nullable(),
  trainers: z.any().optional().nullable(),
  allowComments: z.preprocess((val) => (val === undefined ? true : Boolean(val)), z.boolean().default(true)),
  allowInteractions: z.preprocess((val) => (val === undefined ? true : Boolean(val)), z.boolean().default(true)),
});

export async function GET() {
  try {
    const items = await TrainingService.getAllAdmin();
    return NextResponse.json({ success: true, items });
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : "Error";
    return NextResponse.json({ success: false, error: msg }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    try {
      await requireAuth(null, "training:create");
    } catch {
      await requireAuth(null, "training:update");
    }
    const body = await req.json();
    const parsed = trainingSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json(
        { success: false, error: parsed.error.issues[0]?.message || "Invalid input" },
        { status: 400 }
      );
    }

    const item = await TrainingService.createProgram(parsed.data as any);
    return NextResponse.json({ success: true, item });
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : "Error";
    const status = msg === "UNAUTHORIZED" ? 401 : msg === "FORBIDDEN" ? 403 : 500;
    return NextResponse.json({ success: false, error: msg }, { status });
  }
}

