// Describes every editable table in the admin panel. The admin pages and
// server actions are generic: adding a new content type means adding an entry here.

export type FieldType = "text" | "textarea" | "url" | "image" | "number" | "boolean" | "color" | "list" | "datetime";

export type Field = {
  name: string;
  label: string;
  type: FieldType;
  required?: boolean;
  nullable?: boolean;
  maxLength?: number;
  help?: string;
};

export type Resource = {
  key: string;
  label: string;
  table: string;
  description: string;
  singleton?: boolean;
  readOnly?: boolean;
  orderBy?: string;
  ascending?: boolean;
  listColumns: { key: string; label: string }[];
  fields: Field[];
};

export const RESOURCES: Record<string, Resource> = {
  settings: {
    key: "settings",
    label: "Theme & Settings",
    table: "site_settings",
    description: "Update your brand, colors, contact details and footer in one place.",
    singleton: true,
    listColumns: [],
    fields: [
      { name: "brand_name", label: "Brand name", type: "text", required: true, maxLength: 80 },
      { name: "logo_url", label: "Logo", type: "image", nullable: true, help: "Upload a file or paste an image link. PNG with transparent background works best." },
      { name: "tagline", label: "Short tagline", type: "text", maxLength: 160, help: "A short line that describes what your studio does." },
      { name: "meta_description", label: "Google search description", type: "textarea", maxLength: 320, help: "A short summary that may appear in search results. Aim for 150 to 160 characters." },
      { name: "accent_color", label: "Primary color", type: "color", required: true, help: "Main brand color for buttons and important accents." },
      { name: "secondary_color", label: "Secondary color", type: "color", required: true, help: "Used for dark surfaces such as the admin sidebar and site footer." },
      { name: "highlight_color", label: "Highlight color", type: "color", required: true, help: "Used to highlight key words and small details." },
      { name: "background_color", label: "Page background", type: "color", required: true, help: "The main background color across the website." },
      { name: "foreground_color", label: "Main text color", type: "color", required: true, help: "The default text and icon color." },
      { name: "contact_email", label: "Contact email", type: "text", maxLength: 150, nullable: true, help: "Shown to visitors as your contact email." },
      { name: "phone", label: "Phone number", type: "text", maxLength: 30, nullable: true, help: "Use the format you want visitors to see." },
      { name: "whatsapp", label: "WhatsApp number", type: "text", maxLength: 30, nullable: true, help: "Include your country code, for example +91." },
      { name: "footer_text", label: "Footer credit text", type: "text", maxLength: 120, help: "Example: Powered by aniketwebdev.in" },
      { name: "footer_url", label: "Footer credit link", type: "url", maxLength: 300, help: "Optional destination for the footer credit." },
      { name: "chat_enabled", label: "Show the chat assistant on the website", type: "boolean" },
      { name: "chat_greeting", label: "Chat greeting", type: "text", maxLength: 200, help: "First message visitors see. Example: Hi! Ask me about websites, apps or SEO." },
      { name: "chat_suggestions", label: "Quick question buttons (comma separated)", type: "list", help: "Shown when the chat opens. Keep each one short, for example: What services do you offer?" },
      { name: "chat_instructions", label: "What the assistant should know and how it should talk", type: "textarea", maxLength: 4000, help: "Write your services, pricing policy, working hours, tone and next step. Example: I build websites and apps for Pune businesses. Be friendly and brief. For prices, offer a fixed quote after a call. Next step: contact form or WhatsApp." },
      { name: "business_name", label: "Legal business name", type: "text", required: true, maxLength: 120, help: "The name that will appear in the invoice header." },
      { name: "business_address", label: "Business address", type: "textarea", maxLength: 1000, nullable: true, help: "Address to print in the invoice header." },
      { name: "business_gstin", label: "GSTIN", type: "text", maxLength: 20, nullable: true, help: "Leave blank if you do not charge GST." },
      { name: "business_pan", label: "PAN", type: "text", maxLength: 20, nullable: true },
      { name: "business_upi_id", label: "UPI ID", type: "text", maxLength: 100, nullable: true, help: "Enter your UPI ID (VPA). It appears on new invoices and enables the Pay via UPI link for INR balances." },
      { name: "business_bank_details", label: "Bank transfer details", type: "textarea", maxLength: 1000, nullable: true, help: "Add account name, account number, IFSC and bank name. These details appear on new client invoices." },
    ],
  },
  projects: {
    key: "projects",
    label: "Projects",
    table: "projects",
    description: "Portfolio projects shown as cards on the home page.",
    orderBy: "sort_order",
    ascending: true,
    listColumns: [
      { key: "title", label: "Title" },
      { key: "category", label: "Category" },
      { key: "published", label: "Published" },
      { key: "sort_order", label: "Order" },
    ],
    fields: [
      { name: "title", label: "Project title", type: "text", required: true, maxLength: 150 },
      { name: "slug", label: "Slug (optional, lowercase)", type: "text", maxLength: 80 },
      { name: "category", label: "Category", type: "text", maxLength: 60, nullable: true, help: "Example: E-commerce, Web App" },
      { name: "description", label: "Description", type: "textarea", maxLength: 500, nullable: true },
      { name: "image_url", label: "Screenshot", type: "image", nullable: true },
      { name: "live_url", label: "Live link", type: "url", maxLength: 500, nullable: true },
      { name: "tags", label: "Tags (comma separated)", type: "list" },
      { name: "featured", label: "Featured", type: "boolean" },
      { name: "published", label: "Publish on website", type: "boolean", help: "Turn this on to show the project on your website." },
      { name: "sort_order", label: "Display order", type: "number", help: "Optional. Lower numbers appear earlier." },
    ],
  },
  testimonials: {
    key: "testimonials",
    label: "Testimonials",
    table: "testimonials",
    description: "Client reviews and quotes.",
    orderBy: "sort_order",
    ascending: true,
    listColumns: [
      { key: "name", label: "Name" },
      { key: "company", label: "Company" },
      { key: "rating", label: "Rating" },
      { key: "published", label: "Published" },
    ],
    fields: [
      { name: "name", label: "Name", type: "text", required: true, maxLength: 100 },
      { name: "role", label: "Role", type: "text", maxLength: 100, nullable: true },
      { name: "company", label: "Company", type: "text", maxLength: 100, nullable: true },
      { name: "quote", label: "Testimonial", type: "textarea", required: true, maxLength: 1000 },
      { name: "avatar_url", label: "Photo", type: "image", nullable: true },
      { name: "rating", label: "Rating (1 to 5)", type: "number", nullable: true },
      { name: "published", label: "Publish on website", type: "boolean", help: "Turn this on to show the testimonial on your website." },
      { name: "sort_order", label: "Display order", type: "number", help: "Optional. Lower numbers appear earlier." },
    ],
  },
  clients: {
    key: "clients",
    label: "Clients",
    table: "clients",
    description: "Client logos shown in the logo wall.",
    orderBy: "sort_order",
    ascending: true,
    listColumns: [
      { key: "name", label: "Name" },
      { key: "published", label: "Published" },
      { key: "sort_order", label: "Order" },
    ],
    fields: [
      { name: "name", label: "Client name", type: "text", required: true, maxLength: 100 },
      { name: "email", label: "Billing email", type: "text", maxLength: 150, nullable: true, help: "Used when sharing invoices by email." },
      { name: "phone", label: "WhatsApp / phone", type: "text", maxLength: 30, nullable: true, help: "Include the country code for WhatsApp reminders." },
      { name: "billing_address", label: "Billing address", type: "textarea", maxLength: 1000, nullable: true },
      { name: "gstin", label: "Client GSTIN", type: "text", maxLength: 20, nullable: true },
      { name: "pan", label: "Client PAN", type: "text", maxLength: 20, nullable: true },
      { name: "logo_url", label: "Logo", type: "image", nullable: true },
      { name: "website_url", label: "Website", type: "url", maxLength: 500, nullable: true },
      { name: "published", label: "Publish on website", type: "boolean", help: "Turn this on to show the client logo on your website." },
      { name: "sort_order", label: "Display order", type: "number", help: "Optional. Lower numbers appear earlier." },
    ],
  },
  blog: {
    key: "blog",
    label: "Blog posts",
    table: "blog_posts",
    description: "Articles for SEO. Start a line with ## for a section heading; blank lines split paragraphs.",
    orderBy: "created_at",
    ascending: false,
    listColumns: [
      { key: "title", label: "Title" },
      { key: "slug", label: "Slug" },
      { key: "published", label: "Published" },
      { key: "published_at", label: "Publish date" },
    ],
    fields: [
      { name: "title", label: "Title", type: "text", required: true, maxLength: 200 },
      { name: "slug", label: "URL slug (leave empty to auto-create)", type: "text", maxLength: 120 },
      { name: "excerpt", label: "Excerpt / intro", type: "textarea", maxLength: 320, nullable: true },
      { name: "cover_url", label: "Cover image", type: "image", nullable: true },
      { name: "content", label: "Article body", type: "textarea", required: true, maxLength: 100000 },
      { name: "tags", label: "Tags (comma separated)", type: "list" },
      { name: "seo_title", label: "SEO title (max 70 characters)", type: "text", maxLength: 70, nullable: true },
      { name: "seo_description", label: "SEO description (max 170 characters)", type: "textarea", maxLength: 170, nullable: true },
      { name: "published", label: "Publish on website", type: "boolean", help: "Turn this on to make the post visible on your website." },
      { name: "published_at", label: "Publish date and time", type: "datetime", nullable: true },
    ],
  },
  contact: {
    key: "contact",
    label: "Enquiries",
    table: "contact_submissions",
    description: "Messages sent through the website contact form.",
    readOnly: true,
    orderBy: "created_at",
    ascending: false,
    listColumns: [
      { key: "name", label: "Name" },
      { key: "email", label: "Email" },
      { key: "service", label: "Service" },
      { key: "message", label: "Message" },
      { key: "created_at", label: "Received" },
    ],
    fields: [],
  },
  payments: {
    key: "payments",
    label: "Payments",
    table: "payments",
    description: "Record and track client payments against invoices.",
    readOnly: true,
    orderBy: "payment_date",
    ascending: false,
    listColumns: [],
    fields: [],
  },
  invoices: {
    key: "invoices",
    label: "Invoices",
    table: "invoices",
    description: "Create invoices, track balances and share payment details with clients.",
    readOnly: true,
    orderBy: "invoice_date",
    ascending: false,
    listColumns: [],
    fields: [],
  },
};

export const IMAGE_MAX_BYTES = 5 * 1024 * 1024;
export const IMAGE_TYPES: Record<string, string> = {
  "image/png": "png",
  "image/jpeg": "jpg",
  "image/webp": "webp",
  "image/gif": "gif",
  "image/svg+xml": "svg",
};
