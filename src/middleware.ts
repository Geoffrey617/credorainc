import { NextRequest, NextResponse } from 'next/server';

// Known AI crawlers and scrapers to block
const BLOCKED_USER_AGENTS = [
  'GPTBot',
  'ChatGPT-User', 
  'CCBot',
  'anthropic-ai',
  'Claude-Web',
  'PerplexityBot',
  'YouBot',
  'Applebot-Extended',
  'Bytespider',
  'Bytedance',
  'Scrapy',
  'python-requests',
  'curl',
  'wget',
  'scrapy',
  'beautifulsoup',
  'selenium',
  'puppeteer',
  'playwright',
  'headless',
  'bot',
  'crawler',
  'spider',
  'scraper'
];

// Known good bots to allow
const ALLOWED_USER_AGENTS = [
  'Googlebot',
  'Googlebot-Image',
  'Googlebot-News',
  'Googlebot-Video',
  'Google-InspectionTool',
  'Google-Safety',
  'Google-Site-Verification'
];

// Suspicious patterns in user agents
const SUSPICIOUS_PATTERNS = [
  /python/i,
  /requests/i,
  /urllib/i,
  /scrapy/i,
  /selenium/i,
  /headless/i,
  /phantom/i,
  /crawler/i,
  /spider/i,
  /bot(?!.*google)/i, // Block "bot" but not "googlebot"
  /scraper/i,
  /harvest/i,
  /extract/i,
  /collect/i
];

// Rate limiting storage (in production, use Redis)
const rateLimitMap = new Map<string, { count: number; resetTime: number }>();

function isAllowedBot(userAgent: string): boolean {
  return ALLOWED_USER_AGENTS.some(allowed => 
    userAgent.toLowerCase().includes(allowed.toLowerCase())
  );
}

function isBlockedBot(userAgent: string): boolean {
  // Check exact matches
  const exactMatch = BLOCKED_USER_AGENTS.some(blocked => 
    userAgent.toLowerCase().includes(blocked.toLowerCase())
  );
  
  // Check suspicious patterns
  const patternMatch = SUSPICIOUS_PATTERNS.some(pattern => 
    pattern.test(userAgent)
  );
  
  return exactMatch || patternMatch;
}

function checkRateLimit(ip: string): boolean {
  const now = Date.now();
  const windowMs = 15 * 60 * 1000; // 15 minutes
  const maxRequests = 100; // 100 requests per 15 minutes
  
  const current = rateLimitMap.get(ip);
  
  if (!current || now > current.resetTime) {
    rateLimitMap.set(ip, { count: 1, resetTime: now + windowMs });
    return true;
  }
  
  if (current.count >= maxRequests) {
    return false;
  }
  
  current.count++;
  return true;
}

export function middleware(request: NextRequest) {
  const userAgent = request.headers.get('user-agent') || '';
  const ip = request.ip || request.headers.get('x-forwarded-for') || 'unknown';
  const url = request.nextUrl.pathname;
  
  // Log suspicious requests
  console.log('🔍 Request:', {
    ip: ip.substring(0, 10) + '...',
    userAgent: userAgent.substring(0, 50) + '...',
    url,
    timestamp: new Date().toISOString()
  });

  // Allow Google bots for SEO
  if (isAllowedBot(userAgent)) {
    console.log('✅ Allowed Google bot:', userAgent.substring(0, 50));
    return NextResponse.next();
  }

  // Block known AI crawlers and scrapers
  if (isBlockedBot(userAgent)) {
    console.log('🚫 Blocked AI crawler/scraper:', userAgent.substring(0, 50));
    return new NextResponse('Access Denied - AI Crawlers Not Allowed', { 
      status: 403,
      headers: {
        'Content-Type': 'text/plain',
        'X-Robots-Tag': 'noindex, nofollow, noarchive, nosnippet'
      }
    });
  }

  // Rate limiting
  if (!checkRateLimit(ip)) {
    console.log('🚫 Rate limit exceeded for IP:', ip.substring(0, 10));
    return new NextResponse('Rate Limit Exceeded', { 
      status: 429,
      headers: {
        'Retry-After': '900', // 15 minutes
        'X-RateLimit-Limit': '100',
        'X-RateLimit-Remaining': '0',
        'X-RateLimit-Reset': new Date(Date.now() + 15 * 60 * 1000).toISOString()
      }
    });
  }

  // Block access to sensitive paths
  const protectedPaths = ['/api/', '/admin/', '/_next/', '/dashboard/'];
  const isProtectedPath = protectedPaths.some(path => url.startsWith(path));
  
  if (isProtectedPath) {
    // Extra validation for protected paths
    const hasValidReferer = request.headers.get('referer')?.includes('bredora.com');
    const hasValidOrigin = request.headers.get('origin')?.includes('bredora.com');
    
    if (!hasValidReferer && !hasValidOrigin && !isAllowedBot(userAgent)) {
      console.log('🚫 Blocked access to protected path:', url);
      return new NextResponse('Access Denied', { status: 403 });
    }
  }

  // Add security headers to all responses
  const response = NextResponse.next();
  
  // Comprehensive security headers
  response.headers.set('X-Frame-Options', 'DENY');
  response.headers.set('X-Content-Type-Options', 'nosniff');
  response.headers.set('X-XSS-Protection', '1; mode=block');
  response.headers.set('Referrer-Policy', 'strict-origin-when-cross-origin');
  response.headers.set('Permissions-Policy', 'camera=(), microphone=(), geolocation=(), payment=()');
  response.headers.set('Strict-Transport-Security', 'max-age=31536000; includeSubDomains; preload');
  response.headers.set('X-DNS-Prefetch-Control', 'off');
  response.headers.set('X-Download-Options', 'noopen');
  response.headers.set('X-Permitted-Cross-Domain-Policies', 'none');
  
  // Anti-scraping headers
  response.headers.set('X-Robots-Tag', 'index, follow, max-snippet:150, max-image-preview:large');
  response.headers.set('Cache-Control', 'public, max-age=3600, must-revalidate');
  
  return response;
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     */
    '/((?!_next/static|_next/image|favicon.ico).*)',
  ],
}
