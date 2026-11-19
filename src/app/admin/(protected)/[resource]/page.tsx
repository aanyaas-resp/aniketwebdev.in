import { notFound } from "next/navigation";
import Link from "next/link";
import { ArrowDown, ArrowLeft, ArrowUp, Copy, Eye, EyeOff, Mail, MessageCircle, Pencil, Plus, Search, Trash2 } from "lucide-react";
import { deleteRecord, duplicateRecord, moveRecord, saveRecord, toggleHandled, togglePublished } from "@/app/admin/actions";
import { RESOURCES, type Field, type Resource } from "@/lib/admin-config";
import { DEFAULT_SETTINGS } from "@/lib/content";
import { createSupabaseServerClient } from "@/lib/supabase/server";
import TitleWithAutoSlug from "@/components/admin/TitleWithAutoSlug";
import ImageUploadField from "@/components/admin/ImageUploadField";
import ThemePalettePreview from "@/components/admin/ThemePalettePreview";
import ColorSettingInput from "@/components/admin/ColorSettingInput";
import PendingActionButton from "@/components/admin/PendingActionButton";

type Props = {
  params: Promise<{ resource: string }>;
  searchParams: Promise<Record<string, string | undefined>>;
};

const panel = "rounded-[20px] border border-[var(--foreground)]/10 bg-[var(--background)] p-5 shadow-[0_8px_30px_-24px_var(--foreground)] sm:p-6";
const primary = "inline-flex h-10 items-center gap-2 rounded-xl bg-[var(--accent)] px-4 text-[13px] font-semibold text-[var(--accent-ink)] transition-all hover:-translate-y-0.5 hover:brightness-95";
const ghost = "inline-flex h-10 items-center gap-2 rounded-xl border border-[var(--foreground)]/10 bg-[var(--background)] px-3.5 text-[13px] font-medium text-[var(--foreground)]/75 transition-colors hover:bg-[var(--foreground)]/[0.05] hover:text-[var(--foreground)]";

const notices: Record<string, string> = {
  saved: "Saved. Your website is up to date.",
  deleted: "Moved to trash. Restore it from Trash in the sidebar.",
};

