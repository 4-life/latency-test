import { measureLatency } from './measureLatency.js';
import { formatSpeed } from './formatSpeed.js';

const url = process.argv[2];
if (!url) {
  console.error('Вставьте ссылку: node index.js <url>');
  process.exit(1);
}

try {
  const [avgMs, totalBytes] = await measureLatency(url);
  console.log(`Скорость: ${formatSpeed(avgMs, totalBytes)}`);
} catch (error) {
  console.error(`Ошибка запроса: ${error.message}`);
  process.exit(1);
}
