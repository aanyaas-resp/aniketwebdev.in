# Aniket Jamunde — Portfolio & Business Website

The source code for [aniketwebdev.in](https://aniketwebdev.in), a portfolio and services website for Aniket Jamunde. It includes project and blog pages, a contact form, a configurable admin panel, and an optional AI chat assistant.

## Run locally

### Requirements

- Node.js 18.18 or later
- npm
- A Supabase project for the admin panel and contact enquiry storage

### Setup

1. From the project directory, install dependencies:

   ```bash
   npm install
   ```

2. Create `.env.local` in the project root. Copy `.env.example` and fill in the values:

   ```bash
   cp .env.example .env.local
   ```

   On Windows PowerShell, use `Copy-Item .env.example .env.local`.

3. Create a Supabase project. In its SQL Editor, run `supabase/FULL-SETUP.sql` once on a fresh database. In Supabase Authentication, disable public sign-ups and create your admin user. Add that user to the admin list:

   ```sql
   insert into public.admins (user_id)
   select id from auth.users where email = 'you@example.com';
   ```

4. Start the development server:

   ```bash
   npm run dev
   ```

5. Visit [http://localhost:3000](http://localhost:3000). The admin panel is at `/admin`.

For an existing Supabase database, back it up first. `FULL-SETUP.sql` is intended for a fresh project and should not be rerun on a live database without reviewing its effects.

### Environment variables

| Variable | Required | Purpose |
| --- | --- | --- |
| `NEXT_PUBLIC_SITE_URL` | Recommended | Canonical site URL, for example `http://localhost:3000` locally and `https://aniketwebdev.in` in production. |
| `NEXT_PUBLIC_SUPABASE_URL` | Yes | Supabase project URL. |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Yes | Supabase anon/public key. Row-level security protects database access. |
| `GROQ_API_KEY` | Optional | Enables responses from the AI chat assistant. Keep this secret on the server. |
| `NEXT_PUBLIC_GOOGLE_SITE_VERIFICATION` | Optional | Google Search Console verification token. |
| `NEXT_PUBLIC_BUSINESS_CITY` | Optional | Business locality added to structured data. |

Never commit `.env.local`, private API keys, or a Supabase `service_role` key. The app uses the anon key and Supabase row-level security.

## Available commands

```bash
npm run dev    # Start the local development server
npm run build  # Create a production build
npm run start  # Serve the production build
npm run lint   # Run the Next.js linter
```

## About Aniket

Aniket Jamunde is a web and app developer based in Chhatrapati Sambhajinagar, Maharashtra, India. He works with businesses on websites, custom apps, e-commerce, SEO/AEO/GEO, and digital product development.

- Website: [aniketwebdev.in](https://aniketwebdev.in)
- Email: [aniketjamunde4@gmail.com](mailto:aniketjamunde4@gmail.com)
- LinkedIn: [Aniket Jamunde](https://www.linkedin.com/in/aniketjamunde/)
- Instagram: [@aniketwebdev_in](https://www.instagram.com/aniketwebdev_in/)
- GitHub: [Aniketjamunde9146](https://github.com/Aniketjamunde9146/)

## License

Copyright © 2026 Aniket Jamunde. All rights reserved. See [LICENSE](LICENSE) for the terms governing use of this source code. Contact Aniket for licensing enquiries.
