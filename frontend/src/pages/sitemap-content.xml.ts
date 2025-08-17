import type { APIRoute } from 'astro';
import { getCollection } from 'astro:content';

const siteUrl = 'https://seowebster.com';

type ChangeFreq = 'always' | 'hourly' | 'daily' | 'weekly' | 'monthly' | 'yearly' | 'never';

interface SitemapEntry {
  url: string;
  lastmod: string;
  changefreq: ChangeFreq;
  priority: number;
}

async function getContentEntries(): Promise<SitemapEntry[]> {
  const entries: SitemapEntry[] = [];
  
  try {
    // Get all blog posts
    const blogPosts = await getCollection('blog');
    for (const post of blogPosts) {
      entries.push({
        url: `${siteUrl}/blog/${post.slug}`,
        lastmod: post.data.publishDate ? post.data.publishDate.toISOString() : new Date().toISOString(),
        changefreq: 'weekly',
        priority: 0.7
      });
    }
    
    // Get all CMS SEO pages
    const cmsSeoPages = await getCollection('cms-seo');
    for (const page of cmsSeoPages) {
      entries.push({
        url: `${siteUrl}/cms-seo/${page.slug}`,
        lastmod: page.data.publishDate ? page.data.publishDate.toISOString() : new Date().toISOString(),
        changefreq: 'monthly',
        priority: 0.6
      });
    }
    
    // Get all industry SEO pages
    const industrySeoPages = await getCollection('industry-seo');
    for (const page of industrySeoPages) {
      entries.push({
        url: `${siteUrl}/industry-seo/${page.slug}`,
        lastmod: page.data.publishDate ? page.data.publishDate.toISOString() : new Date().toISOString(),
        changefreq: 'monthly',
        priority: 0.6
      });
    }
    
    // Get main content pages from pages collection
    const pages = await getCollection('pages');
    for (const page of pages) {
      // Skip if it's already covered by static pages
      if (['index', 'contact', 'shop', 'partners'].includes(page.slug)) {
        continue;
      }
      
      entries.push({
        url: `${siteUrl}/${page.slug}`,
        lastmod: new Date().toISOString(),
        changefreq: 'monthly',
        priority: 0.5
      });
    }
    
  } catch (error) {
    console.error('Error fetching content entries:', error);
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
  .sort((a, b) => {
    // Sort by priority first, then by last modified date (newest first), then by URL
    if (a.priority !== b.priority) {
      return b.priority - a.priority;
    }
    if (a.lastmod !== b.lastmod) {
      return new Date(b.lastmod).getTime() - new Date(a.lastmod).getTime();
    }
    return a.url.localeCompare(b.url);
  })
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
    const entries = await getContentEntries();
    const xmlContent = generateSitemapXml(entries);
    
    return new Response(xmlContent, {
      status: 200,
      headers: {
        'Content-Type': 'application/xml',
        'Cache-Control': 'public, max-age=3600',
      },
    });
  } catch (error) {
    console.error('Error generating content sitemap:', error);
    return new Response('Internal Server Error', { status: 500 });
  }
};
