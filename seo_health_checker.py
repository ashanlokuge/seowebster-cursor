#!/usr/bin/env python3
"""
SEO Health Checker - Real Website Analysis Tool
Analyzes live websites for SEO issues and provides actionable recommendations.
"""

import requests
from bs4 import BeautifulSoup
import re
import time
from urllib.parse import urljoin, urlparse
import json
from typing import Dict, List, Tuple
import ssl
import socket
import whois
from datetime import datetime
import argparse

class SEOHealthChecker:
    def __init__(self):
        self.session = requests.Session()
        self.session.headers.update({
            'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36'
        })
        
    def check_website(self, url: str) -> Dict:
        """Main method to check website SEO health"""
        print(f"🔍 Analyzing {url}...")
        
        # Ensure URL has protocol
        if not url.startswith(('http://', 'https://')):
            url = 'https://' + url
            
        try:
            # Basic checks
            response = self.session.get(url, timeout=30, allow_redirects=True)
            soup = BeautifulSoup(response.content, 'html.parser')
            
            results = {
                'url': url,
                'timestamp': datetime.now().isoformat(),
                'status_code': response.status_code,
                'response_time': response.elapsed.total_seconds(),
                'score': 0,
                'issues': [],
                'recommendations': [],
                'technical_details': {}
            }
            
            # Run all checks
            self._check_meta_tags(soup, results)
            self._check_headings(soup, results)
            self._check_images(soup, results)
            self._check_links(soup, results)
            self._check_content(soup, results)
            self._check_technical(response, results)
            self._check_performance(response, results)
            
            # Calculate score
            results['score'] = self._calculate_score(results)
            results['grade'] = self._get_grade(results['score'])
            
            return results
            
        except Exception as e:
            return {
                'url': url,
                'error': str(e),
                'timestamp': datetime.now().isoformat()
            }
    
    def _check_meta_tags(self, soup: BeautifulSoup, results: Dict):
        """Check meta tags and title"""
        issues = []
        recommendations = []
        
        # Title tag
        title = soup.find('title')
        if not title or not title.get_text().strip():
            issues.append({
                'type': 'critical',
                'title': 'Missing Title Tag',
                'description': 'Your page has no title tag, which is essential for SEO.'
            })
            recommendations.append({
                'priority': 'Immediate',
                'title': 'Add Title Tag',
                'description': 'Create a compelling title tag between 50-60 characters.'
            })
        else:
            title_text = title.get_text().strip()
            if len(title_text) < 30:
                issues.append({
                    'type': 'medium',
                    'title': 'Title Too Short',
                    'description': f'Title is only {len(title_text)} characters. Aim for 50-60 characters.'
                })
            elif len(title_text) > 60:
                issues.append({
                    'type': 'medium',
                    'title': 'Title Too Long',
                    'description': f'Title is {len(title_text)} characters. Keep under 60 characters.'
                })
        
        # Meta description
        meta_desc = soup.find('meta', attrs={'name': 'description'})
        if not meta_desc or not meta_desc.get('content', '').strip():
            issues.append({
                'type': 'high',
                'title': 'Missing Meta Description',
                'description': 'No meta description found. This hurts click-through rates from search results.'
            })
            recommendations.append({
                'priority': 'High',
                'title': 'Add Meta Description',
                'description': 'Write a compelling 150-160 character description.'
            })
        else:
            desc_text = meta_desc.get('content', '').strip()
            if len(desc_text) < 120:
                issues.append({
                    'type': 'low',
                    'title': 'Meta Description Too Short',
                    'description': f'Description is {len(desc_text)} characters. Aim for 150-160 characters.'
                })
            elif len(desc_text) > 160:
                issues.append({
                    'type': 'low',
                    'title': 'Meta Description Too Long',
                    'description': f'Description is {len(desc_text)} characters. Keep under 160 characters.'
                })
        
        # Viewport meta tag
        viewport = soup.find('meta', attrs={'name': 'viewport'})
        if not viewport:
            issues.append({
                'type': 'high',
                'title': 'Missing Viewport Meta Tag',
                'description': 'No viewport meta tag found. This affects mobile optimization.'
            })
            recommendations.append({
                'priority': 'High',
                'title': 'Add Viewport Meta Tag',
                'description': 'Add: <meta name="viewport" content="width=device-width, initial-scale=1">'
            })
        
        results['issues'].extend(issues)
        results['recommendations'].extend(recommendations)
    
    def _check_headings(self, soup: BeautifulSoup, results: Dict):
        """Check heading structure"""
        issues = []
        recommendations = []
        
        h1_tags = soup.find_all('h1')
        h2_tags = soup.find_all('h2')
        h3_tags = soup.find_all('h3')
        
        # H1 check
        if len(h1_tags) == 0:
            issues.append({
                'type': 'critical',
                'title': 'Missing H1 Tag',
                'description': 'No H1 heading found. Every page should have one main heading.'
            })
            recommendations.append({
                'priority': 'Immediate',
                'title': 'Add H1 Heading',
                'description': 'Include one H1 tag with your main keyword.'
            })
        elif len(h1_tags) > 1:
            issues.append({
                'type': 'high',
                'title': 'Multiple H1 Tags',
                'description': f'Found {len(h1_tags)} H1 tags. Use only one per page.'
            })
            recommendations.append({
                'priority': 'High',
                'title': 'Use Single H1',
                'description': 'Keep only one H1 tag per page for better SEO.'
            })
        
        # Heading hierarchy
        if h1_tags and h2_tags:
            h1_pos = soup.find('h1').sourceline
            h2_pos = soup.find('h2').sourceline
            if h2_pos < h1_pos:
                issues.append({
                    'type': 'medium',
                    'title': 'Poor Heading Hierarchy',
                    'description': 'H2 appears before H1. Maintain proper heading order.'
                })
                recommendations.append({
                    'priority': 'Medium',
                    'title': 'Fix Heading Order',
                    'description': 'Ensure H1 comes before H2, H2 before H3, etc.'
                })
        
        results['issues'].extend(issues)
        results['recommendations'].extend(recommendations)
    
    def _check_images(self, soup: BeautifulSoup, results: Dict):
        """Check image optimization"""
        issues = []
        recommendations = []
        
        images = soup.find_all('img')
        missing_alt = 0
        large_images = 0
        
        for img in images:
            # Alt text check
            if not img.get('alt') or img.get('alt').strip() == '':
                missing_alt += 1
            
            # Image size check (basic)
            src = img.get('src', '')
            if src and not src.startswith('data:'):
                if 'large' in src.lower() or 'big' in src.lower():
                    large_images += 1
        
        if missing_alt > 0:
            issues.append({
                'type': 'medium' if missing_alt < 5 else 'high',
                'title': f'Missing Alt Text ({missing_alt} images)',
                'description': f'{missing_alt} images lack alt text, affecting accessibility and image SEO.'
            })
            recommendations.append({
                'priority': 'Medium' if missing_alt < 5 else 'High',
                'title': 'Add Alt Text to Images',
                'description': f'Add descriptive alt text to {missing_alt} images.'
            })
        
        if large_images > 0:
            issues.append({
                'type': 'low',
                'title': f'Large Images Detected ({large_images})',
                'description': f'{large_images} images may be oversized, affecting page speed.'
            })
            recommendations.append({
                'priority': 'Low',
                'title': 'Optimize Image Sizes',
                'description': 'Compress and resize large images for better performance.'
            })
        
        results['issues'].extend(issues)
        results['recommendations'].extend(recommendations)
    
    def _check_links(self, soup: BeautifulSoup, results: Dict):
        """Check internal and external links"""
        issues = []
        recommendations = []
        
        links = soup.find_all('a', href=True)
        internal_links = 0
        external_links = 0
        broken_links = 0
        
        for link in links:
            href = link.get('href', '')
            if href.startswith('http'):
                external_links += 1
            elif href.startswith('/') or href.startswith('#'):
                internal_links += 1
        
        # Internal linking check
        if internal_links < 3:
            issues.append({
                'type': 'medium',
                'title': 'Low Internal Linking',
                'description': f'Only {internal_links} internal links found. Internal linking helps SEO.'
            })
            recommendations.append({
                'priority': 'Medium',
                'title': 'Increase Internal Links',
                'description': 'Add more internal links to help users and search engines navigate your site.'
            })
        
        results['issues'].extend(issues)
        results['recommendations'].extend(recommendations)
    
    def _check_content(self, soup: BeautifulSoup, results: Dict):
        """Check content quality"""
        issues = []
        recommendations = []
        
        # Get text content
        text_content = soup.get_text()
        word_count = len(text_content.split())
        
        if word_count < 300:
            issues.append({
                'type': 'medium',
                'title': 'Low Content Volume',
                'description': f'Page has only {word_count} words. Aim for at least 300 words for better SEO.'
            })
            recommendations.append({
                'priority': 'Medium',
                'title': 'Increase Content Length',
                'description': 'Add more valuable content to reach at least 300 words.'
            })
        
        # Check for content duplication
        paragraphs = soup.find_all('p')
        if len(paragraphs) < 2:
            issues.append({
                'type': 'low',
                'title': 'Minimal Content Structure',
                'description': 'Page has few paragraphs. Better structure improves readability.'
            })
            recommendations.append({
                'priority': 'Low',
                'title': 'Improve Content Structure',
                'description': 'Break content into more paragraphs for better readability.'
            })
        
        results['issues'].extend(issues)
        results['recommendations'].extend(recommendations)
    
    def _check_technical(self, response: requests.Response, results: Dict):
        """Check technical aspects"""
        issues = []
        recommendations = []
        
        # HTTPS check
        if response.url.startswith('http://'):
            issues.append({
                'type': 'critical',
                'title': 'Not Using HTTPS',
                'description': 'Website is not using HTTPS, which hurts SEO and security.'
            })
            recommendations.append({
                'priority': 'Immediate',
                'title': 'Enable HTTPS',
                'description': 'Install SSL certificate and redirect HTTP to HTTPS.'
            })
        
        # Response time check
        if response.elapsed.total_seconds() > 3:
            issues.append({
                'type': 'high',
                'title': 'Slow Response Time',
                'description': f'Page takes {response.elapsed.total_seconds():.1f}s to load. Aim for under 3 seconds.'
            })
            recommendations.append({
                'priority': 'High',
                'title': 'Improve Page Speed',
                'description': 'Optimize images, minify CSS/JS, and use caching.'
            })
        
        # Status code check
        if response.status_code != 200:
            issues.append({
                'type': 'critical',
                'title': f'HTTP Status {response.status_code}',
                'description': f'Page returned status code {response.status_code}.'
            })
            recommendations.append({
                'priority': 'Immediate',
                'title': 'Fix HTTP Status',
                'description': 'Ensure page returns 200 status code.'
            })
        
        results['issues'].extend(issues)
        results['recommendations'].extend(recommendations)
    
    def _check_performance(self, response: requests.Response, results: Dict):
        """Check performance metrics"""
        issues = []
        recommendations = []
        
        # Content size check
        content_size = len(response.content)
        if content_size > 500000:  # 500KB
            issues.append({
                'type': 'medium',
                'title': 'Large Page Size',
                'description': f'Page is {content_size/1000:.1f}KB. Large pages load slower.'
            })
            recommendations.append({
                'priority': 'Medium',
                'title': 'Reduce Page Size',
                'description': 'Compress images, minify code, and remove unnecessary elements.'
            })
        
        results['issues'].extend(issues)
        results['recommendations'].extend(recommendations)
    
    def _calculate_score(self, results: Dict) -> int:
        """Calculate overall SEO score"""
        base_score = 100
        
        # Deduct points for issues
        for issue in results['issues']:
            if issue['type'] == 'critical':
                base_score -= 20
            elif issue['type'] == 'high':
                base_score -= 15
            elif issue['type'] == 'medium':
                base_score -= 10
            elif issue['type'] == 'low':
                base_score -= 5
        
        # Bonus for good performance
        if results.get('response_time', 0) < 2:
            base_score += 5
        if results.get('status_code') == 200:
            base_score += 5
        
        return max(0, min(100, base_score))
    
    def _get_grade(self, score: int) -> str:
        """Convert score to letter grade"""
        if score >= 90:
            return 'A+'
        elif score >= 80:
            return 'A'
        elif score >= 70:
            return 'B'
        elif score >= 60:
            return 'C'
        elif score >= 50:
            return 'D'
        else:
            return 'F'
    
    def generate_report(self, results: Dict) -> str:
        """Generate a formatted report"""
        report = f"""
SEO Health Check Report
{'='*50}
Website: {results['url']}
Date: {results['timestamp']}
Score: {results['score']}/100 ({results['grade']})
Response Time: {results.get('response_time', 0):.2f}s

ISSUES FOUND ({len(results['issues'])}):
{'-'*30}
"""
        
        for issue in results['issues']:
            report += f"• {issue['title']} ({issue['type'].upper()})\n"
            report += f"  {issue['description']}\n\n"
        
        report += f"""
RECOMMENDATIONS ({len(results['recommendations'])}):
{'-'*30}
"""
        
        for rec in results['recommendations']:
            report += f"• {rec['title']} ({rec['priority']})\n"
            report += f"  {rec['description']}\n\n"
        
        report += f"""
TECHNICAL DETAILS:
{'-'*30}
Status Code: {results.get('status_code', 'N/A')}
Response Time: {results.get('response_time', 0):.2f}s
Content Size: {len(results.get('content', ''))} characters

For professional SEO optimization services, contact SEOWebster
"""
        
        return report

