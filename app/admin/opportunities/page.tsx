import React from "react";
import { KpiRow } from "@/components/admin/KpiRow";
import { OpportunityRepository } from "@/repositories/opportunity.repository";
import { OpportunityManager } from "@/components/admin/OpportunityManager";
import { requireAuth } from "@/lib/permissions/roles";

export const dynamic = "force-dynamic";

export default async function AdminOpportunitiesPage() {
  await requireAuth();
  const opportunities = await OpportunityRepository.findAllAdmin();

  const total = opportunities.length;
  const active = opportunities.filter((o: any) => o.isActive).length;
  const typesCount = new Set(opportunities.map((o: any) => o.type)).size;

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-extrabold text-foreground tracking-tight">
          Opportunities & Grants CMS
        </h1>
        <p className="text-xs sm:text-sm text-muted-foreground mt-1">
          Post and manage open innovation challenges, incubation calls, hackathons, and research fellowships.
        </p>
      </div>

      <KpiRow
        items={[
          { title: "Total Calls", value: total, sub: "all opportunities" },
          { title: "Active & Open", value: active, sub: "accepting entries" },
          { title: "Inactive", value: total - active, sub: "archived" },
          { title: "Opportunity Types", value: typesCount, sub: "categories" },
        ]}
      />

      <OpportunityManager
        initialOpportunities={JSON.parse(JSON.stringify(opportunities))}
      />
    </div>
  );
}
