"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { usePathname, useRouter } from "next/navigation";
import { Menu, X, LogIn, UserPlus, LayoutDashboard, LogOut, ChevronDown, FolderKanban, Users, UserCircle, HandHeart } from "lucide-react";
import { cn } from "@/lib/utils";
import { ThemeModeDropdown } from "@/components/theme/ThemeModeDropdown";
import { useUser, useClerk } from "@clerk/nextjs";
import type { AuthUser } from "@/types/user";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

const defaultNavLinks = [
  { name: "ABOUT", href: "/about" },
  { name: "WHAT WE DO", href: "/what-we-do" },
  { name: "INNOVATION HUB", href: "/innovation-hub" },
  { name: "PROJECTS", href: "/projects" },
  { name: "TRAINING", href: "/training" },
  { name: "RESEARCH", href: "/research" },
  { name: "EVENTS", href: "/events" },
  { name: "PARTNERSHIPS", href: "/partnerships" },
];

interface PublicHeaderProps {
  navLinks?: { name: string; href: string }[];
  currentUser?: AuthUser | null;
}

function getUserInitial(name: string): string {
  if (!name || name.length === 0) return "U";
  const trimmed = name.trim();
  if (trimmed.length === 0) return "U";
  return trimmed.charAt(0).toUpperCase();
}

interface UserAvatarMenuProps {
  user: AuthUser;
  loggingOut: boolean;
  onLogout: () => void;
}

