import { endpoints, fetchApi } from '../src/api';
import * as fs from 'fs';
import * as path from 'path';

const RESPONSES_DIR = path.join(__dirname, '../responses');

async function captureResponses() {
  console.log('📸 Capturing API responses and generating snapshots...\n');

  // Ensure responses directory exists
  if (!fs.existsSync(RESPONSES_DIR)) {
    fs.mkdirSync(RESPONSES_DIR, { recursive: true });
  }

  let successCount = 0;
  let errorCount = 0;

  for (const endpoint of endpoints) {
    try {
      console.log(`   Fetching: ${endpoint.name}`);
      console.log(`   URL: ${endpoint.url}`);

      const data = await fetchApi(endpoint.url, endpoint.method);

      // Create filename from endpoint name (kebab-case)
      const filename = endpoint.name
        .toLowerCase()
        .replace(/\s+/g, '-')
        .replace(/[^a-z0-9-]/g, '');
      
      const snapshotFile = path.join(RESPONSES_DIR, `${filename}.shot`);

      // Create snapshot content in the format requested by user
      // IMPORTANT: Matches the name in __tests__/api.test.ts
      const fullTestName = `API Snapshot Tests ${endpoint.name} API should match snapshot 1`;
      
      // Clone data while preserving array/object type
      const dataWithMatchers = Array.isArray(data) ? [...data] : (typeof data === 'object' && data !== null ? { ...data } : data);
      
      // Inject matchers into the data if they exist in the config
      if (endpoint.matchers && typeof dataWithMatchers === 'object' && dataWithMatchers !== null) {
        for (const [key, type] of Object.entries(endpoint.matchers)) {
          if (Object.prototype.hasOwnProperty.call(dataWithMatchers, key)) {
            // @ts-ignore - This matches Jest's "Any<Type>" format for snapshots
            dataWithMatchers[key] = `Any<${type}>`;
          }
        }
      }

      // Use pretty-format to match Jest's snapshot formatting exactly
      const { format } = require('pretty-format');
      let formattedData = format(dataWithMatchers, {
        indent: 2,
        printBasicPrototype: false,
        escapeString: false,
      });

      // Remove quotes around "Any<Type>" to match Jest's raw identifier format in snapshots
      formattedData = formattedData.replace(/"Any<(String|Number|Date|Boolean|Array|Object)>"/g, 'Any<$1>');

      // Check if data is simple (empty array, null, empty string, single line)
      const isSimpleValue = 
        dataWithMatchers === null ||
        dataWithMatchers === '' ||
        (Array.isArray(dataWithMatchers) && dataWithMatchers.length === 0) ||
        !formattedData.includes('\n');

      // Format snapshot based on complexity
      let snapshotContent: string;
      if (isSimpleValue) {
        // Single-line format for simple values
        snapshotContent = `// Jest Snapshot v1, https://goo.gl/fbAQLP\n\n` +
          `exports[\`${fullTestName}\`] = \`${formattedData}\`;\n`;
      } else {
        // Multi-line format for complex values
        snapshotContent = `// Jest Snapshot v1, https://goo.gl/fbAQLP\n\n` +
          `exports[\`${fullTestName}\`] = \`\n${formattedData}\n\`;\n`;
      }

      // Write individual snapshot file (.snap format)
      fs.writeFileSync(snapshotFile, snapshotContent);

      console.log(`   ✅ Saved → responses/${filename}.shot\n`);
      successCount++;
    } catch (error: any) {
      console.error(`   ❌ Error: ${error.message}\n`);
      errorCount++;
    }
  }

  console.log(`\n📊 Summary:`);
  console.log(`   ✅ Captured: ${successCount}`);
  console.log(`   ❌ Errors: ${errorCount}`);
  console.log(`\n💾 Snapshots saved to: responses/\n`);
}

captureResponses().catch(error => {
  console.error('❌ Capture failed:', error);
  process.exit(1);
});
