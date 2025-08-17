# SEO Webster - Dynamic Sitemap System

## Overview

This directory contains a comprehensive, SEO-friendly dynamic sitemap system that automatically updates when new URLs are created. The system follows XML sitemap standards and SEO best practices.

## Features

✅ **Automatic Discovery**: Automatically discovers all pages and content  
✅ **SEO Optimized**: Proper priority, changefreq, and lastmod values  
✅ **Organized Structure**: Category-specific sitemaps for better organization  
✅ **Standards Compliant**: Follows XML sitemap protocol 0.9  
✅ **Cache Optimized**: HTTP caching headers for performance  
✅ **Search Engine Ready**: robots.txt integration  

## Sitemap Files

### Main Sitemaps

- **`/sitemap.xml`** - Comprehensive sitemap with all pages
- **`/sitemap-index.xml`** - Sitemap index pointing to all category sitemaps

### Category-Specific Sitemaps

- **`/sitemap-pages.xml`** - Static pages (home, contact, shop, etc.)
- **`/sitemap-services.xml`** - All service pages and categories  
- **`/sitemap-content.xml`** - Blog posts and content collection pages

### Supporting Files

- **`/robots.txt`** - References main sitemap for search engines

## SEO Configuration

### Priority Levels

- **1.0**: Homepage
- **0.9**: Main service pages (services, contact)
- **0.8**: Individual service pages, high-priority services
- **0.7**: Blog posts, shop page
- **0.6**: Industry/CMS specific pages
- **0.5**: Static content pages

### Change Frequency

- **Weekly**: Homepage, blog posts, shop page
- **Monthly**: Service pages, static pages, content pages

### Last Modified

- Automatically uses file modification dates for static pages
- Uses `publishDate` from content collections when available
- Falls back to current timestamp

## Content Discovery

### Static Pages

The system automatically discovers:
- All `.astro` files in `/src/pages/`
- Nested directory structures
- Excludes dynamic routes (`[slug]`, `[...slug]`)
- Excludes special files (404, API endpoints)

### Content Collections

Automatically includes:
- **Blog**: `/blog/{slug}`
- **Services**: `/services/{slug}` 
- **CMS SEO**: `/cms-seo/{slug}`
- **Industry SEO**: `/industry-seo/{slug}`
- **Pages**: `/{slug}`

## How It Works

1. **File System Scanning**: Recursively scans `/src/pages/` for `.astro` files
2. **Content Collection Integration**: Uses Astro's `getCollection()` API
3. **URL Generation**: Converts file paths to clean URLs
4. **Metadata Extraction**: Gets file modification dates and publish dates
5. **XML Generation**: Creates standards-compliant XML sitemaps
6. **Caching**: Implements HTTP caching for performance

## Adding New Pages

The sitemap automatically updates when you:

### Add Static Pages
1. Create new `.astro` files in `/src/pages/`
2. They'll be automatically discovered on next build/request

### Add Content Collection Entries  
1. Add new `.md` files to content collections
2. They'll appear in the appropriate category sitemap

### Add New Content Collections
1. Update `/src/content/config.ts` 
2. Add collection handling to sitemap files

## Search Engine Submission

### Google Search Console
1. Go to [Google Search Console](https://search.google.com/search-console)
2. Select your property
3. Go to Sitemaps → Add new sitemap
4. Submit: `https://seowebster.com/sitemap.xml`

### Bing Webmaster Tools
1. Go to [Bing Webmaster Tools](https://www.bing.com/webmasters)
2. Go to Sitemaps → Submit Sitemap
3. Submit: `https://seowebster.com/sitemap.xml`

### Alternative: Sitemap Index
You can also submit the sitemap index for better organization:
- `https://seowebster.com/sitemap-index.xml`

## Performance Features

- **HTTP Caching**: 1-hour cache headers
- **Organized Structure**: Category-specific sitemaps reduce processing time
- **Efficient Discovery**: File system scanning with error handling
- **Sorted Output**: Priority-based sorting for optimal crawling

## Monitoring & Maintenance

### Check Sitemap Status
- Visit: `https://seowebster.com/sitemap.xml`
- Verify XML is valid and contains expected URLs

### Monitor Search Console
- Track sitemap processing status
- Monitor for crawl errors
- Check indexing statistics

### Update Priorities (Optional)
Edit the `pageConfig` object in `sitemap.xml.ts` to adjust:
- Priority levels for different page types
- Change frequency settings
- URL patterns for categorization

## Technical Details

### Dependencies
- `astro:content` - Content collection integration
- `fs/promises` - File system operations
- `path` - Path manipulation utilities

### File Structure
```
/src/pages/
├── sitemap.xml.ts              # Main comprehensive sitemap
├── sitemap-index.xml.ts        # Sitemap index
├── sitemap-pages.xml.ts        # Static pages sitemap
├── sitemap-services.xml.ts     # Services sitemap
└── sitemap-content.xml.ts      # Content sitemap

/public/
└── robots.txt                  # Search engine directives
```

### Error Handling
- Graceful fallbacks for missing files
- Console logging for debugging
- HTTP 500 responses for errors

## Best Practices Implemented

1. **XML Declaration**: Proper UTF-8 encoding
2. **Namespace Declarations**: Standard sitemap schemas
3. **Required Elements**: loc, lastmod, changefreq, priority
4. **URL Encoding**: Clean, canonical URLs
5. **Date Formats**: ISO 8601 timestamps
6. **Priority Distribution**: Strategic priority assignment
7. **Change Frequency**: Realistic update frequencies
8. **Cache Headers**: Performance optimization
9. **robots.txt Integration**: Search engine discovery
10. **Organized Structure**: Category-based organization

This sitemap system ensures optimal search engine crawling and indexing of your SEO Webster website while automatically staying up-to-date with new content.
