# Aniket Jamunde - Next.js website + Supabase admin panel

Website: https://aniketwebdev.in

## 1. Install and run

    npm install
    # Create .env.local with your Supabase URL, anon key, and public site URL
    npm run dev

## 2. Set up Supabase (one time)

1. Create a new Supabase project.
2. Open SQL Editor, paste and run `supabase/FULL-SETUP.sql`. This single script
   creates the complete schema, security policies, media bucket, billing,
   invoice features, starter settings, and client logos.
3. Authentication -> Providers -> Email: turn OFF "Allow new users to sign up".
4. Authentication -> Users -> "Add user" with your email and a strong password.
5. Add your user to the admin list by running this query with your email:

       insert into public.admins (user_id)
       select id from auth.users where email = 'you@example.com';

6. Copy the Project URL and anon key (Project Settings -> API) into `.env.local`.

Use `FULL-SETUP.sql` only on a fresh project and run it once. Add your real brand,
contact, tax and payment details in Theme & Settings before publishing or creating
invoices. Never put the service_role key in this project. Only the anon key is used.
## 3. Admin panel

Open `/admin`, sign in, then manage:

- Theme & Settings: logo (upload or link), brand name, the four palette colors
  (primary, secondary, highlight, background) with a live preview, contact details,
  footer credit
- Images: every image field takes either an uploaded file (stored in Supabase
  Storage, 5 MB max) or a pasted link
- Projects: home page project cards (notched design)
- Testimonials and Clients: public sections are populated from these records
- Blog posts: SEO title, description, slug, cover, publish date
- Enquiries: messages from the contact form, with a handled toggle
- Payments and Invoices: record payments, issue linked invoices, share a client invoice link,
  print invoices to PDF, and track balances, overdue invoices and credit notes
- Invoice charts: six-month INR collection chart and current invoice status breakdown

Security: /admin is guarded by middleware, the admin role is checked on every
server action, and Supabase row-level security blocks non-admins even if the
app is bypassed. The admin pages send `noindex`.

## 4. SEO / AEO / GEO included

- Metadata API on every page, canonical URLs, Open Graph, Twitter cards
- JSON-LD: Organization, WebSite, BlogPosting
- sitemap.xml (static pages, service pages, published blog posts) and robots.txt
- robots.txt allows AI crawlers (GPTBot, ClaudeBot, PerplexityBot, Google-Extended)
- public/llms.txt summarises the business for answer engines
- Security headers in next.config.ts

`NEXT_PUBLIC_SITE_URL` is set to `https://aniketwebdev.in`. The `llms.txt` file
and canonical metadata use the same public domain.

## Known gaps (please read)

- The Clients and Testimonials sections read their content from Supabase. Add
  real records in the admin panel to display them.
- The Services pages still read from src/lib/services.ts; they are not yet
  editable in the admin panel.
- The original template sections (Hero, Services, Stats, FAQ, Testimonials,
  WhyChooseUs, TechStack) still use their own hard-coded colors and do not yet
  read the theme palette. Only the new sections, footer, admin and back buttons use it.
- Navbar logo is not yet connected to the logo field.
- The project was assembled without network access, so `npm install` and
  `npm run build` were not run here. Run them locally first; fix any type
  error the build reports and tell me the message.


## Final setup (Aniket Jamunde)

1. New Supabase project: run `supabase/FULL-SETUP.sql` once in the SQL Editor.
2. Create your admin login (Authentication -> Users), then run the admin insert shown below with that email.
3. Copy `.env.example` to `.env.local` and fill in:
   - `NEXT_PUBLIC_SUPABASE_URL` and `NEXT_PUBLIC_SUPABASE_ANON_KEY` (Project Settings -> API)
   - `GROQ_API_KEY` for the chat assistant (never commit this file)
4. `npm install` (this installs `sharp`, used to convert uploaded images to WebP), then `npm run dev`.
5. In the admin: check the client names and links, add your projects, testimonials and blog posts, and turn the chat on or off under Theme & Settings.

Existing site: back up the database first, then use `FULL-SETUP.sql` only if the missing tables or features are required.
