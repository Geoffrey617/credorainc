import type { Metadata } from "next";
import { generatePageSEO, generateMetaTags, createMetadata } from '../../lib/seo-config';
import SupportPageClient from './SupportPageClient';

export const metadata: Metadata = createMetadata({
  title: "Support Center",
  description: "Get help with your Credora cosigner application. Access live chat support, FAQs, and troubleshooting guides. Our support team is here to help you succeed.",
  path: "/support",
  keywords: [
    "support center",
    "cosigner help",
    "application support",
    "live chat support",
    "customer service",
    "apartment cosigner support",
    "lease cosigner help",
    "rental assistance support",
    "cosigner service support",
    "apartment approval help"
  ]
});

export default function SupportPage() {
  const breadcrumbSchema = createBreadcrumbSchema([
    { name: "Home", path: "" },
    { name: "Support", path: "/support" }
  ]);

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }}
      />
      <SupportPageClient />
    </>
  );
}
