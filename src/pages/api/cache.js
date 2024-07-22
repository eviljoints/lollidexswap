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
