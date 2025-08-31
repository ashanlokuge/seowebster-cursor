/**
 * Trailing Slash SEO Tester for SEOWebster
 * Tests and validates trailing slash redirects across the entire site
 */

interface TrailingSlashTest {
  url: string;
  expectedRedirect: string;
  description: string;
  testType: 'trailing-slash' | 'canonical' | 'legacy';
}

// Comprehensive trailing slash test cases
export const trailingSlashTests: TrailingSlashTest[] = [
  // Homepage (exception - should keep trailing slash)
  {
    url: 'https://seowebster.com',
    expectedRedirect: 'https://seowebster.com/',
    description: 'Homepage without trailing slash should redirect to with trailing slash',
    testType: 'canonical'
  },
  
  // Service pages (should remove trailing slash)
  {
    url: 'https://seowebster.com/services/',
    expectedRedirect: 'https://seowebster.com/services',
    description: 'Services page with trailing slash should redirect to without',
    testType: 'trailing-slash'
  },
  {
    url: 'https://seowebster.com/contact/',
    expectedRedirect: 'https://seowebster.com/contact',
    description: 'Contact page with trailing slash should redirect to without',
    testType: 'trailing-slash'
  },
  {
    url: 'https://seowebster.com/shop/',
    expectedRedirect: 'https://seowebster.com/shop',
    description: 'Shop page with trailing slash should redirect to without',
    testType: 'trailing-slash'
  },
  
  // Deep service pages
  {
    url: 'https://seowebster.com/services/advanced-seo/',
    expectedRedirect: 'https://seowebster.com/services/advanced-seo',
    description: 'Advanced SEO page with trailing slash should redirect to without',
    testType: 'trailing-slash'
  },
  {
    url: 'https://seowebster.com/services/cms-seo/',
    expectedRedirect: 'https://seowebster.com/services/cms-seo',
    description: 'CMS SEO page with trailing slash should redirect to without',
    testType: 'trailing-slash'
  },
  {
    url: 'https://seowebster.com/services/industry-seo/',
    expectedRedirect: 'https://seowebster.com/services/industry-seo',
    description: 'Industry SEO page with trailing slash should redirect to without',
    testType: 'trailing-slash'
  },
  
  // Specific service pages
  {
    url: 'https://seowebster.com/services/advanced-seo/ecommerce-seo/',
    expectedRedirect: 'https://seowebster.com/services/advanced-seo/ecommerce-seo',
    description: 'E-commerce SEO page with trailing slash should redirect to without',
    testType: 'trailing-slash'
  },
  {
    url: 'https://seowebster.com/services/cms-seo/wordpress-seo/',
    expectedRedirect: 'https://seowebster.com/services/cms-seo/wordpress-seo',
    description: 'WordPress SEO page with trailing slash should redirect to without',
    testType: 'trailing-slash'
  },
  {
    url: 'https://seowebster.com/services/industry-seo/saas-seo/',
    expectedRedirect: 'https://seowebster.com/services/industry-seo/saas-seo',
    description: 'SaaS SEO page with trailing slash should redirect to without',
    testType: 'trailing-slash'
  },
  
  // Blog pages
  {
    url: 'https://seowebster.com/blog/',
    expectedRedirect: 'https://seowebster.com/blog',
    description: 'Blog page with trailing slash should redirect to without',
    testType: 'trailing-slash'
  },
  {
    url: 'https://seowebster.com/blog/ecommerce-seo/',
    expectedRedirect: 'https://seowebster.com/blog/ecommerce-seo',
    description: 'Blog post with trailing slash should redirect to without',
    testType: 'trailing-slash'
  },
  
  // Multilingual pages
  {
    url: 'https://seowebster.com/services/multilingual-seo/',
    expectedRedirect: 'https://seowebster.com/services/multilingual-seo',
    description: 'Multilingual SEO page with trailing slash should redirect to without',
    testType: 'trailing-slash'
  },
  {
    url: 'https://seowebster.com/services/multilingual-seo/spanish-seo/',
    expectedRedirect: 'https://seowebster.com/services/multilingual-seo/spanish-seo',
    description: 'Spanish SEO page with trailing slash should redirect to without',
    testType: 'trailing-slash'
  },
  
  // Legacy URL tests (these should redirect AND normalize trailing slash)
  {
    url: 'https://seowebster.com/saas-seo/',
    expectedRedirect: 'https://seowebster.com/services/industry-seo/saas-seo',
    description: 'Legacy SaaS SEO with trailing slash should redirect to new canonical URL',
    testType: 'legacy'
  },
  {
    url: 'https://seowebster.com/e-commerce-seo/',
    expectedRedirect: 'https://seowebster.com/services/advanced-seo/ecommerce-seo',
    description: 'Legacy e-commerce SEO with trailing slash should redirect to new canonical URL',
    testType: 'legacy'
  },
  {
    url: 'https://seowebster.com/link-building/',
    expectedRedirect: 'https://seowebster.com/services/advanced-seo/link-building',
    description: 'Legacy link building with trailing slash should redirect to new canonical URL',
    testType: 'legacy'
  },
  
  // Case sensitivity tests
  {
    url: 'https://seowebster.com/Services/',
    expectedRedirect: 'https://seowebster.com/services',
    description: 'Uppercase Services with trailing slash should redirect to lowercase without trailing slash',
    testType: 'canonical'
  },
  {
    url: 'https://seowebster.com/CONTACT/',
    expectedRedirect: 'https://seowebster.com/contact',
    description: 'Uppercase CONTACT with trailing slash should redirect to lowercase without trailing slash',
    testType: 'canonical'
  },
  
  // WWW vs non-WWW tests
  {
    url: 'https://www.seowebster.com/services/',
    expectedRedirect: 'https://seowebster.com/services',
    description: 'WWW with trailing slash should redirect to non-WWW without trailing slash',
    testType: 'canonical'
  },
  {
    url: 'https://www.seowebster.com/',
    expectedRedirect: 'https://seowebster.com/',
    description: 'WWW homepage should redirect to non-WWW homepage (keep trailing slash)',
    testType: 'canonical'
  },
  
  // File extension tests
  {
    url: 'https://seowebster.com/contact.html',
    expectedRedirect: 'https://seowebster.com/contact',
    description: 'HTML extension should redirect to clean URL',
    testType: 'canonical'
  },
  {
    url: 'https://seowebster.com/services.php',
    expectedRedirect: 'https://seowebster.com/services',
    description: 'PHP extension should redirect to clean URL',
    testType: 'canonical'
  },
  
  // Double slash tests
  {
    url: 'https://seowebster.com/services//advanced-seo/',
    expectedRedirect: 'https://seowebster.com/services/advanced-seo',
    description: 'Double slashes with trailing slash should redirect to single slash without trailing',
    testType: 'canonical'
  }
];

