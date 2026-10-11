import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { MessageService } from "@/services/messages/message.service";
import { isEnabled } from "@/lib/settings";
import { notifyNewContactMessage } from "@/lib/mailer";

const messageSchema = z.object({
  name: z.string().min(2, "Name is required"),
  email: z.string().email("Valid email is required"),
  phone: z.string().optional(),
  subject: z.string().min(3, "Subject is required"),
  message: z.string().min(10, "Message must be at least 10 characters"),
});

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const parsed = messageSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json(
        { success: false, error: parsed.error.issues[0]?.message || "Invalid input" },
        { status: 400 }
      );
    }

    if (!(await isEnabled("allow_contact_form", true))) {
      return NextResponse.json({ success: false, error: "Contact form is currently disabled" }, { status: 403 });
    }
    const message = await MessageService.submitMessage(parsed.data);

    // Notification is best-effort: never let mail delivery affect a saved submission.
    void notifyNewContactMessage({
      id: message.id,
      name: message.name,
      email: message.email,
      phone: message.phone,
      subject: message.subject,
      message: message.message,
    });

    return NextResponse.json({
      success: true,
      message: "Message sent successfully",
      messageId: message.id,
    });
  } catch (err: unknown) {
    const errorMsg = err instanceof Error ? err.message : "Internal error";
    return NextResponse.json({ success: false, error: errorMsg }, { status: 500 });
  }
}
