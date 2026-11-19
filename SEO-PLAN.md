# SEO, AEO and GEO plan for Aniket Jamunde

Target searches: web developer / app developer in Aurangabad (Chhatrapati Sambhaji Nagar) and Pune.

## Already built into the site
- Four local landing pages: /developers/web-developer-aurangabad, /web-developer-pune, /app-developer-aurangabad, /app-developer-pune
- A direct-answer paragraph at the top of each page (what answer engines quote)
- FAQPage, ProfessionalService and BreadcrumbList structured data
- Sitemap listing every page, robots.txt that allows AI crawlers, llms.txt
- Unique titles and descriptions per page, canonical URLs, Open Graph tags
- Blog and service pages with their own metadata

## Set these environment variables (in Vercel or .env.local)
- NEXT_PUBLIC_SITE_URL = https://aniketwebdev.in
- NEXT_PUBLIC_GOOGLE_SITE_VERIFICATION = the code from Google Search Console
- NEXT_PUBLIC_BUSINESS_CITY = Chhatrapati Sambhaji Nagar (or your real city)

## Do this week (off-site, outside the code)
1. Google Business Profile: create or claim it for your business, pick the correct
   category (Web designer / Software company), add photos, services and your service area.
   Ask every past client for a Google review.
2. Google Search Console: add the property, verify it with the env code above,
   submit https://aniketwebdev.in/sitemap.xml, and request indexing for the four local pages.
3. Bing Webmaster Tools: add the site and submit the sitemap as well.
4. Directory listings with the same name, address and phone (NAP) everywhere:
   JustDial, IndiaMART, Sulekha, Clutch, GoodFirms, and LinkedIn company page.
5. Keep the business name, phone and city identical on every listing and on the website footer.

## Do this month (content)
- Publish one blog post a week from the admin panel. Good first topics:
  "How much does a business website cost in Aurangabad?", "Flutter vs native apps for small businesses",
  "Why Google Business Profile matters for local clients", "What to check before hiring a web developer".
- Each post: one clear question as the title, a direct answer in the first 60 words, then sections
  with ## headings, and a link to the matching local page.
- Collect 3 to 5 real case studies (with client permission) and add them as projects with results.

## How to measure
- Search Console: impressions and clicks for "web developer aurangabad", "app developer pune" etc.
- Check monthly which local pages rank, then add FAQs based on the real questions people ask.
- Check AI answers: ask ChatGPT, Perplexity and Google AI Overviews the target questions
  and note whether your business is mentioned. Improve the local pages where it is not.

## Honest notes
- Ranking takes weeks to months. Local reviews and a complete Google Business Profile often
  move local rankings the most.
- Before publishing, confirm every claim on the local pages (timelines, services, service areas)
  is true for your business. Edit src/lib/locations.ts to change them.
