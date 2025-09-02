export async function GET() {
  const siteUrl = 'https://seowebster.com';
  
  const robotsTxt = `# SEOWebster Multi-Country Robots.txt
# Main site and country-specific pages

User-agent: *
Allow: /

# Main site pages
Allow: /services/
Allow: /cms-seo/
Allow: /industry-seo/
Allow: /blog/
Allow: /contact
Allow: /shop
Allow: /partners

# Country-specific pages
Allow: /lk/
Allow: /lk/services/
Allow: /lk/cms-seo/
Allow: /lk/seo-services/
Allow: /lk/contact

Allow: /au/
Allow: /au/services/
Allow: /au/cms-seo/
Allow: /au/seo-services/
Allow: /au/contact

# Block admin and private areas
Disallow: /admin/
Disallow: /api/
Disallow: /_astro/
Disallow: /node_modules/
Disallow: /.git/

# Allow all sitemaps
Sitemap: ${siteUrl}/sitemap-index.xml
Sitemap: ${siteUrl}/sitemap.xml
Sitemap: ${siteUrl}/sitemap-countries.xml
Sitemap: ${siteUrl}/sitemap-pages.xml
Sitemap: ${siteUrl}/sitemap-services.xml
Sitemap: ${siteUrl}/sitemap-content.xml

# Crawl delay for respectful crawling
Crawl-delay: 1

# Country-specific comments for search engines
# Sri Lanka (LK) specific content optimized for local search
# Australia (AU) specific content optimized for Australian market
# United States (US) default content for international audience`;

  return new Response(robotsTxt, {
    headers: {
      'Content-Type': 'text/plain',
      'Cache-Control': 'public, max-age=86400' // Cache for 24 hours
    }
  });
}
