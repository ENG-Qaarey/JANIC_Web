import React from "react";
import { PublicHeader } from "@/components/layout/PublicHeader";
import { PublicFooter } from "@/components/layout/PublicFooter";
import { isEnabled, getSetting } from "@/lib/settings";
import { getCurrentUser } from "@/lib/auth/jwt";
import { HubRepository } from "@/repositories/hub.repository";
import type { AuthUser } from "@/types/user";

export const dynamic = "force-dynamic";

export default async function PublicLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const maintenance = await isEnabled("maintenance_mode");

  if (maintenance) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-background px-4 text-center">
        <h1 className="text-3xl font-extrabold tracking-tight">Under Maintenance</h1>
        <p className="mt-3 max-w-md text-sm text-muted-foreground">
          We are performing scheduled maintenance. Please check back soon.
        </p>
      </div>
    );
  }

  const navLinksRaw = await getSetting("nav_links");
  let navLinks: { name: string; href: string }[] | undefined;
  try {
    if (navLinksRaw) navLinks = JSON.parse(navLinksRaw);
  } catch {
    navLinks = undefined;
  }

  let currentUser: AuthUser | null = null;
  try {
    currentUser = await getCurrentUser();
  } catch {
    currentUser = null;
  }

  // Only hubs whose public link is switched on may appear in the main navigation.
  let hubLinks: { name: string; href: string }[] = [];
  try {
    hubLinks = await HubRepository.findPublicLinks();
  } catch {
    hubLinks = [];
  }

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <PublicHeader navLinks={navLinks} hubLinks={hubLinks} currentUser={currentUser} />
      <div className="flex-1">{children}</div>
      <PublicFooter hubLinks={hubLinks} />
    </div>
  );
}
