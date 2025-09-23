import { MetadataRoute } from 'next'

export const dynamic = 'force-static'

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      // Allow Google bots for SEO indexing
      {
        userAgent: 'Googlebot',
        allow: '/',
        disallow: ['/api/', '/admin/', '/apply/', '/auth/', '/_next/'],
      },
      {
        userAgent: 'Googlebot-Image',
        allow: '/',
        disallow: ['/api/', '/admin/', '/apply/', '/auth/'],
      },
      {
        userAgent: 'Googlebot-News',
        allow: ['/blog/', '/'],
        disallow: ['/api/', '/admin/', '/apply/', '/auth/'],
      },
      // Block AI crawlers and scrapers
      {
        userAgent: 'GPTBot',
        disallow: '/',
      },
      {
        userAgent: 'ChatGPT-User',
        disallow: '/',
      },
      {
        userAgent: 'CCBot',
        disallow: '/',
      },
      {
        userAgent: 'anthropic-ai',
        disallow: '/',
      },
      {
        userAgent: 'Claude-Web',
        disallow: '/',
      },
      {
        userAgent: 'PerplexityBot',
        disallow: '/',
      },
      {
        userAgent: 'YouBot',
        disallow: '/',
      },
      {
        userAgent: 'Applebot-Extended',
        disallow: '/',
      },
      {
        userAgent: 'FacebookBot',
        disallow: '/',
      },
      {
        userAgent: 'facebookexternalhit',
        disallow: '/',
      },
      {
        userAgent: 'Bytespider',
        disallow: '/',
      },
      {
        userAgent: 'Bytedance',
        disallow: '/',
      },
      {
        userAgent: 'Scrapy',
        disallow: '/',
      },
      {
        userAgent: 'python-requests',
        disallow: '/',
      },
      {
        userAgent: 'curl',
        disallow: '/',
      },
      {
        userAgent: 'wget',
        disallow: '/',
      },
      // Allow other legitimate search engines but limit access
      {
        userAgent: 'Bingbot',
        allow: ['/blog/', '/for-renters/', '/pricing/', '/'],
        disallow: ['/api/', '/admin/', '/apply/', '/auth/'],
      },
      {
        userAgent: 'DuckDuckBot',
        allow: ['/blog/', '/for-renters/', '/pricing/', '/'],
        disallow: ['/api/', '/admin/', '/apply/', '/auth/'],
      },
      // Block everything else by default
      {
        userAgent: '*',
        disallow: ['/api/', '/admin/', '/apply/', '/auth/', '/_next/'],
        allow: ['/blog/', '/for-renters/', '/pricing/', '/faq/', '/contact/', '/legal/', '/privacy/', '/terms/', '/cookies/'],
      }
    ],
    sitemap: 'https://bredora.com/sitemap.xml',
    host: 'https://bredora.com',
  }
} 