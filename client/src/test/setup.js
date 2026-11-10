import '@testing-library/jest-dom/vitest';

// jsdom lacks these browser APIs (needed by Recharts and <dialog>)
if (!globalThis.ResizeObserver) {
  globalThis.ResizeObserver = class ResizeObserver {
    observe() {}
    unobserve() {}
    disconnect() {}
  }
}

if (typeof HTMLDialogElement !== 'undefined') {
  const proto = HTMLDialogElement.prototype
  if (!proto.showModal) {
    proto.showModal = function showModal() {
      this.setAttribute('open', '')
    }
  }
  if (!proto.close) {
    proto.close = function close() {
      this.removeAttribute('open')
      this.dispatchEvent(new Event('close'))
    }
  }
}
