"use client";

import { useFormStatus } from "react-dom";
import Loader from "@/components/ui/Loader";

export default function AdminLoginSubmitButton() {
  const { pending } = useFormStatus();

  return (
    <>
      <button
        type="submit"
        disabled={pending}
        aria-busy={pending}
        className="h-11 w-full rounded-xl bg-[var(--accent)] text-sm font-semibold text-[var(--accent-ink)] transition-all hover:-translate-y-0.5 hover:brightness-95 disabled:cursor-wait disabled:opacity-60"
      >
        {pending ? "Signing in..." : "Sign in"}
      </button>
      {pending && (
        <div className="fixed inset-0 z-[100] grid place-items-center bg-black/25 px-5 backdrop-blur-sm">
          <div className="rounded-3xl border border-[var(--foreground)]/10 bg-[var(--background)] p-8 shadow-2xl">
            <Loader label="Signing in" />
          </div>
        </div>
      )}
    </>
  );
}