export default async function ResourcePage({ params, searchParams }: Props) {
  const { resource: key } = await params;
  const sp = await searchParams;
  const resource = RESOURCES[key];
  if (!resource) notFound();

  const supabase = await createSupabaseServerClient();

  const notice = sp.error
    ? { tone: "error", text: sp.error }
    : sp.saved || sp.deleted
      ? { tone: "ok", text: notices[sp.saved ? "saved" : "deleted"] }
      : null;

  const noticeBar = notice && (
    <p role="status" className={`mb-6 rounded-2xl px-5 py-3 text-sm ${notice.tone === "error" ? "border border-rose-500/20 bg-rose-500/10 text-rose-700" : "bg-[var(--accent)]/20 text-[var(--foreground)]"}`}>
      {notice.text}
    </p>
  );

  const header = (
    <div className="mb-8 flex flex-wrap items-end justify-between gap-5">
      <div>
        <p className="mb-2 text-[10px] font-semibold uppercase tracking-[0.2em] text-[var(--foreground)]/45">Content management</p>
        <h1 className="text-[34px] font-semibold leading-none tracking-[-0.05em] sm:text-[42px]">{resource.label}</h1>
        <p className="mt-3 max-w-xl text-sm leading-6 text-[var(--foreground)]/60">{resource.description}</p>
      </div>
      {!resource.singleton && !resource.readOnly && (
        <Link href={`/admin/${resource.key}?new=1`} className={primary}>
          <Plus size={18} aria-hidden="true" /> Add new
        </Link>
      )}
    </div>
  );

  // Settings and create/edit screens
  if (resource.singleton || sp.new || sp.id) {
    let row: Record<string, unknown> | null = null;
    if (resource.singleton) {
      const { data } = await supabase.from(resource.table).select("*").eq("id", 1).maybeSingle();
      row = data;
      if (resource.key === "settings") {
        const { data: billing } = await supabase.from("invoice_business_profile").select("*").eq("id", 1).maybeSingle();
        row = { ...(row ?? {}), ...(billing ?? {}) };
      }
    } else if (sp.id) {
      const { data } = await supabase.from(resource.table).select("*").eq("id", sp.id).maybeSingle();
      if (!data) notFound();
      row = data;
      if (resource.key === "clients") {
        const { data: billing } = await supabase.from("client_billing_profiles").select("*").eq("client_id", sp.id).maybeSingle();
        row = { ...row, ...(billing ?? {}) };
      }
    }
    return (
      <div className="max-w-4xl">
        {!resource.singleton && (
          <Link href={`/admin/${resource.key}`} className={`${ghost} mb-6`}>
            <ArrowLeft size={16} aria-hidden="true" /> Back to {resource.label}
          </Link>
        )}
        {header}
        {noticeBar}
        <ResourceForm resource={resource} row={row} />
      </div>
    );
  }

  const { data: allRows } = await supabase
    .from(resource.table)
    .select("*").is("deleted_at", null)
    .order(resource.orderBy ?? "created_at", { ascending: resource.ascending ?? false });

  const rows = allRows ?? [];
  const hasPublished = resource.fields.some((f) => f.name === "published");
  const status = sp.status ?? "all";
  const q = (sp.q ?? "").trim().toLowerCase();

  // Tab counts (before search filtering)
  const tabs = resource.readOnly
    ? [
        { key: "all", label: "All", count: rows.length },
        { key: "new", label: "New", count: rows.filter((r) => !r.handled).length },
        { key: "handled", label: "Handled", count: rows.filter((r) => r.handled).length },
      ]
    : hasPublished
      ? [
          { key: "all", label: "All", count: rows.length },
          { key: "published", label: "Live", count: rows.filter((r) => r.published).length },
          { key: "draft", label: "Drafts", count: rows.filter((r) => !r.published).length },
        ]
      : [];

  let items = rows;
  if (resource.readOnly && status === "new") items = items.filter((r) => !r.handled);
  if (resource.readOnly && status === "handled") items = items.filter((r) => r.handled);
  if (hasPublished && status === "published") items = items.filter((r) => r.published);
  if (hasPublished && status === "draft") items = items.filter((r) => !r.published);
  if (q) {
    items = items.filter((r) =>
      Object.values(r).some((v) => (typeof v === "string" || typeof v === "number") && String(v).toLowerCase().includes(q)),
    );
  }

  const imageField = resource.fields.find((f) => f.type === "image");
  const [titleCol, ...restCols] = resource.listColumns;

  return (
    <div>
      {header}
      {noticeBar}

      {/* Toolbar: filter tabs and search */}
      <div className="mb-6 flex flex-wrap items-center justify-between gap-4">
        {tabs.length > 0 ? (
          <nav aria-label="Filter" className="flex flex-wrap gap-2">
            {tabs.map((t) => {
              const active = status === t.key;
              return (
                <Link
                  key={t.key}
                  href={`/admin/${resource.key}?status=${t.key}${q ? `&q=${encodeURIComponent(q)}` : ""}`}
                  aria-current={active ? "true" : undefined}
                  className={`inline-flex h-10 items-center gap-2 rounded-full px-4 text-sm transition-colors ${active ? "bg-[var(--accent)] font-medium text-[var(--accent-ink)]" : "bg-[var(--foreground)]/[0.06] text-[var(--foreground)]/80 hover:bg-[var(--foreground)]/[0.12]"}`}
                >
                  {t.label}
                  <span className={`rounded-full px-2 py-0.5 text-xs ${active ? "bg-[var(--accent-ink)]/10" : "bg-[var(--foreground)]/10"}`}>{t.count}</span>
                </Link>
              );
            })}
          </nav>
        ) : <span />}

        <form action={`/admin/${resource.key}`} method="get" role="search" className="relative w-full sm:w-72">
          <input type="hidden" name="status" value={status} />
          <Search size={16} aria-hidden="true" className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-[var(--foreground)]/45" />
          <input
            type="search"
            name="q"
            defaultValue={sp.q ?? ""}
            placeholder={`Search ${resource.label.toLowerCase()}`}
            aria-label={`Search ${resource.label.toLowerCase()}`}
            className="h-10 w-full rounded-full border border-[var(--foreground)]/15 bg-[var(--background)] pl-10 pr-4 text-sm text-[var(--foreground)] placeholder:text-[var(--foreground)]/40 focus:outline-none focus:ring-2 focus:ring-[var(--accent)]"
          />
        </form>
      </div>

      {items.length === 0 ? (
        <div className="rounded-[20px] border border-dashed border-[var(--foreground)]/20 bg-[var(--background)]/60 p-12 text-center">
          <p className="text-sm text-[var(--foreground)]/60">{q || status !== "all" ? "No items match your filter." : "Nothing here yet."}</p>
          {!resource.readOnly && !q && status === "all" && (
            <Link href={`/admin/${resource.key}?new=1`} className={`${primary} mt-6`}>
              <Plus size={18} aria-hidden="true" /> Add your first one
            </Link>
          )}
        </div>
      ) : (
        <ul className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
          {items.map((row) => {
            const digits = String(row.phone ?? "").replace(/\D/g, "");
            return (
              <li key={String(row.id)} className={`${panel} flex flex-col gap-4`}>
                {imageField && (
                  row[imageField.name] ? (
                    <img src={String(row[imageField.name])} alt="" className="h-36 w-full rounded-2xl object-cover" />
                  ) : (
                    <div className="flex h-36 w-full items-center justify-center rounded-2xl bg-[var(--foreground)]/[0.05] text-sm text-[var(--foreground)]/45">No image</div>
                  )
                )}

                <div className="flex items-start justify-between gap-3">
                  <p className="min-w-0 truncate text-[15px] font-semibold tracking-[-0.02em]">{titleCol ? formatCell(row[titleCol.key]) : "Item"}</p>
                  {hasPublished && (
                    <span className={`shrink-0 rounded-full px-2.5 py-0.5 text-[11px] font-semibold ${row.published ? "bg-[var(--accent)] text-[var(--accent-ink)]" : "bg-[var(--foreground)]/10 text-[var(--foreground)]/70"}`}>
                      {row.published ? "Live" : "Draft"}
                    </span>
                  )}
                  {resource.readOnly && !row.handled && (
                    <span className="shrink-0 rounded-full bg-[var(--accent)] px-2.5 py-0.5 text-[11px] font-semibold text-[var(--accent-ink)]">New</span>
                  )}
                </div>

                <dl className="space-y-1.5 text-sm">
                  {restCols.map((c) => (
                  <div key={c.key} className="flex justify-between gap-4 border-b border-[var(--foreground)]/[0.06] py-1.5 last:border-0">
                      <dt className="shrink-0 text-xs text-[var(--foreground)]/50">{c.label}</dt>
                      <dd className="truncate text-right text-xs font-medium text-[var(--foreground)]/80">{formatCell(row[c.key])}</dd>
                    </div>
                  ))}
                </dl>

                {resource.readOnly && typeof row.message === "string" && (
                  <p className="line-clamp-3 rounded-2xl bg-[var(--foreground)]/[0.04] p-3 text-sm text-[var(--foreground)]/75">{row.message}</p>
                )}

                <div className="mt-auto flex flex-wrap items-center gap-2 border-t border-[var(--foreground)]/10 pt-4">
                  {resource.readOnly ? (
                    <>
                      {digits && (
                        <a href={`https://wa.me/${digits}?text=${encodeURIComponent(`Hi ${row.name}, thanks for contacting Aniket Jamunde.`)}`} target="_blank" rel="noopener noreferrer" className={`${primary} h-9 px-3.5 text-xs`}>
                          <MessageCircle size={14} aria-hidden="true" /> WhatsApp
                        </a>
                      )}
                      <a href={`mailto:${row.email}?subject=${encodeURIComponent("Your enquiry with Aniket Jamunde")}`} className={`${ghost} h-9 px-3.5 text-xs`}>
                        <Mail size={14} aria-hidden="true" /> Email
                      </a>
                      <form action={toggleHandled}>
                        <input type="hidden" name="id" value={String(row.id)} />
                        <input type="hidden" name="handled" value={String(Boolean(row.handled))} />
                        <PendingActionButton className={`${ghost} h-9 px-3.5 text-xs`} pendingLabel="Updating...">{row.handled ? "Mark as new" : "Mark handled"}</PendingActionButton>
                      </form>
                    </>
                  ) : (
                    <Link href={`/admin/${resource.key}?id=${row.id}`} className={`${ghost} h-9`}>
                      <Pencil size={14} aria-hidden="true" /> Edit
                    </Link>
                  )}
                  {!resource.readOnly && (
                    <>
                      {hasPublished && (
                        <form action={togglePublished.bind(null, resource.key)}>
                          <input type="hidden" name="id" value={String(row.id)} />
                          <input type="hidden" name="published" value={String(Boolean(row.published))} />
                          <input type="hidden" name="has_date" value={String(Boolean(row.published_at))} />
                          <PendingActionButton className={`${ghost} h-9 px-3.5 text-xs`} pendingLabel={row.published ? "Unpublishing..." : "Publishing..."}>
                            {row.published ? <EyeOff size={14} aria-hidden="true" /> : <Eye size={14} aria-hidden="true" />}
                            {row.published ? "Unpublish" : "Publish"}
                          </PendingActionButton>
                        </form>
                      )}
                      {resource.key === "blog" && row.published && typeof row.slug === "string" && (
                        <a href={`/blog/${row.slug}`} target="_blank" rel="noopener noreferrer" className={`${ghost} h-9 px-3.5 text-xs`}>View</a>
                      )}
                      <form action={duplicateRecord.bind(null, resource.key)}>
                        <input type="hidden" name="id" value={String(row.id)} />
                        <PendingActionButton className={`${ghost} h-9 px-3.5 text-xs`} pendingLabel="Duplicating...">
                          <Copy size={14} aria-hidden="true" /> Duplicate
                        </PendingActionButton>
                      </form>
                      {resource.orderBy === "sort_order" && !q && (
                        <>
                          <form action={moveRecord.bind(null, resource.key)}>
                            <input type="hidden" name="id" value={String(row.id)} />
                            <input type="hidden" name="dir" value="up" />
                            <PendingActionButton className={`${ghost} h-9 w-9 justify-center p-0`} pendingLabel=" " aria-label="Move up">
                              <ArrowUp size={14} aria-hidden="true" />
                            </PendingActionButton>
                          </form>
                          <form action={moveRecord.bind(null, resource.key)}>
                            <input type="hidden" name="id" value={String(row.id)} />
                            <input type="hidden" name="dir" value="down" />
                            <PendingActionButton className={`${ghost} h-9 w-9 justify-center p-0`} pendingLabel=" " aria-label="Move down">
                              <ArrowDown size={14} aria-hidden="true" />
                            </PendingActionButton>
                          </form>
                        </>
                      )}
                    </>
                  )}
                  <form action={deleteRecord.bind(null, resource.key)} className="ml-auto">
                    <input type="hidden" name="id" value={String(row.id)} />
                    <PendingActionButton className="inline-flex h-9 items-center gap-2 rounded-full px-3 text-xs text-rose-300 hover:bg-rose-500/15" pendingLabel="Deleting..." aria-label="Delete">
                      <Trash2 size={14} aria-hidden="true" /> Delete
                    </PendingActionButton>
                  </form>
                </div>
              </li>
            );
          })}
        </ul>
      )}
    </div>
  );
}

