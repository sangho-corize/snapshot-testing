import axios from 'axios';
import * as fs from 'fs';
import * as path from 'path';
import * as dotenv from 'dotenv';
import { apiEndpoints } from '../api-config';

// Load environment variables
dotenv.config();

const OUTPUT_DIR = process.argv[2] || 'before'; // 'before' or 'after' from command line

// Parse custom headers from environment
const getCustomHeaders = (): Record<string, string> => {
  const headers: Record<string, string> = {};
  
  // Add Authorization header if access token is provided
  const ACCESS_TOKEN = process.env.ACCESS_TOKEN || '';
  if (ACCESS_TOKEN) {
    headers['Authorization'] = `Bearer ${ACCESS_TOKEN}`;
  }
  
  // Add custom headers from CUSTOM_HEADERS env variable (JSON format)
  if (process.env.CUSTOM_HEADERS) {
    try {
      const customHeaders = JSON.parse(process.env.CUSTOM_HEADERS);
      Object.assign(headers, customHeaders);
    } catch (error) {
      console.warn('⚠️  Failed to parse CUSTOM_HEADERS:', error);
    }
  }
  
  return headers;
};

const CUSTOM_HEADERS = getCustomHeaders();

// Normalize response to remove dynamic fields
function normalizeResponse(data: any): any {
  if (data === null || data === undefined) {
    return data;
  }

  if (Array.isArray(data)) {
    return data.map(item => normalizeResponse(item));
  }

  if (typeof data === 'object') {
    const normalized: any = {};
    for (const [key, value] of Object.entries(data)) {
      // Normalize timestamp fields
      if (key === 'timestamp' || key === 'createdAt' || key === 'updatedAt' || key === 'date') {
        normalized[key] = '2025-01-01T00:00:00.000Z';
      } else if (typeof value === 'object' && value !== null) {
        normalized[key] = normalizeResponse(value);
      } else {
        normalized[key] = value;
      }
    }
    return normalized;
  }

  return data;
}

async function captureResponses() {
  console.log(`\n📸 Capturing API responses to ${OUTPUT_DIR}/\n`);
  
  // Show configured headers
  if (Object.keys(CUSTOM_HEADERS).length > 0) {
    console.log('🔑 Custom headers configured:');
    Object.keys(CUSTOM_HEADERS).forEach(key => {
      const value = CUSTOM_HEADERS[key];
      // Mask sensitive values
      const displayValue = key.toLowerCase().includes('auth') || key.toLowerCase().includes('token')
        ? `${value.substring(0, 10)}...`
        : value;
      console.log(`   ${key}: ${displayValue}`);
    });
    console.log('');
  }

  // Create output directory
  const outputPath = path.join(process.cwd(), OUTPUT_DIR);
  if (!fs.existsSync(outputPath)) {
    fs.mkdirSync(outputPath, { recursive: true });
  }

  let successCount = 0;
  let errorCount = 0;

  for (const endpoint of apiEndpoints) {
    try {
      console.log(`    URL: ${endpoint.url}`);

      const response = await axios({
        method: 'GET',
        url: endpoint.url,
        headers: CUSTOM_HEADERS,
        validateStatus: () => true, // Accept any status code
        timeout: 10000, // 10 second timeout for external APIs
      });

      // Normalize the response
      const normalized = normalizeResponse(response.data);

      // Save to file
      const filePath = path.join(outputPath, endpoint.filename);
      fs.writeFileSync(filePath, JSON.stringify(normalized, null, 2) + '\n');

      console.log(`    ✅ Saved to ${endpoint.filename} (${response.status})\n`);
      successCount++;
    } catch (error: any) {
      console.error(`    ❌ Error: ${error.message}\n`);
      errorCount++;
    }
  }

  console.log(`📊 Summary: ${successCount} captured, ${errorCount} errors\n`);
}

async function main() {
  console.log('🌐 Testing External APIs\n');
  console.log(`📋 Total APIs to test: ${apiEndpoints.length}\n`);
  
  await captureResponses();
}

main().catch(error => {
  console.error('Error:', error);
  process.exit(1);
});
