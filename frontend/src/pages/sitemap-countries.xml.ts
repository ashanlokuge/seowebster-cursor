export async function GET() {
  const siteUrl = 'https://seowebster.com';
  
  // Define country-specific pages
  const countryPages = [
    // Sri Lanka (LK) pages
    { 
      url: `${siteUrl}/lk`,
      lastmod: new Date().toISOString(),
      changefreq: 'weekly',
      priority: 0.9,
      country: 'LK'
    },
    { 
      url: `${siteUrl}/lk/contact`,
      lastmod: new Date().toISOString(),
      changefreq: 'monthly',
      priority: 0.7,
      country: 'LK'
    },
    { 
      url: `${siteUrl}/lk/seo-services`,
      lastmod: new Date().toISOString(),
      changefreq: 'weekly',
      priority: 0.8,
      country: 'LK'
    },
    { 
      url: `${siteUrl}/lk/seo-services/technical-seo`,
      lastmod: new Date().toISOString(),
      changefreq: 'monthly',
      priority: 0.7,
      country: 'LK'
    },
    { 
      url: `${siteUrl}/lk/seo-services/local-seo`,
      lastmod: new Date().toISOString(),
      changefreq: 'monthly',
      priority: 0.7,
      country: 'LK'
    },
    { 
      url: `${siteUrl}/lk/cms-seo`,
      lastmod: new Date().toISOString(),
      changefreq: 'monthly',
      priority: 0.7,
      country: 'LK'
    },
    { 
      url: `${siteUrl}/lk/cms-seo/wordpress-seo`,
      lastmod: new Date().toISOString(),
      changefreq: 'monthly',
      priority: 0.6,
      country: 'LK'
    },

    // Australia (AU) pages
    { 
      url: `${siteUrl}/au`,
      lastmod: new Date().toISOString(),
      changefreq: 'weekly',
      priority: 0.9,
      country: 'AU'
    },
    { 
      url: `${siteUrl}/au/contact`,
      lastmod: new Date().toISOString(),
      changefreq: 'monthly',
      priority: 0.7,
      country: 'AU'
    },
    { 
      url: `${siteUrl}/au/seo-services`,
      lastmod: new Date().toISOString(),
      changefreq: 'weekly',
      priority: 0.8,
      country: 'AU'
    }
  ];

  const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"
        xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"
        xmlns:xhtml="http://www.w3.org/1999/xhtml"
        xsi:schemaLocation="http://www.sitemaps.org/schemas/sitemap/0.9
        http://www.sitemaps.org/schemas/sitemap/0.9/sitemap.xsd">

${countryPages.map(page => `  <url>
    <loc>${page.url}</loc>
    <lastmod>${page.lastmod}</lastmod>
    <changefreq>${page.changefreq}</changefreq>
    <priority>${page.priority}</priority>
    <!-- Hreflang alternates for ${page.country} -->
    ${generateHrefLangAlternates(page.url)}
  </url>`).join('\n')}

</urlset>`;

  return new Response(sitemap, {
    headers: {
      'Content-Type': 'application/xml',
      'Cache-Control': 'public, max-age=3600'
    }
  });
}

function generateHrefLangAlternates(url: string): string {
  const baseUrl = 'https://seowebster.com';
  
  // Extract the path after the country code
  let path = '';
  if (url.includes('/lk/')) {
    path = url.replace(`${baseUrl}/lk`, '');
  } else if (url.includes('/au/')) {
    path = url.replace(`${baseUrl}/au`, '');
  } else {
    path = url.replace(baseUrl, '');
  }

  return `    <xhtml:link rel="alternate" hreflang="en-US" href="${baseUrl}${path}" />
    <xhtml:link rel="alternate" hreflang="en-LK" href="${baseUrl}/lk${path}" />
    <xhtml:link rel="alternate" hreflang="en-AU" href="${baseUrl}/au${path}" />
    <xhtml:link rel="alternate" hreflang="x-default" href="${baseUrl}${path}" />`;
}
