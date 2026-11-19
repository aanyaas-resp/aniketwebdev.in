import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { signIn } from "@/app/admin/actions";
import { createSupabaseServerClient } from "@/lib/supabase/server";
import AdminLoginSubmitButton from "@/components/admin/AdminLoginSubmitButton";

export const metadata: Metadata = { title: "Admin login", robots: { index: false, follow: false } };

const messages: Record<string, string> = {
  invalid: "Email or password is incorrect.",
  forbidden: "This account does not have admin access.",
};

export default async function LoginPage({ searchParams }: { searchParams: Promise<{ error?: string }> }) {
  const { error } = await searchParams;

  // Already signed in as an admin: go straight to the dashboard.
  const supabase = await createSupabaseServerClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (user && (await supabase.rpc("is_admin")).data === true) redirect("/admin");

  return (
    <main className="admin-shell flex min-h-dvh items-center justify-center px-5 py-12">
      <form action={signIn} className="w-full max-w-[420px] space-y-6 rounded-[24px] border border-[var(--foreground)]/10 bg-[var(--background)] p-7 shadow-[0_32px_90px_-54px_var(--foreground)] sm:p-9">
        <div>
          <p className="text-[10px] font-semibold uppercase tracking-[0.22em] text-[var(--foreground)]/45">Aniket Jamunde · Admin</p>
          <h1 className="mt-3 text-[36px] font-semibold leading-none tracking-[-0.055em]">Welcome back.</h1>
          <p className="mt-3 text-sm text-[var(--foreground)]/55">Sign in to manage your workspace.</p>
        </div>
        {error && messages[error] && (
          <p role="alert" className="rounded-xl border border-rose-500/30 bg-rose-500/10 px-4 py-3 text-sm text-rose-700">
            {messages[error]}
          </p>
        )}
        <label className="block space-y-2 text-[13px] font-medium text-[var(--foreground)]/75">
          Email
          <input name="email" type="email" required autoComplete="email" className="w-full rounded-xl border border-[var(--foreground)]/12 bg-[var(--background)] px-4 py-3 text-sm text-[var(--foreground)] focus:border-[var(--accent)] focus:outline-none focus:ring-2 focus:ring-[var(--accent)]/30" />
        </label>
        <label className="block space-y-2 text-[13px] font-medium text-[var(--foreground)]/75">
          Password
          <input name="password" type="password" required autoComplete="current-password" className="w-full rounded-xl border border-[var(--foreground)]/12 bg-[var(--background)] px-4 py-3 text-sm text-[var(--foreground)] focus:border-[var(--accent)] focus:outline-none focus:ring-2 focus:ring-[var(--accent)]/30" />
        </label>
        <AdminLoginSubmitButton />
      </form>
    </main>
  );
}
