import '@testing-library/jest-dom';

const store = new Map();
const localStorageMock = {
  getItem: (key) => (store.has(key) ? store.get(key) : null),
  setItem: (key, value) => store.set(key, String(value)),
  removeItem: (key) => store.delete(key),
  clear: () => store.clear(),
  get length() {
    return store.size;
  },
  key: (i) => Array.from(store.keys())[i] || null
};

Object.defineProperty(globalThis, 'localStorage', {
  value: localStorageMock,
  writable: true,
  configurable: true
});

if (typeof window !== 'undefined') {
  Object.defineProperty(window, 'localStorage', {
    value: localStorageMock,
    writable: true,
    configurable: true
  });
}

const originalWarn = console.warn;
console.warn = (...args) => {
  const msg = args[0];
  if (typeof msg === 'string' && msg.includes('React Router Future Flag Warning')) {
    return;
  }
  originalWarn(...args);
};
