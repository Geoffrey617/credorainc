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
  title: "Bredora - Apartment Finder & Lease Cosigner Service",
  description: "Professional apartment finder and lease cosigner service. Get approved for your dream apartment with our expert cosigning services. Trusted nationwide.",
  keywords: [
    "apartment finder",
    "lease cosigner", 
    "apartment cosigning",
    "rental approval",
    "apartment approval",
    "cosigner service",
    "apartment search",
    "rental assistance"
  ],
  ogImage: "/og-image.jpg",
  ogType: "website",
  twitterCard: "summary_large_image"
};

export const pageSEO = {
  blog: {
    title: "Rental Tips & Guides | Bredora Blog",
    description: "Expert advice on apartment hunting, lease agreements, and rental tips from Bredora's apartment finder and cosigner service.",
    keywords: ["apartment tips", "rental advice", "lease guide", "apartment hunting"]
  },
  
  contact: {
    title: "Contact Bredora | Apartment Finder & Cosigner Help",
    description: "Get in touch with Bredora for apartment finder and cosigning service questions. Expert support available.",
    keywords: ["contact bredora", "apartment finder help", "cosigning support", "rental assistance"]
  },
  
  cookies: {
    title: "Cookie Policy | Bredora Privacy Information",
    description: "Learn about how Bredora uses cookies to improve your apartment finder and cosigning service experience.",
    keywords: ["cookie policy", "privacy", "data protection", "website cookies"],
    noindex: true
  },
  
  faq: {
    title: "FAQ | Bredora Apartment Finder & Cosigner Service",
    description: "Find answers to common questions about our apartment finder service, cosigning process, pricing, and requirements.",
    keywords: ["apartment finder faq", "cosigning questions", "rental help", "service faq"]
  },
  
  forRenters: {
    title: "Renters | Bredora Apartment Finder & Cosigner Service",
    description: "Professional apartment finder and cosigning services for renters. Get approved for your dream apartment quickly.",
    keywords: ["apartment finder", "cosigner service", "rental help", "apartment approval"]
  },
  
  privacy: {
    title: "Privacy Policy | Bredora Data Protection",
    description: "Learn how Bredora protects your personal information when using our apartment finder and cosigning services.",
    keywords: ["privacy policy", "data protection", "personal information", "privacy rights"],
    noindex: true
  },
  
  terms: {
    title: "Terms of Service | Bredora Legal Agreement", 
    description: "Terms and conditions for using Bredora's apartment finder and lease cosigning services.",
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
  const baseUrl = 'https://bredora.com';
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
      siteName: 'Bredora',
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