"use client";

import type { ButtonHTMLAttributes, ReactNode } from "react";
import { useFormStatus } from "react-dom";

export default function PendingActionButton({
  children,
  pendingLabel,
  className,
  ...buttonProps
}: {
  children: ReactNode;
  pendingLabel: string;
  className: string;
} & Omit<ButtonHTMLAttributes<HTMLButtonElement>, "children" | "className" | "type">) {
  const { pending } = useFormStatus();

  return (
    <button type="submit" disabled={pending} aria-busy={pending} className={`${className} disabled:cursor-wait disabled:opacity-60`} {...buttonProps}>
      {pending && <span aria-hidden="true" className="loader-spin h-3.5 w-3.5 rounded-full border-2 border-current/30 border-t-current" />}
      {pending ? pendingLabel : children}
    </button>
  );
}
