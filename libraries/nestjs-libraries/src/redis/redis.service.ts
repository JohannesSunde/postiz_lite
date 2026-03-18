type RedisEntry = {
  value: string;
  expiresAt?: number;
};

class EphemeralStore {
  private data = new Map<string, RedisEntry>();

  private isExpired(entry: RedisEntry) {
    return typeof entry.expiresAt === 'number' && entry.expiresAt <= Date.now();
  }

  private pruneKey(key: string) {
    const entry = this.data.get(key);
    if (entry && this.isExpired(entry)) {
      this.data.delete(key);
      return true;
    }

    return false;
  }

  async get(key: string) {
    if (this.pruneKey(key)) {
      return null;
    }

    return this.data.get(key)?.value ?? null;
  }

  async set(key: string, value: any, ...args: any[]) {
    const ttlMode = String(args[0] || '').toUpperCase();
    const ttlValue = Number(args[1] || 0);
    const entry: RedisEntry = {
      value: String(value),
    };

    if (ttlMode === 'EX' && ttlValue > 0) {
      entry.expiresAt = Date.now() + ttlValue * 1000;
    }

    if (ttlMode === 'PX' && ttlValue > 0) {
      entry.expiresAt = Date.now() + ttlValue;
    }

    this.data.set(key, entry);
    return 'OK';
  }

  async del(key: string) {
    return this.data.delete(key) ? 1 : 0;
  }
}

// The self-hosted deployment now assumes a single app process, so a tiny
// in-memory TTL store is enough for auth state and short-lived caches.
export const ioRedis = new EphemeralStore();
