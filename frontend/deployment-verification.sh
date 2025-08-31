#!/bin/bash

# 🚀 SEOWebster Trailing Slash Deployment Verification Script
# This script verifies that trailing slash redirects are working correctly in production

set -e  # Exit on any error

# Configuration
DOMAIN="seowebster.com"
PROTOCOL="https"
TIMEOUT=10

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

echo -e "${BLUE}🎯 SEOWebster Trailing Slash Deployment Verification${NC}"
echo -e "${BLUE}==================================================${NC}"
echo ""

# Function to test a URL and check for redirects
test_url() {
    local url="$1"
    local expected_redirect="$2"
    local description="$3"
    
    echo -e "${BLUE}Testing: ${description}${NC}"
    echo "URL: ${url}"
    
    # Get HTTP response with curl
    response=$(curl -s -w "%{http_code}|%{redirect_url}" -o /dev/null --max-time $TIMEOUT "$url" 2>/dev/null || echo "000|")
    
    # Parse response
    http_code=$(echo "$response" | cut -d'|' -f1)
    redirect_url=$(echo "$response" | cut -d'|' -f2)
    
    if [ "$http_code" = "000" ]; then
        echo -e "${RED}❌ ERROR: Request failed or timed out${NC}"
        return 1
    fi
    
    if [ "$http_code" = "301" ] || [ "$http_code" = "302" ]; then
        if [ -n "$expected_redirect" ]; then
            if [ "$redirect_url" = "$expected_redirect" ]; then
                echo -e "${GREEN}✅ SUCCESS: 301 redirect to ${redirect_url}${NC}"
                return 0
            else
                echo -e "${YELLOW}⚠️  WARNING: Redirected to ${redirect_url} (expected ${expected_redirect})${NC}"
                return 1
            fi
        else
            echo -e "${GREEN}✅ SUCCESS: 301 redirect to ${redirect_url}${NC}"
            return 0
        fi
    elif [ "$http_code" = "200" ]; then
        if [ -n "$expected_redirect" ]; then
            echo -e "${RED}❌ FAILED: Got 200 OK, expected 301 redirect${NC}"
            return 1
        else
            echo -e "${GREEN}✅ SUCCESS: 200 OK (no redirect needed)${NC}"
            return 0
        fi
    else
        echo -e "${RED}❌ FAILED: Unexpected HTTP code ${http_code}${NC}"
        return 1
    fi
}

# Function to test multiple URLs
test_urls() {
    local test_name="$1"
    shift
    local urls=("$@")
    
    echo -e "${YELLOW}🧪 Testing: ${test_name}${NC}"
    echo "=================================="
    
    local passed=0
    local failed=0
    
    for url_info in "${urls[@]}"; do
        # Parse URL info: "url|expected_redirect|description"
        url=$(echo "$url_info" | cut -d'|' -f1)
        expected_redirect=$(echo "$url_info" | cut -d'|' -f2)
        description=$(echo "$url_info" | cut -d'|' -f3)
        
        if test_url "$url" "$expected_redirect" "$description"; then
            ((passed++))
        else
            ((failed++))
        fi
        echo ""
    done
    
    echo -e "${YELLOW}📊 Results for ${test_name}:${NC}"
    echo -e "   ${GREEN}✅ Passed: ${passed}${NC}"
    echo -e "   ${RED}❌ Failed: ${failed}${NC}"
    echo ""
    
    return $failed
}

# Test URLs that SHOULD redirect (remove trailing slash)
echo -e "${BLUE}🔄 Testing URLs that SHOULD redirect (remove trailing slash)${NC}"
echo "=================================================================="

trailing_slash_tests=(
    "${PROTOCOL}://${DOMAIN}/services/|${PROTOCOL}://${DOMAIN}/services|Services page with trailing slash"
    "${PROTOCOL}://${DOMAIN}/contact/|${PROTOCOL}://${DOMAIN}/contact|Contact page with trailing slash"
    "${PROTOCOL}://${DOMAIN}/blog/|${PROTOCOL}://${DOMAIN}/blog|Blog page with trailing slash"
    "${PROTOCOL}://${DOMAIN}/about/|${PROTOCOL}://${DOMAIN}/about|About page with trailing slash"
    "${PROTOCOL}://${DOMAIN}/services/local-seo/|${PROTOCOL}://${DOMAIN}/services/local-seo|Local SEO service with trailing slash"
    "${PROTOCOL}://${DOMAIN}/services/industry-seo/saas-seo/|${PROTOCOL}://${DOMAIN}/services/industry-seo/saas-seo|SaaS SEO service with trailing slash"
    "${PROTOCOL}://${DOMAIN}/services/advanced-seo/answer-engine-optimization/|${PROTOCOL}://${DOMAIN}/services/advanced-seo/answer-engine-optimization|AEO service with trailing slash"
    "${PROTOCOL}://${DOMAIN}/services/on-page-seo/|${PROTOCOL}://${DOMAIN}/services/on-page-seo|On-page SEO service with trailing slash"
    "${PROTOCOL}://${DOMAIN}/blog/intro-to-seo/|${PROTOCOL}://${DOMAIN}/blog/intro-to-seo|Blog post with trailing slash"
    "${PROTOCOL}://${DOMAIN}/partners/|${PROTOCOL}://${DOMAIN}/partners|Partners page with trailing slash"
)

