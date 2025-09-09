// Simplified RSS Proxy Server for real-time sports updates
// This handles CORS issues when fetching from external RSS feeds

const express = require('express');
const cors = require('cors');
const https = require('https');
const http = require('http');
const { URL } = require('url');

const app = express();
const port = process.env.PORT || 3001;

// Enable CORS for all origins
app.use(cors());
app.use(express.json());

// Simple XML to JSON parser (basic functionality)
function parseXMLToJSON(xmlString) {
  try {
    // This is a very basic parser - for production use a proper XML parser
    const items = [];
    const titleMatches = xmlString.match(/<title><!\[CDATA\[(.*?)\]\]><\/title>|<title>(.*?)<\/title>/gi);
    const linkMatches = xmlString.match(/<link>(.*?)<\/link>/gi);
    const descMatches = xmlString.match(/<description><!\[CDATA\[(.*?)\]\]><\/description>|<description>(.*?)<\/description>/gi);
    
    if (titleMatches) {
      titleMatches.forEach((title, index) => {
        const cleanTitle = title.replace(/<title><!\[CDATA\[|\]\]><\/title>|<title>|<\/title>/gi, '');
        const link = linkMatches && linkMatches[index] ? linkMatches[index].replace(/<link>|<\/link>/gi, '') : '';
        const description = descMatches && descMatches[index] ? descMatches[index].replace(/<description><!\[CDATA\[|\]\]><\/description>|<description>|<\/description>/gi, '') : '';
        
        if (cleanTitle.trim()) {
          items.push({
            id: `item_${index}`,
            title: cleanTitle.trim(),
            description: description.trim(),
            link: link.trim(),
            pubDate: new Date().toISOString()
          });
        }
      });
    }
    
    return { items };
  } catch (error) {
    console.error('XML parsing error:', error);
    return { items: [] };
  }
}

// RSS Proxy endpoint
app.get('/api/rss-proxy', async (req, res) => {
  try {
    const { url } = req.query;
    
    if (!url) {
      return res.status(400).json({ error: 'URL parameter is required' });
    }

    // Validate URL to prevent abuse
    const allowedDomains = [
      'bcci.tv',
      'iplt20.com', 
      'icc-cricket.com',
      'fifa.com',
      'bwfbadminton.com',
      'olympics.com',
      'worldathletics.org',
      'espncricinfo.com',
      'feeds.feedburner.com',
      'sports.ndtv.com',
      'the-aiff.com',
      'indiansuperleague.com',
      'badmintonindia.org',
      'hockeyindia.org',
      'indianathletics.in',
      'aitatennis.com'
    ];

    const urlObj = new URL(url);
    const isAllowed = allowedDomains.some(domain => 
      urlObj.hostname.includes(domain) || urlObj.hostname.endsWith(domain)
    );

    if (!isAllowed) {
      return res.status(403).json({ error: 'Domain not allowed' });
    }

    // Fetch RSS feed using native Node.js modules
    const fetchRSS = (url) => {
      return new Promise((resolve, reject) => {
        const client = url.startsWith('https:') ? https : http;
        const request = client.get(url, {
          headers: {
            'User-Agent': 'VIKSORASPORTS-RSS-Proxy/1.0',
            'Accept': 'application/rss+xml, application/xml, text/xml'
          },
          timeout: 10000
        }, (response) => {
          if (response.statusCode !== 200) {
            reject(new Error(`HTTP ${response.statusCode}: ${response.statusMessage}`));
            return;
          }

          let data = '';
          response.on('data', chunk => data += chunk);
          response.on('end', () => resolve(data));
        });

        request.on('error', reject);
        request.on('timeout', () => {
          request.destroy();
          reject(new Error('Request timeout'));
        });
      });
    };

    const xmlText = await fetchRSS(url);
    const parsed = parseXMLToJSON(xmlText);
    
    res.json({
      success: true,
      source: urlObj.hostname,
      itemCount: parsed.items.length,
      items: parsed.items.slice(0, 10), // Limit to 10 items
      fetchedAt: new Date().toISOString()
    });

  } catch (error) {
    console.error('RSS Proxy Error:', error);
    res.status(500).json({
      error: 'Failed to fetch RSS feed',
      message: error.message,
      timestamp: new Date().toISOString()
    });
  }
});

// Health check endpoint
app.get('/health', (req, res) => {
  res.json({ 
    status: 'healthy', 
    timestamp: new Date().toISOString(),
    service: 'RSS Proxy Server'
  });
});

// Start server
if (require.main === module) {
  app.listen(port, () => {
    console.log(`RSS Proxy Server running on port ${port}`);
    console.log(`Health check: http://localhost:${port}/health`);
  });
}

module.exports = app;