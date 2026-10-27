import React from "react";
import { KpiRow } from "@/components/admin/KpiRow";
import { ResourceDocumentRepository } from "@/repositories/resource-document.repository";
import { DownloadManager } from "@/components/admin/DownloadManager";
import { requireAuth } from "@/lib/permissions/roles";

export const dynamic = "force-dynamic";

export default async function AdminDownloadsPage() {
  await requireAuth();
  const documents = await ResourceDocumentRepository.findAllAdmin();

  const total = documents.length;
  const active = documents.filter((d: any) => d.isActive).length;
  const categoriesCount = new Set(documents.map((d: any) => d.category)).size;

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-extrabold text-foreground tracking-tight">
          Downloads & Forms CMS
        </h1>
        <p className="text-xs sm:text-sm text-muted-foreground mt-1">
          Manage downloadable policies, guides, application templates, and governance publications.
        </p>
      </div>

      <KpiRow
        items={[
          { title: "Total Documents", value: total, sub: "all materials" },
          { title: "Active & Public", value: active, sub: "downloadable" },
          { title: "Inactive", value: total - active, sub: "drafts" },
          { title: "Categories", value: categoriesCount, sub: "distinct groups" },
        ]}
      />

      <DownloadManager
        initialDocuments={JSON.parse(JSON.stringify(documents))}
      />
    </div>
  );
}