test_urls "Trailing Slash Redirects" "${trailing_slash_tests[@]}"
trailing_slash_results=$?

echo ""

# Test URLs that should NOT redirect (already correct)
echo -e "${BLUE}✅ Testing URLs that should NOT redirect (already correct)${NC}"
echo "=================================================================="

correct_urls=(
    "${PROTOCOL}://${DOMAIN}/||Homepage (should keep trailing slash)"
    "${PROTOCOL}://${DOMAIN}/services||Services page (no trailing slash)"
    "${PROTOCOL}://${DOMAIN}/contact||Contact page (no trailing slash)"
    "${PROTOCOL}://${DOMAIN}/blog||Blog page (no trailing slash)"
    "${PROTOCOL}://${DOMAIN}/about||About page (no trailing slash)"
    "${PROTOCOL}://${DOMAIN}/services/local-seo||Local SEO service (no trailing slash)"
    "${PROTOCOL}://${DOMAIN}/services/industry-seo/saas-seo||SaaS SEO service (no trailing slash)"
    "${PROTOCOL}://${DOMAIN}/services/advanced-seo/answer-engine-optimization||AEO service (no trailing slash)"
    "${PROTOCOL}://${DOMAIN}/services/on-page-seo||On-page SEO service (no trailing slash)"
    "${PROTOCOL}://${DOMAIN}/blog/intro-to-seo||Blog post (no trailing slash)"
)

test_urls "Correct URLs (No Redirect)" "${correct_urls[@]}"
correct_urls_results=$?

echo ""

# Test edge cases
echo -e "${BLUE}🔍 Testing Edge Cases${NC}"
echo "========================"

edge_case_tests=(
    "${PROTOCOL}://${DOMAIN}/services///|${PROTOCOL}://${DOMAIN}/services//|Multiple trailing slashes"
    "${PROTOCOL}://${DOMAIN}/services//|${PROTOCOL}://${DOMAIN}/services/|Double trailing slashes"
    "${PROTOCOL}://${DOMAIN}/services/?utm_source=google|${PROTOCOL}://${DOMAIN}/services?utm_source=google|With query parameters"
    "${PROTOCOL}://${DOMAIN}/services/#section1|${PROTOCOL}://${DOMAIN}/services#section1|With hash fragment"
)

test_urls "Edge Cases" "${edge_case_tests[@]}"
edge_case_results=$?

echo ""

# Test legacy URLs that should redirect
echo -e "${BLUE}🔄 Testing Legacy URL Redirects${NC}"
echo "====================================="

legacy_url_tests=(
    "${PROTOCOL}://${DOMAIN}/saas-seo/|${PROTOCOL}://${DOMAIN}/services/industry-seo/saas-seo|Legacy SaaS SEO redirect"
    "${PROTOCOL}://${DOMAIN}/e-commerce-SEO/|${PROTOCOL}://${DOMAIN}/services/advanced-seo/ecommerce-seo|Legacy E-commerce SEO redirect"
    "${PROTOCOL}://${DOMAIN}/link-building/|${PROTOCOL}://${DOMAIN}/services/advanced-seo/link-building|Legacy Link Building redirect"
    "${PROTOCOL}://${DOMAIN}/ai-seo/|${PROTOCOL}://${DOMAIN}/services/industry-seo/ai-seo-automation|Legacy AI SEO redirect"
    "${PROTOCOL}://${DOMAIN}/multilangual-seo/|${PROTOCOL}://${DOMAIN}/services/multilingual-seo|Legacy Multilingual SEO redirect"
)

test_urls "Legacy URL Redirects" "${legacy_url_tests[@]}"
legacy_url_results=$?

echo ""

# Final Summary
echo -e "${BLUE}📊 FINAL DEPLOYMENT VERIFICATION SUMMARY${NC}"
echo "=============================================="

total_tests=$((trailing_slash_results + correct_urls_results + edge_case_results + legacy_url_results))

if [ $total_tests -eq 0 ]; then
    echo -e "${GREEN}🎉 ALL TESTS PASSED! Your trailing slash fix is working perfectly!${NC}"
    echo ""
    echo -e "${GREEN}✅ Trailing slash redirects: WORKING${NC}"
    echo -e "${GREEN}✅ Correct URLs: WORKING${NC}"
    echo -e "${GREEN}✅ Edge cases: WORKING${NC}"
    echo -e "${GREEN}✅ Legacy redirects: WORKING${NC}"
    echo ""
    echo -e "${GREEN}🚀 Your site is now SEO-optimized with no trailing slash issues!${NC}"
    exit 0
else
    echo -e "${RED}⚠️  SOME TESTS FAILED. Your trailing slash fix needs attention.${NC}"
    echo ""
    echo -e "${RED}❌ Failed test categories: ${total_tests}${NC}"
    echo ""
    echo -e "${YELLOW}🔧 Next steps:${NC}"
    echo "1. Check if middleware is deployed correctly"
    echo "2. Verify server configuration"
    echo "3. Clear any caching layers"
    echo "4. Rebuild and redeploy"
    echo "5. Run this verification script again"
    exit 1
fi
