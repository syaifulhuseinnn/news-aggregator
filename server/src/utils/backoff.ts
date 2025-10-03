export async function withBackoff<T>(
  fn: () => Promise<T>,
  opts: { retries?: number } = {},
) {
  const retries = opts.retries ?? 4;
  let attempt = 0;
  while (true) {
    try {
      return await fn();
    } catch (e: any) {
      if (attempt >= retries) throw e;
      const base = 300; // ms
      const delay = Math.min(5000, base * 2 ** attempt) + Math.random() * 200;
      await new Promise((r) => setTimeout(r, delay));
      attempt++;
    }
  }
}
