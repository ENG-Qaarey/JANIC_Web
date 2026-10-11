import React from "react";
import { getCurrentUser } from "@/lib/auth/jwt";
import { StaffShell } from "@/components/staff/StaffShell";
import prisma from "@/lib/db/prisma";
import { redirect } from "next/navigation";

export default async function StaffLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const user = await getCurrentUser();

  if (!user) {
    redirect("/login?from=/staff/dashboard");
  }

  // Double check they are staff or admin
  if (user.role !== "STAFF" && user.role !== "ADMIN") {
    redirect("/login");
  }

  const [pendingSubmissions, unreadMessages] = await Promise.all([
    prisma.innovationSubmission.count({ where: { status: "PENDING" } }),
    prisma.contactMessage.count({ where: { status: "UNREAD" } }),
  ]);
  const notifCount = pendingSubmissions + unreadMessages;

  return <StaffShell user={user} notifCount={notifCount}>{children}</StaffShell>;
}
