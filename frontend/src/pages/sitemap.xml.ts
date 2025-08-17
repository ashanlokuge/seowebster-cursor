import type { APIRoute } from 'astro';
import { getCollection } from 'astro:content';
import { promises as fs } from 'node:fs';
import { join, relative } from 'node:path';

interface SitemapEntry {
  url: string;
  lastmod?: string;
  changefreq?: ChangeFreq;
  priority?: number;
}

const siteUrl = 'https://seowebster.com';

type ChangeFreq = 'always' | 'hourly' | 'daily' | 'weekly' | 'monthly' | 'yearly' | 'never';

// Priority and change frequency configurations for different page types
const pageConfig = {
  // Homepage has highest priority
  homepage: { priority: 1.0, changefreq: 'weekly' as ChangeFreq },
  
  // Main service pages - high priority
  mainServices: { priority: 0.9, changefreq: 'monthly' as ChangeFreq },
  
  // Individual service pages - high priority 
  services: { priority: 0.8, changefreq: 'monthly' as ChangeFreq },
  
  // Blog posts - medium-high priority, updated frequently
  blog: { priority: 0.7, changefreq: 'weekly' as ChangeFreq },
  
  // Industry/CMS specific pages - medium priority
  industryPages: { priority: 0.6, changefreq: 'monthly' as ChangeFreq },
  
  // Static pages - medium priority
  staticPages: { priority: 0.5, changefreq: 'monthly' as ChangeFreq },
};

async function getStaticPages(): Promise<SitemapEntry[]> {
  const entries: SitemapEntry[] = [];
  const pagesDir = join(process.cwd(), 'src', 'pages');
  
  try {
    // Get all .astro files recursively
    const files = await getAstroFiles(pagesDir);
    
    for (const file of files) {
      const relativePath = relative(pagesDir, file);
      
      // Skip dynamic routes and special files
      if (relativePath.includes('[') || relativePath.includes('...') || 
          relativePath.includes('404') || relativePath.endsWith('.xml.ts')) {
        continue;
      }
      
      // Convert file path to URL
      let url = relativePath.replace(/\.astro$/, '').replace(/\/index$/, '');
      if (url === 'index' || url === '') {
        url = '/';
      } else if (!url.startsWith('/')) {
        url = `/${url}`;
      }
      
      // Determine priority and change frequency based on page type
      let config = pageConfig.staticPages;
      
      if (url === '/') {
        config = pageConfig.homepage;
      } else if (url === '/services' || url === '/contact' || url === '/shop') {
        config = pageConfig.mainServices;
      } else if (url.includes('/services/')) {
        config = pageConfig.services;
      } else if (url.includes('/industry-seo/') || url.includes('/cms-seo/')) {
        config = pageConfig.industryPages;
      }
      
      entries.push({
        url: `${siteUrl}${url}`,
        ...config,
        lastmod: await getFileModifiedDate(file)
      });
    }
  } catch (error) {
    console.error('Error reading static pages:', error);
  }
  
  return entries;
}

async function getAstroFiles(dir: string): Promise<string[]> {
  const files: string[] = [];
  
  try {
    const items = await fs.readdir(dir, { withFileTypes: true });
    
    for (const item of items) {
      const fullPath = join(dir, item.name);
      
      if (item.isDirectory()) {
        files.push(...await getAstroFiles(fullPath));
      } else if (item.isFile() && item.name.endsWith('.astro')) {
        files.push(fullPath);
      }
    }
  } catch (error) {
    console.error(`Error reading directory ${dir}:`, error);
  }
  
  return files;
}

async function getFileModifiedDate(filePath: string): Promise<string> {
  try {
    const stats = await fs.stat(filePath);
    return stats.mtime.toISOString();
  } catch {
    return new Date().toISOString();
  }
}

async function getContentCollectionPages(): Promise<SitemapEntry[]> {
  const entries: SitemapEntry[] = [];
  
  try {
    // Get all blog posts
    const blogPosts = await getCollection('blog');
    for (const post of blogPosts) {
      entries.push({
        url: `${siteUrl}/blog/${post.slug}`,
        ...pageConfig.blog,
        lastmod: post.data.publishDate ? post.data.publishDate.toISOString() : new Date().toISOString()
      });
    }
    
    // Get all CMS SEO pages
    const cmsSeoPages = await getCollection('cms-seo');
    for (const page of cmsSeoPages) {
      entries.push({
        url: `${siteUrl}/cms-seo/${page.slug}`,
        ...pageConfig.industryPages,
        lastmod: page.data.publishDate ? page.data.publishDate.toISOString() : new Date().toISOString()
      });
    }
    
    // Get all industry SEO pages
    const industrySeoPages = await getCollection('industry-seo');
    for (const page of industrySeoPages) {
      entries.push({
        url: `${siteUrl}/industry-seo/${page.slug}`,
        ...pageConfig.industryPages,
        lastmod: page.data.publishDate ? page.data.publishDate.toISOString() : new Date().toISOString()
      });
    }
    
    // Get all service collection pages
    const servicePages = await getCollection('services');
    for (const page of servicePages) {
      entries.push({
        url: `${siteUrl}/services/${page.slug}`,
        ...pageConfig.services,
        lastmod: page.data.publishDate ? page.data.publishDate.toISOString() : new Date().toISOString()
      });
    }
    
  } catch (error) {
    console.error('Error fetching content collections:', error);
  }
  
  return entries;
}

function generateSitemapXml(entries: SitemapEntry[]): string {
  const xml = `<?xml version="1.0" encoding="UTF-8"?>
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
  
  return xml;
}

export const GET: APIRoute = async () => {
  try {
    // Get all pages
    const staticPages = await getStaticPages();
    const contentPages = await getContentCollectionPages();
    
    // Combine and sort by priority (highest first) then by URL
    const allEntries = [...staticPages, ...contentPages]
      .sort((a, b) => {
        if (a.priority !== b.priority) {
          return (b.priority || 0) - (a.priority || 0);
        }
        return a.url.localeCompare(b.url);
      });
    
    // Generate XML
    const xmlContent = generateSitemapXml(allEntries);
    
    return new Response(xmlContent, {
      status: 200,
      headers: {
        'Content-Type': 'application/xml',
        'Cache-Control': 'public, max-age=3600', // Cache for 1 hour
      },
    });
  } catch (error) {
    console.error('Error generating sitemap:', error);
    return new Response('Internal Server Error', { status: 500 });
  }
};
