/**
 * Main Middleware for SEOWebster
 * Handles redirects, security headers, and other middleware functionality
 */

import { sequence } from 'astro:middleware';
import { redirectMiddleware } from './redirects';
import type { MiddlewareResponseHandler } from 'astro';

// Security headers middleware
const securityMiddleware: MiddlewareResponseHandler = async (context, next) => {
  const response = await next();
  
  // Add security headers
  response.headers.set('X-Content-Type-Options', 'nosniff');
  response.headers.set('X-Frame-Options', 'DENY');
  response.headers.set('X-XSS-Protection', '1; mode=block');
  response.headers.set('Referrer-Policy', 'strict-origin-when-cross-origin');
  response.headers.set('Permissions-Policy', 'camera=(), microphone=(), geolocation=()');
  
  // Add SEO-friendly headers
  response.headers.set('Cache-Control', 'public, max-age=3600, must-revalidate');
  
  return response;
};

// Canonicalization middleware for SEO
const canonicalMiddleware: MiddlewareResponseHandler = async (context, next) => {
  const url = new URL(context.request.url);
  let needsRedirect = false;
  
  // Force HTTPS in production
  if (url.protocol === 'http:' && url.hostname !== 'localhost') {
    url.protocol = 'https:';
    needsRedirect = true;
  }
  
  // Remove duplicate slashes
  if (url.pathname.includes('//')) {
    url.pathname = url.pathname.replace(/\/+/g, '/');
    needsRedirect = true;
  }
  
  // Handle trailing slash normalization (SEO best practice: no trailing slash except root)
  if (url.pathname.length > 1 && url.pathname.endsWith('/')) {
    // Remove trailing slash for all URLs except root
    url.pathname = url.pathname.slice(0, -1);
    needsRedirect = true;
  }
  
  // Force lowercase URLs for consistency (SEO best practice)
  if (url.pathname !== url.pathname.toLowerCase()) {
    url.pathname = url.pathname.toLowerCase();
    needsRedirect = true;
  }
  
  // Redirect if any canonicalization was needed
  if (needsRedirect) {
    return Response.redirect(url.toString(), 301);
  }
  
  return next();
};

// Analytics middleware (for redirect tracking)
const analyticsMiddleware: MiddlewareResponseHandler = async (context, next) => {
  const startTime = Date.now();
  const response = await next();
  const endTime = Date.now();
  
  // Add performance timing header
  response.headers.set('X-Response-Time', `${endTime - startTime}ms`);
  
  // Log for analytics (in production, you'd send this to your analytics service)
  if (response.status >= 300 && response.status < 400) {
    console.log('Redirect occurred:', {
      url: context.request.url,
      status: response.status,
      location: response.headers.get('location'),
      userAgent: context.request.headers.get('user-agent'),
      referer: context.request.headers.get('referer'),
      timestamp: new Date().toISOString()
    });
  }
  
  return response;
};

// Export the middleware sequence
export const onRequest = sequence(
  canonicalMiddleware,
  redirectMiddleware,
  securityMiddleware,
  analyticsMiddleware
);
