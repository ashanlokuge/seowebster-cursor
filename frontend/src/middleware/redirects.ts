/**
 * Advanced SEO Redirect Middleware for SEOWebster
 * Handles dynamic redirects, analytics tracking, and advanced redirect scenarios
 */

import type { MiddlewareResponseHandler } from 'astro';

// Advanced redirect mapping with additional metadata
interface RedirectRule {
  from: string | RegExp;
  to: string;
  permanent?: boolean; // 301 vs 302
  caseSensitive?: boolean;
  preserveQuery?: boolean;
  matcher?: (url: URL) => boolean;
  analytics?: {
    category: string;
    action: string;
    label?: string;
  };
}

// Dynamic redirect rules that can't be handled by static config
const dynamicRedirects: RedirectRule[] = [
  // Case-insensitive e-commerce variations
  {
    from: /^\/(e-?commerce|ecommerce)-?seo\/?$/i,
    to: '/services/advanced-seo/ecommerce-seo',
    permanent: true,
    caseSensitive: false,
    preserveQuery: true,
    analytics: {
      category: 'Legacy Redirect',
      action: 'E-commerce SEO',
      label: 'Case Insensitive Match'
    }
  },
  
  // Multi-language variations with typo fixes
  {
    from: /^\/multilingu?a?l?-?seo\/?$/i,
    to: '/services/multilingual-seo',
    permanent: true,
    caseSensitive: false,
    preserveQuery: true,
    analytics: {
      category: 'Legacy Redirect',
      action: 'Multilingual SEO',
      label: 'Typo Fix'
    }
  },
  
  // Legacy service structure redirects
  {
    from: /^\/services\/legacy\/(.*)\/?$/,
    to: '/services/$1',
    permanent: true,
    preserveQuery: true,
    analytics: {
      category: 'Legacy Redirect',
      action: 'Service Structure Update'
    }
  },
  
  // SEO tool redirects with query preservation
  {
    from: /^\/tools?\/(seo-|)(.*)\/?$/i,
    to: '/services/industry-seo/$2',
    permanent: true,
    preserveQuery: true,
    analytics: {
      category: 'Legacy Redirect',
      action: 'Tool to Service',
      label: '$2'
    }
  },
  
  // Blog category redirects
  {
    from: /^\/blog\/(category|tag)\/(.*)\/?$/,
    to: '/blog',
    permanent: false, // 302 for blog categorization
    preserveQuery: true,
    analytics: {
      category: 'Blog Redirect',
      action: 'Category Consolidation'
    }
  },
  
  // Language-specific redirects
  {
    from: /^\/(?:es|spanish)\/(.*)$/,
    to: '/services/multilingual-seo/spanish-seo',
    permanent: true,
    preserveQuery: true,
    analytics: {
      category: 'Language Redirect',
      action: 'Spanish SEO'
    }
  },
  {
    from: /^\/(?:fr|french)\/(.*)$/,
    to: '/services/multilingual-seo/french-seo',
    permanent: true,
    preserveQuery: true,
    analytics: {
      category: 'Language Redirect',
      action: 'French SEO'
    }
  },
  {
    from: /^\/(?:de|german)\/(.*)$/,
    to: '/services/multilingual-seo/german-seo',
    permanent: true,
    preserveQuery: true,
    analytics: {
      category: 'Language Redirect',
      action: 'German SEO'
    }
  },
  
  // Industry-specific variations
  {
    from: /^\/(?:legal|law|attorney|lawyer)-?seo\/?$/i,
    to: '/services/industry-seo/law-seo',
    permanent: true,
    caseSensitive: false,
    preserveQuery: true,
    analytics: {
      category: 'Industry Redirect',
      action: 'Legal SEO'
    }
  },
  
  // Platform-specific redirects with variations
  {
    from: /^\/(?:wp|wordpress)-?seo\/?$/i,
    to: '/services/cms-seo/wordpress-seo',
    permanent: true,
    caseSensitive: false,
    preserveQuery: true,
    analytics: {
      category: 'Platform Redirect',
      action: 'WordPress SEO'
    }
  },
  {
    from: /^\/(?:shopify|shop)-?seo\/?$/i,
    to: '/services/cms-seo/shopify-seo',
    permanent: true,
    caseSensitive: false,
    preserveQuery: true,
    analytics: {
      category: 'Platform Redirect',
      action: 'Shopify SEO'
    }
  },
  
  // Common abbreviations and acronyms
  {
    from: /^\/(?:ppc|sem|paid-search)\/?$/i,
    to: '/services/advanced-seo/google-ai-overviews-seo',
    permanent: false, // 302 as these are different services
    preserveQuery: true,
    analytics: {
      category: 'Abbreviation Redirect',
      action: 'PPC to AI Overviews'
    }
  },
  
  // Legacy API or service endpoints
  {
    from: /^\/api\/(?:v1|v2)\/(.*)\/?$/,
    to: '/contact', // Redirect old API calls to contact
    permanent: true,
    preserveQuery: false,
    analytics: {
      category: 'API Redirect',
      action: 'Legacy API to Contact'
    }
  }
];

