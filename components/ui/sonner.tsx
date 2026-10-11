"use client";

import { useTheme } from "next-themes";
import { Toaster as SonnerToaster } from "sonner";

export type ToasterProps = React.ComponentProps<typeof SonnerToaster>;

/**
 * App-wide toast host.
 *
 * Mounted INSIDE <ThemeProvider> (unlike the previous root-level <Toaster>) so the
 * `useTheme()` read resolves correctly and toasts follow the active colour scheme.
 */
export function Toaster(props: ToasterProps) {
  const { theme = "system" } = useTheme();

  return (
    <SonnerToaster
      theme={theme as ToasterProps["theme"]}
      className="toaster group"
      position="top-center"
      closeButton
      richColors
      visibleToasts={4}
      duration={4000}
      toastOptions={{
        classNames: {
          toast: "janic-toast",
          title: "janic-toast-title",
          description: "janic-toast-description",
          actionButton: "janic-toast-action",
          cancelButton: "janic-toast-cancel",
          closeButton: "janic-toast-close",
        },
      }}
      style={
        {
          "--normal-bg": "var(--card)",
          "--normal-text": "var(--card-foreground)",
          "--normal-border": "var(--border)",
        } as React.CSSProperties
      }
      {...props}
    />
  );
}