// Security monitoring and threat detection

interface SecurityEvent {
  type: 'bot_detected' | 'rate_limit_exceeded' | 'suspicious_activity' | 'scraping_attempt';
  ip: string;
  userAgent: string;
  url: string;
  timestamp: string;
  details?: any;
}

class SecurityMonitor {
  private events: SecurityEvent[] = [];
  private maxEvents = 1000; // Keep last 1000 events

  logSecurityEvent(event: Omit<SecurityEvent, 'timestamp'>) {
    const securityEvent: SecurityEvent = {
      ...event,
      timestamp: new Date().toISOString()
    };

    this.events.push(securityEvent);
    
    // Keep only recent events
    if (this.events.length > this.maxEvents) {
      this.events = this.events.slice(-this.maxEvents);
    }

    // Log to console for monitoring
    console.log('🛡️ Security Event:', securityEvent);

    // In production, you could send to monitoring service
    // this.sendToMonitoringService(securityEvent);
  }

  getRecentEvents(limit = 50): SecurityEvent[] {
    return this.events.slice(-limit);
  }

  getEventsByType(type: SecurityEvent['type']): SecurityEvent[] {
    return this.events.filter(event => event.type === type);
  }

  getEventsByIP(ip: string): SecurityEvent[] {
    return this.events.filter(event => event.ip === ip);
  }

  // Detect suspicious patterns
  detectSuspiciousActivity(ip: string, userAgent: string, url: string): boolean {
    const recentEvents = this.getEventsByIP(ip);
    const last5Minutes = Date.now() - (5 * 60 * 1000);
    
    const recentRequests = recentEvents.filter(event => 
      new Date(event.timestamp).getTime() > last5Minutes
    );

    // Too many requests from same IP
    if (recentRequests.length > 50) {
      this.logSecurityEvent({
        type: 'suspicious_activity',
        ip,
        userAgent,
        url,
        details: { reason: 'high_request_frequency', count: recentRequests.length }
      });
      return true;
    }

    // Suspicious user agent patterns
    const suspiciousPatterns = [
      /python/i, /requests/i, /urllib/i, /scrapy/i, /selenium/i,
      /headless/i, /phantom/i, /crawler/i, /spider/i, /bot/i,
      /scraper/i, /harvest/i, /extract/i, /collect/i
    ];

    const isSuspiciousUA = suspiciousPatterns.some(pattern => pattern.test(userAgent));
    if (isSuspiciousUA) {
      this.logSecurityEvent({
        type: 'bot_detected',
        ip,
        userAgent,
        url,
        details: { reason: 'suspicious_user_agent' }
      });
      return true;
    }

    return false;
  }

  // Check if IP should be blocked
  shouldBlockIP(ip: string): boolean {
    const events = this.getEventsByIP(ip);
    const last24Hours = Date.now() - (24 * 60 * 60 * 1000);
    
    const recentSecurityEvents = events.filter(event => 
      new Date(event.timestamp).getTime() > last24Hours &&
      ['bot_detected', 'suspicious_activity', 'scraping_attempt'].includes(event.type)
    );

    // Block if more than 5 security events in 24 hours
    return recentSecurityEvents.length > 5;
  }

  // Get security statistics
  getSecurityStats() {
    const last24Hours = Date.now() - (24 * 60 * 60 * 1000);
    const recentEvents = this.events.filter(event => 
      new Date(event.timestamp).getTime() > last24Hours
    );

    return {
      totalEvents: recentEvents.length,
      botDetections: recentEvents.filter(e => e.type === 'bot_detected').length,
      rateLimitExceeded: recentEvents.filter(e => e.type === 'rate_limit_exceeded').length,
      suspiciousActivity: recentEvents.filter(e => e.type === 'suspicious_activity').length,
      scrapingAttempts: recentEvents.filter(e => e.type === 'scraping_attempt').length,
      uniqueIPs: new Set(recentEvents.map(e => e.ip)).size
    };
  }
}

// Export singleton instance
export const securityMonitor = new SecurityMonitor();

// Utility functions
export function isValidUserAgent(userAgent: string): boolean {
  // Check for legitimate browser user agents
  const legitimatePatterns = [
    /mozilla/i, /chrome/i, /safari/i, /firefox/i, /edge/i, /opera/i
  ];

  return legitimatePatterns.some(pattern => pattern.test(userAgent));
}

export function detectScrapingAttempt(request: NextRequest): boolean {
  const userAgent = request.headers.get('user-agent') || '';
  const referer = request.headers.get('referer') || '';
  const accept = request.headers.get('accept') || '';

  // No user agent (suspicious)
  if (!userAgent) return true;

  // Missing typical browser headers
  if (!accept.includes('text/html') && !accept.includes('application/json')) return true;

  // Programmatic access patterns
  if (userAgent.includes('python') || userAgent.includes('requests')) return true;

  // No referer for deep pages (suspicious for normal users)
  if (!referer && request.nextUrl.pathname.includes('/apply/')) return true;

  return false;
}

export function logSecurityEvent(
  type: SecurityEvent['type'],
  request: NextRequest,
  details?: any
) {
  const ip = request.ip || request.headers.get('x-forwarded-for') || 'unknown';
  const userAgent = request.headers.get('user-agent') || 'unknown';
  const url = request.nextUrl.pathname;

  securityMonitor.logSecurityEvent({
    type,
    ip,
    userAgent,
    url,
    details
  });
}
