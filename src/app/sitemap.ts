import { MetadataRoute } from 'next'

export const dynamic = 'force-static'

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = 'https://bredora.com'
  
  // Current static pages - matching your streamlined navigation
  const staticPages = [
    '',                    // Homepage
    '/for-renters',       // Renters page
    '/pricing',           // Pricing page
    '/faq',               // FAQ page
    '/blog',              // Blog page
    '/contact',           // Contact page
    '/about',             // About page
    '/legal',             // Legal page
    '/privacy',           // Privacy Policy
    '/terms',             // Terms of Service
    '/cookies',           // Cookie Policy
    '/support',           // Support page
    '/apply',             // Application page
    '/auth/signin',       // Sign in page
    '/auth/signup'        // Sign up page
  ]

  return staticPages.map((page) => ({
    url: `${baseUrl}${page}`,
    lastModified: new Date(),
    changeFrequency: page === '' ? 'daily' : 
                    page === '/blog' ? 'weekly' : 
                    page === '/apply' ? 'weekly' :
                    page.includes('/auth/') ? 'monthly' :
                    'monthly',
    priority: page === '' ? 1.0 :                    // Homepage - highest priority
              page === '/apply' ? 0.9 :              // Application - very high
              page === '/for-renters' ? 0.8 :        // Main service page
              page === '/pricing' ? 0.8 :            // Pricing - high
              page === '/blog' ? 0.7 :               // Blog - good
              page === '/faq' ? 0.7 :                // FAQ - good
              page === '/contact' ? 0.6 :            // Contact - medium
              page === '/about' ? 0.6 :              // About - medium
              page.includes('/auth/') ? 0.4 :        // Auth pages - lower
              0.5,                                   // Legal pages - medium-low
  }))
} 