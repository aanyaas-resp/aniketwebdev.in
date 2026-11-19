import type { Metadata, Viewport } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import type { CSSProperties } from "react";
import "./globals.css";
import { getSettings } from "@/lib/content";
import { siteUrl } from "@/lib/seo";
import { inkFor } from "@/lib/theme";
import Frame from "@/components/layout/frame";
import ChatWidget from "@/components/chat/ChatWidget";

const geistSans = Geist({ variable: "--font-geist-sans", subsets: ["latin"] });
const geistMono = Geist_Mono({ variable: "--font-geist-mono", subsets: ["latin"] });

export async function generateMetadata(): Promise<Metadata> {
  const settings = await getSettings();
  const base = siteUrl();
  return {
    metadataBase: new URL(base),
    title: {
      default: `${settings.brand_name} | ${settings.tagline ?? "Web, App & AI Development"}`,
      template: `%s | ${settings.brand_name}`,
    },
    description: settings.meta_description ?? undefined,
    applicationName: settings.brand_name,
    authors: [{ name: settings.brand_name, url: base }],
    creator: settings.brand_name,
    publisher: settings.brand_name,
    alternates: { canonical: "/" },
    robots: { index: true, follow: true, googleBot: { index: true, follow: true, "max-image-preview": "large", "max-snippet": -1 } },
    openGraph: {
      type: "website",
      siteName: settings.brand_name,
      url: base,
      title: settings.brand_name,
      description: settings.meta_description ?? undefined,
      locale: "en_IN",
    },
    twitter: { card: "summary_large_image", title: settings.brand_name, description: settings.meta_description ?? undefined },
    ...(process.env.NEXT_PUBLIC_GOOGLE_SITE_VERIFICATION
      ? { verification: { google: process.env.NEXT_PUBLIC_GOOGLE_SITE_VERIFICATION } }
      : {}),
    icons: { icon: "/logo.png", apple: "/logo.png" },
  };
}

export const viewport: Viewport = {
  themeColor: "#f4f8ea",
  width: "device-width",
  initialScale: 1,
};

export default async function RootLayout({ children }: { children: React.ReactNode }) {
  const settings = await getSettings();
  const base = siteUrl();

  // Theme colors come from the admin panel (site_settings) and are exposed as CSS variables.
  const themeStyle = {
    "--accent": settings.accent_color,
    "--accent-ink": inkFor(settings.accent_color),
    "--secondary": settings.secondary_color,
    "--highlight": settings.highlight_color,
    "--background": settings.background_color,
    "--foreground": settings.foreground_color,
  } as CSSProperties;

  const jsonLd = [
    {
      "@context": "https://schema.org",
      "@type": "Organization",
      name: settings.brand_name,
      url: base,
      logo: `${base}/logo.png`,
      description: settings.meta_description ?? undefined,
      ...(settings.contact_email ? { email: settings.contact_email } : {}),
      ...(settings.phone ? { telephone: settings.phone } : {}),
      areaServed: "IN",
      ...(process.env.NEXT_PUBLIC_BUSINESS_CITY
        ? {
            address: {
              "@type": "PostalAddress",
              addressLocality: process.env.NEXT_PUBLIC_BUSINESS_CITY,
              addressRegion: "Maharashtra",
              addressCountry: "IN",
            },
          }
        : {}),
      knowsAbout: ["Website development", "Mobile app development", "SEO", "AEO", "GEO", "AI automation", "E-commerce"],
    },
    {
      "@context": "https://schema.org",
      "@type": "WebSite",
      name: settings.brand_name,
      url: base,
    },
  ];

  return (
    <html
      lang="en"
      style={themeStyle}
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="h-full bg-[var(--background)] font-sans text-[var(--foreground)]">
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd).replace(/</g, "\\u003c") }}
        />
        <Frame settings={settings}>{children}</Frame>
        <ChatWidget enabled={settings.chat_enabled} greeting={settings.chat_greeting ?? ""} suggestions={settings.chat_suggestions} whatsapp={settings.whatsapp} />
      </body>
    </html>
  );
}
