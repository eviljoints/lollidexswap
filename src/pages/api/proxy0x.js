import axios from 'axios';
import axiosRetry from 'axios-retry';
import Bottleneck from 'bottleneck';

axiosRetry(axios, { retries: 3, retryDelay: axiosRetry.exponentialDelay });

class Cache {
  constructor() {
    this.cache = {};
    this.timeouts = {};
  }

  set(key, value, ttl) {
    this.cache[key] = value;
    if (this.timeouts[key]) {
      clearTimeout(this.timeouts[key]);
    }
    this.timeouts[key] = setTimeout(() => {
      delete this.cache[key];
      delete this.timeouts[key];
    }, ttl);
  }

  get(key) {
    return this.cache[key];
  }
}

const cache = new Cache();

const limiter = new Bottleneck({
  minTime: 200,
  maxConcurrent: 1,
});

async function fetchWithRateLimit(url, headers) {
  return limiter.schedule(() => axios.get(url, { headers }));
}

export default async function handler(req, res) {
  const { method } = req;
  const { url } = req.query;

  if (!url) {
    return res.status(400).json({ error: 'URL query parameter is required' });
  }

  if (method === 'GET') {
    try {
      console.log('0x API Key:', process.env.NEXT_PUBLIC_0X_API_KEY);

      const headers = {
        'Accept': 'application/json',
        '0x-api-key': process.env.NEXT_PUBLIC_0X_API_KEY,
      };

      console.log('Request Headers:', headers);

      const cachedResponse = cache.get(url);
      if (cachedResponse) {
        console.log('Cache hit:', url);
        return res.status(200).json(cachedResponse);
      }

      console.log('Cache miss:', url);
      const response = await fetchWithRateLimit(url, headers);

      console.log('API Response:', response.data);

      cache.set(url, response.data, 30000); // Cache response for 30 seconds

      res.status(200).json(response.data);
    } catch (error) {
      console.error('Error fetching data:', error.response?.data || error.message);
      res.status(error.response?.status || 500).json({ error: error.response?.data || error.message });
    }
  } else {
    res.setHeader('Allow', ['GET']);
    res.status(405).end(`Method ${method} Not Allowed`);
  }
}
