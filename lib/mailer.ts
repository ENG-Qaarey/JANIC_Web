import nodemailer from "nodemailer";
import type { Mail } from "nodemailer";

type Block = { label: string; value: string };
type Row = { label: string; value: string };

type Transporter = Mail;
type MailOptions = Parameters<Transporter["sendMail"]>[0];

/**
 * Outbound email for JANIC.
 *
 * Delivery is intentionally fire-and-forget at the call site: a mail failure must never
 * roll back or duplicate a successfully saved submission. Every helper resolves rather
 * than rejects, and callers `void` them.
 */

const HOST = process.env.SMTP_HOST?.trim();
const USER = process.env.SMTP_USER?.trim();
/** Gmail app passwords are displayed in spaced groups — the spaces are not part of it. */
const PASSWORD = process.env.SMTP_PASSWORD?.replace(/\s+/g, "");
const PORT = Number(process.env.SMTP_PORT?.trim() || 587);
const SECURE = process.env.SMTP_SECURE?.trim() === "true";
const TO = process.env.CONTACT_NOTIFICATION_EMAIL?.trim() || USER;

const FROM_NAME = "JANIC Website";
const FROM_ADDRESS = USER || "no-reply@localhost";

export type MailResult = { sent: boolean; error?: string; skipped?: boolean };

let transporter: Transporter | null = null;

export function isMailConfigured(): boolean {
  return Boolean(HOST && USER && PASSWORD);
}

function getTransporter(): Transporter | null {
  if (!isMailConfigured()) return null;
  if (transporter) return transporter;

  transporter = nodemailer.createTransport({
    host: HOST,
    port: PORT,
    secure: SECURE,
    auth: { user: USER, pass: PASSWORD },
    // Required for Gmail on port 587.
    requireTLS: !SECURE,
    tls: { rejectUnauthorized: false },
    connectionTimeout: 10_000,
    greetingTimeout: 10_000,
    socketTimeout: 20_000,
  });

  return transporter;
}

/** Wraps a send so callers never need try/catch and never see a rejection. */
async function send(options: MailOptions): Promise<MailResult> {
  const tx = getTransporter();
  if (!tx) {
    if (process.env.NODE_ENV === "development") {
      console.warn("[mail] SMTP not configured — skipping send to", TO);
    }
    return { sent: false, skipped: true };
  }
  try {
    await tx.sendMail({ from: `"${FROM_NAME}" <${FROM_ADDRESS}>`, ...options });
    return { sent: true };
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : "Unknown mail error";
    console.error("[mail] send failed:", message);
    return { sent: false, error: message };
  }
}

