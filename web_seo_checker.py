#!/usr/bin/env python3
"""
Web-based SEO Health Checker
Flask web application for the SEO health checker tool
"""

from flask import Flask, render_template_string, request, jsonify
from seo_health_checker import SEOHealthChecker
import json

app = Flask(__name__)
checker = SEOHealthChecker()

# HTML template for the web interface
HTML_TEMPLATE = """
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>SEO Health Checker - Real Website Analysis</title>
    <script src="https://cdn.tailwindcss.com"></script>
    <style>
        .loading { display: none; }
        .results { display: none; }
        .error { display: none; }
    </style>
</head>
<body class="bg-gray-50">
    <!-- Hero Section -->
    <section class="py-20 bg-gradient-to-br from-green-600 to-emerald-600">
        <div class="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <h1 class="text-4xl md:text-5xl lg:text-6xl font-black tracking-tight text-white mb-6 leading-tight">
                Real SEO Health Checker
            </h1>
            <p class="text-xl md:text-2xl text-green-100 mb-8 max-w-3xl mx-auto">
                Analyze live websites for real SEO issues. Our tool checks 50+ critical factors and provides actionable recommendations.
            </p>
            
            <div class="bg-white/10 rounded-xl p-6 backdrop-blur-sm mb-8">
                <div class="grid md:grid-cols-3 gap-6 text-sm text-green-100">
                    <div class="flex items-center justify-center">
                        <svg class="w-5 h-5 text-green-400 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"></path>
                        </svg>
                        Live Analysis
                    </div>
                    <div class="flex items-center justify-center">
                        <svg class="w-5 h-5 text-green-400 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"></path>
                        </svg>
                        50+ SEO Factors
                    </div>
                    <div class="flex items-center justify-center">
                        <svg class="w-5 h-5 text-green-400 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"></path>
                        </svg>
                        Actionable Insights
                    </div>
                </div>
            </div>
        </div>
    </section>

    <!-- SEO Health Checker Tool -->
    <section class="py-20 bg-gray-50">
        <div class="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
            <div class="bg-white rounded-2xl shadow-xl p-8">
                <div class="text-center mb-8">
                    <h2 class="text-3xl font-bold text-gray-900 mb-4">
                        Check Your Website's SEO Health
                    </h2>
                    <p class="text-lg text-gray-600">
                        Enter your website URL below and get a comprehensive SEO analysis in minutes
                    </p>
                </div>

                <!-- URL Input Form -->
                <div class="max-w-2xl mx-auto mb-8">
                    <form id="seo-checker-form" class="flex flex-col sm:flex-row gap-4">
                        <div class="flex-1">
                            <input 
                                type="url" 
                                id="website-url" 
                                placeholder="https://yourwebsite.com"
                                class="w-full px-4 py-4 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 transition-colors text-lg"
                                required
                            />
                        </div>
                        <button 
                            type="submit" 
                            id="check-seo-btn"
                            class="px-8 py-4 bg-gradient-to-r from-green-600 to-emerald-600 text-white font-semibold rounded-lg hover:from-green-700 hover:to-emerald-700 transform transition-all duration-200 hover:scale-105 shadow-lg"
                        >
                            Check SEO Health
                        </button>
                    </form>
                </div>

                <!-- Loading State -->
                <div id="loading-state" class="loading text-center py-12">
                    <div class="inline-flex items-center px-4 py-2 font-semibold leading-6 text-green-800 bg-green-100 rounded-md">
                        <svg class="animate-spin -ml-1 mr-3 h-5 w-5 text-green-800" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                            <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                            <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                        </svg>
                        Analyzing your website...
                    </div>
                </div>

                <!-- Error State -->
                <div id="error-state" class="error text-center py-12">
                    <div class="inline-flex items-center px-4 py-2 font-semibold leading-6 text-red-800 bg-red-100 rounded-md">
                        <svg class="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z"></path>
                        </svg>
                        <span id="error-message">An error occurred while analyzing the website.</span>
                    </div>
                </div>

                <!-- Results Section -->
                <div id="results-section" class="results">
                    <!-- Score Display -->
                    <div class="text-center mb-8">
                        <div class="inline-flex items-center justify-center w-32 h-32 rounded-full bg-gradient-to-r from-green-500 to-emerald-500 text-white mb-4">
                            <span id="seo-score" class="text-4xl font-bold">85</span>
                        </div>
                        <h3 id="score-title" class="text-2xl font-bold text-gray-900 mb-2">Good SEO Health</h3>
                        <p id="score-description" class="text-gray-600">Your website has solid SEO fundamentals with room for improvement</p>
                    </div>

                    <!-- Detailed Results Grid -->
                    <div class="grid md:grid-cols-2 gap-8">
                        <!-- Left Column: Issues Found -->
                        <div>
                            <h4 class="text-xl font-semibold text-gray-900 mb-4">Issues Found</h4>
                            <div id="issues-list" class="space-y-3">
                                <!-- Issues will be populated here -->
                            </div>
                        </div>

                        <!-- Right Column: Recommendations -->
                        <div>
                            <h4 class="text-xl font-semibold text-gray-900 mb-4">Priority Recommendations</h4>
                            <div id="recommendations-list" class="space-y-3">
                                <!-- Recommendations will be populated here -->
                            </div>
                        </div>
                    </div>

                    <!-- Action Buttons -->
                    <div class="text-center mt-8">
                        <button id="download-report" class="inline-flex items-center px-6 py-3 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 transform transition-all duration-200 hover:scale-105 mr-4">
                            <svg class="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"></path>
                            </svg>
                            Download Full Report
                        </button>
                        <a href="mailto:hello@seowebster.com" class="inline-flex items-center justify-center px-6 py-3 bg-green-600 text-white font-semibold rounded-lg hover:bg-green-700 transform transition-all duration-200 hover:scale-105">
                            Get Professional Help
                            <svg class="w-5 h-5 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7"></path>
                            </svg>
                        </a>
                    </div>
                </div>
            </div>
        </div>
    </section>

    <script>
        document.getElementById('seo-checker-form').addEventListener('submit', async (e) => {
            e.preventDefault();
            
            const url = document.getElementById('website-url').value;
            if (!url) {
                alert('Please enter a valid website URL');
                return;
            }

            // Show loading state
            document.getElementById('loading-state').style.display = 'block';
            document.getElementById('results-section').style.display = 'none';
            document.getElementById('error-state').style.display = 'none';
            
            try {
                const response = await fetch('/check-seo', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({ url: url })
                });
                
                const data = await response.json();
                
                if (data.error) {
                    throw new Error(data.error);
                }
                
                displayResults(data);
                document.getElementById('results-section').style.display = 'block';
                
            } catch (error) {
                document.getElementById('error-message').textContent = error.message;
                document.getElementById('error-state').style.display = 'block';
            } finally {
                document.getElementById('loading-state').style.display = 'none';
            }
        });

        function displayResults(data) {
            // Update score
            document.getElementById('seo-score').textContent = data.score;
            document.getElementById('score-title').textContent = data.grade + ' SEO Health';
            document.getElementById('score-description').textContent = getScoreDescription(data.score);

            // Update issues list
            const issuesList = document.getElementById('issues-list');
            issuesList.innerHTML = data.issues.map(issue => `
                <div class="flex items-start space-x-3 p-3 rounded-lg ${getIssueColor(issue.type)}">
                    <div class="flex-shrink-0 w-2 h-2 rounded-full mt-2 ${getIssueDotColor(issue.type)}"></div>
                    <div>
                        <h5 class="font-medium text-gray-900">${issue.title}</h5>
                        <p class="text-sm text-gray-600">${issue.description}</p>
                    </div>
                </div>
            `).join('');

            // Update recommendations list
            const recommendationsList = document.getElementById('recommendations-list');
            recommendationsList.innerHTML = data.recommendations.map(rec => `
                <div class="flex items-start space-x-3 p-3 rounded-lg bg-blue-50">
                    <div class="flex-shrink-0">
                        <span class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getPriorityColor(rec.priority)}">
                            ${rec.priority}
                        </span>
                    </div>
                    <div>
                        <h5 class="font-medium text-gray-900">${rec.title}</h5>
                        <p class="text-sm text-gray-600">${rec.description}</p>
                    </div>
                </div>
            `).join('');
        }

        function getScoreDescription(score) {
            if (score >= 90) return 'Excellent! Your website has outstanding SEO health.';
            if (score >= 80) return 'Good! Your website has solid SEO fundamentals with minor improvements needed.';
            if (score >= 70) return 'Fair! Your website has moderate SEO issues that need attention.';
            if (score >= 60) return 'Poor! Your website has significant SEO problems requiring immediate action.';
            return 'Critical! Your website has major SEO issues that severely impact performance.';
        }

        function getIssueColor(type) {
            const colors = {
                'critical': 'bg-red-50',
                'high': 'bg-orange-50',
                'medium': 'bg-yellow-50',
                'low': 'bg-blue-50'
            };
            return colors[type] || 'bg-gray-50';
        }

        function getIssueDotColor(type) {
            const colors = {
                'critical': 'bg-red-500',
                'high': 'bg-orange-500',
                'medium': 'bg-yellow-500',
                'low': 'bg-blue-500'
            };
            return colors[type] || 'bg-gray-500';
        }

        function getPriorityColor(priority) {
            const colors = {
                'Immediate': 'bg-red-100 text-red-800',
                'High': 'bg-orange-100 text-orange-800',
                'Medium': 'bg-yellow-100 text-yellow-800',
                'Low': 'bg-blue-100 text-blue-800'
            };
            return colors[priority] || 'bg-gray-100 text-gray-800';
        }

        // Download report functionality
        document.getElementById('download-report').addEventListener('click', () => {
            const url = document.getElementById('website-url').value;
            const score = document.getElementById('seo-score').textContent;
            
            const report = `SEO Health Check Report\nWebsite: ${url}\nScore: ${score}/100\nDate: ${new Date().toLocaleDateString()}`;
            
            const blob = new Blob([report], { type: 'text/plain' });
            const url2 = window.URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = url2;
            a.download = `seo-health-report-${url.replace(/[^a-zA-Z0-9]/g, '-')}.txt`;
            a.click();
            window.URL.revokeObjectURL(url2);
        });
    </script>
</body>
</html>
"""

@app.route('/')
def index():
    return HTML_TEMPLATE

@app.route('/check-seo', methods=['POST'])
def check_seo():
    try:
        data = request.get_json()
        url = data.get('url')
        
        if not url:
            return jsonify({'error': 'URL is required'}), 400
        
        # Run SEO health check
        results = checker.check_website(url)
        
        if 'error' in results:
            return jsonify({'error': results['error']}), 400
        
        return jsonify(results)
        
    except Exception as e:
        return jsonify({'error': str(e)}), 500

if __name__ == '__main__':
    print("🚀 Starting SEO Health Checker Web Server...")
    print("📱 Open your browser and go to: http://localhost:5000")
    print("🔍 The tool will analyze live websites for real SEO issues!")
    app.run(debug=True, host='0.0.0.0', port=5000) 