/* eslint-disable no-undef */
class LocalStorageMock {
  constructor() {
    this.store = {};
    this.keys = [];
  }

  clear() {
    this.keys = [];
    this.store = {};
  }

  getItem(key) {
    return this.store[key] || null;
  }

  setItem(key, value) {
    this.store[key] = String(value);
    this.keys.push(key);
  }

  removeItem(key) {
    delete this.store[key];

    const index = this.keys.indexOf(key);
    index >= 0 && this.keys.splice(key, 1);
  }

  key(i) {
    return this.keys[i];
  }

  get length() {
    return this.keys.length;
  }
}

global.localStorage = new LocalStorageMock();
