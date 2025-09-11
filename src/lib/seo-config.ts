import { Metadata } from "next";

export const siteConfig = {
  name: "Credora Inc",
  description: "Apartment finder & Lease Cosigner service",
  url: "https://credorainc.com",
  ogImage: "https://credorainc.com/og-image.jpg",
  twitterHandle: "@CredoraInc",
  email: "support@credorainc.com"
};

export function createMetadata({
  title,
  description,
  image = siteConfig.ogImage,
  path = "",
  keywords = []
}: {
  title: string;
  description: string;
  image?: string;
  path?: string;
  keywords?: string[];
}): Metadata {
  const url = `${siteConfig.url}${path}`;
  const fullTitle = path === "" ? `${title}` : `${title} - ${siteConfig.name}`;

  return {
    title: fullTitle,
    description,
    keywords: [
      "apartment cosigner",
      "lease guarantor",
      "rental approval",
      "apartment approval guaranteed",
      "professional cosigning",
      "lease cosigner service",
      "apartment rental help",
      "guaranteed lease approval",
      "Credora Inc",
      "cosigning service",
      ...keywords
    ],
    authors: [{ name: siteConfig.name }],
    creator: siteConfig.name,
    publisher: siteConfig.name,
    robots: {
      index: true,
      follow: true,
      googleBot: {
        index: true,
        follow: true,
        'max-video-preview': -1,
        'max-image-preview': 'large',
        'max-snippet': -1,
      },
    },
    openGraph: {
      type: 'website',
      locale: 'en_US',
      url,
      siteName: siteConfig.name,
      title: fullTitle,
      description,
      images: [
        {
          url: image,
          width: 1200,
          height: 630,
          alt: `${siteConfig.name} - ${title}`,
        }
      ],
    },
    twitter: {
      card: 'summary_large_image',
      site: siteConfig.twitterHandle,
      creator: siteConfig.twitterHandle,
      title: fullTitle,
      description,
      images: [image],
    },
    alternates: {
      canonical: url,
    },
    category: 'Real Estate Services',
  };
}

export function createBreadcrumbSchema(items: Array<{ name: string; path: string }>) {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    "itemListElement": items.map((item, index) => ({
      "@type": "ListItem",
      "position": index + 1,
      "name": item.name,
      "item": `${siteConfig.url}${item.path}`
    }))
  };
}

// Pre-configured metadata for common pages
export const pageMetadata = {
  home: createMetadata({
    title: "Credora Inc - Apartment finder & Lease Cosigner service",
    description: "Get approved for apartments in 24-48 hours with Credora Inc's professional cosigner service. Serving all 50 states with guaranteed lease approval.",
    keywords: ["apartment finder", "lease cosigner", "rental approval", "guaranteed approval"]
  }),
  
  apartments: createMetadata({
    title: "Find Apartments",
    description: "Browse available apartments with guaranteed cosigner backing from Credora Inc. Quality listings with professional lease guarantee service.",
    path: "/apartments",
    keywords: ["apartment search", "rental listings", "guaranteed apartments"]
  }),
  
  forRenters: createMetadata({
    title: "For Renters",
    description: "Credora Inc helps renters get approved for apartments with professional cosigner services. Get the apartment you want with guaranteed approval.",
    path: "/for-renters",
    keywords: ["renter services", "apartment approval help", "rental assistance"]
  }),
  
  contact: createMetadata({
    title: "Contact Us",
    description: "Get in touch with Credora Inc for apartment cosigner services. Professional support team available to help with your rental approval needs.",
    path: "/contact",
    keywords: ["contact", "support", "customer service", "help"]
  }),
  
  faq: createMetadata({
    title: "FAQ",
    description: "Frequently asked questions about Credora Inc's apartment cosigner services. Get answers about our lease guarantee process and requirements.",
    path: "/faq",
    keywords: ["FAQ", "questions", "cosigner help", "lease guarantee questions"]
  }),
  
  blog: createMetadata({
    title: "Blog",
    description: "Expert advice and tips for apartment hunting, rental approval, and lease cosigning from Credora Inc. Stay informed about rental market trends.",
    path: "/blog",
    keywords: ["apartment tips", "rental advice", "cosigner blog", "apartment hunting"]
  }),
  
  privacy: createMetadata({
    title: "Privacy Policy",
    description: "Credora Inc privacy policy. Learn how we protect your personal information and data when using our apartment cosigner services.",
    path: "/privacy",
    keywords: ["privacy policy", "data protection", "personal information"]
  }),
  
  cookies: createMetadata({
    title: "Cookie Policy",
    description: "Credora Inc cookie policy. Information about how we use cookies on our website to improve your experience with our cosigner services.",
    path: "/cookies",
    keywords: ["cookie policy", "website cookies", "privacy"]
  })
};
