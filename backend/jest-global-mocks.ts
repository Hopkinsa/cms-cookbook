Object.defineProperty(document, 'doctype', {
  value: '<!DOCTYPE html>',
});
Object.defineProperty(window, 'getComputedStyle', {
  value: () => {
    return {
      display: 'none',
      appearance: ['-webkit-appearance'],
    };
  },
});
/**
 * ISSUE: https://github.com/angular/material2/issues/7101
 * Workaround for JSDOM missing transform property
 */
Object.defineProperty(document.body.style, 'transform', {
  value: () => {
    return {
      enumerable: true,
      configurable: true,
    };
  },
});

// Polyfill TextEncoder/TextDecoder for dependencies that require them (e.g., cuid2)
if (typeof (global as any).TextEncoder === 'undefined') {
  const util = require('util');
  (global as any).TextEncoder = util.TextEncoder;
  (global as any).TextDecoder = util.TextDecoder;
}
