import type { Metadata } from "next";
import ServiceCatalogManager from "@/components/admin/ServiceCatalogManager";

export const metadata: Metadata = {
  title: "Service Catalog | JANIC Admin",
  description: "Manage community service categories and services",
};

export default function AdminServiceCatalogPage() {
  return <ServiceCatalogManager />;
}