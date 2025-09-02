import type { APIRoute } from 'astro';

const siteUrl = 'https://seowebster.com';

function generateSitemapIndex(): string {
  const lastmod = new Date().toISOString();
  
  const sitemaps = [
    { loc: `${siteUrl}/sitemap.xml`, lastmod }, // Main comprehensive sitemap
    { loc: `${siteUrl}/sitemap-pages.xml`, lastmod }, // Static pages
    { loc: `${siteUrl}/sitemap-services.xml`, lastmod }, // All service pages
    { loc: `${siteUrl}/sitemap-content.xml`, lastmod }, // Blog and content pages
    { loc: `${siteUrl}/sitemap-countries.xml`, lastmod }, // Country-specific pages (LK, AU)
  ];
  
  return `<?xml version="1.0" encoding="UTF-8"?>
<sitemapindex xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"
              xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"
              xsi:schemaLocation="http://www.sitemaps.org/schemas/sitemap/0.9
              http://www.sitemaps.org/schemas/sitemap/0.9/siteindex.xsd">
${sitemaps.map(sitemap => `  <sitemap>
    <loc>${sitemap.loc}</loc>
    <lastmod>${sitemap.lastmod}</lastmod>
  </sitemap>`).join('\n')}
</sitemapindex>`;
}

export const GET: APIRoute = async () => {
  try {
    const xmlContent = generateSitemapIndex();
    
    return new Response(xmlContent, {
      status: 200,
      headers: {
        'Content-Type': 'application/xml',
        'Cache-Control': 'public, max-age=3600', // Cache for 1 hour
      },
    });
  } catch (error) {
    console.error('Error generating sitemap index:', error);
    return new Response('Internal Server Error', { status: 500 });
  }
};
