import type { Metadata } from "next";
import CommunityServiceManager from "@/components/admin/CommunityServiceManager";

export const metadata: Metadata = {
  title: "Service Requests | JANIC Admin",
  description: "Manage community service requests",
};

export default function AdminCommunityServicesPage() {
  return <CommunityServiceManager />;
}