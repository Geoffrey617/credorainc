import type { Metadata } from "next";
import LandlordsPageClient from './LandlordsPageClient';

export const metadata: Metadata = {
  title: "For Landlords - Bredora Inc | Property Listing & Guaranteed Cosigners",
  description: "List your property on Bredora Inc and connect with pre-screened tenants backed by guaranteed cosigners. Reduce vacancy time and rental risk with professional tenant matching.",
  keywords: [
    "landlord property listing",
    "guaranteed cosigners for landlords", 
    "tenant screening service",
    "rental property management",
    "apartment listing platform",
    "landlord cosigner service",
    "tenant background check",
    "property rental guarantee"
  ],
  openGraph: {
    title: "For Landlords - Bredora Inc | Property Listing & Guaranteed Cosigners",
    description: "List your property and connect with pre-screened tenants backed by guaranteed cosigners. Reduce vacancy time and rental risk.",
    url: "https://credorainc.com/landlords",
    siteName: "Bredora Inc",
    images: [
      {
        url: "https://credorainc.com/og-landlords.jpg",
        width: 1200,
        height: 630,
        alt: "Bredora Inc - For Landlords Property Listing Platform"
      }
    ],
    type: "website"
  },
  twitter: {
    card: "summary_large_image",
    title: "For Landlords - Bredora Inc | Property Listing & Guaranteed Cosigners",
    description: "List your property and connect with pre-screened tenants backed by guaranteed cosigners.",
    images: ["https://credorainc.com/og-landlords.jpg"]
  },
  alternates: {
    canonical: "https://credorainc.com/landlords"
  }
};

export default function LandlordsPage() {
  const breadcrumbSchema = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    "itemListElement": [
      {
        "@type": "ListItem",
        "position": 1,
        "name": "Home",
        "item": "https://credorainc.com"
      },
      {
        "@type": "ListItem",
        "position": 2,
        "name": "For Landlords",
        "item": "https://credorainc.com/landlords"
      }
    ]
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }}
      />
      <LandlordsPageClient />
    </>
  );
}

