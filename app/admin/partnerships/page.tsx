/* eslint-disable @typescript-eslint/no-explicit-any, @typescript-eslint/no-unused-vars */
import React from "react";
import { requireAuth } from "@/lib/permissions/roles";
import { KpiRow } from "@/components/admin/KpiRow";
import { PartnershipService } from "@/services/partnerships/partnership.service";
import { PartnershipManager } from "@/components/admin/PartnershipManager";

export const dynamic = "force-dynamic";

export default async function AdminPartnershipsPage() {
  try {
    await requireAuth(null, "partnerships:read");
    const inquiries: any[] = await PartnershipService.getAllAdmin();

    return (
      <div className="space-y-4">
        <div>
          <h1 className="text-2xl font-extrabold text-foreground tracking-tight">
            Partnership Inquiries CMS
          </h1>
          <p className="text-xs sm:text-sm text-muted-foreground mt-1">
            Review external collaboration proposals from universities, technology companies, and NGOs.
          </p>
        </div>

        <KpiRow items={[
          { title: "Total", value: inquiries.length, sub: "all inquiries" },
          { title: "New", value: inquiries.filter((p: any) => p.status === "NEW").length, sub: "unreviewed" },
          { title: "In Progress", value: inquiries.filter((p: any) => p.status === "IN_PROGRESS").length, sub: "active" },
          { title: "Closed", value: inquiries.filter((p: any) => p.status === "CLOSED").length, sub: "completed" },
        ]} />

        <PartnershipManager initialPartnerships={inquiries as any} />
      </div>
    );
  } catch (err: unknown) {
    console.error("AdminPartnershipsPage Error:", err);
    const msg = err instanceof Error ? err.message : String(err);
    return (
      <div className="p-8 text-center space-y-4 bg-card rounded-2xl border border-border shadow-sm max-w-lg mx-auto mt-12">
        <h2 className="text-xl font-bold text-rose-600">Access or Data Error</h2>
        <p className="text-sm text-muted-foreground">Details: {msg}</p>
        <p className="text-xs text-muted-foreground">
          If you are not logged in, please log in at <a href="/login" className="text-blue-600 underline">/login</a> with admin credentials.
        </p>
      </div>
    );
  }
}
