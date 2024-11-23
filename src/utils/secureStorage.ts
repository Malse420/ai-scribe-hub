import { AES, enc } from 'crypto-js';

export class SecureStorageManager {
  private readonly storagePrefix: string;
  private readonly encryptionKey: string;

  constructor(prefix: string = 'ai-scribe-hub') {
    this.storagePrefix = prefix;
    // Use a combination of extension ID and installation time as encryption key
    this.encryptionKey = this.generateSecureKey();
  }

  private generateSecureKey(): string {
    const installTime = localStorage.getItem(`${this.storagePrefix}-install-time`);
    if (!installTime) {
      const newInstallTime = Date.now().toString();
      localStorage.setItem(`${this.storagePrefix}-install-time`, newInstallTime);
      return `${chrome.runtime.id}-${newInstallTime}`;
    }
    return `${chrome.runtime.id}-${installTime}`;
  }

  public async setItem(key: string, value: any): Promise<void> {
    try {
      const serializedValue = JSON.stringify(value);
      const encrypted = AES.encrypt(serializedValue, this.encryptionKey).toString();
      localStorage.setItem(`${this.storagePrefix}-${key}`, encrypted);
    } catch (error) {
      console.error('Error storing encrypted data:', error);
      throw new Error('Failed to store data securely');
    }
  }

  public async getItem<T>(key: string): Promise<T | null> {
    try {
      const encrypted = localStorage.getItem(`${this.storagePrefix}-${key}`);
      if (!encrypted) return null;
      
      const decrypted = AES.decrypt(encrypted, this.encryptionKey).toString(enc.Utf8);
      return JSON.parse(decrypted) as T;
    } catch (error) {
      console.error('Error retrieving encrypted data:', error);
      return null;
    }
  }

  public async removeItem(key: string): Promise<void> {
    localStorage.removeItem(`${this.storagePrefix}-${key}`);
  }

  public async clear(): Promise<void> {
    const keys = Object.keys(localStorage);
    keys.forEach(key => {
      if (key.startsWith(this.storagePrefix)) {
        localStorage.removeItem(key);
      }
    });
  }
}

// Export a singleton instance
export const secureStorage = new SecureStorageManager();