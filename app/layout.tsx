import type { Metadata } from "next";
import { Plus_Jakarta_Sans } from "next/font/google";
import { ThemeProvider } from "@/components/theme/ThemeProvider";
import { Toaster } from "@/components/ui/sonner";
import { ClerkProvider } from "@clerk/nextjs";
import "./globals.css";

const plusJakartaSans = Plus_Jakarta_Sans({
  subsets: ["latin"],
  variable: "--font-plus-jakarta-sans",
  display: "swap",
});

export const metadata: Metadata = {
  title: {
    default: "JANIC | Jazeera Nexus Innovation Center — Jazeera University",
    template: "%s | JANIC",
  },
  description:
    "Jazeera Nexus Innovation Center (JANIC), Faculty of Computer Science & IT at Jazeera University. Technology, Innovation, Research, and Professional Training.",
  keywords: [
    "JANIC",
    "Jazeera Nexus Innovation Center",
    "Jazeera University",
    "Somalia Innovation",
    "Tech Hub Mogadishu",
    "Student Innovation",
    "Applied Research",
    "ICT Training",
    "Robotics",
    "AI",
  ],
  authors: [{ name: "Jazeera University - Faculty of Computer Science & IT" }],
  metadataBase: new URL(process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000"),
  icons: {
    icon: [
      { url: "/favicon.ico", sizes: "any" },
      { url: "/images/janic-new-icon.png", type: "image/png", sizes: "512x512" },
      { url: "/favicon.png", type: "image/png" },
    ],
    shortcut: "/favicon.ico",
    apple: "/images/janic-new-icon.png",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning className={`${plusJakartaSans.variable} h-full antialiased scroll-smooth`}>
      <body className="min-h-full flex flex-col bg-background text-foreground font-sans selection:bg-blue-600 selection:text-white">
        <ClerkProvider
          appearance={{
            options: {
              logoImageUrl: "/favicon.png",
            },
          }}
        >
          {/* Toaster lives INSIDE ThemeProvider so toasts follow the active colour scheme. */}
          <ThemeProvider>
            {children}
            <Toaster />
          </ThemeProvider>
        </ClerkProvider>
      </body>
    </html>
  );
}
