import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import ConditionalNavigation from "../components/ConditionalNavigation";
import CookieBanner from "../components/CookieBanner";
import GoogleAnalytics from "../components/GoogleAnalytics";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Bredora - Apartment Finder & Lease Cosigner Service",
  description: "Bredora provides apartment finder and lease cosigner services. Get approved in 24-48 hours with our assigned cosigners. Serving all 50 states.",
  keywords: [
    "apartment cosigner",
    "lease guarantor", 
    "rental approval",
    "apartment approval guaranteed",
    "professional cosigning",
    "lease cosigner service",
    "apartment rental help",
    "guaranteed lease approval",
    "Bredora LLC",
    "cosigning service"
  ],
  authors: [{ name: "Bredora" }],
  creator: "Bredora",
  publisher: "Bredora",
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
    url: 'https://bredora.com',
    siteName: 'Bredora',
    title: 'Bredora - Apartment Finder & Lease Cosigner Service',
    description: 'Apartment finder and lease cosigner service. Get approved in 24-48 hours. Serving all 50 states.',
    images: [
      {
        url: 'https://bredora.com/og-image.jpg',
        width: 1200,
        height: 630,
        alt: 'Bredora - Apartment Finder & Lease Cosigner Service',
      }
    ],
  },
  twitter: {
    card: 'summary_large_image',
    site: '@Bredora',
    creator: '@Bredora',
    title: 'Bredora - Apartment Finder & Lease Cosigner Service',
    description: 'Apartment Finder and lease cosigner service. Get approved in 24-48 hours.',
    images: ['https://bredora.com/twitter-image.jpg'],
  },
  verification: {
    google: 'your-google-verification-code',
    yandex: 'your-yandex-verification-code',
    yahoo: 'your-yahoo-verification-code',
  },
  alternates: {
    canonical: 'https://bredora.com',
  },
  category: 'Real Estate Services',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const structuredData = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "Organization",
        "@id": "https://bredora.com/#organization",
        "name": "Bredora",
        "legalName": "Bredora",
        "url": "https://bredora.com",
        "logo": {
          "@type": "ImageObject",
          "url": "https://bredora.com/logo.png",
          "width": 300,
          "height": 100
        },
        "description": "Professional apartment lease cosigning services with guaranteed approval. Serving all 50 states.",
        "foundingDate": "2020",
        "slogan": "Apartment Finder and lease cosigner service",
        "contactPoint": [
          {
            "@type": "ContactPoint",
            "telephone": "+1-800-273-3672",
            "contactType": "customer service",
            "email": "support@bredora.com",
            "availableLanguage": "English",
            "areaServed": "US"
          }
        ],
        "address": {
          "@type": "PostalAddress",
          "streetAddress": "50 California Street, Suite 1500",
          "addressLocality": "San Francisco",
          "addressRegion": "CA",
          "postalCode": "94111",
          "addressCountry": "US"
        },
        "sameAs": [
          "https://twitter.com/Bredora",
          "https://facebook.com/Bredora",
          "https://linkedin.com/company/credora-inc"
        ],
        "areaServed": {
          "@type": "Country",
          "name": "United States"
        }
      },
      {
        "@type": "WebSite",
        "@id": "https://bredora.com/#website",
        "url": "https://bredora.com",
        "name": "Bredora",
        "description": "Professional apartment lease cosigning services with guaranteed approval",
        "publisher": {
          "@id": "https://bredora.com/#organization"
        },
        "potentialAction": [
          {
            "@type": "SearchAction",
            "target": {
              "@type": "EntryPoint",
              "urlTemplate": "https://bredora.com/apartments?search={search_term_string}"
            },
            "query-input": "required name=search_term_string"
          }
        ]
      },
      {
        "@type": "Service",
        "@id": "https://bredora.com/#service",
        "name": "Professional Apartment Cosigning Service",
        "description": "Guaranteed apartment lease approval through professional cosigning services",
        "provider": {
          "@id": "https://bredora.com/#organization"
        },
        "serviceType": "Lease Cosigning",
        "areaServed": {
          "@type": "Country",
          "name": "United States"
        },
        "hasOfferCatalog": {
          "@type": "OfferCatalog",
          "name": "Cosigning Services",
          "itemListElement": [
            {
              "@type": "Offer",
              "itemOffered": {
                "@type": "Service",
                "name": "Application Processing",
                "description": "Background check and application processing"
              },
              "price": "50",
              "priceCurrency": "USD"
            },
            {
              "@type": "Offer",
              "itemOffered": {
                "@type": "Service",
                "name": "Professional Cosigning",
                "description": "Professional cosigner service for lease approval"
              },
              "price": "Variable (First month's rent)",
              "priceCurrency": "USD"
            }
          ]
        }
      },
      {
        "@type": "LocalBusiness",
        "@id": "https://bredora.com/#localbusiness",
        "name": "Bredora",
        "description": "Professional apartment lease cosigning services with guaranteed approval",
        "url": "https://bredora.com",
        "telephone": "+1-800-273-3672",
        "email": "support@bredora.com",
        "address": {
          "@type": "PostalAddress",
          "streetAddress": "50 California Street, Suite 1500",
          "addressLocality": "San Francisco",
          "addressRegion": "CA",
          "postalCode": "94111",
          "addressCountry": "US"
        },
        "openingHoursSpecification": [
          {
            "@type": "OpeningHoursSpecification",
            "dayOfWeek": [
              "Monday",
              "Tuesday", 
              "Wednesday",
              "Thursday",
              "Friday"
            ],
            "opens": "09:00",
            "closes": "18:00"
          },
          {
            "@type": "OpeningHoursSpecification",
            "dayOfWeek": "Saturday",
            "opens": "10:00",
            "closes": "16:00"
          }
        ],
        "priceRange": "$55 + First month's rent",
        "paymentAccepted": ["Credit Card", "Debit Card", "Bank Transfer"],
        "currenciesAccepted": "USD"
      }
    ]
  };

  return (
    <html lang="en">
      <head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify(structuredData),
          }}
        />
        <meta name="google-site-verification" content="your-google-verification-code" />
        <meta name="msvalidate.01" content="your-bing-verification-code" />
        <link rel="canonical" href="https://bredora.com" />
        
        {/* Favicon and App Icons */}
        <link rel="icon" href="/favicon.ico" sizes="any" />
        <link rel="icon" href="/favicon.svg" type="image/svg+xml" />
        <link rel="icon" href="/favicon-96x96.png" sizes="96x96" type="image/png" />
        <link rel="apple-touch-icon" href="/apple-touch-icon.png" sizes="180x180" />
        <link rel="manifest" href="/site.webmanifest" />
        
        {/* Android Chrome Icons */}
        <link rel="icon" href="/web-app-manifest-192x192.png" sizes="192x192" type="image/png" />
        <link rel="icon" href="/web-app-manifest-512x512.png" sizes="512x512" type="image/png" />
        
        {/* Theme and App Configuration */}
        <meta name="theme-color" content="#334155" />
        <meta name="msapplication-TileColor" content="#334155" />
        <meta name="mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="default" />
        <meta name="apple-mobile-web-app-title" content="Bredora" />
        <meta name="application-name" content="Bredora" />
      </head>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
          <GoogleAnalytics trackingId="G-KECYNPFCHS" />
          <ConditionalNavigation />
          {children}
          <CookieBanner />
      </body>
    </html>
  );
}
