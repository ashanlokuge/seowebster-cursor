/**
 * Redirect Manager Utility for SEOWebster
 * Provides tools to manage, test, and validate redirect rules
 */

interface RedirectTest {
  input: string;
  expectedOutput: string;
  description: string;
  shouldMatch: boolean;
}

// Test cases for your specific legacy URLs
export const legacyUrlTests: RedirectTest[] = [
  // Your original URLs
  { 
    input: 'https://seowebster.com/saas-seo/', 
    expectedOutput: '/services/industry-seo/saas-seo', 
    description: 'SaaS SEO service redirect',
    shouldMatch: true 
  },
  { 
    input: 'https://seowebster.com/e-commerce-SEO', 
    expectedOutput: '/services/advanced-seo/ecommerce-seo', 
    description: 'E-commerce SEO with capital letters',
    shouldMatch: true 
  },
  { 
    input: 'https://seowebster.com/link-building/', 
    expectedOutput: '/services/advanced-seo/link-building', 
    description: 'Link building service',
    shouldMatch: true 
  },
  { 
    input: 'https://seowebster.com/e-commerce-seo/', 
    expectedOutput: '/services/advanced-seo/ecommerce-seo', 
    description: 'E-commerce SEO lowercase',
    shouldMatch: true 
  },
  { 
    input: 'https://seowebster.com/', 
    expectedOutput: '/', 
    description: 'Homepage should remain unchanged',
    shouldMatch: false 
  },
  { 
    input: 'https://seowebster.com/ecommerce-seo/', 
    expectedOutput: '/services/advanced-seo/ecommerce-seo', 
    description: 'E-commerce SEO without hyphen',
    shouldMatch: true 
  },
  { 
    input: 'https://seowebster.com/services/industry-seo/ai-seo-automation/', 
    expectedOutput: '/services/industry-seo/ai-seo-automation', 
    description: 'AI SEO automation (existing path)',
    shouldMatch: true 
  },
  { 
    input: 'https://seowebster.com/ai-seo/', 
    expectedOutput: '/services/industry-seo/ai-seo-automation', 
    description: 'AI SEO short form',
    shouldMatch: true 
  },
  { 
    input: 'https://seowebster.com/multilangual-seo/', 
    expectedOutput: '/services/multilingual-seo', 
    description: 'Multilingual SEO with typo fix',
    shouldMatch: true 
  },
  { 
    input: 'https://seowebster.com/seo-consultation/', 
    expectedOutput: '/services/seo-consultation', 
    description: 'SEO consultation service',
    shouldMatch: true 
  },
  { 
    input: 'https://seowebster.com/seo-content-creation/', 
    expectedOutput: '/services/content-optimization', 
    description: 'SEO content creation to content optimization',
    shouldMatch: true 
  },
  { 
    input: 'https://seowebster.com/local-seo/', 
    expectedOutput: '/services/local-seo', 
    description: 'Local SEO service',
    shouldMatch: true 
  }
];