// Function to test a single URL
export async function testTrailingSlashRedirect(testUrl: string, expectedRedirect?: string): Promise<{
  success: boolean;
  actualRedirect?: string;
  statusCode?: number;
  error?: string;
}> {
  try {
    const response = await fetch(testUrl, {
      method: 'HEAD',
      redirect: 'manual' // Don't follow redirects automatically
    });
    
    if (response.status >= 300 && response.status < 400) {
      const location = response.headers.get('location');
      if (location) {
        const actualRedirect = new URL(location, testUrl).toString();
        const success = expectedRedirect ? actualRedirect === expectedRedirect : true;
        
        return {
          success,
          actualRedirect,
          statusCode: response.status
        };
      }
    }
    
    // If no redirect and expected one
    if (expectedRedirect && expectedRedirect !== testUrl) {
      return {
        success: false,
        statusCode: response.status,
        error: 'Expected redirect but none found'
      };
    }
    
    // If no redirect expected and none found
    return {
      success: true,
      statusCode: response.status
    };
    
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error'
    };
  }
}

// Function to run all trailing slash tests
export async function runAllTrailingSlashTests(): Promise<{
  passed: number;
  total: number;
  results: Array<{
    test: TrailingSlashTest;
    success: boolean;
    actualRedirect?: string;
    statusCode?: number;
    error?: string;
  }>;
}> {
  const results = [];
  let passed = 0;
  
  console.log('🧪 Running Trailing Slash SEO Tests...\n');
  
  for (const test of trailingSlashTests) {
    const result = await testTrailingSlashRedirect(test.url, test.expectedRedirect);
    
    const testResult = {
      test,
      success: result.success,
      actualRedirect: result.actualRedirect,
      statusCode: result.statusCode,
      error: result.error
    };
    
    results.push(testResult);
    
    if (result.success) {
      passed++;
      console.log(`✅ ${test.description}`);
      console.log(`   ${test.url} → ${result.actualRedirect || 'No redirect'} (${result.statusCode})\n`);
    } else {
      console.log(`❌ ${test.description}`);
      console.log(`   ${test.url} → Expected: ${test.expectedRedirect}`);
      console.log(`   Actual: ${result.actualRedirect || 'No redirect'} (${result.statusCode})`);
      if (result.error) {
        console.log(`   Error: ${result.error}`);
      }
      console.log('');
    }
  }
  
  console.log(`\n📊 Test Results: ${passed}/${trailingSlashTests.length} passed (${Math.round((passed/trailingSlashTests.length) * 100)}%)`);
  
  return {
    passed,
    total: trailingSlashTests.length,
    results
  };
}

