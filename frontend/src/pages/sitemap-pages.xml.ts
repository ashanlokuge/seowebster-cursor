import type { APIRoute } from 'astro';

const siteUrl = 'https://seowebster.com';

type ChangeFreq = 'always' | 'hourly' | 'daily' | 'weekly' | 'monthly' | 'yearly' | 'never';

interface SitemapEntry {
  url: string;
  lastmod: string;
  changefreq: ChangeFreq;
  priority: number;
}

async function getStaticPagesEntries(): Promise<SitemapEntry[]> {
  const entries: SitemapEntry[] = [];
  const now = new Date().toISOString();
  
  // Main static pages
  const staticPages = [
    { url: '/', priority: 1.0, changefreq: 'weekly' as const },
    { url: '/contact', priority: 0.8, changefreq: 'monthly' as const },
    { url: '/shop', priority: 0.7, changefreq: 'weekly' as const },
    { url: '/services', priority: 0.9, changefreq: 'monthly' as const },
    { url: '/partners', priority: 0.6, changefreq: 'monthly' as const },
  ];
  
  for (const page of staticPages) {
    entries.push({
      url: `${siteUrl}${page.url}`,
      lastmod: now,
      changefreq: page.changefreq,
      priority: page.priority
    });
  }
  
  return entries;
}

function generateSitemapXml(entries: SitemapEntry[]): string {
  return `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"
        xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"
        xsi:schemaLocation="http://www.sitemaps.org/schemas/sitemap/0.9
        http://www.sitemaps.org/schemas/sitemap/0.9/sitemap.xsd">
${entries
  .map(entry => {
    return `  <url>
    <loc>${entry.url}</loc>
    <lastmod>${entry.lastmod}</lastmod>
    <changefreq>${entry.changefreq}</changefreq>
    <priority>${entry.priority}</priority>
  </url>`;
  })
  .join('\n')}
</urlset>`;
}

export const GET: APIRoute = async () => {
  try {
    const entries = await getStaticPagesEntries();
    const xmlContent = generateSitemapXml(entries);
    
    return new Response(xmlContent, {
      status: 200,
      headers: {
        'Content-Type': 'application/xml',
        'Cache-Control': 'public, max-age=3600',
      },
    });
  } catch (error) {
    console.error('Error generating pages sitemap:', error);
    return new Response('Internal Server Error', { status: 500 });
  }
};
