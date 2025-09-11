import type { Metadata } from "next";
import { createMetadata, createBreadcrumbSchema } from '@/lib/seo-config';
import ContactPageClient from './ContactPageClient';

export const metadata: Metadata = createMetadata({
  title: "Contact Us",
  description: "Get in touch with Credora Inc for apartment cosigner services. Professional support team available to help with your rental approval needs. Phone, email, and live chat support.",
  path: "/contact",
  keywords: [
    "contact support",
    "cosigner help",
    "customer service",
    "apartment cosigner support",
    "lease guarantee help",
    "rental assistance contact",
    "cosigner service support",
    "apartment approval help"
  ]
});

export default function ContactPage() {
  const breadcrumbSchema = createBreadcrumbSchema([
    { name: "Home", path: "" },
    { name: "Contact Us", path: "/contact" }
  ]);

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }}
      />
      <ContactPageClient />
    </>
  );
}