// Function to generate trailing slash report
export function generateTrailingSlashReport(siteUrl: string = 'https://seowebster.com'): void {
  console.log(`\n📋 Trailing Slash SEO Configuration Report for ${siteUrl}\n`);
  
  console.log('🎯 SEO Standards Applied:');
  console.log('  ✅ Homepage: Keeps trailing slash (/)');
  console.log('  ✅ All other pages: No trailing slash');
  console.log('  ✅ 301 redirects: From trailing slash to non-trailing slash');
  console.log('  ✅ Case normalization: All URLs lowercase');
  console.log('  ✅ WWW normalization: Redirects to non-WWW');
  console.log('  ✅ File extensions: Redirects to clean URLs');
  console.log('  ✅ Double slashes: Normalized to single slashes\n');
  
  console.log('🔧 Implementation Details:');
  console.log('  • astro.config.mjs: trailingSlash: "never"');
  console.log('  • Middleware: Comprehensive canonicalization');
  console.log('  • Static Redirects: 125+ legacy URL mappings');
  console.log('  • Dynamic Redirects: Pattern-based redirects\n');
  
  console.log('📈 SEO Benefits:');
  console.log('  • Eliminates duplicate content issues');
  console.log('  • Consolidates link equity to canonical URLs');
  console.log('  • Improves crawl efficiency');
  console.log('  • Consistent URL structure for better UX');
  console.log('  • Prevents split ranking between URL variations\n');
  
  console.log('🧪 Testing:');
  console.log('  • Use runAllTrailingSlashTests() to validate');
  console.log('  • Test with curl -I <url> to see redirect headers');
  console.log('  • Monitor Google Search Console for crawl errors');
  console.log('  • Check Analytics for redirect patterns\n');
}

// Utility function to check if URL needs trailing slash normalization
export function needsTrailingSlashNormalization(url: string): {
  needs: boolean;
  canonical: string;
  reason: string;
} {
  try {
    const urlObj = new URL(url);
    const pathname = urlObj.pathname;
    
    // Homepage should have trailing slash
    if (pathname === '') {
      return {
        needs: false,
        canonical: url + '/',
        reason: 'Homepage should keep trailing slash'
      };
    }
    
    // All other paths should NOT have trailing slash
    if (pathname.length > 1 && pathname.endsWith('/')) {
      const canonical = url.slice(0, -1);
      return {
        needs: true,
        canonical,
        reason: 'Non-homepage URLs should not have trailing slash'
      };
    }
    
    // Check for case sensitivity
    if (pathname !== pathname.toLowerCase()) {
      urlObj.pathname = pathname.toLowerCase();
      return {
        needs: true,
        canonical: urlObj.toString(),
        reason: 'URLs should be lowercase'
      };
    }
    
    // Check for WWW
    if (urlObj.hostname.startsWith('www.')) {
      urlObj.hostname = urlObj.hostname.replace('www.', '');
      return {
        needs: true,
        canonical: urlObj.toString(),
        reason: 'Should use non-WWW version'
      };
    }
    
    return {
      needs: false,
      canonical: url,
      reason: 'URL is already canonical'
    };
    
  } catch (error) {
    return {
      needs: false,
      canonical: url,
      reason: 'Invalid URL'
    };
  }
}

export default {
  trailingSlashTests,
  testTrailingSlashRedirect,
  runAllTrailingSlashTests,
  generateTrailingSlashReport,
  needsTrailingSlashNormalization
};
