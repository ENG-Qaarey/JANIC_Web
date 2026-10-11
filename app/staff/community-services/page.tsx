import type { Metadata } from "next";
import CommunityServiceManager from "@/components/admin/CommunityServiceManager";

export const metadata: Metadata = {
  title: "Community Services | JANIC Staff",
  description: "Manage community service requests",
};

export default function StaffCommunityServicesPage() {
  return <CommunityServiceManager />;
}
