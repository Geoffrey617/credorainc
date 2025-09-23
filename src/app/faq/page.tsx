
import type { Metadata } from "next";
import { generatePageSEO, generateMetaTags, createMetadata, createBreadcrumbSchema } from '../../lib/seo-config';
import FAQPageClient from './FAQPageClient';

export const metadata: Metadata = createMetadata({
  title: "FAQ",
  description: "Frequently asked questions about Bredora Inc's apartment cosigner services. Get answers about our lease guarantee process, pricing, requirements, and application process.",
  path: "/faq",
  keywords: [
    "FAQ",
    "cosigner questions",
    "lease guarantee FAQ",
    "apartment cosigner help",
    "rental cosigner questions",
    "cosigner service FAQ",
    "apartment approval questions",
    "lease cosigner process"
  ]
});

export default function FAQPage() {
  const breadcrumbSchema = createBreadcrumbSchema([
    { name: "Home", url: "https://credorainc.com" },
    { name: "FAQ", url: "https://credorainc.com/faq" }
  ]);

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }}
      />
      <FAQPageClient />
    </>
  );
}
