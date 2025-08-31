/**
 * Comprehensive Trailing Slash Testing Utility
 * Tests all possible trailing slash scenarios across the site
 */

import { testTrailingSlash } from '../middleware/redirects';

// Test cases for trailing slash handling
const testCases = [
  // Root path (should NOT redirect)
  { input: '/', expected: null, description: 'Root path should remain unchanged' },
  
  // Single level paths
  { input: '/services/', expected: '/services', description: 'Single level with trailing slash' },
  { input: '/about/', expected: '/about', description: 'About page with trailing slash' },
  { input: '/contact/', expected: '/contact', description: 'Contact page with trailing slash' },
  
  // Multi-level paths
  { input: '/services/seo/', expected: '/services/seo', description: 'Multi-level with trailing slash' },
  { input: '/services/industry-seo/saas-seo/', expected: '/services/industry-seo/saas-seo', description: 'Deep nested with trailing slash' },
  { input: '/blog/intro-to-seo/', expected: '/blog/intro-to-seo', description: 'Blog post with trailing slash' },
  
  // Already correct paths (should NOT redirect)
  { input: '/services', expected: null, description: 'Already correct - no trailing slash' },
  { input: '/about', expected: null, description: 'Already correct - no trailing slash' },
  { input: '/services/seo', expected: null, description: 'Already correct - no trailing slash' },
  
  // Edge cases
  { input: '/services///', expected: '/services//', description: 'Multiple trailing slashes (first one removed)' },
  { input: '/services//', expected: '/services/', description: 'Double slashes (first one removed)' },
  { input: '/', expected: null, description: 'Root with no trailing slash' },
  
  // Query parameters and hashes
  { input: '/services/?utm_source=google', expected: '/services?utm_source=google', description: 'With query parameters' },
  { input: '/services/#section1', expected: '/services#section1', description: 'With hash fragment' },
  { input: '/services/?utm_source=google#section1', expected: '/services?utm_source=google#section1', description: 'With both query and hash' },
  
  // Special characters and encoded URLs
  { input: '/services%20seo/', expected: '/services%20seo', description: 'URL encoded space' },
  { input: '/services-seo/', expected: '/services-seo', description: 'Hyphenated path' },
  { input: '/services_seo/', expected: '/services_seo', description: 'Underscore path' },
];

// Function to run all tests
export function runTrailingSlashTests(): void {
  console.log('🧪 Running Comprehensive Trailing Slash Tests...\n');
  
  let passed = 0;
  let failed = 0;
  
  testCases.forEach((testCase, index) => {
    const result = testTrailingSlash(testCase.input);
    const success = result === testCase.expected;
    
    if (success) {
      passed++;
      console.log(`✅ Test ${index + 1}: ${testCase.description}`);
      console.log(`   Input: "${testCase.input}" → Output: "${result}"`);
    } else {
      failed++;
      console.log(`❌ Test ${index + 1}: ${testCase.description}`);
      console.log(`   Input: "${testCase.input}" → Expected: "${testCase.expected}" → Got: "${result}"`);
    }
    console.log('');
  });
  
  // Summary
  console.log('📊 Test Results Summary:');
  console.log(`   ✅ Passed: ${passed}`);
  console.log(`   ❌ Failed: ${failed}`);
  console.log(`   📈 Success Rate: ${((passed / (passed + failed)) * 100).toFixed(1)}%`);
  
  if (failed === 0) {
    console.log('\n🎉 All trailing slash tests passed! Your site is properly configured.');
  } else {
    console.log('\n⚠️  Some tests failed. Check the implementation.');
  }
}

// Function to test specific URL patterns
export function testSpecificUrl(url: string): void {
  console.log(`🔍 Testing specific URL: "${url}"`);
  const result = testTrailingSlash(url);
  
  if (result) {
    console.log(`   ✅ Redirect: "${url}" → "${result}"`);
  } else {
    console.log(`   ℹ️  No redirect needed: "${url}"`);
  }
}

// Function to generate test URLs for your site structure
export function generateSiteTestUrls(): string[] {
  return [
    // Main pages
    '/',
    '/services/',
    '/about/',
    '/contact/',
    '/blog/',
    '/partners/',
    '/shop/',
    
    // Service pages
    '/services/seo-consultation/',
    '/services/local-seo/',
    '/services/content-optimization/',
    '/services/site-audit/',
    '/services/technical-seo/',
    '/services/on-page-seo/',
    '/services/off-page-seo/',
    '/services/keyword-research/',
    
    // Industry-specific services
    '/services/industry-seo/saas-seo/',
    '/services/industry-seo/law-seo/',
    '/services/industry-seo/startup-seo/',
    '/services/industry-seo/ai-seo-automation/',
    
    // CMS-specific services
    '/services/cms-seo/wordpress-seo/',
    '/services/cms-seo/shopify-seo/',
    '/services/cms-seo/magento-seo/',
    '/services/cms-seo/woocommerce-seo/',
    '/services/cms-seo/webflow-seo/',
    '/services/cms-seo/squarespace-seo/',
    '/services/cms-seo/drupal-seo/',
    '/services/cms-seo/ghost-seo/',
    '/services/cms-seo/bigcommerce-seo-services/',
    
    // Advanced services
    '/services/advanced-seo/ecommerce-seo/',
    '/services/advanced-seo/link-building/',
    '/services/advanced-seo/programmatic-seo/',
    '/services/advanced-seo/answer-engine-optimization/',
    '/services/advanced-seo/generative-engine-optimization/',
    '/services/advanced-seo/google-ai-overviews-seo/',
    
    // Multilingual services
    '/services/multilingual-seo/',
    '/services/multilingual-seo/spanish-seo/',
    '/services/multilingual-seo/french-seo/',
    '/services/multilingual-seo/german-seo/',
    
    // Blog posts
    '/blog/intro-to-seo/',
    '/blog/seo-best-practices/',
    '/blog/local-seo-guide/',
    
    // Legacy URLs (should redirect)
    '/saas-seo/',
    '/e-commerce-SEO/',
    '/link-building/',
    '/ai-seo/',
    '/multilangual-seo/',
    '/seo-consultation/',
    '/seo-content-creation/',
    '/local-seo/',
  ];
}

// Function to test all your site URLs
export function testAllSiteUrls(): void {
  console.log('🌐 Testing All Site URLs for Trailing Slash Issues...\n');
  
  const urls = generateSiteTestUrls();
  let needsRedirect = 0;
  let correct = 0;
  
  urls.forEach(url => {
    const result = testTrailingSlash(url);
    if (result) {
      needsRedirect++;
      console.log(`🔄 ${url} → ${result}`);
    } else {
      correct++;
      console.log(`✅ ${url} (correct)`);
    }
  });
  
  console.log('\n📊 Site-Wide Trailing Slash Analysis:');
  console.log(`   🔄 URLs needing redirect: ${needsRedirect}`);
  console.log(`   ✅ URLs already correct: ${correct}`);
  console.log(`   📈 Total coverage: ${urls.length} URLs tested`);
  
  if (needsRedirect > 0) {
    console.log('\n⚠️  Some URLs need trailing slash redirects. The middleware will handle these automatically.');
  } else {
    console.log('\n🎉 All URLs are already in the correct format!');
  }
}

// Export for use in other files
export default {
  runTrailingSlashTests,
  testSpecificUrl,
  testAllSiteUrls,
  generateSiteTestUrls
};
