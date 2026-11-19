"use client";

import type { ReactNode } from "react";
import { usePathname } from "next/navigation";
import Navbar from "@/components/layout/navbar";
import SiteAnimations from "@/components/layout/site-animations";
import Footer from "@/components/layout/Footer";
import type { Settings } from "@/lib/content";
import BackLink from "@/components/ui/BackLink";

export default function Frame({ children, settings }: { children: ReactNode; settings: Settings }) {
  const pathname = usePathname();

  if (pathname === "/admin" || pathname.startsWith("/admin/") || pathname.startsWith("/i/")) {
    return <>{children}</>;
  }

  const backTarget =
    pathname.startsWith("/blog/")
      ? { href: "/blog", label: "All articles" }
      : pathname.startsWith("/servicesweoffer/")
        ? { href: "/#services", label: "All services" }
        : pathname.startsWith("/locations/")
          ? { href: "/locations", label: "All locations" }
          : pathname.startsWith("/developers/")
            ? { href: "/locations", label: "All locations" }
            : pathname.startsWith("/cities/")
              ? { href: "/locations", label: "All locations" }
              : { href: "/", label: "Home" };

  return (
    <div className="h-full p-2 sm:p-3 md:p-5">
      <div className="relative h-full overflow-visible rounded-[14px] bg-[var(--background)] sm:rounded-[20px]">
        <Navbar />
        <div className="frame-scroll h-full overflow-x-hidden overflow-y-auto overscroll-contain rounded-[14px] sm:rounded-[18px]">
          {pathname !== "/" && <BackLink href={backTarget.href} label={backTarget.label} />}
          <SiteAnimations>
            {children}
            <Footer settings={settings} />
          </SiteAnimations>
        </div>
      </div>
    </div>
  );
}
