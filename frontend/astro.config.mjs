import { defineConfig } from 'astro/config';
import tailwind from '@astrojs/tailwind';

// https://astro.build/config
export default defineConfig({
  integrations: [tailwind()],
  site: 'https://seowebster.com',
  trailingSlash: 'never', // SEO best practice: consistent no trailing slash
  markdown: {
    shikiConfig: {
      theme: 'github-dark'
    }
  },
  redirects: {
    // Legacy URL redirects for better SEO ranking preservation
    // Note: Trailing slash variations are handled automatically by middleware
    
    // Your Original Legacy URLs
    '/saas-seo': '/services/industry-seo/saas-seo',
    '/e-commerce-SEO': '/services/advanced-seo/ecommerce-seo',
    '/e-commerce-seo': '/services/advanced-seo/ecommerce-seo',
    '/ecommerce-seo': '/services/advanced-seo/ecommerce-seo',
    '/link-building': '/services/advanced-seo/link-building',
    '/ai-seo': '/services/industry-seo/ai-seo-automation',
    '/multilangual-seo': '/services/multilingual-seo', // Typo fix
    '/multilingual-seo': '/services/multilingual-seo',
    '/seo-consultation': '/services/seo-consultation',
    '/seo-content-creation': '/services/content-optimization',
    '/local-seo': '/services/local-seo',
    
    // Additional Common SEO Services
    '/seo-audit': '/services/site-audit',
    '/technical-seo': '/services/technical-seo',
    '/on-page-seo': '/services/on-page-seo',
    '/off-page-seo': '/services/off-page-seo',
    '/keyword-research': '/services/keyword-research',
    
    // CMS-Specific SEO Services
    '/wordpress-seo': '/services/cms-seo/wordpress-seo',
    '/wp-seo': '/services/cms-seo/wordpress-seo',
    '/shopify-seo': '/services/cms-seo/shopify-seo',
    '/magento-seo': '/services/cms-seo/magento-seo',
    '/woocommerce-seo': '/services/cms-seo/woocommerce-seo',
    '/webflow-seo': '/services/cms-seo/webflow-seo',
    '/squarespace-seo': '/services/cms-seo/squarespace-seo',
    '/drupal-seo': '/services/cms-seo/drupal-seo',
    '/ghost-seo': '/services/cms-seo/ghost-seo',
    '/bigcommerce-seo': '/services/cms-seo/bigcommerce-seo-services',
    
    // Industry-Specific SEO Services
    '/startup-seo': '/services/industry-seo/startup-seo',
    '/law-seo': '/services/industry-seo/law-seo',
    '/legal-seo': '/services/industry-seo/law-seo',
    '/attorney-seo': '/services/industry-seo/law-seo',
    '/lawyer-seo': '/services/industry-seo/law-seo',
    
    // Advanced SEO Services
    '/programmatic-seo': '/services/advanced-seo/programmatic-seo',
    '/answer-engine-optimization': '/services/advanced-seo/answer-engine-optimization',
    '/aeo': '/services/advanced-seo/answer-engine-optimization',
    '/generative-engine-optimization': '/services/advanced-seo/generative-engine-optimization',
    '/geo': '/services/advanced-seo/generative-engine-optimization',
    '/google-ai-overviews-seo': '/services/advanced-seo/google-ai-overviews-seo',
    '/ai-overviews-seo': '/services/advanced-seo/google-ai-overviews-seo',
    
    // Content & Optimization Services
    '/content-optimization': '/services/content-optimization',
    '/content-seo': '/services/content-optimization',
    '/seo-content': '/services/content-optimization',
    '/seo-copywriting': '/services/content-optimization',
    
    // Multilingual SEO Variations
    '/international-seo': '/services/multilingual-seo',
    '/global-seo': '/services/multilingual-seo',
    '/multi-language-seo': '/services/multilingual-seo',
    
    // Link Building Variations
    '/linkbuilding': '/services/advanced-seo/link-building',
    '/link-acquisition': '/services/advanced-seo/link-building',
    '/backlink-building': '/services/advanced-seo/link-building',
    '/off-page-optimization': '/services/advanced-seo/link-building',
    
    // Common Aliases & Variations
    '/services': '/services',
    '/service': '/services',
    '/seo-services': '/services',
    '/digital-marketing': '/services',
    '/search-engine-optimization': '/services',
    '/about': '/contact',
    '/about-us': '/contact',
    '/consultation': '/services/seo-consultation',
    '/seo-consulting': '/services/seo-consultation',
    '/seo-consultant': '/services/seo-consultation',
    '/free-consultation': '/services/seo-consultation',
    
    // Site Architecture & Audit Services
    '/site-audit': '/services/site-audit',
    '/seo-analysis': '/services/site-audit',
    '/website-audit': '/services/site-audit',
    '/seo-checkup': '/services/site-audit',
    '/seo-report': '/services/site-audit',
    
    // Regional & Local SEO
    '/local-search-optimization': '/services/local-seo',
    '/local-search': '/services/local-seo',
    '/google-my-business': '/services/local-seo',
    '/gmb-optimization': '/services/local-seo',
    
    // Legacy File Extensions (common SEO issue) - handled by middleware instead
    
    // Legacy Service Paths
    '/services/seo-audit': '/services/site-audit',
    '/services/website-audit': '/services/site-audit',
    '/services/link-building-services': '/services/advanced-seo/link-building',
    '/services/content-marketing': '/services/content-optimization',
    
    // Blog Content Redirects (preserve blog SEO value)
    '/blog/seo-tips': '/blog',
    '/blog/seo-guide': '/blog',
    '/articles': '/blog',
    '/resources': '/blog',
  }
}); 