/** Shared visual shell so all notification mail looks like one system. */
function layout(opts: { title: string; preheader: string; rows: Row[]; blocks?: Block[]; cta?: { label: string; url: string } }) {
  const row = (r: Row) => `
    <tr>
      <td style="padding:10px 0;border-bottom:1px solid #eef2f7;vertical-align:top;width:150px">
        <span style="font-size:11px;font-weight:700;letter-spacing:.06em;text-transform:uppercase;color:#64748b">${escapeHtml(r.label)}</span>
      </td>
      <td style="padding:10px 0;border-bottom:1px solid #eef2f7;font-size:14px;color:#0f172a">${escapeHtml(r.value)}</td>
    </tr>`;

  return `<!doctype html>
<html><body style="margin:0;padding:24px;background:#f8fbff;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,Helvetica,Arial,sans-serif">
  <span style="display:none;max-height:0;overflow:hidden">${escapeHtml(opts.preheader)}</span>
  <table role="presentation" width="100%" cellpadding="0" cellspacing="0"><tr><td align="center">
    <table role="presentation" width="600" cellpadding="0" cellspacing="0" style="background:#fff;border-radius:16px;border:1px solid #e2e8f0;overflow:hidden">

      <tr><td style="background:linear-gradient(135deg,#08245C,#0875D1);padding:24px 28px">
        <div style="color:#fff;font-size:16px;font-weight:800;letter-spacing:-.01em">JANIC</div>
        <div style="color:#cfe4ff;font-size:11px;font-weight:600;letter-spacing:.1em;text-transform:uppercase;margin-top:4px">${escapeHtml(opts.title)}</div>
      </td></tr>

      <tr><td style="padding:24px 28px 8px">
        <h1 style="margin:0 0 6px;font-size:19px;font-weight:800;color:#08245C">${escapeHtml(opts.title)}</h1>
        <p style="margin:0 0 16px;font-size:13px;line-height:1.6;color:#64748b">${escapeHtml(opts.preheader)}</p>
        <table role="presentation" width="100%" cellpadding="0" cellspacing="0">${opts.rows.map(row).join("")}</table>
        ${(opts.blocks ?? []).map((b) => `<div style="margin-top:18px"><div style="font-size:11px;font-weight:700;letter-spacing:.06em;text-transform:uppercase;color:#64748b;margin-bottom:6px">${b.label}</div><div style="font-size:13px;line-height:1.65;color:#334155;white-space:pre-wrap">${escapeHtml(b.value)}</div></div>`).join("")}
        ${
          opts.cta
            ? `<div style="margin-top:24px"><a href="${opts.cta.url}" style="display:inline-block;background:#0875D1;color:#fff;text-decoration:none;font-size:12px;font-weight:700;letter-spacing:.04em;text-transform:uppercase;padding:12px 22px;border-radius:999px">${escapeHtml(opts.cta.label)}</a></div>`
            : ""
        }
      </td></tr>

      <tr><td style="padding:18px 28px;background:#f8fbff;border-top:1px solid #eef2f7;font-size:11px;color:#94a3b8">
        Jazeera Nexus Innovation Center &middot; Faculty of Computer Science &amp; IT, Jazeera University
      </td></tr>

    </table>
  </td></tr></table>
</body></html>`;
}

function escapeHtml(value: unknown): string {
  if (value === null || value === undefined) return "";
  return String(value)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
}

function siteUrl(path: string) {
  const base = process.env.NEXT_PUBLIC_APP_URL || process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000";
  return `${base.replace(/\/$/, "")}${path}`;
}

const label = (v: unknown) => (v === null || v === undefined || v === "" ? "—" : String(v));

/* ------------------------------------------------------------------ */
/*  Notification templates                                             */
/* ------------------------------------------------------------------ */

export function notifyNewContactMessage(d: {
  id: string;
  name: string;
  email: string;
  phone?: string | null;
  subject: string;
  message: string;
}): Promise<MailResult> {
  return send({
    to: TO,
    subject: `New contact message — ${d.subject}`,
    text: [
      `New message from ${d.name}`,
      `Email: ${d.email}`,
      d.phone ? `Phone: ${d.phone}` : null,
      "",
      d.message,
    ]
      .filter(Boolean)
      .join("\n"),
    html: layout({
      title: "New Contact Message",
      preheader: `${d.name} sent "${d.subject}" through the website contact form.`,
      rows: [
        { label: "From", value: d.name },
        { label: "Email", value: d.email },
        { label: "Phone", value: label(d.phone) },
        { label: "Subject", value: d.subject },
      ],
      blocks: [{ label: "Message", value: d.message }],
      cta: { label: "Open in admin", url: siteUrl("/admin/messages") },
    }),
  });
}

export function notifyNewPartnershipInquiry(d: {
  id: string;
  organizationName: string;
  organizationType: string;
  contactName: string;
  email: string;
  phone?: string | null;
  collaborationArea: string;
  proposalDetails: string;
}): Promise<MailResult> {
  return send({
    to: TO,
    subject: `New partnership inquiry — ${d.organizationName}`,
    text: [
      `New partnership inquiry from ${d.organizationName}`,
      `Type: ${d.organizationType}`,
      `Contact: ${d.contactName} <${d.email}>`,
      d.phone ? `Phone: ${d.phone}` : null,
      `Area: ${d.collaborationArea}`,
      "",
      d.proposalDetails,
    ]
      .filter(Boolean)
      .join("\n"),
    html: layout({
      title: "New Partnership Inquiry",
      preheader: `${d.organizationName} wants to collaborate on ${d.collaborationArea}.`,
      rows: [
        { label: "Organization", value: d.organizationName },
        { label: "Type", value: d.organizationType },
        { label: "Contact", value: d.contactName },
        { label: "Email", value: d.email },
        { label: "Phone", value: label(d.phone) },
        { label: "Collaboration", value: d.collaborationArea },
      ],
      blocks: [{ label: "Proposal", value: d.proposalDetails }],
      cta: { label: "Review inquiry", url: siteUrl("/admin/partnerships") },
    }),
  });
}

