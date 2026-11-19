import type { ReactNode } from "react";
// Public website shell: navbar, scroll frame and animations.
// The admin panel lives outside this group and has its own layout.
export default function SiteLayout({ children }: { children: ReactNode }) {
  return <>{children}</>;
}