function formatCell(value: unknown) {
  if (value === null || value === undefined || value === "") return "-";
  if (typeof value === "boolean") return value ? "Yes" : "No";
  if (Array.isArray(value)) return value.join(", ");
  if (typeof value === "string" && /^\d{4}-\d{2}-\d{2}T/.test(value)) {
    return new Date(value).toLocaleString("en-IN", { dateStyle: "medium", timeStyle: "short" });
  }
  return String(value);
}

function ResourceForm({ resource, row }: { resource: Resource; row: Record<string, unknown> | null }) {
  const slugField = resource.fields.find((field) => field.name === "slug");
  const titleField = resource.fields.find((field) => field.name === "title");
  const hiddenFields = new Set(["slug", "featured", "rating"]);
  const advancedFields = new Set(["sort_order", "seo_title", "seo_description", "published_at"]);
  const fields = resource.fields.filter((field) => !hiddenFields.has(field.name));
  const visibleFields = fields.filter((field) => !advancedFields.has(field.name));
  const advanced = fields.filter((field) => advancedFields.has(field.name));
  const slugRoute = resource.key === "blog" ? "/blog" : undefined;
  const saveLabel = resource.singleton
    ? "Save settings"
    : row?.id
      ? "Save changes"
      : `Create ${resource.key === "blog" ? "post" : resource.key.replace(/s$/, "")}`;
  const settingGroups = [
    { title: "Brand identity", description: "The name, short description and logo visitors see across your site.", fields: ["brand_name", "tagline", "logo_url"] },
    { title: "Theme colors", description: "Choose the colors used for buttons, highlights, backgrounds and text.", fields: ["accent_color", "secondary_color", "highlight_color", "background_color", "foreground_color"] },
    { title: "Contact details", description: "How clients can reach you from the website.", fields: ["contact_email", "phone", "whatsapp"] },
    { title: "Search & footer", description: "Set your default search description and the footer credit.", fields: ["meta_description", "footer_text", "footer_url"] },
    { title: "Invoice & payment details", description: "Set your legal business details, UPI ID and bank transfer instructions. New invoices copy these details into the client view.", fields: ["business_name", "business_address", "business_gstin", "business_pan", "business_upi_id", "business_bank_details"] },
  ];
  const fieldByName = new Map(resource.fields.map((field) => [field.name, field]));
  const valueForField = (name: string) => row?.[name] ?? (resource.key === "settings" ? DEFAULT_SETTINGS[name as keyof typeof DEFAULT_SETTINGS] : undefined);
  const colorValue = (name: string, fallback: string) => String(valueForField(name) ?? fallback);

  return (
    <form action={saveRecord.bind(null, resource.key)} encType="multipart/form-data" className="rounded-[22px] border border-[var(--foreground)]/10 bg-[var(--background)] p-5 shadow-[0_8px_30px_-24px_var(--foreground)] sm:p-8">
      {typeof row?.id === "string" || typeof row?.id === "number" ? (
        !resource.singleton && <input type="hidden" name="id" value={String(row.id)} />
      ) : null}
      {hiddenFields.has("featured") && resource.fields.some((field) => field.name === "featured") && (
        <input type="hidden" name="featured" value={row?.featured ? "on" : ""} />
      )}
      {hiddenFields.has("rating") && resource.fields.some((field) => field.name === "rating") && (
        <input type="hidden" name="rating" value={row?.rating == null ? "" : String(row.rating)} />
      )}

      {resource.key === "settings" ? (
        <div className="space-y-8">
          {settingGroups.map((group) => (
            <section key={group.title} className="border-b border-[var(--foreground)]/10 pb-8 last:border-0 last:pb-0">
              <div className="mb-5">
                <h2 className="text-base font-semibold tracking-[-0.02em]">{group.title}</h2>
                <p className="mt-1 text-xs leading-5 text-[var(--foreground)]/50">{group.description}</p>
              </div>
              {group.title === "Theme colors" && (
                <div className="mb-5">
                  <ThemePalettePreview initial={{
                    accent: colorValue("accent_color", "#d4f94a"),
                    secondary: colorValue("secondary_color", "#0b0b0b"),
                    highlight: colorValue("highlight_color", "#d4f94a"),
                    background: colorValue("background_color", "#f4f8ea"),
                    foreground: colorValue("foreground_color", "#0b0b0b"),
                  }} />
                </div>
              )}
              <div className="grid gap-5 sm:grid-cols-2">
                {group.fields.map((name) => {
                  const field = fieldByName.get(name);
                  if (!field) return null;
                  const wide = field.type === "image" || field.type === "textarea";
                  return <div key={field.name} className={wide ? "sm:col-span-2" : undefined}><FieldInput field={field} value={valueForField(field.name)} /></div>;
                })}
              </div>
            </section>
          ))}
        </div>
      ) : (
        <div className="grid gap-6">
          {visibleFields.map((field) => field.name === "title" && slugField && titleField ? (
            <TitleWithAutoSlug
              key={field.name}
              titleField={titleField}
              slugField={slugField}
              titleValue={typeof row?.title === "string" ? row.title : ""}
              slugValue={typeof row?.slug === "string" ? row.slug : ""}
              routePrefix={slugRoute}
            />
          ) : (
            <FieldInput key={field.name} field={field} value={row?.[field.name]} />
          ))}
        </div>
      )}

      {advanced.length > 0 && (
        <details className="mt-6 rounded-xl border border-[var(--foreground)]/10 bg-[var(--foreground)]/[0.02] p-4">
          <summary className="cursor-pointer text-[13px] font-semibold text-[var(--foreground)]/75 marker:text-[var(--accent)]">More options <span className="ml-1 font-normal text-[var(--foreground)]/45">(optional)</span></summary>
          <div className="mt-5 grid gap-5 border-t border-[var(--foreground)]/10 pt-5">
            {advanced.map((field) => <FieldInput key={field.name} field={field} value={row?.[field.name]} />)}
          </div>
        </details>
      )}

      <div className="mt-7 flex flex-wrap items-center justify-between gap-4 border-t border-[var(--foreground)]/10 pt-5">
        <p className="text-xs text-[var(--foreground)]/50">Changes appear on your website after saving.</p>
        <div className="flex flex-wrap gap-3">
        <PendingActionButton className={primary} pendingLabel="Saving...">{saveLabel}</PendingActionButton>
        {!resource.singleton && <Link href={`/admin/${resource.key}`} className={ghost}>Cancel</Link>}
        </div>
      </div>
    </form>
  );
}

