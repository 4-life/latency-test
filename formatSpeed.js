import { REQUESTS } from './constants.js';

export function formatSpeed(avgMs, totalBytes) {
  const totalSeconds = (avgMs * REQUESTS) / 1000;
  const megabytesPerSecond = totalBytes / 1024 / 1024 / totalSeconds;
  return `${megabytesPerSecond.toFixed(2)} МБ/с`;
}
