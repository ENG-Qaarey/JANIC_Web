import type { Metadata } from "next";
import { ThemeProvider } from "@/components/theme/ThemeProvider";
import { Toaster } from "@/components/ui/sonner";
import { ClerkProvider } from "@clerk/nextjs";
import "./globals.css";

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
      { url: "/images/janic-logo-white-badge.png", type: "image/png" },
    ],
    shortcut: "/images/janic-logo-white-badge.png",
    apple: "/images/janic-logo-white-badge.png",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning className="h-full antialiased scroll-smooth">
      <head>
        <link rel="icon" href="/images/janic-logo-white-badge.png" type="image/png" sizes="any" />
        <link rel="shortcut icon" href="/images/janic-logo-white-badge.png" type="image/png" />
        <link rel="apple-touch-icon" href="/images/janic-logo-white-badge.png" />
      </head>
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
