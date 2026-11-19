export type ServiceFaq = { question: string; answer: string };

export type ServiceOffering = {
  slug: string;
  title: string;
  image: string;
  imageAlt: string;
  description: string;
  longDescription: string;
  metaTitle: string;
  metaDescription: string;
  tags: string[];
  keywords: string[];
  whoItsFor: string[];
  benefits: string[];
  included: string[];
  pricing: {
    label: string;
    range: string;
    note: string;
  };
  faqs: ServiceFaq[];
  relatedSlugs: string[];
};

export const SERVICE_AREAS = [
  "Aurangabad",
  "Pune",
  "Mumbai",
  "Nashik",
  "Nagpur",
];

export const SERVICE_PROCESS = [
  {
    title: "Discover",
    description:
      "I learn about your business, your customers, and what you want the project to achieve. I also note any technical or budget limits early.",
  },
  {
    title: "Plan",
    description:
      "I agree on the scope, deliverables, timeline, and how success will be measured, so there are no surprises later.",
  },
  {
    title: "Build",
    description:
      "I create the agreed solution in stages and share progress with you, so feedback comes in while changes are still easy to make.",
  },
  {
    title: "Test & launch",
    description:
      "I check the finished work on real devices, fix the agreed issues, and prepare the launch or handover with clear documentation.",
  },
];

const SERVICE_IMAGES = [
  "https://images.unsplash.com/photo-1461749280684-dccba630e2f6?auto=format&fit=crop&w=1200&q=85",
  "https://images.unsplash.com/photo-1559028012-481c04fa702d?auto=format&fit=crop&w=1200&q=85",
  "https://images.unsplash.com/photo-1460925895917-afdab827c52f?auto=format&fit=crop&w=1200&q=85",
  "https://images.unsplash.com/photo-1522542550221-31fd19575a2d?auto=format&fit=crop&w=1200&q=85",
  "https://images.unsplash.com/photo-1498050108023-c5249f4df085?auto=format&fit=crop&w=1200&q=85",
  "https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&w=1200&q=85",
];

