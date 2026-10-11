import React from "react";
import { redirect } from "next/navigation";
import { getCurrentUser } from "@/lib/auth/jwt";
import { AdminShell } from "@/components/admin/AdminShell";
import prisma from "@/lib/db/prisma";
import { SettingService } from "@/services/settings/setting.service";

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const user = await getCurrentUser();

  if (!user) {
    return <>{children}</>;
  }

  if (user.role === "STAFF") {
    redirect("/staff/dashboard");
  }

  if (user.role === "USER") {
    redirect("/");
  }

  const [unreadMessages, pendingSubmissions, newPartnerships, rolePermSetting] = await Promise.all([
    prisma.contactMessage.count({ where: { status: "UNREAD" } }),
    prisma.innovationSubmission.count({ where: { status: "PENDING" } }),
    (prisma.partnershipInquiry as any).count({ where: { isApproved: false, isRejected: false } }),
    SettingService.getByKey("role_permissions"),
  ]);
  const notifCount = unreadMessages + pendingSubmissions + newPartnerships;

  return <AdminShell user={user} notifCount={notifCount}>{children}</AdminShell>;
}
