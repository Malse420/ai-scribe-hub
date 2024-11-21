interface RateLimitConfig {
  requestsPerMinute: number;
  delayBetweenRequests: number;
  maxConcurrent: number;
}

class RateLimiter {
  private queue: (() => Promise<void>)[] = [];
  private running = 0;
  private lastRequestTime = 0;
  private config: RateLimitConfig;

  constructor(config: RateLimitConfig) {
    this.config = config;
  }

  async execute<T>(task: () => Promise<T>): Promise<T> {
    return new Promise((resolve, reject) => {
      this.queue.push(async () => {
        try {
          const result = await this.runWithDelay(task);
          resolve(result);
        } catch (error) {
          reject(error);
        }
      });
      this.processQueue();
    });
  }

  private async runWithDelay<T>(task: () => Promise<T>): Promise<T> {
    const now = Date.now();
    const timeSinceLastRequest = now - this.lastRequestTime;
    
    if (timeSinceLastRequest < this.config.delayBetweenRequests) {
      await new Promise(resolve => 
        setTimeout(resolve, this.config.delayBetweenRequests - timeSinceLastRequest)
      );
    }

    this.lastRequestTime = Date.now();
    return task();
  }

  private async processQueue() {
    if (this.running >= this.config.maxConcurrent || this.queue.length === 0) {
      return;
    }

    this.running++;
    const task = this.queue.shift();
    if (task) {
      try {
        await task();
      } finally {
        this.running--;
        this.processQueue();
      }
    }
  }
}

export const createRateLimiter = (config: RateLimitConfig) => new RateLimiter(config);