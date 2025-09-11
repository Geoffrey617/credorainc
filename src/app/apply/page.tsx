import type { Metadata } from "next";
import { createMetadata, createBreadcrumbSchema } from '@/lib/seo-config';
import ApplyPageClient from './ApplyPageClient';

export const metadata: Metadata = createMetadata({
  title: "Apply",
  description: "Apply for Credora Inc apartment cosigner service. Get approved in 24-48 hours with professional cosigners. Simple application process for all 50 states.",
  path: "/apply",
  keywords: [
    "apply cosigner service",
    "apartment cosigner application",
    "lease guarantor application",
    "rental cosigner apply",
    "apartment approval application",
    "cosigner service application",
    "lease guarantee application",
    "rental approval apply"
  ]
});

export default function ApplyPage() {
  const breadcrumbSchema = createBreadcrumbSchema([
    { name: "Home", path: "" },
    { name: "Apply", path: "/apply" }
  ]);

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }}
      />
      <ApplyPageClient />
    </>
  );
}
