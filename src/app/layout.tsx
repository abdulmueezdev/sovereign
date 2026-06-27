import type { Metadata } from "next";
import { Cormorant_Garamond, Space_Grotesk, Space_Mono } from "next/font/google";
import "./globals.css";
import { Toaster } from "@/components/ui/sonner";

const cormorant = Cormorant_Garamond({
  variable: "--font-cormorant",
  subsets: ["latin"],
  weight: ["400", "700"],
  style: ["normal", "italic"],
  display: "swap",
});

const spaceGrotesk = Space_Grotesk({
  variable: "--font-space-grotesk",
  subsets: ["latin"],
  weight: ["400", "500", "600"],
  display: "swap",
});

const spaceMono = Space_Mono({
  variable: "--font-space-mono",
  subsets: ["latin"],
  weight: ["400", "700"],
  display: "swap",
});

export const metadata: Metadata = {
  title: "Sovereign — Forge Your Kingdom",
  description: "Turn real-life self-improvement into an RPG kingdom-building game. Complete quests, earn XP, level up, and build your sovereign realm.",
  keywords: ["Sovereign", "RPG", "self-improvement", "gamification", "kingdom", "quests", "leveling"],
  icons: {
    icon: "/logo.svg",
  },
};

import { PWARegistration } from '@/components/pwa/PWARegistration'

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark" suppressHydrationWarning>
      <head>
        <link rel="manifest" href="/manifest.json" />
        <meta name="theme-color" content="#080808" />
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="black-translucent" />
        <link rel="apple-touch-icon" href="/logo.svg" />
      </head>
      <body
        className={`${cormorant.variable} ${spaceGrotesk.variable} ${spaceMono.variable} font-sans antialiased bg-background text-foreground`}
      >
        <PWARegistration />
        {children}
        <Toaster
          position="bottom-right"
          gap={8}
          toastOptions={{
            duration: 3000,
            style: {
              background: '#0C0C0C',
              border: '1px solid #2A2A2A',
              borderRadius: '0',
              color: '#E8E6E0',
              padding: '10px 14px',
              maxWidth: '300px',
              fontSize: '11px',
              letterSpacing: '0.1em',
              fontFamily: 'var(--font-space-mono, monospace)',
            },
          }}
        />
      </body>
    </html>
  );
}
