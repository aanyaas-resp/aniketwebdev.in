"use server";

import { revalidatePath } from "next/cache";
import sharp from "sharp";
import { redirect } from "next/navigation";
import { createSupabaseServerClient } from "@/lib/supabase/server";
import { IMAGE_MAX_BYTES, IMAGE_TYPES, RESOURCES, type Field, type Resource } from "@/lib/admin-config";

// Every admin action re-checks the session AND the admins table on the server.
// Row-level security in Supabase is the final safety net.
async function requireAdmin() {
  const supabase = await createSupabaseServerClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) redirect("/admin/login");

  const { data: isAdmin } = await supabase.rpc("is_admin");
  if (isAdmin !== true) {
    await supabase.auth.signOut();
    redirect("/admin/login?error=forbidden");
  }
  return supabase;
}

export async function signIn(formData: FormData) {
  const email = String(formData.get("email") ?? "").trim();
  const password = String(formData.get("password") ?? "");

  const supabase = await createSupabaseServerClient();
  const { error } = await supabase.auth.signInWithPassword({ email, password });
  if (error) redirect("/admin/login?error=invalid");

  redirect("/admin");
}

export async function signOut() {
  const supabase = await createSupabaseServerClient();
  await supabase.auth.signOut();
  redirect("/admin/login");
}

