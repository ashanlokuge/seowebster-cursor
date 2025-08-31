# Trailing Slash Fix Script for SEOWebster

## Overview
Script to systematically fix all internal links with trailing slashes to use canonical URLs (no trailing slash except homepage).

## Issues Found
Based on the analysis, the following files contain internal links with trailing slashes that need to be fixed:

### Major Files with Trailing Slash Issues:
1. `/frontend/src/pages/services/multilingual-seo.astro` - 26 instances
2. `/frontend/src/pages/services.astro` - 12 instances  
3. `/frontend/src/pages/services/industry-seo/multilingual-seo.astro` - 6 instances
4. `/frontend/src/pages/services/industry-seo.astro` - 4 instances

## Fix Strategy

### Automated Find & Replace Patterns:
```bash
# Pattern 1: href="/path/" -> href="/path"
find . -name "*.astro" -type f -exec sed -i '' 's|href="\([^"]*\)/"|\href="\1"|g' {} \;

# Pattern 2: href='/path/' -> href='/path'
find . -name "*.astro" -type f -exec sed -i '' "s|href='\([^']*\)/'|href='\1'|g" {} \;
```

### Manual Review Required:
- Homepage links should keep trailing slash: `href="/"`
- External links should not be changed
- Dynamic links from CMS/data should be checked

## Implementation Steps

### 1. Backup Current State
```bash
cd frontend
git add .
git commit -m "Backup before trailing slash fixes"
```

### 2. Run Automated Fixes
```bash
# Fix double-quoted hrefs
find src -name "*.astro" -type f -exec sed -i '' 's|href="\([^"]*[^/]\)/"|\href="\1"|g' {} \;

# Fix single-quoted hrefs  
find src -name "*.astro" -type f -exec sed -i '' "s|href='\([^']*[^/]\)/'|href='\1'|g" {} \;
```

### 3. Manual Homepage Fix
Ensure homepage links keep trailing slash:
```astro
<!-- Keep this format -->
<a href="/">Home</a>

<!-- Not this -->
<a href="">Home</a>
```

### 4. Validation Steps
```bash
# Check for remaining issues
grep -r 'href.*="/[^"]*/"' src/
grep -r "href.*='/[^']*/'" src/

# Test build
npm run build

# Test redirects
npm run test:trailing-slash
```

## Specific Files to Fix

### File: services/multilingual-seo.astro
**Lines to fix:**
- Line 165: `/services/multilingual-seo/international-seo/` → `/services/multilingual-seo/international-seo`
- Line 202: `/services/multilingual-seo/multi-language-content/` → `/services/multilingual-seo/multi-language-content`
- Line 239: `/services/multilingual-seo/language-specific-seo/` → `/services/multilingual-seo/language-specific-seo`
- Line 275: `/services/multilingual-seo/spanish-seo/` → `/services/multilingual-seo/spanish-seo`
- Line 288: `/services/multilingual-seo/german-seo/` → `/services/multilingual-seo/german-seo`
- Line 301: `/services/multilingual-seo/french-seo/` → `/services/multilingual-seo/french-seo`
- Line 314: `/services/multilingual-seo/japanese-seo/` → `/services/multilingual-seo/japanese-seo`
- Line 327: `/services/multilingual-seo/chinese-seo/` → `/services/multilingual-seo/chinese-seo`
- Line 340: `/services/multilingual-seo/arabic-seo/` → `/services/multilingual-seo/arabic-seo`
- Line 353: `/services/multilingual-seo/italian-seo/` → `/services/multilingual-seo/italian-seo`
- Line 366: `/services/multilingual-seo/portuguese-seo/` → `/services/multilingual-seo/portuguese-seo`
- Line 379: `/services/multilingual-seo/russian-seo/` → `/services/multilingual-seo/russian-seo`
- Line 392: `/services/multilingual-seo/korean-seo/` → `/services/multilingual-seo/korean-seo`

### File: services.astro
**Lines to fix:**
- Line 120: `/services/cms-seo/` → `/services/cms-seo`
- Line 161: `/services/advanced-seo/` → `/services/advanced-seo`
- Line 202: `/services/industry-seo/` → `/services/industry-seo`
- Line 246: `/services/multilingual-seo/` → `/services/multilingual-seo`
- Line 288: `/services/technical-seo/` → `/services/technical-seo`
- Line 323: `/services/cms-seo/wordpress-seo/` → `/services/cms-seo/wordpress-seo`
- Line 335: `/services/cms-seo/shopify-seo/` → `/services/cms-seo/shopify-seo`
- Line 347: `/services/advanced-seo/programmatic-seo/` → `/services/advanced-seo/programmatic-seo`
- Line 359: `/services/industry-seo/saas-seo/` → `/services/industry-seo/saas-seo`
- Line 371: `/services/industry-seo/local-seo/` → `/services/industry-seo/local-seo`
- Line 383: `/services/advanced-seo/ecommerce-seo/` → `/services/advanced-seo/ecommerce-seo`

## SEO Benefits After Fix

### Before (Problems):
- Duplicate content issues between `/page/` and `/page`
- Split link equity between URL variations
- Inconsistent internal linking structure
- Poor crawl efficiency

### After (Benefits):
- ✅ Consolidated link equity to canonical URLs
- ✅ Eliminated duplicate content issues
- ✅ Consistent URL structure throughout site
- ✅ Better crawl efficiency for search engines
- ✅ Improved user experience with predictable URLs

## Testing & Validation

### 1. Build Testing
```bash
npm run build
# Should complete without errors
# Should generate correct canonical URLs in dist/
```

### 2. Redirect Testing
```bash
# Test that trailing slash URLs redirect correctly
curl -I https://seowebster.com/services/
# Should return: HTTP/1.1 301 Moved Permanently
# Location: https://seowebster.com/services
```

### 3. Internal Link Validation
```bash
# Check for any remaining trailing slash internal links
grep -r 'href.*="/[^"]*/"' src/ | grep -v 'href="/"'
# Should return no results (except homepage)
```

### 4. SEO Validation
- Check Google Search Console for crawl errors
- Verify canonical URLs in HTML source
- Test with SEO tools like Screaming Frog
- Monitor for any ranking drops (should improve)

## Post-Implementation Monitoring

### Week 1-2:
- Monitor Google Search Console for crawl errors
- Check server logs for 404 errors
- Verify redirects are working correctly

### Month 1:
- Review organic traffic patterns
- Check for any ranking improvements
- Monitor page load speeds
- Review user behavior analytics

### Ongoing:
- Maintain consistent linking patterns in new content
- Regular audits to prevent trailing slash regression
- Update any external tools/integrations that might add trailing slashes

## Rollback Plan
If issues arise:
```bash
git revert <commit-hash>
npm run build
# Deploy previous version
```

## Success Metrics
- ✅ Zero internal links with trailing slashes (except homepage)
- ✅ All trailing slash URLs return 301 redirects
- ✅ Consistent canonical URL structure
- ✅ No increase in 404 errors
- ✅ No drop in organic traffic
- ✅ Improved crawl efficiency metrics
