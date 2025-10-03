import { LRUCache } from "lru-cache";

const cache = new LRUCache<string, any>({ max: 500, ttl: 60_000 });

export async function memo<T>(
  key: string,
  fn: () => Promise<T>,
  ttl = 60_000,
): Promise<T> {
  if (cache.has(key)) return cache.get(key)!;
  const data = await fn();
  cache.set(key, data, { ttl });
  return data;
}

export function delPrefix(prefix: string) {
  for (const k of cache.keys()) if (k.startsWith(prefix)) cache.delete(k);
}
