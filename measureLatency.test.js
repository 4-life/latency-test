import { test } from 'node:test';
import assert from 'node:assert/strict';
import { measureLatency } from './measureLatency.js';
import { REQUESTS } from './constants.js';

const URL = 'https://example.com';

function createFetch(sizes, delayMs = 0) {
  const calls = [];
  let i = 0;
  const fetchFn = async (url, options) => {
    calls.push({ url, options });
    const size = sizes[i++ % sizes.length];
    if (delayMs) {
      await new Promise((resolve) => setTimeout(resolve, delayMs));
    }
    return { ok: true, status: 200, arrayBuffer: async () => new ArrayBuffer(size) };
  };
  return { fetchFn, calls };
}

test('makes exactly REQUESTS calls to the given url', async () => {
  const { fetchFn, calls } = createFetch([100]);
  await measureLatency(URL, fetchFn);
  assert.equal(calls.length, REQUESTS);
  for (const call of calls) {
    assert.equal(call.url, URL);
  }
});

test('returns total downloaded size', async () => {
  const { fetchFn } = createFetch([100, 300]);
  const [, size] = await measureLatency(URL, fetchFn);
  assert.equal(size, (REQUESTS / 2) * (100 + 300));
});

test('returns average request time', async () => {
  const { fetchFn } = createFetch([0], 20);
  const [avgMs] = await measureLatency(URL, fetchFn);
  assert.ok(avgMs >= 15, `expected avg >= 15ms, got ${avgMs}`);
  assert.ok(avgMs < 200, `expected avg < 200ms, got ${avgMs}`);
});

test('requests run sequentially, not in parallel', async () => {
  let active = 0;
  let maxActive = 0;
  const fetchFn = async () => {
    active++;
    maxActive = Math.max(maxActive, active);
    await new Promise((resolve) => setTimeout(resolve, 5));
    active--;
    return { ok: true, status: 200, arrayBuffer: async () => new ArrayBuffer(1) };
  };
  await measureLatency(URL, fetchFn);
  assert.equal(maxActive, 1);
});

test('throws on non-2xx response', async () => {
  const fetchFn = async () => ({
    ok: false,
    status: 404,
    arrayBuffer: async () => new ArrayBuffer(10),
  });
  await assert.rejects(measureLatency(URL, fetchFn), /HTTP 404/);
});

test('propagates fetch errors', async () => {
  const fetchFn = async () => {
    throw new Error('network down');
  };
  await assert.rejects(measureLatency(URL, fetchFn), /network down/);
});