export const SERVICES: ServiceOffering[] = [
  {
    slug: "web-development",
    title: "Web Development",
    image: SERVICE_IMAGES[0],
    imageAlt: "Web development services illustration",
    description:
      "Fast, accessible websites shaped around your brand, customers, and business goals.",
    longDescription:
      "I design and build websites that explain your business clearly, load quickly on phones, and guide visitors to the next step, whether that is a call, a booking, or a purchase. Every project starts with your customers and goals, so the site is built around what your business needs rather than a generic template.",
    metaTitle: "Web Development Services | Responsive, SEO-Ready Websites",
    metaDescription:
      "Custom websites and landing pages built for speed, mobile use, and search visibility. Remote work for businesses in Aurangabad, Pune, Mumbai, Nashik, Nagpur, and worldwide.",
    tags: ["Responsive", "Custom", "Accessible"],
    keywords: [
      "web development",
      "website development",
      "landing page development",
      "business website development",
      "web development in Aurangabad",
      "web development in Pune",
      "web development in Mumbai",
      "web development in Nashik",
      "web development in Nagpur",
    ],
    whoItsFor: [
      "Small businesses that need a credible online presence",
      "Clinics, coaches, and local service providers",
      "Companies replacing a slow or outdated website",
    ],
    benefits: [
      "Pages that load quickly on mobile and desktop",
      "Clear calls to action that make it easy to contact you",
      "Clean structure and on-page SEO foundations from the start",
    ],
    included: [
      "Project discovery and scope planning",
      "Responsive page design and development",
      "On-page SEO: titles, descriptions, headings, and image alt text",
      "Contact form or call-to-action setup",
      "Quality checks across devices and browsers",
      "Launch handover with simple notes for future edits",
    ],
    pricing: {
      label: "Landing page projects",
      range: "₹4,000–₹12,000",
      note:
        "This range covers landing page projects. Multi-page websites and additional functionality are quoted after I review the scope.",
    },
    faqs: [
      {
        question: "Does the ₹4,000–₹12,000 range cover a full website?",
        answer:
          "No. That range is for landing page projects. Multi-page websites, integrations, and extra features are quoted separately after I review your requirements.",
      },
      {
        question: "Can you improve or rebuild an existing website?",
        answer:
          "Yes. I can review your current site, identify what is slowing it down or confusing visitors, and agree on a focused redesign, rebuild, or set of improvements.",
      },
      {
        question: "Will my website be mobile-friendly?",
        answer:
          "Yes. Every website is designed to work on phones, tablets, and desktops, and I test the main pages across common screen sizes before launch.",
      },
      {
        question: "Do you work with businesses outside Aurangabad?",
        answer:
          "Yes. I work remotely with businesses across India and worldwide. The cities listed on this page are service areas, not claims of local offices.",
      },
    ],
    relatedSlugs: ["seo-aeo-geo", "ads-optimization", "ecommerce-shopify"],
  },
  {
    slug: "app-development",
    title: "App Development",
    image: SERVICE_IMAGES[1],
    imageAlt: "App development services illustration",
    description:
      "Intuitive mobile app experiences designed to make everyday tasks feel effortless.",
    longDescription:
      "I plan and build mobile and web apps around the tasks your users care about most. I focus on simple flows, reliable performance, and an interface that works the first time someone opens it. I agree on the platforms and features before development starts, so the scope stays clear.",
    metaTitle: "App Development Services | iOS & Android Apps",
    metaDescription:
      "Custom mobile app development for iOS and Android, with planning, interface design, testing, and release support. Work with me remotely from anywhere in India or worldwide.",
    tags: ["iOS", "Android", "Product Design"],
    keywords: [
      "mobile app development",
      "iOS app development",
      "Android app development",
      "custom app development",
      "cross-platform app development",
    ],
    whoItsFor: [
      "Businesses that want customers to book, order, or track on their phone",
      "Teams replacing manual processes with a simple internal app",
      "Founders validating a product idea before a larger build",
    ],
    benefits: [
      "Simple, focused flows built around real user tasks",
      "One clear scope and plan before any code is written",
      "Testing on real devices before release",
    ],
    included: [
      "Feature and user-flow planning",
      "Interface design for the agreed platforms",
      "App development and third-party integrations",
      "Device testing and bug fixing",
      "Release preparation, including store submission checklist",
    ],
    pricing: {
      label: "Project pricing",
      range: "Custom quote",
      note:
        "The estimate depends on the platforms, number of features, integrations, and the agreed project scope.",
    },
    faqs: [
      {
        question: "Which platforms can you build for?",
        answer:
          "I discuss your audience first, then agree on the target platforms and technical approach in the project scope. Options include iOS, Android, and web apps.",
      },
      {
        question: "Can you help prepare an app for release?",
        answer:
          "Yes. Release preparation can be included in the scope, covering testing and the assets and information needed for app store submission.",
      },
      {
        question: "How do you handle changes during development?",
        answer:
          "Changes are reviewed against the agreed scope. Small adjustments are handled within the plan, while larger changes are quoted and agreed before work continues.",
      },
      {
        question: "Do you work with clients remotely?",
        answer:
          "Yes. I collaborate remotely with clients worldwide, with review points and communication schedules agreed at the start.",
      },
    ],
    relatedSlugs: ["web-development", "game-development", "ai-automation"],
  },
  {
    slug: "game-development",
    title: "Game Development",
    image: SERVICE_IMAGES[2],
    imageAlt: "Game development services illustration",
    description:
      "Playful, polished game experiences for mobile, web, and interactive platforms.",
    longDescription:
      "I help turn a game idea into a playable product. I start with the core loop and the player experience, then build the mechanics, interface, and platform version in stages. This keeps the game fun to test early, and it lets me adjust difficulty and pacing based on real feedback.",
    metaTitle: "Game Development Services | Mobile & Web Games",
    metaDescription:
      "Custom game development for mobile, web, and interactive platforms, from concept and prototype to testing and release. Remote collaboration for clients in India and worldwide.",
    tags: ["Game Design", "Development", "Launch"],
    keywords: [
      "game development",
      "mobile game development",
      "web game development",
      "custom game development",
      "game prototype development",
    ],
    whoItsFor: [
      "Entrepreneurs with a game concept who need a playable prototype",
      "Brands creating interactive experiences or promotional games",
      "Studios that need extra development capacity",
    ],
    benefits: [
      "A playable prototype early, so ideas can be tested quickly",
      "Clear milestones based on the core game loop",
      "Testing and feedback built into each stage",
    ],
    included: [
      "Concept and gameplay scope",
      "Core game mechanics and player interface",
      "Development for the agreed platform",
      "Playtesting and bug fixing",
      "Release preparation for the chosen platform",
    ],
    pricing: {
      label: "Project pricing",
      range: "Custom quote",
      note:
        "Pricing depends on the game concept, mechanics, target platforms, art and audio needs, and production scope.",
    },
    faqs: [
      {
        question: "Which platforms can a game target?",
        answer:
          "The target platform is selected based on your audience and technical scope. I confirm it in the proposal before development begins.",
      },
      {
        question: "Can you work with an existing game concept?",
        answer:
          "Yes. I can review an existing concept or prototype and agree on the next development steps, including what to keep and what to change.",
      },
      {
        question: "Do you provide art and audio?",
        answer:
          "Art and audio can be included if they are part of the agreed scope. If you already have assets, I can work with them during development.",
      },
      {
        question: "Do you work with clients outside India?",
        answer:
          "Yes. Discovery, reviews, and delivery can all be handled remotely for clients worldwide.",
      },
    ],
    relatedSlugs: ["app-development", "web-development", "ads-optimization"],
  },
  {
    slug: "seo-aeo-geo",
    title: "SEO, AEO & GEO",
    image: SERVICE_IMAGES[3],
    imageAlt: "SEO, AEO, and GEO services illustration",
    description:
      "Improve how your brand is discovered in search engines, answer engines, and AI tools.",
    longDescription:
      "I improve how your website is found and understood. Traditional SEO helps search engines find and rank your pages. Answer engine optimization (AEO) structures your content so it can answer real questions clearly. Generative engine optimization (GEO) makes your content easier for AI tools to read, quote, and reference accurately.",
    metaTitle: "SEO, AEO & GEO Services | Search & AI Visibility",
    metaDescription:
      "Technical SEO, answer engine optimization, and generative engine optimization for businesses in India and worldwide. Clear, measurable steps to improve search and AI visibility.",
    tags: ["SEO", "AEO", "GEO"],
    keywords: [
      "search engine optimization",
      "SEO services",
      "technical SEO",
      "answer engine optimization",
      "generative engine optimization",
      "SEO services in Pune",
      "SEO services in Mumbai",
      "SEO services in Nagpur",
    ],
    whoItsFor: [
      "Businesses whose website gets little or no organic traffic",
      "Companies with good services but unclear search presence",
      "Websites that were built without an SEO plan",
    ],
    benefits: [
      "A clear list of technical and content fixes, ranked by impact",
      "Content structured to answer the questions your customers ask",
      "Progress tracked against goals you agree on",
    ],
    included: [
      "Technical and on-page SEO audit",
      "Keyword and search intent review",
      "Content structure and heading recommendations",
      "AEO and GEO improvements scoped to your site",
      "Prioritized action plan and progress reviews",
    ],
    pricing: {
      label: "Project pricing",
      range: "Custom quote",
      note:
        "Pricing depends on the size of your site, its current health, content needs, and the work agreed for each engagement.",
    },
    faqs: [
      {
        question: "Can you guarantee a top Google ranking?",
        answer:
          "No one can guarantee a specific search position. Rankings depend on competition, content quality, site health, and search engine changes. I focus on sound optimization and measurable improvements.",
      },
      {
        question: "What do SEO, AEO, and GEO mean?",
        answer:
          "SEO improves visibility in search results. AEO structures content so it answers questions directly. GEO helps make your content clear and well-sourced for generative AI tools.",
      },
      {
        question: "How long does SEO take to show results?",
        answer:
          "It varies by site and competition. Technical fixes can be measured quickly, while ranking and traffic changes often take several months, which is why I agree on a realistic timeline up front.",
      },
      {
        question: "Do you work with businesses in specific cities?",
        answer:
          "Yes. I work remotely with businesses in Aurangabad, Pune, Mumbai, Nashik, Nagpur, across India, and worldwide.",
      },
    ],
    relatedSlugs: ["web-development", "ads-optimization", "ecommerce-shopify"],
  },
  {
    slug: "ecommerce-shopify",
    title: "E-commerce & Shopify",
    image: SERVICE_IMAGES[4],
    imageAlt: "E-commerce and Shopify services illustration",
    description:
      "Build a seamless online store with clear product journeys and smoother checkout.",
    longDescription:
      "I build online stores that make it easy for customers to find products, understand what they are buying, and check out without friction. I plan the product structure, page layouts, and checkout flow around your catalog, then set up or customize the store and connect the tools your business uses.",
    metaTitle: "E-commerce & Shopify Store Development Services",
    metaDescription:
      "Shopify store setup, theme customization, and e-commerce development with clear product pages and smooth checkout. Remote service for businesses across India and worldwide.",
    tags: ["E-commerce", "Shopify", "Integrations"],
    keywords: [
      "e-commerce development",
      "Shopify development",
      "Shopify store setup",
      "Shopify theme customization",
      "online store development",
    ],
    whoItsFor: [
      "Brands moving from social media sales to their own store",
      "Businesses with a catalog that needs better organization",
      "Stores with high cart abandonment or a confusing checkout",
    ],
    benefits: [
      "Product pages that make the buying decision easier",
      "A checkout flow that is simple on mobile",
      "Integrations planned around how your business already works",
    ],
    included: [
      "Store and product-page planning",
      "Shopify setup or theme customization",
      "Product and collection structure",
      "Checkout and agreed integrations",
      "Store testing and launch review",
    ],
    pricing: {
      label: "Project pricing",
      range: "Custom quote",
      note:
        "Pricing depends on the store structure, catalog size, design, integrations, and any data migration.",
    },
    faqs: [
      {
        question: "Can you build or customize a Shopify store?",
        answer:
          "Yes. I can set up a new store or customize an existing Shopify theme around your products and business requirements.",
      },
      {
        question: "Can you migrate an existing store?",
        answer:
          "Migration can be included after I review your current catalog, platform, integrations, and data needs.",
      },
      {
        question: "Do you support stores selling internationally?",
        answer:
          "I can discuss the regions, currencies, shipping, and payment requirements during discovery, then include the agreed needs in the scope.",
      },
      {
        question: "Will my store work well on mobile?",
        answer:
          "Yes. Most shoppers use phones, so mobile product pages and checkout are tested as part of the launch review.",
      },
    ],
    relatedSlugs: ["web-development", "seo-aeo-geo", "ads-optimization"],
  },
  {
    slug: "ads-optimization",
    title: "Ads & Optimization",
    image: SERVICE_IMAGES[5],
    imageAlt: "Ads and optimization services illustration",
    description:
      "Reach the right people with performance ads, then optimize your site to turn visits into customers.",
    longDescription:
      "I plan and manage advertising campaigns that reach the people most likely to become customers, then improve your landing pages and tracking so more of those visits turn into enquiries or sales. Advertising and website work are planned together, so the spend is measured against real results.",
    metaTitle: "Digital Ads & Conversion Optimization Services",
    metaDescription:
      "Performance ad campaigns, conversion tracking, and landing page optimization for businesses in India and worldwide. Clear reporting and recommendations you can act on.",
    tags: ["Paid Ads", "Performance", "Conversion"],
    keywords: [
      "digital advertising",
      "paid ads management",
      "campaign optimization",
      "conversion rate optimization",
      "conversion tracking setup",
    ],
    whoItsFor: [
      "Businesses already running ads without clear results",
      "Companies launching a new service or product",
      "Websites with traffic but few enquiries",
    ],
    benefits: [
      "Campaigns built around goals you can measure",
      "Tracking set up so you know which ads bring results",
      "Landing page changes that support the ad message",
    ],
    included: [
      "Campaign goals and audience planning",
      "Campaign structure for the agreed platforms",
      "Conversion tracking and measurement plan",
      "Landing page review and recommendations",
      "Regular performance reviews with next steps",
    ],
    pricing: {
      label: "Project pricing",
      range: "Custom quote",
      note:
        "Pricing depends on campaign scope, platforms, measurement needs, and the optimization work agreed. Ad platform budgets are separate from my service fee.",
    },
    faqs: [
      {
        question: "Which advertising platforms do you support?",
        answer:
          "I choose platforms based on your audience, goals, and budget, then confirm them in the proposal.",
      },
      {
        question: "Is the advertising budget included in the service price?",
        answer:
          "No. My proposal states the service work separately from media spend. Platform budgets are agreed and paid directly before campaigns begin.",
      },
      {
        question: "Can you optimize an existing campaign?",
        answer:
          "Yes. I can review your current campaigns and tracking setup, then recommend a focused set of improvements.",
      },
      {
        question: "How soon will I see results?",
        answer:
          "Campaigns usually need a learning period before results stabilize. I set expectations for this during planning and review data regularly with you.",
      },
    ],
    relatedSlugs: ["seo-aeo-geo", "web-development", "game-development"],
  },
];

export function getServiceBySlug(slug: string) {
  return SERVICES.find((service) => service.slug === slug);
}

export function getAllServiceSlugs() {
  return SERVICES.map((service) => service.slug);
}