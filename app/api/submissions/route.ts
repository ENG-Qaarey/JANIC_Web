import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { SubmissionService } from "@/services/submissions/submission.service";
import { isEnabled } from "@/lib/settings";

const submissionSchema = z.object({
  title: z.string().min(3, "Title must be at least 3 characters"),
  category: z.string().min(2, "Category is required"),
  description: z.string().min(15, "Please describe the project (at least 15 characters)"),
  technologyStack: z.string().optional(),
  submitterName: z.string().min(2, "Submitter name is required"),
  submitterEmail: z.string().email("Valid email is required"),
  submitterPhone: z.string().min(5, "Valid phone number is required"),
  studentId: z.string().optional(),
  teamMembers: z.string().optional(),
  prototypeUrl: z.string().optional(),
  videoUrl: z.string().optional(),
});

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const parsed = submissionSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json(
        { success: false, error: parsed.error.issues[0]?.message || "Invalid input" },
        { status: 400 }
      );
    }

    if (!(await isEnabled("allow_submissions", true))) {
      return NextResponse.json({ success: false, error: "Submissions are currently closed" }, { status: 403 });
    }
    const submission = await SubmissionService.submitInnovation(parsed.data);

    return NextResponse.json({
      success: true,
      message: "Innovation submitted successfully",
      submissionId: submission.id,
    });
  } catch (err: unknown) {
    const errorMsg = err instanceof Error ? err.message : "Internal server error";
    return NextResponse.json({ success: false, error: errorMsg }, { status: 500 });
  }
}