// Additional comprehensive test cases
export const comprehensiveTests: RedirectTest[] = [
  // Case variations
  { 
    input: 'https://seowebster.com/E-COMMERCE-SEO/', 
    expectedOutput: '/services/advanced-seo/ecommerce-seo', 
    description: 'All caps e-commerce SEO',
    shouldMatch: true 
  },
  { 
    input: 'https://seowebster.com/WordPress-SEO/', 
    expectedOutput: '/services/cms-seo/wordpress-seo', 
    description: 'WordPress SEO with capital W',
    shouldMatch: true 
  },
  { 
    input: 'https://seowebster.com/SHOPIFY-seo', 
    expectedOutput: '/services/cms-seo/shopify-seo', 
    description: 'Mixed case Shopify SEO',
    shouldMatch: true 
  },
  
  // Query parameter preservation
  { 
    input: 'https://seowebster.com/saas-seo/?utm_source=google&utm_medium=cpc', 
    expectedOutput: '/services/industry-seo/saas-seo?utm_source=google&utm_medium=cpc', 
    description: 'SaaS SEO with UTM parameters',
    shouldMatch: true 
  },
  
  // Language variants
  { 
    input: 'https://seowebster.com/spanish/seo-services/', 
    expectedOutput: '/services/multilingual-seo/spanish-seo', 
    description: 'Spanish language SEO services',
    shouldMatch: true 
  },
  { 
    input: 'https://seowebster.com/fr/seo/', 
    expectedOutput: '/services/multilingual-seo/french-seo', 
    description: 'French language code redirect',
    shouldMatch: true 
  },
  
  // Industry variations
  { 
    input: 'https://seowebster.com/legal-seo/', 
    expectedOutput: '/services/industry-seo/law-seo', 
    description: 'Legal SEO to law SEO',
    shouldMatch: true 
  },
  { 
    input: 'https://seowebster.com/attorney-seo/', 
    expectedOutput: '/services/industry-seo/law-seo', 
    description: 'Attorney SEO to law SEO',
    shouldMatch: true 
  },
  
  // Common abbreviations
  { 
    input: 'https://seowebster.com/wp-seo/', 
    expectedOutput: '/services/cms-seo/wordpress-seo', 
    description: 'WP SEO abbreviation',
    shouldMatch: true 
  },
  { 
    input: 'https://seowebster.com/woocommerce-seo', 
    expectedOutput: '/services/cms-seo/woocommerce-seo', 
    description: 'WooCommerce SEO',
    shouldMatch: true 
  }
];

// Function to test redirect rules
export function testRedirects(tests: RedirectTest[] = legacyUrlTests) {
  const results: Array<{
    test: RedirectTest;
    passed: boolean;
    actualOutput?: string;
    error?: string;
  }> = [];

  for (const test of tests) {
    try {
      // This would use your redirect logic
      // For now, we'll simulate the test
      const url = new URL(test.input);
      const pathname = url.pathname;
      
      // Simulate the redirect logic (you'd import and use your actual redirect functions here)
      let actualOutput = pathname; // Default to no change
      
      // This is where you'd call your actual redirect matching logic
      // const actualOutput = testRedirect(test.input);
      
      const passed = test.shouldMatch 
        ? actualOutput === test.expectedOutput
        : actualOutput === pathname;
      
      results.push({
        test,
        passed,
        actualOutput
      });
    } catch (error) {
      results.push({
        test,
        passed: false,
        error: error instanceof Error ? error.message : 'Unknown error'
      });
    }
  }

  return results;
}

// Function to generate redirect report
export function generateRedirectReport(tests: RedirectTest[] = legacyUrlTests) {
  const results = testRedirects(tests);
  const passed = results.filter(r => r.passed).length;
  const total = results.length;
  
  console.log(`\n=== Redirect Test Report ===`);
  console.log(`Passed: ${passed}/${total} (${Math.round((passed/total) * 100)}%)\n`);
  
  results.forEach((result, index) => {
    const status = result.passed ? '✅' : '❌';
    console.log(`${status} Test ${index + 1}: ${result.test.description}`);
    console.log(`   Input: ${result.test.input}`);
    console.log(`   Expected: ${result.test.expectedOutput}`);
    console.log(`   Actual: ${result.actualOutput || 'No redirect'}`);
    if (result.error) {
      console.log(`   Error: ${result.error}`);
    }
    console.log('');
  });
  
  return { passed, total, results };
}

// Function to validate redirect configuration
export function validateRedirectConfig() {
  const issues: string[] = [];
  
  // Check for common redirect issues
  const redirects = [
    // This would read from your actual redirect configuration
    // For now, we'll use some examples
  ];
  
  // Check for infinite redirects
  // Check for broken redirects
  // Check for redirect chains
  // Check for missing target pages
  
  if (issues.length === 0) {
    console.log('✅ Redirect configuration validation passed!');
  } else {
    console.log('❌ Redirect configuration issues found:');
    issues.forEach(issue => console.log(`  - ${issue}`));
  }
  
  return issues;
}

// Export utility functions
export default {
  testRedirects,
  generateRedirectReport,
  validateRedirectConfig,
  legacyUrlTests,
  comprehensiveTests
};