const inputClass = "w-full rounded-xl border border-[var(--foreground)]/12 bg-[var(--background)] px-4 py-3 text-sm text-[var(--foreground)] placeholder:text-[var(--foreground)]/40 transition-shadow focus:outline-none focus:ring-2 focus:ring-[var(--accent)]/60";

function FieldInput({ field, value }: { field: Field; value: unknown }) {
  const label = (
    <span className="mb-2 block text-[13px] font-semibold text-[var(--foreground)]/80">
      {field.label}
      {field.required && <span className="text-rose-300"> *</span>}
    </span>
  );
  const help = field.help && <span className="mt-2 block text-xs text-[var(--foreground)]/55">{field.help}</span>;
  const common = { name: field.name, required: field.required, maxLength: field.maxLength };
  const current = typeof value === "string" ? value : value == null ? "" : String(value);

  if (field.type === "boolean") {
    return (
      <label className="flex cursor-pointer items-start gap-3 rounded-xl border border-[var(--foreground)]/10 bg-[var(--foreground)]/[0.025] px-4 py-3.5">
        <input type="checkbox" name={field.name} defaultChecked={Boolean(value)} className="mt-0.5 h-4 w-4 accent-[var(--accent)]" />
        <span>
          <span className="block text-[13px] font-semibold text-[var(--foreground)]/80">{field.label}</span>
          {help && <span className="mt-1 block text-xs text-[var(--foreground)]/50">{field.help}</span>}
        </span>
      </label>
    );
  }

  if (field.type === "image") {
    return <ImageUploadField field={field} value={current} />;
  }

  let control;
  switch (field.type) {
    case "textarea":
      control = <textarea {...common} rows={5} defaultValue={current} className={inputClass} />;
      break;
    case "color":
      control = <ColorSettingInput name={field.name} value={current || "#000000"} required={field.required} />;
      break;
    case "number":
      control = <input type="number" name={field.name} required={field.required} min={field.name === "rating" ? 1 : undefined} max={field.name === "rating" ? 5 : undefined} defaultValue={current} className={inputClass} />;
      break;
    case "datetime":
      control = <input type="datetime-local" name={field.name} defaultValue={typeof value === "string" ? toLocalInput(value) : ""} className={inputClass} />;
      break;
    case "list":
      control = <input type="text" name={field.name} defaultValue={Array.isArray(value) ? value.join(", ") : ""} className={inputClass} />;
      break;
    case "url":
      control = <input type="text" inputMode="url" placeholder="https://" {...common} defaultValue={current} className={inputClass} />;
      break;
    default:
      control = <input type="text" {...common} defaultValue={current} className={inputClass} />;
  }

  if (field.type === "color") {
    return (
      <div>
        {label}
        {control}
        {help}
      </div>
    );
  }

  return (
    <label className="block">
      {label}
      {control}
      {help}
    </label>
  );
}

function toLocalInput(iso: string) {
  const d = new Date(iso);
  const pad = (n: number) => String(n).padStart(2, "0");
  return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}T${pad(d.getHours())}:${pad(d.getMinutes())}`;
}
