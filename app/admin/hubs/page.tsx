import React from "react";
import { KpiRow } from "@/components/admin/KpiRow";
import { HubRepository } from "@/repositories/hub.repository";
import { HubManager } from "@/components/admin/HubManager";
import { requireAuth } from "@/lib/permissions/roles";

export const dynamic = "force-dynamic";

export default async function AdminHubsPage() {
  await requireAuth();
  const hubs = await HubRepository.findAllAdmin();

  const totalHubs = hubs.length;
  const activeHubs = hubs.filter((h: any) => h.isActive).length;
  const categoriesCount = new Set(hubs.map((h: any) => h.category)).size;

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-extrabold text-foreground tracking-tight">
          Hubs & Programmes Management
        </h1>
        <p className="text-xs sm:text-sm text-muted-foreground mt-1">
          Create, edit, reorder, and configure JANIC innovation labs, research centers, and incubation programs.
        </p>
      </div>

      <KpiRow
        items={[
          { title: "Total Hubs", value: totalHubs, sub: "all listed" },
          { title: "Active & Public", value: activeHubs, sub: "visible" },
          { title: "Inactive", value: totalHubs - activeHubs, sub: "drafts" },
          { title: "Domains", value: categoriesCount, sub: "categories" },
        ]}
      />

      <HubManager initialHubs={JSON.parse(JSON.stringify(hubs))} />
    </div>
  );
}
