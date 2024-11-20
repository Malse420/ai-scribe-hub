import { AES, enc } from 'crypto-js';

const ENCRYPTION_KEY = 'ai-scribe-hub-local-storage';

export const LocalStorageManager = {
  setEncrypted: (key: string, value: any) => {
    const encrypted = AES.encrypt(JSON.stringify(value), ENCRYPTION_KEY).toString();
    localStorage.setItem(key, encrypted);
  },

  getEncrypted: (key: string) => {
    const encrypted = localStorage.getItem(key);
    if (!encrypted) return null;
    
    try {
      const decrypted = AES.decrypt(encrypted, ENCRYPTION_KEY).toString(enc.Utf8);
      return JSON.parse(decrypted);
    } catch (error) {
      console.error('Failed to decrypt:', error);
      return null;
    }
  },

  remove: (key: string) => {
    localStorage.removeItem(key);
  }
};