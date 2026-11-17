import { test } from 'node:test';
import assert from 'node:assert/strict';
import { formatSpeed } from './formatSpeed.js';
import { REQUESTS } from './constants.js';

const MB = 1024 * 1024;

test('converts 1 MB in 1000 ms total to 1.00 МБ/с', () => {
  assert.equal(formatSpeed(1000 / REQUESTS, MB), '1.00 МБ/с');
});

test('converts 5 MB in 500 ms total to 10.00 МБ/с', () => {
  assert.equal(formatSpeed(500 / REQUESTS, 5 * MB), '10.00 МБ/с');
});

test('rounds to two decimals', () => {
  assert.equal(formatSpeed(3000 / REQUESTS, MB), '0.33 МБ/с');
});
