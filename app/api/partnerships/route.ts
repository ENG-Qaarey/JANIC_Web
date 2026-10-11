import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { PartnershipService } from "@/services/partnerships/partnership.service";
import { notifyNewPartnershipInquiry } from "@/lib/mailer";

const partnershipSchema = z.object({
  organizationName: z.string().min(2, "Organization name is required"),
  organizationType: z.string().min(2, "Organization type is required"),
  contactName: z.string().min(2, "Contact name is required"),
  email: z.string().email("Valid email is required"),
  phone: z.string().optional(),
  collaborationArea: z.string().min(2, "Collaboration area is required"),
  proposalDetails: z.string().min(10, "Please provide more details on the proposal"),
});

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const parsed = partnershipSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json(
        { success: false, error: parsed.error.issues[0]?.message || "Invalid input" },
        { status: 400 }
      );
    }

    const inquiry = await PartnershipService.submitInquiry(parsed.data);

    // Notification is best-effort: never let mail delivery affect a saved submission.
    void notifyNewPartnershipInquiry({
      id: inquiry.id,
      organizationName: inquiry.organizationName,
      organizationType: inquiry.organizationType,
      contactName: inquiry.contactName,
      email: inquiry.email,
      phone: inquiry.phone,
      collaborationArea: inquiry.collaborationArea,
      proposalDetails: inquiry.proposalDetails,
    });

    return NextResponse.json({
      success: true,
      message: "Partnership inquiry submitted successfully",
      inquiryId: inquiry.id,
    });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : "Internal server error";
    return NextResponse.json({ success: false, error: message }, { status: 500 });
  }
}
