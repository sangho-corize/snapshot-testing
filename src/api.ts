import axios from 'axios';
import * as dotenv from 'dotenv';

dotenv.config();

export interface ApiEndpoint {
  name: string;
  url: string;
  method?: 'GET' | 'POST' | 'PUT' | 'DELETE';
  matchers?: Record<string, 'String' | 'Number' | 'Date' | 'Boolean' | 'Array' | 'Object'>;
}

export async function fetchApi(url: string, method: string = 'GET'): Promise<any> {
  const headers: Record<string, string> = {};
  
  if (process.env.ACCESS_TOKEN) {
    headers['Authorization'] = `Bearer ${process.env.ACCESS_TOKEN}`;
  }
  
  if (process.env.CUSTOM_HEADERS) {
    try {
      Object.assign(headers, JSON.parse(process.env.CUSTOM_HEADERS));
    } catch (e) {
      console.warn('Failed to parse CUSTOM_HEADERS');
    }
  }
  
  const response = await axios({
    method: method as any,
    url,
    headers,
    timeout: 10000,
  });
  
  return response.data;
}


export const endpoints: ApiEndpoint[] = [
  {
    name: 'IP Geolocation',
    url: 'https://ipinfo.io/161.185.160.93/geo',
  },
  {
    name: 'ZIP Code Info',
    url: 'https://api.zippopotam.us/us/33162',
  },
];

