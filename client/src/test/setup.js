import '@testing-library/jest-dom/vitest';

// jsdom has no IntersectionObserver; motion's `whileInView` (used by the Reveal effect) needs one.
if (typeof globalThis.IntersectionObserver === 'undefined') {
  globalThis.IntersectionObserver = class IntersectionObserver {
    observe() {}
    unobserve() {}
    disconnect() {}
    takeRecords() { return [] }
  }
}
