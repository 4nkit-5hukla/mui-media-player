import "@testing-library/jest-dom";

// Mock HTMLMediaElement methods that are not implemented in JSDOM
if (typeof window !== "undefined") {
  window.HTMLMediaElement.prototype.play = () => Promise.resolve();
  window.HTMLMediaElement.prototype.pause = () => {};
  window.HTMLMediaElement.prototype.load = () => {};
}