export function notifyNewServiceRequest(d: {
  id: string;
  requestNumber: string;
  organizationName: string;
  organizationType: string;
  organizationCategory: string;
  contactPerson: string;
  email: string;
  phone: string;
  country: string;
  city: string;
  serviceCategoryName?: string | null;
  serviceName?: string | null;
  requestTitle: string;
  description: string;
  budget?: string | null;
}): Promise<MailResult> {
  return send({
    to: TO,
    subject: `New service request ${d.requestNumber} — ${d.organizationName}`,
    text: [
      `New community service request ${d.requestNumber}`,
      `Organization: ${d.organizationName} (${d.organizationType})`,
      `Contact: ${d.contactPerson} <${d.email}>`,
      `Phone: ${d.phone}`,
      `Location: ${d.city}, ${d.country}`,
      `Service: ${d.serviceCategoryName ?? "—"} / ${d.serviceName ?? "—"}`,
      d.budget ? `Budget: ${d.budget}` : null,
      "",
      d.requestTitle,
      "",
      d.description,
    ]
      .filter(Boolean)
      .join("\n"),
    html: layout({
      title: "New Community Service Request",
      preheader: `${d.organizationName} requested "${d.requestTitle}".`,
      rows: [
        { label: "Reference", value: d.requestNumber },
        { label: "Organization", value: d.organizationName },
        { label: "Type", value: d.organizationType === "FOR_PROFIT" ? "For-Profit" : "Nonprofit" },
        { label: "Category", value: d.organizationCategory.replace(/_/g, " ") },
        { label: "Contact", value: d.contactPerson },
        { label: "Email", value: d.email },
        { label: "Phone", value: d.phone },
        { label: "Location", value: `${d.city}, ${d.country}` },
        { label: "Service", value: label(d.serviceName ?? d.serviceCategoryName) },
        { label: "Budget", value: label(d.budget) },
      ],
      blocks: [{ label: "Request details", value: `${d.requestTitle}\n\n${d.description}` }],
      cta: { label: "Review request", url: siteUrl("/admin/community-services") },
    }),
  });
}

/** Staff/requester notification when a request changes state. */
export function notifyServiceRequestStatusChange(d: {
  requestNumber: string;
  toStatus: string;
  toEmail?: string | null;
  notes?: string | null;
}): Promise<MailResult> {
  const pretty = d.toStatus.replace(/_/g, " ").toLowerCase();
  return send({
    to: d.toEmail && d.toEmail.includes("@") ? d.toEmail : TO,
    subject: `Your JANIC service request ${d.requestNumber} is now ${pretty}`,
    text: [
      `Your service request ${d.requestNumber} has been updated.`,
      `Status: ${pretty}`,
      d.notes ? `Notes: ${d.notes}` : null,
    ]
      .filter(Boolean)
      .join("\n"),
    html: layout({
      title: "Request Update",
      preheader: `Your service request ${d.requestNumber} is now ${pretty}.`,
      rows: [
        { label: "Reference", value: d.requestNumber },
        { label: "Status", value: pretty },
      ],
      blocks: d.notes ? [{ label: "Message from JANIC", value: d.notes }] : [],
    }),
  });
}

/** Verifies SMTP connectivity without sending anything. */
export async function verifyMailTransport(): Promise<{ ok: boolean; message: string }> {
  const tx = getTransporter();
  if (!tx) return { ok: false, message: "SMTP is not configured (missing SMTP_HOST / SMTP_USER / SMTP_PASSWORD)." };
  try {
    await tx.verify();
    return { ok: true, message: `SMTP connection verified for ${USER}.` };
  } catch (err: unknown) {
    return { ok: false, message: err instanceof Error ? err.message : "Verification failed" };
  }
}