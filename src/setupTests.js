import '@testing-library/jest-dom';

// Silenciar warnings informativos de React Router v7 en consola durante los tests
const originalWarn = console.warn;
console.warn = (...args) => {
  const msg = args[0];
  if (typeof msg === 'string' && msg.includes('React Router Future Flag Warning')) {
    return;
  }
  originalWarn(...args);
};
