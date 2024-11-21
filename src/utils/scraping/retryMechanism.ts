interface RetryConfig {
  maxRetries: number;
  backoffFactor: number;
  initialDelay: number;
  maxDelay: number;
}

export const withRetry = async <T>(
  operation: () => Promise<T>,
  config: RetryConfig
): Promise<T> => {
  let lastError: Error | null = null;
  
  for (let attempt = 0; attempt < config.maxRetries; attempt++) {
    try {
      return await operation();
    } catch (error) {
      lastError = error as Error;
      
      if (attempt < config.maxRetries - 1) {
        const delay = Math.min(
          config.initialDelay * Math.pow(config.backoffFactor, attempt),
          config.maxDelay
        );
        
        await new Promise(resolve => setTimeout(resolve, delay));
      }
    }
  }
  
  throw lastError || new Error('Operation failed after retries');
};