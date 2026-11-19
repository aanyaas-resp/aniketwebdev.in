import type { Metadata } from "next";
import Clients from "@/components/sections/Clients";
import FAQ from "@/components/sections/faq";
import Hero from "@/components/sections/Hero";
import Services from "@/components/sections/Services";
import Testimonials from "@/components/sections/Testinomials";
import WhyChooseUs from "@/components/sections/WhyChooseUs";
import ProjectsShowcase from "@/components/sections/ProjectsShowcase";
import BlogPreview from "@/components/sections/BlogPreview";
import ServiceAreas from "@/components/sections/ServiceAreas";
import ProcessSteps from "@/components/sections/ProcessSteps";
import PackagesSection from "@/components/sections/PackagesSection";
import WhatsAppButton from "@/components/ui/WhatsAppButton";
import ContactForm from "@/components/sections/ContactForm";
import { getBlogPosts, getClients, getProjects, getTestimonials } from "@/lib/content";
import { siteUrl } from "@/lib/seo";

export const metadata: Metadata = {
  alternates: { canonical: siteUrl() },
  description:
    "Website, mobile app, SEO, AEO, GEO and AI automation services. Aniket Jamunde builds fast, search-ready digital products.",
};

export default async function Home() {
  const [posts, testimonials, projects, clients] = await Promise.all([
    getBlogPosts(3),
    getTestimonials(),
    getProjects(),
    getClients(),
  ]);

  return (
    <main>
      {/* Priority order: each block targets a page that should rank */}
      <Hero />
      <Services />
      <ProjectsShowcase projects={projects} />
      <PackagesSection />
      <Testimonials items={testimonials} />
      <Clients items={clients} />
      <WhyChooseUs />
      <ProcessSteps />
      <BlogPreview posts={posts} />
      <FAQ />
      <ContactForm />
      <ServiceAreas />
    </main>
  );
}