function UserAvatarMenu({ user, loggingOut, onLogout }: UserAvatarMenuProps) {
  const router = useRouter();
  const initial = getUserInitial(user.name);
  const isJamiila =
    user.username === "jamiila" ||
    user.name.toLowerCase().includes("jamiila") ||
    user.email?.toLowerCase().includes("jamiila");
  const usernameDisplay = user.username ? `@${user.username}` : (isJamiila ? "@jamiila" : user.name);

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <button
          type="button"
          className="relative inline-flex items-center gap-2 pl-1.5 pr-3 py-1 rounded-full border border-slate-200/90 dark:border-slate-800 bg-white/95 dark:bg-slate-900/95 hover:bg-blue-50/60 dark:hover:bg-slate-800 transition-all shadow-xs shrink-0 group"
          aria-label="User menu"
        >
          <Avatar className="h-8 w-8 xl:h-8.5 xl:w-8.5 ring-2 ring-[#0875D1]/30">
            {user.avatar ? (
              <AvatarImage src={user.avatar} alt={user.name} />
            ) : null}
            <AvatarFallback className="bg-gradient-to-br from-[#0875D1] to-[#08245C] text-white font-bold text-xs">
              {initial}
            </AvatarFallback>
          </Avatar>
          <div className="hidden sm:flex flex-col text-left leading-tight">
            <span className="text-[11px] font-extrabold text-[#08245C] dark:text-slate-100 group-hover:text-[#0875D1] transition-colors">
              {usernameDisplay}
            </span>
            <span className="text-[9px] font-bold text-[#0875D1] dark:text-sky-400 tracking-tight">
              {isJamiila ? "Dean of CS & IT" : user.role}
            </span>
          </div>
        </button>
      </DropdownMenuTrigger>
      <DropdownMenuContent
        className="w-64 overflow-hidden rounded-xl border border-slate-200/80 dark:border-slate-800 bg-white dark:bg-slate-950 p-1.5 shadow-[0_1px_2px_rgba(0,0,0,0.05),0_20px_45px_-12px_rgba(8,36,92,0.25)] backdrop-blur-xl"
        align="end"
        forceMount
      >
        <DropdownMenuLabel className="font-normal rounded-lg bg-gradient-to-br from-[#F5F9FF] via-white to-[#E9F3FD] dark:from-slate-900 dark:via-slate-950 dark:to-slate-900 p-3 mb-1 border border-slate-100/80 dark:border-slate-800/80">
          <div className="flex flex-col space-y-1">
            <div className="flex items-center justify-between gap-1.5">
              <p className="text-sm font-bold leading-none text-[#08245C] dark:text-slate-100">
                {usernameDisplay}
              </p>
              <span className="px-2 py-0.5 rounded-full bg-[#0875D1]/15 text-[#0875D1] dark:text-sky-300 text-[9px] font-black uppercase tracking-wider">
                {isJamiila ? "ADMIN" : user.role}
              </span>
            </div>
            {isJamiila ? (
              <p className="text-xs font-bold text-[#0875D1] dark:text-sky-400">
                Dean of CS & IT
              </p>
            ) : null}
            <p className="text-[11px] text-slate-500 dark:text-slate-400 break-all">
              {user.email}
            </p>
            <p className="inline-flex items-center w-fit mt-1 px-2 py-0.5 rounded-full bg-[#08245C] dark:bg-[#0875D1] text-white text-[10px] font-extrabold tracking-wider uppercase shadow-xs">
              {isJamiila ? "Dean of CS & IT • System Admin" : (user.role as string) === "USER" ? "Member" : user.role}
            </p>
          </div>
        </DropdownMenuLabel>
        <DropdownMenuSeparator className="my-1 bg-slate-100 dark:bg-slate-800" />
        {(user.role as string) !== "USER" && (
          <>
            <DropdownMenuItem
              onClick={() => router.push(user.role === "STAFF" ? "/staff/profile" : "/admin/profile")}
              className="cursor-pointer gap-2 rounded-lg px-2.5 py-2 text-slate-800 dark:text-slate-200 hover:bg-gradient-to-r hover:from-[#E9F3FD] hover:to-white dark:hover:from-slate-900 dark:hover:to-slate-800 focus:bg-gradient-to-r focus:from-[#E9F3FD] focus:to-white dark:focus:from-slate-900 dark:focus:to-slate-800 hover:text-[#08245C] dark:hover:text-white transition-colors"
            >
              <span className="flex items-center justify-center w-7 h-7 rounded-lg bg-gradient-to-br from-[#0875D1]/10 to-[#08245C]/10 dark:from-[#0875D1]/15 dark:to-[#08245C]/15">
                <UserCircle className="h-4 w-4 text-[#0875D1]" />
              </span>
              <span className="text-sm font-bold">My Profile</span>
            </DropdownMenuItem>
            <DropdownMenuItem
              onClick={() => router.push(user.role === "STAFF" ? "/staff/dashboard" : "/admin/dashboard")}
              className="cursor-pointer gap-2 rounded-lg px-2.5 py-2 text-slate-800 dark:text-slate-200 hover:bg-gradient-to-r hover:from-[#E9F3FD] hover:to-white dark:hover:from-slate-900 dark:hover:to-slate-800 focus:bg-gradient-to-r focus:from-[#E9F3FD] focus:to-white dark:focus:from-slate-900 dark:focus:to-slate-800 hover:text-[#08245C] dark:hover:text-white transition-colors"
            >
              <span className="flex items-center justify-center w-7 h-7 rounded-lg bg-gradient-to-br from-[#0875D1]/10 to-[#08245C]/10 dark:from-[#0875D1]/15 dark:to-[#08245C]/15">
                <LayoutDashboard className="h-4 w-4 text-[#0875D1]" />
              </span>
              <span className="text-sm font-bold">Dashboard</span>
            </DropdownMenuItem>
            <DropdownMenuSeparator className="my-1 bg-slate-100 dark:bg-slate-800" />
          </>
        )}
        <DropdownMenuItem
          onClick={onLogout}
          disabled={loggingOut}
          className="text-red-600 focus:text-red-600 cursor-pointer gap-2 rounded-lg px-2.5 py-2 hover:bg-red-50 dark:hover:bg-red-950/30 focus:bg-red-50 dark:focus:bg-red-950/30 transition-colors"
        >
          <span className="flex items-center justify-center w-7 h-7 rounded-lg bg-red-50 dark:bg-red-950/40 border border-red-100 dark:border-red-900/40">
            <LogOut className="h-4 w-4 text-red-600" />
          </span>
          <span className="text-sm font-bold">
            {loggingOut ? "Logging out..." : "Log out"}
          </span>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

export function PublicHeader({ navLinks, currentUser }: PublicHeaderProps) {
  const links = navLinks && navLinks.length > 0 ? navLinks : defaultNavLinks;
  const pathname = usePathname();
  const router = useRouter();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [projectsDropdownOpen, setProjectsDropdownOpen] = useState(false);
  const [partnershipsDropdownOpen, setPartnershipsDropdownOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [loggingOut, setLoggingOut] = useState(false);
  const { user: clerkUser, isSignedIn: isClerkSignedIn } = useUser();
  const { signOut: clerkSignOut } = useClerk();

  const activeUser: AuthUser | null = currentUser || (isClerkSignedIn && clerkUser ? {
    id: clerkUser.id,
    name: clerkUser.fullName || clerkUser.username || clerkUser.primaryEmailAddress?.emailAddress || "Member",
    username: clerkUser.username || clerkUser.firstName?.toLowerCase() || "member",
    email: clerkUser.primaryEmailAddress?.emailAddress || "",
    role: "USER" as any,
    avatar: clerkUser.imageUrl,
  } : null);
  const isLoggedIn = Boolean(activeUser);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 15);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    if (isClerkSignedIn && clerkUser) {
      const email = clerkUser.primaryEmailAddress?.emailAddress;
      if (email) {
        fetch("/api/auth/sync", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            email,
            name: clerkUser.fullName || clerkUser.username || "Member",
            username: clerkUser.username || email.split("@")[0],
            avatar: clerkUser.imageUrl,
          }),
        }).catch(() => {});
      }
    }
  }, [isClerkSignedIn, clerkUser?.id]);

  const [lastPathname, setLastPathname] = useState(pathname);

  if (pathname !== lastPathname) {
    setLastPathname(pathname);
    setMobileMenuOpen(false);
  }

  const handleLogout = async () => {
    setLoggingOut(true);
    try {
      if (isClerkSignedIn) {
        await clerkSignOut();
      }
      await fetch("/api/auth/logout", { method: "POST" });
      router.push("/");
      router.refresh();
    } catch {
      router.push("/");
    } finally {
      setLoggingOut(false);
    }
  };

  return (
    <header
      className={cn(
        "sticky top-0 z-40 w-full transition-all duration-200 bg-white dark:bg-slate-950 border-b border-slate-100 dark:border-slate-800",
        scrolled ? "shadow-sm py-3" : "py-3.5 sm:py-4"
      )}
    >
      <div className="max-w-[1380px] mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between">
        {/* Brand Logo with exact image */}
        <Link href="/" className="flex items-center shrink-0 group">
          <div className="relative h-9 sm:h-10 w-40 sm:w-48 xl:w-56 transition-transform group-hover:scale-[1.02]">
            <Image
              src="/images/janic-with-jazeera-blue.png"
              alt="JANIC — Jazeera Nexus Innovation Center"
              fill
              className="object-contain object-left dark:hidden"
              priority
              sizes="(max-width: 640px) 160px, (max-width: 1280px) 192px, 224px"
            />
            <Image
              src="/images/janic-with-jazeera-white.png"
              alt="JANIC — Jazeera Nexus Innovation Center"
              fill
              className="object-contain object-left hidden dark:block"
              priority
              sizes="(max-width: 640px) 160px, (max-width: 1280px) 192px, 224px"
            />
          </div>
        </Link>

        {/* Desktop Navigation Links */}
        <nav className="hidden lg:flex items-center gap-2.5 xl:gap-4 2xl:gap-6">
          {links.map((link) => {
            const isProjects = link.name === "PROJECTS";
            const isProjectsActive =
              pathname === "/projects" ||
              (pathname.startsWith("/projects/") && !pathname.includes("/members")) ||
              pathname === "/project-members" ||
              pathname.startsWith("/project-members") ||
              pathname === "/projects/members";
            const isActive = isProjects
              ? isProjectsActive
              : pathname === link.href || pathname.startsWith(link.href + "/");

            if (isProjects) {
              return (
                <div
                  key={link.name}
                  className="relative group py-2"
                  onMouseEnter={() => setProjectsDropdownOpen(true)}
                  onMouseLeave={() => setProjectsDropdownOpen(false)}
                >
                  <Link
                    href="/projects"
                    className={cn(
                      "inline-flex items-center gap-1 text-[10px] xl:text-[11px] font-bold tracking-wide transition-colors uppercase whitespace-nowrap",
                      isActive
                        ? "text-[#0875D1]"
                        : "text-slate-700 hover:text-[#0875D1] dark:text-slate-300"
                    )}
                  >
                    <span>{link.name}</span>
                    <ChevronDown
                      className={cn(
                        "w-3 h-3 transition-transform duration-200",
                        projectsDropdownOpen ? "rotate-180 text-[#0875D1]" : "text-slate-400 group-hover:text-[#0875D1]"
                      )}
                    />
                  </Link>

                  {/* Dropdown Menu Card */}
                  <div
                    className={cn(
                      "absolute top-full left-1/2 -translate-x-1/2 pt-2 w-64 transition-all duration-200 z-50",
                      projectsDropdownOpen
                        ? "opacity-100 visible translate-y-0"
                        : "opacity-0 invisible -translate-y-1 pointer-events-none"
                    )}
                  >
                    <div className="bg-white/98 dark:bg-slate-900/98 backdrop-blur-xl rounded-2xl border border-slate-200/90 dark:border-slate-800 p-2 shadow-[0_12px_36px_-10px_rgba(8,36,92,0.22)] dark:shadow-[0_12px_36px_-10px_rgba(0,0,0,0.6)] space-y-1">
                      <Link
                        href="/projects"
                        onClick={() => setProjectsDropdownOpen(false)}
                        className={cn(
                          "flex items-start gap-3 p-2.5 rounded-xl transition-all group/item",
                          pathname === "/projects" || (pathname.startsWith("/projects/") && !pathname.includes("/members"))
                            ? "bg-blue-50/80 dark:bg-blue-950/60 text-[#0875D1]"
                            : "hover:bg-slate-50 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-200"
                        )}
                      >
                        <div className="p-2 rounded-lg bg-blue-100/70 dark:bg-blue-900/40 text-[#0875D1] shrink-0 mt-0.5 group-hover/item:scale-105 transition-transform">
                          <FolderKanban className="w-4 h-4" />
                        </div>
                        <div className="min-w-0">
                          <div className="text-xs font-bold leading-tight flex items-center gap-1.5">
                            <span>All Projects</span>
                            <span className="text-[9px] font-black px-1.5 py-0.2 rounded-full bg-blue-100 text-[#0875D1] dark:bg-blue-900/60 dark:text-sky-300">
                              15
                            </span>
                          </div>
                          <div className="text-[10px] text-slate-500 dark:text-slate-400 mt-0.5 leading-snug">
                            Explore 15 innovation prototypes
                          </div>
                        </div>
                      </Link>

                      <Link
                        href="/project-members"
                        onClick={() => setProjectsDropdownOpen(false)}
                        className={cn(
                          "flex items-start gap-3 p-2.5 rounded-xl transition-all group/item",
                          pathname === "/project-members" || pathname.startsWith("/project-members") || pathname === "/projects/members"
                            ? "bg-blue-50/80 dark:bg-blue-950/60 text-[#0875D1]"
                            : "hover:bg-slate-50 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-200"
                        )}
                      >
                        <div className="p-2 rounded-lg bg-emerald-100/70 dark:bg-emerald-900/40 text-emerald-600 dark:text-emerald-400 shrink-0 mt-0.5 group-hover/item:scale-105 transition-transform">
                          <Users className="w-4 h-4" />
                        </div>
                        <div className="min-w-0">
                          <div className="text-xs font-bold leading-tight flex items-center gap-1.5">
                            <span>Project Members</span>
                            <span className="text-[9px] font-black px-1.5 py-0.2 rounded-full bg-emerald-100 text-emerald-700 dark:bg-emerald-900/60 dark:text-emerald-300">
                              Teams
                            </span>
                          </div>
                          <div className="text-[10px] text-slate-500 dark:text-slate-400 mt-0.5 leading-snug">
                            Meet student engineers & leads
                          </div>
                        </div>
                      </Link>
                    </div>
                  </div>
                </div>
              );
            }

            if (link.name === "PARTNERSHIPS") {
              const isPartnershipsActive =
                pathname === "/partnerships" || pathname.startsWith("/partnerships/");

              return (
                <div
                  key={link.name}
                  className="relative group py-2"
                  onMouseEnter={() => setPartnershipsDropdownOpen(true)}
                  onMouseLeave={() => setPartnershipsDropdownOpen(false)}
                >
                  <Link
                    href="/partnerships"
                    className={cn(
                      "inline-flex items-center gap-1 text-[10px] xl:text-[11px] font-bold tracking-wide transition-colors uppercase whitespace-nowrap",
                      isPartnershipsActive
                        ? "text-[#0875D1]"
                        : "text-slate-700 hover:text-[#0875D1] dark:text-slate-300"
                    )}
                  >
                    <span>{link.name}</span>
                    <ChevronDown
                      className={cn(
                        "w-3 h-3 transition-transform duration-200",
                        partnershipsDropdownOpen ? "rotate-180 text-[#0875D1]" : "text-slate-400 group-hover:text-[#0875D1]"
                      )}
                    />
                  </Link>

                  <div
                    className={cn(
                      "absolute top-full left-1/2 -translate-x-1/2 pt-2 w-64 transition-all duration-200 z-50",
                      partnershipsDropdownOpen
                        ? "opacity-100 visible translate-y-0"
                        : "opacity-0 invisible -translate-y-1 pointer-events-none"
                    )}
                  >
                    <div className="bg-white/98 dark:bg-slate-900/98 backdrop-blur-xl rounded-2xl border border-slate-200/90 dark:border-slate-800 p-2 shadow-[0_12px_36px_-10px_rgba(8,36,92,0.22)] dark:shadow-[0_12px_36px_-10px_rgba(0,0,0,0.6)] space-y-1">
                      <Link
                        href="/partnerships"
                        onClick={() => setPartnershipsDropdownOpen(false)}
                        className={cn(
                          "flex items-start gap-3 p-2.5 rounded-xl transition-all group/item",
                          isPartnershipsActive
                            ? "bg-blue-50/80 dark:bg-blue-950/60 text-[#0875D1]"
                            : "hover:bg-slate-50 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-200"
                        )}
                      >
                        <div className="p-2 rounded-lg bg-blue-100/70 dark:bg-blue-900/40 text-[#0875D1] shrink-0 mt-0.5 group-hover/item:scale-105 transition-transform">
                          <Users className="w-4 h-4" />
                        </div>
                        <div className="min-w-0">
                          <div className="text-xs font-bold leading-tight">
                            <span>Partnership</span>
                          </div>
                          <div className="text-[10px] text-slate-500 dark:text-slate-400 mt-0.5 leading-snug">
                            Our partners & collaborators
                          </div>
                        </div>
                      </Link>

                      <Link
                        href="/community-services"
                        onClick={() => setPartnershipsDropdownOpen(false)}
                        className="flex items-start gap-3 p-2.5 rounded-xl transition-all group/item hover:bg-slate-50 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-200"
                      >
                        <div className="p-2 rounded-lg bg-purple-100/70 dark:bg-purple-900/40 text-purple-600 dark:text-purple-400 shrink-0 mt-0.5 group-hover/item:scale-105 transition-transform">
                          <HandHeart className="w-4 h-4" />
                        </div>
                        <div className="min-w-0">
                          <div className="text-xs font-bold leading-tight">
                            <span>Community Service</span>
                          </div>
                          <div className="text-[10px] text-slate-500 dark:text-slate-400 mt-0.5 leading-snug">
                            Technology &amp; support for organizations
                          </div>
                        </div>
                      </Link>
                    </div>
                  </div>
                </div>
              );
            }

            return (
              <Link
                key={link.name}
                href={link.href}
                className={cn(
                  "text-[10px] xl:text-[11px] font-bold tracking-wide transition-colors uppercase whitespace-nowrap",
                  isActive
                    ? "text-[#0875D1]"
                    : "text-slate-700 hover:text-[#0875D1] dark:text-slate-300"
                )}
              >
                {link.name}
              </Link>
            );
          })}
        </nav>

        {/* Right Action: Desktop */}
        <div className="hidden lg:flex items-center gap-1.5 xl:gap-2.5 shrink-0">
          <Link
            href="/contact"
            className="inline-flex items-center gap-1 px-3 xl:px-4 py-2 text-slate-600 hover:text-[#0875D1] dark:text-slate-300 font-bold text-[10px] xl:text-xs tracking-wider uppercase transition rounded-full hover:bg-slate-50 dark:hover:bg-slate-900"
          >
            Contact
          </Link>
          <ThemeModeDropdown />
          {isLoggedIn ? (
            activeUser ? (
              <UserAvatarMenu user={activeUser} loggingOut={loggingOut} onLogout={handleLogout} />
            ) : null
          ) : (
            <>
              <Link
                href="/login"
                className="inline-flex items-center gap-1.5 px-3.5 xl:px-5 py-2 xl:py-2.5 rounded-full border border-slate-200 dark:border-slate-800 text-[#08245C] dark:text-slate-200 hover:border-[#08245C] dark:hover:border-slate-600 hover:bg-[#08245C] hover:text-white font-bold text-[10px] xl:text-xs tracking-wider uppercase transition"
              >
                <LogIn className="w-3.5 h-3.5" />
                Login
              </Link>
              <Link
                href="/register"
                className="inline-flex items-center gap-1.5 px-3.5 xl:px-5 py-2 xl:py-2.5 rounded-full bg-gradient-to-r from-[#0875D1] to-[#0aa5e8] hover:from-[#0660ab] hover:to-[#0891c7] text-white font-bold text-[10px] xl:text-xs tracking-wider uppercase shadow-md shadow-blue-500/25 hover:shadow-lg hover:-translate-y-0.5 transition-all"
              >
                <UserPlus className="w-3.5 h-3.5" />
                Join Us
              </Link>
            </>
          )}
        </div>

        {/* Mobile Hamburger Button */}
        <button
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          className="lg:hidden p-2 text-slate-700 hover:text-[#0875D1] rounded-lg hover:bg-slate-50 transition"
          aria-label="Toggle navigation menu"
        >
          {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
        </button>
      </div>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div className="lg:hidden border-t border-slate-100 dark:border-slate-800 bg-white dark:bg-slate-950 px-4 pt-4 pb-6 space-y-2 shadow-xl animate-in slide-in-from-top-2 duration-200">
          <div className="mb-4 flex items-center justify-between gap-3">
            <p className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">Theme</p>
            <ThemeModeDropdown />
          </div>

          {/* Logged-in user card (mobile) */}
          {isLoggedIn && activeUser && (
            <div className="mb-4 rounded-2xl border border-slate-200/80 dark:border-slate-800 bg-gradient-to-br from-[#F5F9FF] to-white dark:from-slate-900 dark:to-slate-950 p-4 flex items-center gap-3 shadow-[0_1px_2px_rgba(0,0,0,0.04),0_10px_25px_-15px_rgba(8,117,209,0.35)]">
              <Avatar className="h-11 w-11 shrink-0">
                {activeUser.avatar ? (
                  <AvatarImage src={activeUser.avatar} alt={activeUser.name} />
                ) : null}
                <AvatarFallback className="bg-gradient-to-br from-[#0875D1] to-[#08245C] text-white font-bold">
                  {getUserInitial(activeUser.name)}
                </AvatarFallback>
              </Avatar>
              <div className="min-w-0 flex-1">
                <p className="text-sm font-semibold text-slate-900 dark:text-slate-100 truncate">
                  {activeUser.username ? `@${activeUser.username}` : activeUser.name}
                </p>
                {activeUser.username === "jamiila" || activeUser.name.toLowerCase().includes("jamiila") ? (
                  <p className="text-xs font-bold text-[#0875D1] dark:text-sky-400">
                    Dean of CS & IT
                  </p>
                ) : null}
                <p className="text-[11px] text-muted-foreground truncate">
                  {activeUser.email}
                </p>
                <p className="text-[10px] font-extrabold tracking-wider text-[#0875D1] uppercase mt-0.5">
                  {activeUser.username === "jamiila" || activeUser.name.toLowerCase().includes("jamiila")
                    ? "Dean of CS & IT • System Admin"
                    : activeUser.role}
                </p>
              </div>
            </div>
          )}

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-1 mb-4">
            {links.map((link) => {
              if (link.name === "PROJECTS") {
                const isProjectsActive =
                  pathname === "/projects" ||
                  (pathname.startsWith("/projects/") && !pathname.includes("/members"));
                const isMembersActive =
                  pathname === "/project-members" ||
                  pathname.startsWith("/project-members") ||
                  pathname === "/projects/members";

                return (
                  <React.Fragment key={link.name}>
                    <Link
                      href="/projects"
                      onClick={() => setMobileMenuOpen(false)}
                      className={cn(
                        "px-3 py-2 rounded-lg text-xs font-bold uppercase tracking-wider transition dark:hover:bg-slate-900 flex items-center justify-between",
                        isProjectsActive
                          ? "text-[#0875D1] bg-blue-50/80 dark:bg-blue-950/50"
                          : "text-slate-700 dark:text-slate-300 hover:bg-slate-50 hover:text-[#0875D1]"
                      )}
                    >
                      <span>PROJECTS</span>
                      <span className="text-[9px] px-1.5 py-0.5 rounded-full bg-blue-100 dark:bg-blue-900/50 text-[#0875D1] font-black">
                        15
                      </span>
                    </Link>
                    <Link
                      href="/project-members"
                      onClick={() => setMobileMenuOpen(false)}
                      className={cn(
                        "px-3 py-2 rounded-lg text-xs font-bold uppercase tracking-wider transition dark:hover:bg-slate-900 flex items-center justify-between",
                        isMembersActive
                          ? "text-[#0875D1] bg-blue-50/80 dark:bg-blue-950/50"
                          : "text-slate-700 dark:text-slate-300 hover:bg-slate-50 hover:text-[#0875D1]"
                      )}
                    >
                      <span>PROJECT MEMBERS</span>
                      <span className="text-[9px] px-1.5 py-0.5 rounded-full bg-emerald-100 dark:bg-emerald-900/50 text-emerald-700 font-black">
                        TEAMS
                      </span>
                    </Link>
                  </React.Fragment>
                );
              }

              if (link.name === "PARTNERSHIPS") {
                const isPartnershipsActive =
                  pathname === "/partnerships" || pathname.startsWith("/partnerships/");

                return (
                  <React.Fragment key={link.name}>
                    <Link
                      href="/partnerships"
                      onClick={() => setMobileMenuOpen(false)}
                      className={cn(
                        "px-3 py-2 rounded-lg text-xs font-bold uppercase tracking-wider transition dark:hover:bg-slate-900 flex items-center gap-2",
                        isPartnershipsActive
                          ? "text-[#0875D1] bg-blue-50/80 dark:bg-blue-950/50"
                          : "text-slate-700 dark:text-slate-300 hover:bg-slate-50 hover:text-[#0875D1]"
                      )}
                    >
                      <Users className="w-3.5 h-3.5 text-[#0875D1]" />
                      <span>Partnership</span>
                    </Link>
                    <Link
                      href="/community-services"
                      onClick={() => setMobileMenuOpen(false)}
                      className="px-3 py-2 rounded-lg text-xs font-bold uppercase tracking-wider transition dark:hover:bg-slate-900 flex items-center gap-2 text-slate-700 dark:text-slate-300 hover:bg-slate-50 hover:text-[#0875D1]"
                    >
                      <HandHeart className="w-3.5 h-3.5 text-purple-500" />
                      <span>Community Service</span>
                    </Link>
                  </React.Fragment>
                );
              }

              const isActive = pathname === link.href || pathname.startsWith(link.href + "/");

              return (
                <Link
                  key={link.name}
                  href={link.href}
                  onClick={() => setMobileMenuOpen(false)}
                  className={cn(
                    "px-3 py-2 rounded-lg text-xs font-bold uppercase tracking-wider transition dark:hover:bg-slate-900",
                    isActive
                      ? "text-[#0875D1] bg-blue-50/80 dark:bg-blue-950/50"
                      : "text-slate-700 dark:text-slate-300 hover:bg-slate-50 hover:text-[#0875D1]"
                  )}
                >
                  {link.name}
                </Link>
              );
            })}
          </div>

          <div className="pt-2 border-t border-slate-100 dark:border-slate-800 flex flex-col gap-2">
            <Link
              href="/contact"
              className="w-full py-2.5 px-4 rounded-full border border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-300 font-semibold text-xs text-center"
            >
              Contact Us
            </Link>
            {isLoggedIn ? (
              <>
                {(currentUser?.role as string) !== "USER" && (
                  <>
                    <Link
                      href={currentUser?.role === "STAFF" ? "/staff/profile" : "/admin/profile"}
                      className="w-full py-2.5 px-4 rounded-full bg-gradient-to-r from-[#0875D1] to-[#0aa5e8] text-white font-semibold text-xs text-center shadow-md flex items-center justify-center gap-1.5"
                    >
                      <UserCircle className="w-3.5 h-3.5" />
                      My Profile
                    </Link>
                    <Link
                      href={currentUser?.role === "STAFF" ? "/staff/dashboard" : "/admin/dashboard"}
                      className="w-full py-2.5 px-4 rounded-full border border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-300 font-semibold text-xs text-center flex items-center justify-center gap-1.5"
                    >
                      <LayoutDashboard className="w-3.5 h-3.5" />
                      Dashboard
                    </Link>
                  </>
                )}
                <button
                  type="button"
                  onClick={handleLogout}
                  disabled={loggingOut}
                  className="w-full py-2.5 px-4 rounded-full border border-red-200 text-red-600 font-semibold text-xs text-center flex items-center justify-center gap-1.5 hover:bg-red-50 disabled:opacity-60 transition-colors"
                >
                  <LogOut className="w-3.5 h-3.5" />
                  {loggingOut ? "Logging out..." : "Log out"}
                </button>
              </>
            ) : (
              <>
                <Link
                  href="/login"
                  className="w-full py-2.5 px-4 rounded-full border border-[#08245C] text-[#08245C] font-semibold text-xs text-center flex items-center justify-center gap-1.5"
                >
                  <LogIn className="w-3.5 h-3.5" />
                  Login
                </Link>
                <Link
                  href="/register"
                  className="w-full py-2.5 px-4 rounded-full bg-gradient-to-r from-[#0875D1] to-[#0aa5e8] text-white font-semibold text-xs text-center shadow-md flex items-center justify-center gap-1.5"
                >
                  <UserPlus className="w-3.5 h-3.5" />
                  Join Us
                </Link>
              </>
            )}
            <Link
              href="/submit-innovation"
              className="w-full py-2.5 px-4 rounded-full bg-[#08245C] text-white font-semibold text-xs text-center shadow-sm"
            >
              Submit Innovation Idea
            </Link>
          </div>
        </div>
      )}
    </header>
  );
}
