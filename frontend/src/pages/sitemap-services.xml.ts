import type { APIRoute } from 'astro';
import { getCollection } from 'astro:content';
import { promises as fs } from 'node:fs';
import { join } from 'node:path';

const siteUrl = 'https://seowebster.com';

type ChangeFreq = 'always' | 'hourly' | 'daily' | 'weekly' | 'monthly' | 'yearly' | 'never';

interface SitemapEntry {
  url: string;
  lastmod: string;
  changefreq: ChangeFreq;
  priority: number;
}

async function getServicePagesEntries(): Promise<SitemapEntry[]> {
  const entries: SitemapEntry[] = [];
  
  try {
    // Get service collection pages
    const servicePages = await getCollection('services');
    for (const page of servicePages) {
      entries.push({
        url: `${siteUrl}/services/${page.slug}`,
        lastmod: page.data.publishDate ? page.data.publishDate.toISOString() : new Date().toISOString(),
        changefreq: 'monthly',
        priority: 0.8
      });
    }
    
    // Get static service pages from file system
    const servicesDir = join(process.cwd(), 'src', 'pages', 'services');
    const staticServicePages = await getStaticServicePages(servicesDir);
    entries.push(...staticServicePages);
    
  } catch (error) {
    console.error('Error fetching service pages:', error);
  }
  
  return entries;
}

async function getStaticServicePages(dir: string, basePath = '/services'): Promise<SitemapEntry[]> {
  const entries: SitemapEntry[] = [];
  
  try {
    const items = await fs.readdir(dir, { withFileTypes: true });
    
    for (const item of items) {
      const fullPath = join(dir, item.name);
      
      if (item.isDirectory()) {
        const subEntries = await getStaticServicePages(fullPath, `${basePath}/${item.name}`);
        entries.push(...subEntries);
      } else if (item.isFile() && item.name.endsWith('.astro')) {
        let urlPath = `${basePath}/${item.name.replace('.astro', '')}`;
        
        // Handle index files
        if (item.name === 'index.astro') {
          urlPath = basePath;
        }
        
        // Skip dynamic routes
        if (urlPath.includes('[') || urlPath.includes('...')) {
          continue;
        }
        
        const lastmod = await getFileModifiedDate(fullPath);
        let priority = 0.7;
        
        // Higher priority for main category pages
        if (urlPath.endsWith('/advanced-seo') || urlPath.endsWith('/cms-seo') || 
            urlPath.endsWith('/industry-seo') || urlPath.endsWith('/multilingual-seo')) {
          priority = 0.8;
        }
        
        // Specific high-priority services
        if (urlPath.includes('seo-audit') || urlPath.includes('wordpress-seo') || 
            urlPath.includes('technical-seo') || urlPath.includes('local-seo')) {
          priority = 0.8;
        }
        
        entries.push({
          url: `${siteUrl}${urlPath}`,
          lastmod,
          changefreq: 'monthly',
          priority
        });
      }
    }
  } catch (error) {
    console.error(`Error reading service directory ${dir}:`, error);
  }
  
  return entries;
}

async function getFileModifiedDate(filePath: string): Promise<string> {
  try {
    const stats = await fs.stat(filePath);
    return stats.mtime.toISOString();
  } catch {
    return new Date().toISOString();
  }
}

function generateSitemapXml(entries: SitemapEntry[]): string {
  return `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"
        xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"
        xsi:schemaLocation="http://www.sitemaps.org/schemas/sitemap/0.9
        http://www.sitemaps.org/schemas/sitemap/0.9/sitemap.xsd">
${entries
  .sort((a, b) => b.priority - a.priority || a.url.localeCompare(b.url))
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
    const entries = await getServicePagesEntries();
    const xmlContent = generateSitemapXml(entries);
    
    return new Response(xmlContent, {
      status: 200,
      headers: {
        'Content-Type': 'application/xml',
        'Cache-Control': 'public, max-age=3600',
      },
    });
  } catch (error) {
    console.error('Error generating services sitemap:', error);
    return new Response('Internal Server Error', { status: 500 });
  }
};
