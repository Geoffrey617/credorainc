// SEO configuration for the application
export interface SEOConfig {
  title: string;
  description: string;
  keywords?: string[];
  canonical?: string;
  ogImage?: string;
  ogType?: string;
  twitterCard?: string;
  noindex?: boolean;
}

export const defaultSEO: SEOConfig = {
  title: "Credora Inc - Professional Apartment Lease Cosigning Services",
  description: "Get guaranteed apartment approval with Credora's professional cosigning services. Trusted by thousands across all 50 states. Apply today and secure your dream apartment.",
  keywords: [
    "apartment cosigner",
    "lease cosigning",
    "apartment approval",
    "rental guarantee",
    "apartment finder",
    "lease guarantee",
    "rental cosigner",
    "apartment rental help"
  ],
  ogImage: "/og-image.jpg",
  ogType: "website",
  twitterCard: "summary_large_image"
};

export const pageSEO = {
  apartments: {
    title: "Browse Apartments with Guaranteed Approval | Credora Inc",
    description: "Search quality apartments with guaranteed cosigner backing. Filter by location, price, bedrooms. All listings come with professional lease guarantee service.",
    keywords: ["apartments for rent", "guaranteed approval apartments", "apartment search", "rental listings"]
  },
  
  blog: {
    title: "Apartment Rental Tips & Guides | Credora Inc Blog",
    description: "Expert advice on apartment hunting, lease agreements, credit improvement, and rental tips. Learn from industry professionals.",
    keywords: ["apartment tips", "rental advice", "lease guide", "apartment hunting"]
  },
  
  contact: {
    title: "Contact Credora Inc | Get Help with Apartment Cosigning",
    description: "Get in touch with our expert team for apartment cosigning questions. Phone, email, and live chat support available.",
    keywords: ["contact credora", "cosigning help", "apartment support", "rental assistance"]
  },
  
  cookies: {
    title: "Cookie Policy | Credora Inc Privacy Information",
    description: "Learn about how Credora Inc uses cookies to improve your browsing experience and protect your privacy.",
    keywords: ["cookie policy", "privacy", "data protection", "website cookies"],
    noindex: true
  },
  
  faq: {
    title: "Frequently Asked Questions | Credora Inc Cosigning FAQ",
    description: "Find answers to common questions about apartment cosigning, approval process, pricing, and requirements.",
    keywords: ["cosigning faq", "apartment questions", "lease help", "rental faq"]
  },
  
  forRenters: {
    title: "For Renters | Apartment Cosigning Services | Credora Inc",
    description: "Professional cosigning services for renters. Get approved for your dream apartment with our guaranteed cosigner backing.",
    keywords: ["renter services", "apartment cosigner", "rental help", "lease approval"]
  },
  
  privacy: {
    title: "Privacy Policy | Credora Inc Data Protection",
    description: "Learn how Credora Inc protects your personal information and privacy when using our cosigning services.",
    keywords: ["privacy policy", "data protection", "personal information", "privacy rights"],
    noindex: true
  },
  
  terms: {
    title: "Terms of Service | Credora Inc Legal Agreement",
    description: "Read the terms and conditions for using Credora Inc's apartment cosigning services and platform.",
    keywords: ["terms of service", "legal agreement", "service terms", "user agreement"],
    noindex: true
  }
};

export function generatePageSEO(pageKey: keyof typeof pageSEO, customSEO?: Partial<SEOConfig>): SEOConfig {
  const baseSEO = pageSEO[pageKey] || defaultSEO;
  
  return {
    ...defaultSEO,
    ...baseSEO,
    ...customSEO
  };
}

export function generateMetaTags(seoConfig: SEOConfig) {
  const tags = [
    { name: 'description', content: seoConfig.description },
    { property: 'og:title', content: seoConfig.title },
    { property: 'og:description', content: seoConfig.description },
    { property: 'og:type', content: seoConfig.ogType || 'website' },
    { name: 'twitter:card', content: seoConfig.twitterCard || 'summary_large_image' },
    { name: 'twitter:title', content: seoConfig.title },
    { name: 'twitter:description', content: seoConfig.description }
  ];

  if (seoConfig.keywords && seoConfig.keywords.length > 0) {
    tags.push({ name: 'keywords', content: seoConfig.keywords.join(', ') });
  }

  if (seoConfig.ogImage) {
    tags.push(
      { property: 'og:image', content: seoConfig.ogImage },
      { name: 'twitter:image', content: seoConfig.ogImage }
    );
  }

  if (seoConfig.canonical) {
    tags.push({ name: 'canonical', content: seoConfig.canonical });
  }

  if (seoConfig.noindex) {
    tags.push({ name: 'robots', content: 'noindex, nofollow' });
  }

  return tags;
}

// Next.js Metadata API compatible function
export function createMetadata(config: {
  title: string;
  description: string;
  path?: string;
  keywords?: string[];
  noindex?: boolean;
}): any {
  const baseUrl = 'https://credorainc.com';
  const fullUrl = config.path ? `${baseUrl}${config.path}` : baseUrl;
  
  return {
    title: config.title,
    description: config.description,
    keywords: config.keywords?.join(', '),
    canonical: fullUrl,
    openGraph: {
      title: config.title,
      description: config.description,
      url: fullUrl,
      siteName: 'Credora Inc',
      type: 'website',
      images: [
        {
          url: `${baseUrl}/og-image.jpg`,
          width: 1200,
          height: 630,
          alt: config.title,
        },
      ],
    },
    twitter: {
      card: 'summary_large_image',
      title: config.title,
      description: config.description,
      images: [`${baseUrl}/og-image.jpg`],
    },
    robots: config.noindex ? 'noindex, nofollow' : 'index, follow',
  };
}

// Breadcrumb schema for SEO
export function createBreadcrumbSchema(items: Array<{ name: string; url: string }>) {
  return {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: items.map((item, index) => ({
      '@type': 'ListItem',
      position: index + 1,
      name: item.name,
      item: item.url,
    })),
  };
}