function slugify(text: string) {
  return text
    .toLowerCase()
    .normalize("NFKD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 120);
}

type ParseResult = { values: Record<string, unknown> } | { error: string };

function parseForm(resource: Resource, formData: FormData): ParseResult {
  const values: Record<string, unknown> = {};

  for (const field of resource.fields) {
    const raw = formData.get(field.name);
    const str = typeof raw === "string" ? raw.trim() : "";
    const result = parseField(field, str, formData);
    if ("error" in result) return result;
    values[field.name] = result.value;
  }
  return { values };
}

// Uploads an image file to the public "media" bucket and returns its public URL.
// Runs with the admin session, so the storage policy also requires is_admin().
async function uploadImage(supabase: Awaited<ReturnType<typeof requireAdmin>>, file: File): Promise<{ url: string } | { error: string }> {
  const ext = IMAGE_TYPES[file.type];
  if (!ext) return { error: "Images must be PNG, JPG, WebP, GIF or SVG" };
  if (file.size > IMAGE_MAX_BYTES) return { error: "Images must be 5 MB or smaller" };

  let bytes = Buffer.from(await file.arrayBuffer());
  let contentType = file.type;
  let finalExt = ext;

  // Convert raster images to WebP for faster pages (SVG is already light and is kept as is)
  if (ext !== "svg") {
    try {
      bytes = await sharp(bytes, { animated: true }).rotate().webp({ quality: 85 }).toBuffer();
      contentType = "image/webp";
      finalExt = "webp";
    } catch {
      return { error: "This image could not be processed. Try a different file." };
    }
  }

  const path = `${crypto.randomUUID()}.${finalExt}`;
  const { error } = await supabase.storage.from("media").upload(path, new Uint8Array(bytes), {
    contentType,
    cacheControl: "31536000",
    upsert: false,
  });
  if (error) return { error: "Upload failed. Check the media bucket and admin policies." };

  const { data } = supabase.storage.from("media").getPublicUrl(path);
  return { url: data.publicUrl };
}

function parseField(field: Field, str: string, formData: FormData): { value: unknown } | { error: string } {
  switch (field.type) {
    case "boolean":
      return { value: formData.get(field.name) === "on" };

    case "list": {
      const items = str
        .split(",")
        .map((s) => s.trim().slice(0, 40))
        .filter(Boolean)
        .slice(0, 20);
      return { value: items };
    }

    case "number": {
      if (str === "") return { value: field.nullable ? null : 0 };
      const n = Number(str);
      if (!Number.isInteger(n)) return { error: `${field.label} must be a whole number` };
      if (field.name === "rating" && (n < 1 || n > 5)) return { error: "Rating must be between 1 and 5" };
      return { value: n };
    }

    case "color":
      if (!/^#[0-9a-fA-F]{6}$/.test(str)) return { error: `${field.label} must be a valid color` };
      return { value: str };

    case "image":
    case "url":
      if (str && !/^(https?:\/\/|\/)/.test(str)) {
        return { error: `${field.label} must start with https:// (or /)` };
      }
      if (str.length > (field.maxLength ?? 500)) return { error: `${field.label} is too long` };
      return { value: str || null };

    case "datetime": {
      if (!str) return { value: null };
      const date = new Date(str);
      if (Number.isNaN(date.getTime())) return { error: `${field.label} is not a valid date` };
      return { value: date.toISOString() };
    }

    default: {
      if (field.required && !str) return { error: `${field.label} is required` };
      if (field.maxLength && str.length > field.maxLength) {
        return { error: `${field.label} must be ${field.maxLength} characters or fewer` };
      }
      return { value: str || null };
    }
  }
}

function backTo(resource: Resource, id: string | null, message: string) {
  const base = resource.singleton
    ? `/admin/${resource.key}`
    : id
      ? `/admin/${resource.key}?id=${id}`
      : `/admin/${resource.key}?new=1`;
  return `${base}${base.includes("?") ? "&" : "?"}${message}`;
}

export async function saveRecord(resourceKey: string, formData: FormData) {
  const resource = RESOURCES[resourceKey];
  if (!resource || resource.readOnly) throw new Error("This section cannot be edited.");

  const supabase = await requireAdmin();
  const id = String(formData.get("id") ?? "") || null;

  // Image fields: an uploaded file wins over a pasted URL
  for (const field of resource.fields) {
    if (field.type !== "image") continue;
    const file = formData.get(`${field.name}__file`);
    if (file instanceof File && file.size > 0) {
      const uploaded = await uploadImage(supabase, file);
      if ("error" in uploaded) {
        redirect(backTo(resource, id, `error=${encodeURIComponent(uploaded.error)}`));
      }
      formData.set(field.name, uploaded.url);
    }
  }

  const parsed = parseForm(resource, formData);
  if ("error" in parsed) {
    redirect(backTo(resource, id, `error=${encodeURIComponent(parsed.error)}`));
  }
  const values = parsed.values;

  // Auto-create slugs from the title when left empty
  if ("slug" in values && !values.slug && typeof values.title === "string") {
    values.slug = slugify(values.title) || null;
  }
  if (typeof values.slug === "string" && values.slug && !/^[a-z0-9-]+$/.test(values.slug)) {
    redirect(backTo(resource, id, "error=Slug can only contain lowercase letters, numbers and dashes"));
  }

  // Publishing a blog post without a date sets it to now
  if (values.published === true && "published_at" in values && !values.published_at) {
    values.published_at = new Date().toISOString();
  }

  const table = supabase.from(resource.table);
  let recordId = id;
  let error: { message: string } | null = null;
  if (resource.singleton) {
    if (resource.key === "settings") {
      const billingKeys = ["business_name", "business_address", "business_gstin", "business_pan", "business_upi_id", "business_bank_details"];
      const billingValues: Record<string, unknown> = { id: 1 };
      for (const key of billingKeys) {
        billingValues[key] = values[key];
        delete values[key];
      }
      ({ error } = await table.upsert({ id: 1, ...values }));
      if (!error) {
        const result = await supabase.from("invoice_business_profile").upsert(billingValues);
        error = result.error;
      }
    } else {
      ({ error } = await table.upsert({ id: 1, ...values }));
    }
  } else if (resource.key === "clients") {
    const billingKeys = ["email", "phone", "billing_address", "gstin", "pan"];
    const billingValues: Record<string, unknown> = {};
    for (const key of billingKeys) {
      billingValues[key] = values[key];
      delete values[key];
    }
    let clientId = id;
    if (id) {
      const result = await table.update(values).eq("id", id);
      error = result.error;
    } else {
      const result = await table.insert(values).select("id").single();
      error = result.error;
      clientId = result.data?.id ? String(result.data.id) : "";
    }
    recordId = clientId || id;
    if (!error && clientId) {
      const result = await supabase.from("client_billing_profiles").upsert({ client_id: clientId, ...billingValues });
      error = result.error;
    } else if (!error) {
      error = { message: "Client was saved without an id." };
    }
  } else if (id) {
    ({ error } = await table.update(values).eq("id", id));
  } else {
    ({ error } = await table.insert(values));
  }

  if (error) {
    const friendly = error.message.includes("duplicate")
      ? "That slug is already in use"
      : "Could not save. Check the fields and try again.";
    redirect(backTo(resource, recordId, `error=${encodeURIComponent(friendly)}`));
  }

  revalidatePath("/", "layout");
  redirect(`/admin/${resource.key}?saved=1`);
}

export async function deleteRecord(resourceKey: string, formData: FormData) {
  const resource = RESOURCES[resourceKey];
  if (!resource || resource.singleton) throw new Error("This item cannot be deleted.");

  const supabase = await requireAdmin();
  const id = String(formData.get("id") ?? "");
  if (!id) redirect(`/admin/${resource.key}`);

  // Soft delete: the item goes to the trash and can be restored
  await supabase.from(resource.table).update({ deleted_at: new Date().toISOString() }).eq("id", id);

  revalidatePath("/", "layout");
  redirect(`/admin/${resource.key}?deleted=1`);
}

export async function toggleHandled(formData: FormData) {
  const supabase = await requireAdmin();
  const id = String(formData.get("id") ?? "");
  const handled = formData.get("handled") === "true";
  if (id) await supabase.from("contact_submissions").update({ handled: !handled }).eq("id", id);
  redirect("/admin/contact");
}

// ---------- Productivity actions: quick publish, duplicate, reorder ----------

export async function togglePublished(resourceKey: string, formData: FormData) {
  const resource = RESOURCES[resourceKey];
  if (!resource || resource.readOnly || resource.singleton) throw new Error("This item cannot be changed here.");

  const supabase = await requireAdmin();
  const id = String(formData.get("id") ?? "");
  if (!id) redirect(`/admin/${resource.key}?error=${encodeURIComponent("Choose an item to publish.")}`);
  const currentlyLive = formData.get("published") === "true";
  const update: Record<string, unknown> = { published: !currentlyLive };

  // Blog: publishing an undated post stamps it with today's date
  if (resource.key === "blog" && !currentlyLive && formData.get("has_date") !== "true") {
    update.published_at = new Date().toISOString();
  }
  const { error } = await supabase.from(resource.table).update(update).eq("id", id);
  if (error) redirect(`/admin/${resource.key}?error=${encodeURIComponent("Could not update this item. Please try again.")}`);

  revalidatePath("/", "layout");
  redirect(`/admin/${resource.key}?saved=1`);
}

export async function duplicateRecord(resourceKey: string, formData: FormData) {
  const resource = RESOURCES[resourceKey];
  if (!resource || resource.readOnly || resource.singleton) throw new Error("This item cannot be copied.");

  const supabase = await requireAdmin();
  const id = String(formData.get("id") ?? "");
  const { data: original } = await supabase.from(resource.table).select("*").eq("id", id).maybeSingle();
  if (!original) redirect(`/admin/${resource.key}`);

  const { id: _id, created_at: _created, ...rest } = original as Record<string, unknown>;
  const copy: Record<string, unknown> = { ...rest, published: false };
  if (typeof copy.title === "string") copy.title = `${copy.title} (copy)`;
  if (typeof copy.name === "string") copy.name = `${copy.name} (copy)`;
  if (typeof copy.slug === "string" && copy.slug) copy.slug = `${copy.slug}-copy-${crypto.randomUUID().slice(0, 6)}`;
  if ("published_at" in copy) copy.published_at = null;

  const { data: created, error } = await supabase.from(resource.table).insert(copy).select("id").single();
  if (error || !created) redirect(`/admin/${resource.key}?error=${encodeURIComponent("Could not copy this item")}`);

  revalidatePath("/", "layout");
  redirect(`/admin/${resource.key}?id=${created.id}&saved=1`);
}

export async function moveRecord(resourceKey: string, formData: FormData) {
  const resource = RESOURCES[resourceKey];
  if (!resource || resource.readOnly || resource.singleton || resource.orderBy !== "sort_order") {
    throw new Error("This list cannot be reordered.");
  }

  const supabase = await requireAdmin();
  const id = String(formData.get("id") ?? "");
  const step = formData.get("dir") === "up" ? -1 : 1;

  const { data: rows } = await supabase
    .from(resource.table)
    .select("id")
    .is("deleted_at", null)
    .order("sort_order", { ascending: true })
    .order("created_at", { ascending: true });

  const order = (rows ?? []).map((r) => String(r.id));
  const from = order.indexOf(id);
  const to = from + step;
  if (from >= 0 && to >= 0 && to < order.length) {
    [order[from], order[to]] = [order[to], order[from]];
    // Write a clean 0..n sequence so every row has a distinct position
    await Promise.all(order.map((rowId, index) => supabase.from(resource.table).update({ sort_order: index }).eq("id", rowId)));
  }

  revalidatePath("/", "layout");
  redirect(`/admin/${resource.key}`);
}

export async function createInvoice(formData: FormData) {
  const supabase = await requireAdmin();
  const clientId = String(formData.get("client_id") ?? "");
  const projectId = String(formData.get("project_id") ?? "");
  const currency = String(formData.get("currency") ?? "INR").toUpperCase();
  const invoiceDate = String(formData.get("invoice_date") ?? "");
  const dueDate = String(formData.get("due_date") ?? "");
  const discount = Number(formData.get("discount") ?? 0);
  const taxRate = Number(formData.get("tax_rate") ?? 0);
  let items: Array<{ description: string; quantity: number; rate: number }>;

  try {
    items = JSON.parse(String(formData.get("items") ?? "[]"));
  } catch {
    redirect("/admin/invoices/new?error=Invoice+items+were+not+valid");
  }

  if (!clientId || !projectId) redirect("/admin/invoices/new?error=Choose+a+client+and+project");
  if (!/^\d{4}-\d{2}-\d{2}$/.test(invoiceDate) || !/^\d{4}-\d{2}-\d{2}$/.test(dueDate)) {
    redirect("/admin/invoices/new?error=Enter+valid+invoice+and+due+dates");
  }
  if (!Number.isFinite(discount) || discount < 0 || !Number.isFinite(taxRate) || taxRate < 0 || taxRate > 100) {
    redirect("/admin/invoices/new?error=Check+the+discount+and+tax+rate");
  }
  if (!Array.isArray(items) || items.length === 0 || items.length > 50) {
    redirect("/admin/invoices/new?error=Add+at+least+one+line+item");
  }
  if (!new Set(["INR", "USD", "GBP", "EUR", "AUD", "CAD"]).has(currency)) {
    redirect("/admin/invoices/new?error=Choose+a+supported+currency");
  }

  const [{ data: client }, { data: project }, { data: clientBilling }, { data: business }] = await Promise.all([
    supabase.from("clients").select("id,name").is("deleted_at", null).eq("id", clientId).maybeSingle(),
    supabase.from("projects").select("id,title").is("deleted_at", null).eq("id", projectId).maybeSingle(),
    supabase.from("client_billing_profiles").select("*").eq("client_id", clientId).maybeSingle(),
    supabase.from("invoice_business_profile").select("business_name,business_address,business_gstin,business_pan,business_upi_id,business_bank_details").eq("id", 1).maybeSingle(),
  ]);
  if (!client || !project) redirect("/admin/invoices/new?error=The+selected+client+or+project+could+not+be+found");

  const invoice = {
    client_id: client.id,
    project_id: project.id,
    project_title: project.title,
    client_name: client.name,
    client_email: clientBilling?.email ?? "",
    client_phone: clientBilling?.phone ?? "",
    client_address: clientBilling?.billing_address ?? "",
    client_gstin: clientBilling?.gstin ?? "",
    client_pan: clientBilling?.pan ?? "",
    business_name: business?.business_name || "Aniket Jamunde",
    business_address: business?.business_address ?? "",
    business_gstin: business?.business_gstin ?? "",
    business_pan: business?.business_pan ?? "",
    business_upi_id: business?.business_upi_id ?? "",
    business_bank_details: business?.business_bank_details ?? "",
    invoice_date: invoiceDate,
    due_date: dueDate,
    currency,
    payment_terms: String(formData.get("payment_terms") ?? "").trim().slice(0, 1000),
    discount,
    tax_label: String(formData.get("tax_label") ?? "GST").trim().slice(0, 40) || "GST",
    tax_rate: taxRate,
    send_now: formData.get("send_now") === "on",
  };
  if (items.some((item) => String(item.quantity ?? "").trim() === "" || String(item.rate ?? "").trim() === "")) {
    redirect("/admin/invoices/new?error=Enter+a+quantity+and+rate+for+each+line+item");
  }
  const cleanItems = items.map((item) => ({
    description: String(item.description ?? "").trim().slice(0, 300),
    quantity: Number(item.quantity),
    rate: Number(item.rate),
  }));
  if (cleanItems.some((item) => !item.description || !Number.isFinite(item.quantity) || !Number.isFinite(item.rate))) {
    redirect("/admin/invoices/new?error=Complete+every+line+item+before+saving");
  }

  const { data, error } = await supabase.rpc("create_invoice_with_items", { p_invoice: invoice, p_items: cleanItems });
  if (error) redirect(`/admin/invoices/new?error=${encodeURIComponent(error.message)}`);
  const created = Array.isArray(data) ? data[0] : data;
  if (!created?.id) redirect("/admin/invoices/new?error=Could+not+create+the+invoice");
  revalidatePath("/admin/invoices");
  redirect(`/admin/invoices/${created.id}?created=1`);
}

export async function updateInvoice(invoiceId: string, formData: FormData) {
  const supabase = await requireAdmin();
  const clientId = String(formData.get("client_id") ?? "");
  const projectId = String(formData.get("project_id") ?? "");
  const currency = String(formData.get("currency") ?? "INR").toUpperCase();
  const invoiceDate = String(formData.get("invoice_date") ?? "");
  const dueDate = String(formData.get("due_date") ?? "");
  const discount = Number(formData.get("discount") ?? 0);
  const taxRate = Number(formData.get("tax_rate") ?? 0);
  let items: Array<{ description: string; quantity: number | string; rate: number | string }>;
  try {
    items = JSON.parse(String(formData.get("items") ?? "[]"));
  } catch {
    redirect(`/admin/invoices/${invoiceId}/edit?error=Invoice+items+were+not+valid`);
  }
  const fail = (message: string): never => redirect(`/admin/invoices/${invoiceId}/edit?error=${encodeURIComponent(message)}`);
  if (!clientId || !projectId) fail("Choose a client and project");
  if (!/^\d{4}-\d{2}-\d{2}$/.test(invoiceDate) || !/^\d{4}-\d{2}-\d{2}$/.test(dueDate)) fail("Enter valid invoice and due dates");
  if (!Number.isFinite(discount) || discount < 0 || !Number.isFinite(taxRate) || taxRate < 0 || taxRate > 100) fail("Check the discount and tax rate");
  if (!Array.isArray(items) || items.length === 0 || items.length > 50) fail("Add at least one line item");
  if (!new Set(["INR", "USD", "GBP", "EUR", "AUD", "CAD"]).has(currency)) fail("Choose a supported currency");
  if (items.some((item) => String(item.quantity ?? "").trim() === "" || String(item.rate ?? "").trim() === "")) fail("Enter a quantity and rate for each line item");
  const cleanItems = items.map((item) => ({ description: String(item.description ?? "").trim().slice(0, 300), quantity: Number(item.quantity), rate: Number(item.rate) }));
  if (cleanItems.some((item) => !item.description || !Number.isFinite(item.quantity) || !Number.isFinite(item.rate))) fail("Complete every line item before saving");

  const [{ data: client }, { data: project }, { data: clientBilling }, { data: business }] = await Promise.all([
    supabase.from("clients").select("id,name").is("deleted_at", null).eq("id", clientId).maybeSingle(),
    supabase.from("projects").select("id,title").is("deleted_at", null).eq("id", projectId).maybeSingle(),
    supabase.from("client_billing_profiles").select("*").eq("client_id", clientId).maybeSingle(),
    supabase.from("invoice_business_profile").select("business_name,business_address,business_gstin,business_pan,business_upi_id,business_bank_details").eq("id", 1).maybeSingle(),
  ]);
  if (!client || !project) fail("The selected client or project could not be found");
  const invoice = {
    client_id: client.id, project_id: project.id, project_title: project.title,
    client_name: client.name, client_email: clientBilling?.email ?? "", client_phone: clientBilling?.phone ?? "",
    client_address: clientBilling?.billing_address ?? "", client_gstin: clientBilling?.gstin ?? "", client_pan: clientBilling?.pan ?? "",
    business_name: business?.business_name || "Aniket Jamunde", business_address: business?.business_address ?? "",
    business_gstin: business?.business_gstin ?? "", business_pan: business?.business_pan ?? "",
    business_upi_id: business?.business_upi_id ?? "", business_bank_details: business?.business_bank_details ?? "",
    invoice_date: invoiceDate, due_date: dueDate, currency,
    payment_terms: String(formData.get("payment_terms") ?? "").trim().slice(0, 1000), discount,
    tax_label: String(formData.get("tax_label") ?? "GST").trim().slice(0, 40) || "GST", tax_rate: taxRate,
    send_now: formData.get("send_now") === "on",
  };
  const { error } = await supabase.rpc("update_invoice_with_items", { p_id: invoiceId, p_invoice: invoice, p_items: cleanItems });
  if (error) fail(error.message);
  revalidatePath("/admin/invoices");
  revalidatePath(`/admin/invoices/${invoiceId}`);
  redirect(`/admin/invoices/${invoiceId}?saved=1`);
}

export async function recordPayment(formData: FormData) {
  const supabase = await requireAdmin();
  const invoiceId = String(formData.get("invoice_id") ?? "");
  const amount = Number(formData.get("amount") ?? 0);
  const paymentDate = String(formData.get("payment_date") ?? "");
  const method = String(formData.get("method") ?? "bank_transfer");
  if (!invoiceId || !Number.isFinite(amount) || amount <= 0 || !/^\d{4}-\d{2}-\d{2}$/.test(paymentDate)) {
    redirect("/admin/payments?error=Choose+an+invoice+and+enter+a+valid+payment");
  }
  const { data: invoice } = await supabase.from("invoices").select("id,client_id,project_id,currency,status").eq("id", invoiceId).maybeSingle();
  if (!invoice || !["sent", "partially_paid", "overdue"].includes(invoice.status)) {
    redirect("/admin/payments?error=Choose+an+unpaid+sent+invoice");
  }
  const { error } = await supabase.from("payments").insert({
    invoice_id: invoiceId,
    client_id: invoice.client_id,
    project_id: invoice.project_id,
    amount,
    currency: invoice.currency,
    payment_date: paymentDate,
    method,
    reference: String(formData.get("reference") ?? "").trim().slice(0, 160) || null,
    note: String(formData.get("note") ?? "").trim().slice(0, 1000) || null,
  });
  if (error) redirect(`/admin/payments?error=${encodeURIComponent(error.message)}`);
  revalidatePath("/admin/payments");
  revalidatePath("/admin/invoices");
  redirect("/admin/payments?saved=1");
}

export async function markInvoiceSent(formData: FormData) {
  const supabase = await requireAdmin();
  const id = String(formData.get("id") ?? "");
  const { error } = await supabase.from("invoices").update({ status: "sent" }).eq("id", id).eq("status", "draft");
  if (error) redirect(`/admin/invoices/${id}?error=${encodeURIComponent(error.message)}`);
  revalidatePath(`/admin/invoices/${id}`);
  redirect(`/admin/invoices/${id}?saved=1`);
}

export async function cancelInvoice(formData: FormData) {
  const supabase = await requireAdmin();
  const id = String(formData.get("id") ?? "");
  const { data: invoice } = await supabase.from("invoices").select("status").eq("id", id).maybeSingle();
  if (!invoice || !["draft", "sent"].includes(invoice.status)) redirect(`/admin/invoices/${id}?error=Only+unpaid+invoices+can+be+cancelled`);
  const { error } = await supabase.from("invoices").update({ status: "cancelled" }).eq("id", id);
  if (error) redirect(`/admin/invoices/${id}?error=${encodeURIComponent(error.message)}`);
  revalidatePath("/admin/invoices");
  redirect("/admin/invoices?saved=1");
}

export async function issueCreditNote(formData: FormData) {
  const supabase = await requireAdmin();
  const invoiceId = String(formData.get("invoice_id") ?? "");
  const amount = Number(formData.get("amount") ?? 0);
  const reason = String(formData.get("reason") ?? "").trim();
  const { error } = await supabase.from("credit_notes").insert({ invoice_id: invoiceId, amount, reason });
  if (error) redirect(`/admin/invoices/${invoiceId}?error=${encodeURIComponent(error.message)}`);
  revalidatePath(`/admin/invoices/${invoiceId}`);
  redirect(`/admin/invoices/${invoiceId}?credit=1`);
}

export async function restoreRecord(resourceKey: string, formData: FormData) {
  const resource = RESOURCES[resourceKey];
  if (!resource || resource.singleton) throw new Error("This item cannot be restored.");
  const supabase = await requireAdmin();
  const id = String(formData.get("id") ?? "");
  if (id) await supabase.from(resource.table).update({ deleted_at: null }).eq("id", id);
  revalidatePath("/", "layout");
  redirect("/admin/trash?restored=1");
}

export async function purgeRecord(resourceKey: string, formData: FormData) {
  const resource = RESOURCES[resourceKey];
  if (!resource || resource.singleton) throw new Error("This item cannot be deleted.");
  const supabase = await requireAdmin();
  const id = String(formData.get("id") ?? "");
  if (id) await supabase.from(resource.table).delete().eq("id", id).not("deleted_at", "is", null);
  revalidatePath("/", "layout");
  redirect("/admin/trash?purged=1");
}