// Function to check if URL matches a redirect rule
function matchRedirectRule(url: URL, rule: RedirectRule): string | null {
  const pathname = url.pathname;
  
  if (typeof rule.from === 'string') {
    if (!rule.caseSensitive && pathname.toLowerCase() === rule.from.toLowerCase()) {
      return rule.to;
    } else if (rule.caseSensitive && pathname === rule.from) {
      return rule.to;
    }
  } else if (rule.from instanceof RegExp) {
    const match = pathname.match(rule.from);
    if (match) {
      // Handle regex replacement with captured groups
      let redirectTo = rule.to;
      match.forEach((group, index) => {
        if (index > 0) { // Skip full match at index 0
          redirectTo = redirectTo.replace(`$${index}`, group || '');
        }
      });
      return redirectTo;
    }
  }
  
  // Custom matcher function
  if (rule.matcher && rule.matcher(url)) {
    return rule.to;
  }
  
  return null;
}

// Function to preserve query parameters if needed
function buildRedirectUrl(originalUrl: URL, redirectTo: string, preserveQuery: boolean = true): string {
  const newUrl = new URL(redirectTo, originalUrl.origin);
  
  if (preserveQuery && originalUrl.search) {
    newUrl.search = originalUrl.search;
  }
  
  // Preserve hash if present
  if (originalUrl.hash) {
    newUrl.hash = originalUrl.hash;
  }
  
  return newUrl.pathname + newUrl.search + newUrl.hash;
}

// Function to log redirect for analytics (you can integrate with your analytics service)
function logRedirect(rule: RedirectRule, originalUrl: string, redirectUrl: string) {
  if (rule.analytics) {
    // This would integrate with your analytics service (Google Analytics, etc.)
    console.log(`Redirect Analytics: ${rule.analytics.category} - ${rule.analytics.action}`, {
      from: originalUrl,
      to: redirectUrl,
      label: rule.analytics.label
    });
    
    // Example: Send to Google Analytics or your analytics service
    // gtag('event', rule.analytics.action, {
    //   event_category: rule.analytics.category,
    //   event_label: rule.analytics.label,
    //   custom_parameter_1: originalUrl,
    //   custom_parameter_2: redirectUrl
    // });
  }
}

export const redirectMiddleware: MiddlewareResponseHandler = async (context, next) => {
  const url = new URL(context.request.url);
  
  // Check dynamic redirect rules
  for (const rule of dynamicRedirects) {
    const redirectTo = matchRedirectRule(url, rule);
    
    if (redirectTo) {
      const finalRedirectUrl = buildRedirectUrl(url, redirectTo, rule.preserveQuery);
      
      // Log the redirect for analytics
      logRedirect(rule, url.pathname, finalRedirectUrl);
      
      // Return appropriate redirect response
      const status = rule.permanent !== false ? 301 : 302; // Default to 301
      
      return Response.redirect(new URL(finalRedirectUrl, url.origin), status);
    }
  }
  
  // Handle www vs non-www redirects (force non-www for SEO consistency)
  if (url.hostname.startsWith('www.')) {
    const newUrl = new URL(context.request.url);
    newUrl.hostname = newUrl.hostname.replace('www.', '');
    return Response.redirect(newUrl, 301);
  }
  
  // Handle common SEO issues
  const pathname = url.pathname.toLowerCase();
  
  // Handle double extensions or incorrect file extensions in URLs
  if (pathname.includes('.html') || pathname.includes('.php') || pathname.includes('.htm')) {
    const cleanPath = pathname.replace(/\.(html?|php)$/, '');
    if (cleanPath !== pathname) {
      const newUrl = new URL(context.request.url);
      newUrl.pathname = cleanPath;
      return Response.redirect(newUrl, 301);
    }
  }
  
  // Continue to the next middleware/handler
  return next();
};

// Export redirect rules for testing or external use
export { dynamicRedirects };

// Helper function to add new redirect rules dynamically
export function addRedirectRule(rule: RedirectRule) {
  dynamicRedirects.push(rule);
}

// Helper function to get all current redirect rules
export function getRedirectRules() {
  return [...dynamicRedirects];
}

// Utility function to test redirect matching
export function testRedirect(url: string): string | null {
  const testUrl = new URL(url, 'https://seowebster.com');
  
  for (const rule of dynamicRedirects) {
    const redirectTo = matchRedirectRule(testUrl, rule);
    if (redirectTo) {
      return buildRedirectUrl(testUrl, redirectTo, rule.preserveQuery);
    }
  }
  
  return null;
}
