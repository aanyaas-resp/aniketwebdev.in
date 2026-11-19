// Unique city pages for Maharashtra. Each city has its own local context.
// Facts are general and should be checked before publishing; no population or
// revenue numbers are used.

export type City = {
  slug: string;
  name: string;
  displayName: string;
  region: "Maharashtra";
  intro: string;
  localContext: string;
  industries: string[];
  nearby: string[];
  faqs: { q: string; a: string }[];
};

export const CITIES: City[] = [
  {
    slug: "pune",
    name: "Pune",
    displayName: "Pune",
    region: "Maharashtra",
    intro: "I build websites, mobile apps and search visibility for businesses in Pune, from the IT parks of Hinjewadi and Kharadi to the family-run shops of the old city.",
    localContext: "Pune is one of India's main software and automotive hubs, and it is also a large education centre. Many local businesses sell to other businesses, so trust and clear service pages matter as much as design.",
    industries: ["Software and IT services", "Automotive components", "Education and coaching", "Healthcare clinics", "Real estate and construction"],
    nearby: ["chhatrapati-sambhajinagar", "nashik", "navi-mumbai", "solapur"],
    faqs: [
      { q: "Do you work with businesses in Pune in person?", a: "Yes, when a meeting helps. Most of the planning and reviews happen on video calls, with demo links for every stage." },
      { q: "Can you help a Pune business rank for local searches?", a: "Yes. I set up the Google Business Profile, local service pages and structured data. Ranking also depends on competition and reviews, so I report progress monthly instead of promising a position." },
    ],
  },
  {
    slug: "chhatrapati-sambhajinagar",
    name: "Chhatrapati Sambhajinagar",
    displayName: "Chhatrapati Sambhajinagar (Aurangabad)",
    region: "Maharashtra",
    intro: "I build websites and apps for businesses in Chhatrapati Sambhajinagar, formerly Aurangabad, including manufacturing firms, tourism operators and local retailers.",
    localContext: "The city is close to the Ajanta and Ellora caves, which makes tourism a strong local industry. It also has an industrial estate in Waluj that supports auto component and engineering firms.",
    industries: ["Tourism and travel services", "Auto components and engineering", "Hotels and banquet venues", "Education and coaching", "Retail and local services"],
    nearby: ["pune", "nashik", "jalgaon", "nanded"],
    faqs: [
      { q: "Do you work with tourism businesses in the city?", a: "Yes. I build booking pages, package listings and enquiry forms that work well on mobile, since most travellers search on their phones." },
      { q: "Is the city still listed as Aurangabad online?", a: "Both names are used. I write the page with Chhatrapati Sambhajinagar and Aurangabad together, so people searching either name can find the business." },
    ],
  },
  {
    slug: "mumbai",
    name: "Mumbai",
    displayName: "Mumbai",
    region: "Maharashtra",
    intro: "I build websites, apps and search visibility for businesses in Mumbai, where customers compare options quickly and expect a fast, clear website.",
    localContext: "Mumbai is India's financial and media centre, so many businesses here sell to corporate clients. Pages need to show credibility quickly: clear services, fast loading, and proof of past work.",
    industries: ["Finance and consulting", "Media and advertising", "Fashion and retail", "Real estate", "Hospitality and events"],
    nearby: ["thane", "navi-mumbai", "pune", "nashik"],
    faqs: [
      { q: "How fast is a website for a Mumbai business usually built?", a: "A focused business website usually takes one to three weeks. Larger projects with booking or login take longer, and I confirm the timeline before I start." },
      { q: "Do you help with ads as well as the website?", a: "Yes. I set up tracking and landing pages for Google and Meta campaigns, so you can see which ads bring enquiries." },
    ],
  },
  {
    slug: "thane",
    name: "Thane",
    displayName: "Thane",
    region: "Maharashtra",
    intro: "I build websites and apps for businesses in Thane, from clinics and schools to property developers and local shops.",
    localContext: "Thane has grown quickly as a residential and commercial area next to Mumbai. Many local customers search on their phones for services close to home, so location pages and maps matter.",
    industries: ["Healthcare clinics", "Schools and coaching", "Property and construction", "Restaurants and food", "Local services"],
    nearby: ["mumbai", "navi-mumbai", "pune", "nashik"],
    faqs: [
      { q: "Can a Thane clinic or school get an appointment or enquiry form?", a: "Yes. I build forms that send enquiries to WhatsApp or email, and I make sure they work well on mobile." },
      { q: "Do you set up Google Business Profile for local businesses?", a: "Yes. I help set up and fill in the profile, add photos and services, and show you how to ask for reviews." },
    ],
  },
  {
    slug: "navi-mumbai",
    name: "Navi Mumbai",
    displayName: "Navi Mumbai",
    region: "Maharashtra",
    intro: "I build websites, apps and SEO for businesses in Navi Mumbai, including companies in Vashi, Airoli and Belapur.",
    localContext: "Navi Mumbai is a planned city with several business and IT clusters. Many businesses here serve both local customers and Mumbai clients, so one site often needs to serve two audiences.",
    industries: ["IT and business services", "Logistics and warehousing", "Healthcare", "Education", "Retail and hospitality"],
    nearby: ["mumbai", "thane", "pune", "nashik"],
    faqs: [
      { q: "Do you build sites for business services and B2B companies?", a: "Yes. I write clear service pages, add case studies and set up enquiry forms for B2B customers." },
      { q: "Can you add separate pages for different areas?", a: "Yes. I can create area pages for Vashi, Airoli and Belapur, each with its own local content, rather than one copied page." },
    ],
  },
  {
    slug: "nagpur",
    name: "Nagpur",
    displayName: "Nagpur",
    region: "Maharashtra",
    intro: "I build websites, apps and search visibility for businesses in Nagpur, from logistics and manufacturing firms to food brands and local shops.",
    localContext: "Nagpur sits in the centre of India, and it is home to a large logistics and manufacturing presence, including the MIHAN area. The city is also known for its oranges, so food and agriculture businesses are common.",
    industries: ["Logistics and warehousing", "Manufacturing", "Agriculture and food", "Healthcare", "Education"],
    nearby: ["chhatrapati-sambhajinagar", "amravati", "pune", "akola"],
    faqs: [
      { q: "Do you build websites for logistics and manufacturing firms?", a: "Yes. I build clear service and capability pages, plus enquiry forms that route requests to the right team." },
      { q: "Can you help a food business sell online?", a: "Yes. I can set up product pages, ordering enquiries and local search pages so customers in Nagpur find you first." },
    ],
  },
  {
    slug: "nashik",
    name: "Nashik",
    displayName: "Nashik",
    region: "Maharashtra",
    intro: "I build websites, apps and local search pages for businesses in Nashik, including wineries, manufacturers and tourism operators.",
    localContext: "Nashik is known for its vineyards and wine industry, and for the grape and onion trade. Tourism around the city is growing, so booking and visitor information pages are useful.",
    industries: ["Wine and food", "Tourism and hospitality", "Auto components and manufacturing", "Agriculture", "Healthcare"],
    nearby: ["pune", "mumbai", "chhatrapati-sambhajinagar", "jalgaon"],
    faqs: [
      { q: "Can a winery or tourism business take bookings from its website?", a: "Yes. I set up booking or enquiry forms, visit information and maps, and make the pages easy to use on mobile." },
      { q: "Do you help manufacturers get B2B enquiries?", a: "Yes. I write product and capability pages, add an enquiry form, and help the site appear for industry searches." },
    ],
  },
  {
    slug: "solapur",
    name: "Solapur",
    displayName: "Solapur",
    region: "Maharashtra",
    intro: "I build websites and apps for businesses in Solapur, including textile firms, manufacturers and local service providers.",
    localContext: "Solapur has a long history in textiles and towel making, and it trades in agricultural products. Many businesses here work mostly through referrals, so a clear website helps them reach new customers beyond their usual network.",
    industries: ["Textiles and towels", "Agriculture trade", "Manufacturing", "Healthcare", "Education"],
    nearby: ["pune", "kolhapur", "chhatrapati-sambhajinagar", "sangli"],
    faqs: [
      { q: "Can a textile business sell to buyers outside the city?", a: "Yes. I build product and catalogue pages, enquiry forms and export-friendly contact information, so buyers can reach you from anywhere." },
      { q: "Do you build websites in Marathi as well as English?", a: "Yes. I can build pages in Marathi and English, so local customers can read the site in the language they prefer." },
    ],
  },
  {
    slug: "kolhapur",
    name: "Kolhapur",
    displayName: "Kolhapur",
    region: "Maharashtra",
    intro: "I build websites, online catalogues and search visibility for businesses in Kolhapur, including footwear, jewellery and food producers.",
    localContext: "Kolhapur is well known for handmade footwear and traditional jewellery, and for jaggery production. Many of these businesses sell to customers across India, so product pages and shipping information need to be clear.",
    industries: ["Footwear and leather goods", "Jewellery", "Food and jaggery", "Tourism", "Retail"],
    nearby: ["pune", "solapur", "sangli", "chhatrapati-sambhajinagar"],
    faqs: [
      { q: "Can I sell handmade products online from Kolhapur?", a: "Yes. I build product catalogues with photos, prices and enquiry or ordering options, with clear delivery information." },
      { q: "Will my product pages appear in search?", a: "They can. I write unique descriptions for each product, add structured data, and set up a Google Business Profile for local searches." },
    ],
  },
  {
    slug: "amravati",
    name: "Amravati",
    displayName: "Amravati",
    region: "Maharashtra",
    intro: "I build websites and apps for businesses in Amravati, including textile and agriculture firms, clinics and local retailers.",
    localContext: "Amravati is an agricultural and textile trading centre in Vidarbha, close to the Melghat tiger reserve. Tourism and eco-travel businesses in the surrounding area can benefit from clear booking and visitor pages.",
    industries: ["Agriculture and cotton trade", "Textiles", "Healthcare", "Tourism and eco-travel", "Education"],
    nearby: ["nagpur", "akola", "chhatrapati-sambhajinagar", "jalgaon"],
    faqs: [
      { q: "Do you build websites for agricultural businesses?", a: "Yes. I build pages for products, prices and enquiries, and I keep them simple so they work well on slow mobile connections." },
      { q: "Can a clinic get appointment requests from its website?", a: "Yes. I add an appointment form that sends requests to WhatsApp or email, and I make sure it works on mobile." },
    ],
  },
  {
    slug: "sangli",
    name: "Sangli",
    displayName: "Sangli",
    region: "Maharashtra",
    intro: "I build websites and search visibility for businesses in Sangli, from turmeric and agriculture traders to manufacturers and clinics.",
    localContext: "Sangli is one of the main turmeric trading centres in the state, and it also has an active jaggery and agriculture market. Traders often need pages that explain their products and prices clearly to buyers in other cities.",
    industries: ["Turmeric and spices", "Agriculture trade", "Jaggery and food", "Manufacturing", "Healthcare"],
    nearby: ["kolhapur", "solapur", "pune", "chhatrapati-sambhajinagar"],
    faqs: [
      { q: "Can a spice trader reach buyers outside Sangli?", a: "Yes. I build product and enquiry pages that buyers can find through search and AI answer tools, with clear contact details." },
      { q: "Do you update the prices on the website?", a: "I can set it up so prices are easy to change from the admin panel, without needing a developer each time." },
    ],
  },
  {
    slug: "akola",
    name: "Akola",
    displayName: "Akola",
    region: "Maharashtra",
    intro: "I build websites, apps and local search pages for businesses in Akola, including agricultural traders, clinics and retail shops.",
    localContext: "Akola is an agricultural trading town in Vidarbha, and cotton is one of its main crops. Local customers often search on mobile for shops, clinics and services close to home.",
    industries: ["Agriculture and cotton trade", "Healthcare", "Retail", "Education", "Local services"],
    nearby: ["amravati", "nagpur", "jalgaon", "chhatrapati-sambhajinagar"],
    faqs: [
      { q: "Can a local shop get found on Google Maps?", a: "Yes. I help set up the Google Business Profile, add photos and services, and build a simple page that matches what people search for." },
      { q: "Do you build simple websites for small businesses?", a: "Yes. A simple site with a few pages, a contact form and a map can be built quickly and kept inexpensive." },
    ],
  },
  {
    slug: "latur",
    name: "Latur",
    displayName: "Latur",
    region: "Maharashtra",
    intro: "I build websites, apps and enquiry systems for businesses in Latur, especially education institutes, coaching centres and agricultural firms.",
    localContext: "Latur is known for its coaching centres and education institutes, which attract students from across the region. Parents and students compare options online, so clear course pages and admission forms help a lot.",
    industries: ["Education and coaching", "Agriculture and pulses trade", "Healthcare", "Retail", "Local services"],
    nearby: ["nanded", "solapur", "chhatrapati-sambhajinagar", "pune"],
    faqs: [
      { q: "Can a coaching institute collect admission enquiries online?", a: "Yes. I build course pages, a fee and batch information section, and an admission enquiry form that sends requests to your team." },
      { q: "Can students apply or pay online?", a: "I can add an enquiry or payment flow, depending on the payment provider you choose. I explain the options before I start." },
    ],
  },
  {
    slug: "nanded",
    name: "Nanded",
    displayName: "Nanded",
    region: "Maharashtra",
    intro: "I build websites, apps and local search pages for businesses in Nanded, including education, hospitality and agricultural firms.",
    localContext: "Nanded is home to Hazur Sahib, an important Sikh pilgrimage site, so hotels, transport and visitor services see steady demand. The city also has education institutes and an agricultural economy.",
    industries: ["Hospitality and pilgrim services", "Education", "Agriculture", "Healthcare", "Transport and travel"],
    nearby: ["latur", "chhatrapati-sambhajinagar", "solapur", "amravati"],
    faqs: [
      { q: "Can a hotel or guesthouse take bookings from its site?", a: "Yes. I build room pages, availability enquiries and a booking request form that works well on mobile." },
      { q: "Do you help visitor services show up for travel searches?", a: "Yes. I write clear visitor and travel pages, add maps and set up a Google Business Profile for the business." },
    ],
  },
  {
    slug: "jalgaon",
    name: "Jalgaon",
    displayName: "Jalgaon",
    region: "Maharashtra",
    intro: "I build websites and apps for businesses in Jalgaon, including gold and jewellery traders, agriculture businesses and food producers.",
    localContext: "Jalgaon is an important trading centre for gold and jewellery, and it is known for bananas and other agricultural produce. Many businesses here sell across the region, so clear product and contact pages help.",
    industries: ["Gold and jewellery", "Agriculture and bananas", "Food processing", "Retail", "Healthcare"],
    nearby: ["nashik", "amravati", "chhatrapati-sambhajinagar", "dhule"],
    faqs: [
      { q: "Can a jewellery shop show its collections online?", a: "Yes. I build collection pages with photos and clear contact options, and I keep the design simple so the products stand out." },
      { q: "Can a food producer sell products online?", a: "Yes. I can add a product catalogue with enquiry or ordering options, and clear delivery information for customers in other cities." },
    ],
  },
  {
    slug: "dhule",
    name: "Dhule",
    displayName: "Dhule",
    region: "Maharashtra",
    intro: "I build websites and local search pages for businesses in Dhule, including agriculture traders, clinics and retail shops.",
    localContext: "Dhule is an agricultural and trade centre in North Maharashtra. Local customers rely on Google and maps to find shops and clinics, so a Google Business Profile and clear location pages help.",
    industries: ["Agriculture trade", "Healthcare", "Retail", "Education", "Local services"],
    nearby: ["jalgaon", "nashik", "chhatrapati-sambhajinagar", "ahilyanagar"],
    faqs: [
      { q: "Can a clinic in Dhule show its doctors and timings?", a: "Yes. I build doctor and timing pages, an appointment request form, and a map, all designed to work on mobile." },
      { q: "Do you build websites for small shops?", a: "Yes. A simple site with products or services, a contact form and a map can be set up quickly." },
    ],
  },
  {
    slug: "ahilyanagar",
    name: "Ahilyanagar",
    displayName: "Ahilyanagar (Ahmednagar)",
    region: "Maharashtra",
    intro: "I build websites and apps for businesses in Ahilyanagar, formerly Ahmednagar, including agriculture, sugar-related firms and local services.",
    localContext: "The city was renamed from Ahmednagar, so both names are still used online. Agriculture and sugar-related industries are important in the district, and many local businesses sell to nearby towns.",
    industries: ["Agriculture and sugar", "Manufacturing", "Healthcare", "Education", "Retail"],
    nearby: ["pune", "nashik", "chhatrapati-sambhajinagar", "dhule"],
    faqs: [
      { q: "Should the page say Ahilyanagar or Ahmednagar?", a: "Both. I write the page with the current name and the older name together, so people who search either way can find you." },
      { q: "Can a local business get found for nearby towns too?", a: "Yes. I can add service area pages for nearby towns, each with its own local content, so the site covers the wider area." },
    ],
  },
];

export function getCity(slug: string) {
  return CITIES.find((c) => c.slug === slug) ?? null;
}
