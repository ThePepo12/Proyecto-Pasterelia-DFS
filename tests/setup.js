// tests/setup.js - Configuración global para entorno Jasmine + Karma

beforeEach(() => {
  // Limpiar localStorage antes de cada prueba para aislamiento
  try {
    if (typeof window !== 'undefined' && window.localStorage) {
      window.localStorage.clear();
    }
  } catch (e) {
    // Si localStorage no estuviera disponible, continuar
  }
});

afterEach(() => {
  // Limpieza adicional post-test
  try {
    if (typeof window !== 'undefined' && window.localStorage) {
      window.localStorage.clear();
    }
  } catch (e) {}
});
