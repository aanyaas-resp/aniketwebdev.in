// Local landing pages: one per city + service combination.
// Only claims you can confirm should go here. Edit the text before publishing.

export type LocationPage = {
  slug: string;
  service: "web" | "app" | "seo" | "game";
  city: "aurangabad" | "pune";
  cityName: string;
  serviceName: string;
  serviceType: string;
  title: string;
  description: string;
  h1: string;
  answer: string;
  localNote: string;
  offerings: string[];
  process: { title: string; text: string }[];
  faqs: { q: string; a: string }[];
  whyChoose?: string[];
};

export const PROCESS_STEPS = [
  { title: "Discover", text: "A short call to understand your goals, customers and must-have features." },
  { title: "Plan", text: "A written scope, fixed quote and clear timeline before any build starts." },
  { title: "Build", text: "Regular demos so you see progress, and your feedback shapes the result." },
  { title: "Launch", text: "Testing, go-live support and training, then ongoing care if you want it." },
];

export const LOCATION_PAGES: LocationPage[] = [
  {
    slug: "web-developer-aurangabad",
    service: "web",
    city: "aurangabad",
    cityName: "Aurangabad (Chhatrapati Sambhaji Nagar)",
    serviceName: "Web Developer",
    serviceType: "Website development",
    title: "Web Developer in Aurangabad | Aniket Jamunde",
    description:
      "Web developer in Aurangabad (Chhatrapati Sambhaji Nagar). Fast, mobile-friendly websites, admin panels and business web apps built to rank on Google.",
    h1: "Web Developer in Aurangabad",
    answer:
      "Aniket Jamunde is a web developer in Aurangabad (Chhatrapati Sambhaji Nagar). I build fast, mobile-friendly business websites, custom web applications and admin panels. Every site launches with SEO basics in place: unique titles, descriptions, structured data and a sitemap.",
    localNote:
      "I work with businesses in Chhatrapati Sambhaji Nagar (Aurangabad) and across Maharashtra. I meet in person when it helps, and work remotely with video calls and demos when it does not.",
    offerings: [
      "Business and portfolio websites",
      "Custom web applications and dashboards",
      "Admin panels to edit your content yourself",
      "E-commerce and booking websites",
      "SEO-ready builds and Google Business setup support",
    ],
    process: PROCESS_STEPS,
    faqs: [
      { q: "How much does a website cost in Aurangabad?", a: "The cost depends on the number of pages, features and integrations. I give a fixed quote after a short call, so there are no surprises." },
      { q: "How long does it take to build a website?", a: "A typical business website takes about one to three weeks. Larger web apps with custom features take longer. I share the timeline before work starts." },
      { q: "Will my website show up on Google?", a: "Every site I build includes SEO basics: unique page titles and descriptions, fast loading, a sitemap and structured data. Ranking also depends on content and local reviews, and I can help with both." },
    ],
  },
  {
    slug: "web-developer-pune",
    service: "web",
    city: "pune",
    cityName: "Pune",
    serviceName: "Web Developer",
    serviceType: "Website development",
    title: "Best Web Developer in Pune | Aniket Jamunde",
    description:
      "Web developer serving Pune businesses. Fast, search-ready websites, custom web apps and admin dashboards, delivered remotely with clear milestones.",
    h1: "Best Web Developer in Pune",
    answer:
      "Aniket Jamunde is a web developer serving businesses in Pune. I build fast, search-ready websites, custom web applications and admin dashboards. Every project includes SEO foundations so your business can be found on Google from the day it launches.",
    localNote:
      "I serve Pune clients remotely with scheduled video calls, shared demo links and clear milestones, so you can review progress without travelling.",
    offerings: [
      "Company and landing-page websites",
      "Custom web applications and client portals",
      "Content management admin panels",
      "Online store and booking websites",
      "Website speed and SEO audits for existing sites",
    ],
    process: PROCESS_STEPS,
    faqs: [
      { q: "Can a Pune business work with you remotely?", a: "Yes. I run regular video calls, share demo links for every stage and agree on milestones upfront. Many clients never need an in-person meeting." },
      { q: "Do you redesign existing websites?", a: "Yes. I can audit your current site for speed and SEO, then rebuild it while keeping the pages that already rank." },
      { q: "What do you need from me to start?", a: "Your business details, the services you offer, any logo and photos, and examples of websites you like. I handle the rest in the planning stage." },
    ],
  },
  {
    slug: "app-developer-aurangabad",
    service: "app",
    city: "aurangabad",
    cityName: "Aurangabad (Chhatrapati Sambhaji Nagar)",
    serviceName: "App Developer",
    serviceType: "Mobile app development",
    title: "App Developer in Aurangabad | Aniket Jamunde",
    description:
      "App developer in Aurangabad (Chhatrapati Sambhaji Nagar). Flutter apps for Android and iOS from one codebase, with design, API setup and store publishing.",
    h1: "App Developer in Aurangabad",
    answer:
      "Aniket Jamunde is an app developer in Aurangabad (Chhatrapati Sambhaji Nagar). I build Android and iOS apps with Flutter, so one codebase runs on both platforms. I cover design, development, backend and database setup, store publishing and post-launch support.",
    localNote:
      "I build apps for local businesses in Chhatrapati Sambhaji Nagar (Aurangabad) and across Maharashtra, with in-person planning sessions when they help.",
    offerings: [
      "Cross-platform apps (Android and iOS) with Flutter",
      "App UI/UX design and clickable prototypes",
      "Login, payments, notifications and API integration",
      "Google Play and App Store submission support",
      "Post-launch updates and maintenance",
    ],
    process: PROCESS_STEPS,
    faqs: [
      { q: "Do you build apps for both Android and iOS?", a: "Yes. I use Flutter, which lets me build one app that runs on both Android and iOS, usually saving time and cost compared with two separate apps." },
      { q: "How long does an app take to build?", a: "A simple app usually takes about four to ten weeks. Complex apps with payments and custom backends take longer. I confirm the timeline after planning." },
      { q: "Will you publish the app on Play Store and App Store?", a: "Yes. I help with store listings and submission. Apple requires a developer account, which I will walk you through setting up." },
    ],
  },
  {
    slug: "app-developer-pune",
    service: "app",
    city: "pune",
    cityName: "Pune",
    serviceName: "App Developer",
    serviceType: "Mobile app development",
    title: "Best App Developer in Pune | Aniket Jamunde",
    description:
      "App developer serving Pune businesses. Flutter mobile apps for Android and iOS with design, backend integration and app store publishing.",
    h1: "Best App Developer in Pune",
    answer:
      "Aniket Jamunde is an app developer serving businesses in Pune. I build mobile apps for Android and iOS with Flutter, one codebase for both platforms. Each project covers design, backend and database integration, store publishing and ongoing support.",
    localNote:
      "I build apps for Pune clients remotely, with shared prototypes, scheduled reviews and test builds you can try on your own phone at every stage.",
    offerings: [
      "Customer-facing mobile apps",
      "Internal tools for staff and field teams",
      "App prototypes to validate an idea first",
      "Backend, database and admin panel setup",
      "Store publishing and version updates",
    ],
    process: PROCESS_STEPS,
    faqs: [
      { q: "Can I test the app before it is published?", a: "Yes. I share test builds you can install on your phone at each milestone, so you can check the app before it goes live." },
      { q: "Do you build apps for an existing business idea?", a: "Yes. I can turn an existing idea or process into an app, starting with a prototype so you can test it with real users first." },
      { q: "Will the app work offline or on slow internet?", a: "I design for real-world connections. Where offline use matters, I plan that during scoping so it is built in from the start." },
    ],
  },
  {
    slug: "seo-aeo-geo-pune",
    service: "seo",
    city: "pune",
    cityName: "Pune",
    serviceName: "SEO, AEO & GEO",
    serviceType: "Search engine optimization",
    title: "Best SEO, AEO & GEO Expert in Pune | Aniket Jamunde",
    description:
      "SEO, AEO and GEO services in Pune: technical SEO, Google Business Profile, local pages and visibility in AI answer tools like ChatGPT and Google AI Overviews.",
    h1: "Best SEO, AEO & GEO Expert in Pune",
    answer:
      "I help Pune businesses get found on Google and quoted by AI answer tools such as ChatGPT, Perplexity and Google AI Overviews. My work covers technical SEO, Google Business Profile, local service pages, structured data, and clear answers that AI tools can quote. Results depend on competition, content and reviews, so I measure progress every month.",
    localNote:
      "I work with businesses across Pune remotely. You get a monthly report with clear next steps, and you can call me whenever you need to talk something through.",
    offerings: [
      "Technical SEO audit and fixes",
      "Google Business Profile setup and optimisation",
      "Local SEO pages for each service and area",
      "AEO: question-based content and FAQ structured data",
      "GEO: llms.txt, entity pages and clear citations",
      "Google Ads and Meta ads setup with conversion tracking",
    ],
    process: PROCESS_STEPS,
    faqs: [
      { q: "What is the difference between SEO, AEO and GEO?", a: "SEO helps your pages rank in Google results. AEO makes your answers easy for search engines to pick as direct answers. GEO makes your business clear to AI tools such as ChatGPT and Perplexity, so they can describe and recommend you accurately." },
      { q: "How long does SEO take to show results?", a: "Most local businesses see early movement in two to four months. Competition, content quality and reviews all change the timeline, so I give you a monthly report instead of a promise." },
      { q: "Can you guarantee the number one spot on Google?", a: "No honest SEO expert can guarantee a fixed position, because Google decides the rankings. I can show you exactly what I am doing to improve your visibility, and I track the results." },
    ],
    whyChoose: [
      "I explain every change in plain language, so you know what is happening and why.",
      "I fix the technical problems first, because they hold back every other effort.",
      "I track Google Search Console and Business Profile data, not guesses.",
      "I write content in a way AI answer tools can quote accurately.",
      "You keep ownership of your Google accounts and your website.",
    ],
  },
  {
    slug: "game-developer-pune",
    service: "game",
    city: "pune",
    cityName: "Pune",
    serviceName: "Game Developer",
    serviceType: "Game development",
    title: "Best Game Developer in Pune | Aniket Jamunde",
    description:
      "Game development in Pune for mobile and web: casual and puzzle games, game UI, store pages and launch marketing, built remotely with clear milestones.",
    h1: "Best Game Developer in Pune",
    answer:
      "I develop mobile and browser games in Pune and remotely. I build casual and puzzle games, game interfaces, and the store pages and landing pages that help a game get discovered. I explain each stage in plain language before I start.",
    localNote:
      "I work with Pune clients through scheduled video calls and playable test builds, so you can try each version on your own phone.",
    offerings: [
      "Mobile games for Android and iOS",
      "Browser games that run without installation",
      "Casual, puzzle and quiz games",
      "Game UI, menus and in-game dashboards",
      "Store listing pages and game landing pages",
      "Launch marketing pages and tracking setup",
    ],
    process: PROCESS_STEPS,
    faqs: [
      { q: "Which platforms do you build games for?", a: "I build for Android and iOS with Flutter, and for the browser. I choose the platform during planning, based on who will play and how you plan to share the game." },
      { q: "How long does a simple game take?", a: "A small casual game usually takes a few weeks. Larger games with levels, accounts or payments take longer. I confirm the timeline after the planning stage." },
      { q: "Do you help promote the game?", a: "Yes. I build the store pages, landing page and tracking, and can set up a simple launch campaign. I do not promise a number of downloads." },
    ],
    whyChoose: [
      "You can play every build on your own phone before launch.",
      "I plan the scope in writing, so there are no surprise costs at the end.",
      "I keep the game code simple and maintainable for future updates.",
      "I help with store listings, which many developers skip.",
      "You own the final game and its assets.",
    ],
  },
];

// Default "why clients choose me" points, used by any page without its own list.
export const DEFAULT_WHY = [
  "I reply within one working day and send a clear written plan.",
  "You see progress through demo links, so there are no surprises at the end.",
  "Clean code and fast pages, which search engines and customers both like.",
  "I explain each decision in plain language, so you can make the final call.",
  "I stay available after launch if you want ongoing support.",
];

export function getLocationPage(slug: string) {
  return LOCATION_PAGES.find((p) => p.slug === slug) ?? null;
}
