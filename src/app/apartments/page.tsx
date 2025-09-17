import type { Metadata } from "next";
import { generatePageSEO, generateMetaTags, createMetadata } from '../../lib/seo-config';
import ApartmentsPageClient from './ApartmentsPageClient';

export const metadata: Metadata = createMetadata({
  title: "Find Apartments",
  description: "Browse quality apartments with guaranteed cosigner backing from Credora Inc. Search by location, price, bedrooms. All listings come with professional lease guarantee service.",
  path: "/apartments",
  keywords: [
    "apartment search",
    "rental listings", 
    "guaranteed apartments",
    "cosigner apartments",
    "apartment finder",
    "rental search",
    "lease guarantee apartments",
    "verified apartment listings"
  ]
});

export default function ApartmentsPage() {
  const breadcrumbSchema = createBreadcrumbSchema([
    { name: "Home", path: "" },
    { name: "Find Apartments", path: "/apartments" }
  ]);

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }}
      />
      <ApartmentsPageClient />
    </>
  );
}
