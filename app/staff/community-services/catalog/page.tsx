import type { Metadata } from "next";
import ServiceCatalogManager from "@/components/admin/ServiceCatalogManager";

export const metadata: Metadata = {
  title: "Service Catalog | JANIC Staff",
  description: "Manage community service categories and services",
};

export default function StaffServiceCatalogPage() {
  return <ServiceCatalogManager />;
}