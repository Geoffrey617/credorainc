import { MetadataRoute } from 'next'

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = 'https://credorainc.com'
  
  // Static pages - matching navigation structure
  const staticPages = [
    '',
    '/apartments',
    '/for-renters',
    '/pricing',
    '/landlords',
    '/faq',
    '/blog',
    '/contact',
    '/privacy',
    '/cookies',
    '/apply'
  ]

  // Generate state-specific apartment pages
  const states = [
    'AL', 'AK', 'AZ', 'AR', 'CA', 'CO', 'CT', 'DE', 'FL', 'GA',
    'HI', 'ID', 'IL', 'IN', 'IA', 'KS', 'KY', 'LA', 'ME', 'MD',
    'MA', 'MI', 'MN', 'MS', 'MO', 'MT', 'NE', 'NV', 'NH', 'NJ',
    'NM', 'NY', 'NC', 'ND', 'OH', 'OK', 'OR', 'PA', 'RI', 'SC',
    'SD', 'TN', 'TX', 'UT', 'VT', 'VA', 'WA', 'WV', 'WI', 'WY'
  ]

  const statePages = states.map(state => `/apartments?state=${state}`)

  const allPages = [...staticPages, ...statePages]

  return allPages.map((page) => ({
    url: `${baseUrl}${page}`,
    lastModified: new Date(),
    changeFrequency: page === '' ? 'daily' : 
                    page.includes('/apartments') ? 'weekly' : 
                    page.includes('/blog') ? 'weekly' : 'monthly',
    priority: page === '' ? 1 :
              page === '/apply' ? 0.9 :
              page === '/apartments' ? 0.8 :
              page.includes('/apartments?state=') ? 0.7 :
              0.6,
  }))
} 