import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class LocalStorageService {
  constructor() {}

  setItem(key: string, value: any): void {
    // Check if window and localStorage are available
    if (typeof window !== 'undefined' && window.localStorage) {
      window.localStorage.setItem(key, JSON.stringify(value)); // Stringify value before storing
    }
  }

  getItem(key: string): any {
    // Check if window and localStorage are available
    if (typeof window !== 'undefined' && window.localStorage) {
      const item = window.localStorage.getItem(key);
      return item ? JSON.parse(item) : null; // Parse JSON if the item exists
    }
    return null; // Return null if localStorage is not available
  }

  removeItem(key: string): void {
    // Check if window and localStorage are available
    if (typeof window !== 'undefined' && window.localStorage) {
      window.localStorage.removeItem(key);
    }
  }

  clear(): void {
    localStorage.clear();
  }
}
