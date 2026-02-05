import 'jest-specific-snapshot';
import { endpoints, fetchApi } from '../src/api';
import * as path from 'path';

declare global {
  namespace jest {
    interface Matchers<R> {
      toMatchSpecificSnapshot(snapshotPath: string, matchers?: any): R;
    }
  }
}

describe('API Snapshot Tests', () => {
  jest.setTimeout(15000);

  endpoints.forEach(endpoint => {
    test(`${endpoint.name} API should match snapshot`, async () => {
      const data = await fetchApi(endpoint.url, endpoint.method);
      
      const filename = endpoint.name
        .toLowerCase()
        .replace(/\s+/g, '-')
        .replace(/[^a-z0-9-]/g, '');
      
      const snapshotPath = path.join(__dirname, `../responses/${filename}.snap`);
      
      expect(data).toMatchSpecificSnapshot(snapshotPath);
    });
  });
});