def main():
    parser = argparse.ArgumentParser(description='SEO Health Checker Tool')
    parser.add_argument('url', help='Website URL to analyze')
    parser.add_argument('--output', '-o', help='Output file for report')
    parser.add_argument('--json', action='store_true', help='Output results in JSON format')
    
    args = parser.parse_args()
    
    checker = SEOHealthChecker()
    results = checker.check_website(args.url)
    
    if 'error' in results:
        print(f"❌ Error analyzing {args.url}: {results['error']}")
        return
    
    # Display results
    print(f"\n📊 SEO Health Check Results for {args.url}")
    print(f"Score: {results['score']}/100 ({results['grade']})")
    print(f"Response Time: {results.get('response_time', 0):.2f}s")
    print(f"Issues Found: {len(results['issues'])}")
    print(f"Recommendations: {len(results['recommendations'])}")
    
    # Show critical issues first
    critical_issues = [i for i in results['issues'] if i['type'] == 'critical']
    if critical_issues:
        print(f"\n🚨 CRITICAL ISSUES ({len(critical_issues)}):")
        for issue in critical_issues:
            print(f"• {issue['title']}: {issue['description']}")
    
    # Generate report
    report = checker.generate_report(results)
    
    if args.json:
        output = json.dumps(results, indent=2)
    else:
        output = report
    
    if args.output:
        with open(args.output, 'w', encoding='utf-8') as f:
            f.write(output)
        print(f"\n📄 Report saved to {args.output}")
    else:
        print("\n" + report)

if __name__ == "__main__":
    main() 