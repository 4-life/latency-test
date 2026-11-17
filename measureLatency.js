import { REQUESTS } from './constants.js';

export async function measureLatency(url, fetchFn = fetch) {
  let totalTime = 0;
  let size = 0;

  for (let i = 0; i < REQUESTS; i++) {
    const start = performance.now();
    const res = await fetchFn(url, { cache: 'no-store' });
    if (!res.ok) {
      throw new Error(`HTTP ${res.status}`);
    }
    const body = await res.arrayBuffer();
    totalTime += performance.now() - start;
    size += body.byteLength;
  }

  return [totalTime / REQUESTS, size];
}
