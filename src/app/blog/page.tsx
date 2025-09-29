import type { Metadata } from "next";
import { generatePageSEO, generateMetaTags, createMetadata, createBreadcrumbSchema } from '../../lib/seo-config';
import BlogPageClient from './BlogPageClient';

export const metadata: Metadata = createMetadata({
  title: "Blog",
  description: "Expert advice and tips for apartment hunting, rental approval, and lease cosigning from Bredora Inc. Stay informed about rental market trends and apartment search strategies.",
  path: "/blog",
  keywords: [
    "apartment blog",
    "rental tips",
    "cosigner advice",
    "apartment hunting tips",
    "rental market trends",
    "lease cosigner blog",
    "apartment search guide",
    "rental approval tips"
  ]
});

export default function BlogPage() {
  const breadcrumbSchema = createBreadcrumbSchema([
    { name: "Home", url: "https://bredora.com" },
    { name: "Blog", url: "https://bredora.com/blog" }
  ]);

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }}
      />
      <BlogPageClient />
    </>
  );
}
