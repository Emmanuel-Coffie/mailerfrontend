import "@testing-library/jest-dom/vitest";
import { afterEach } from "vitest";
import { cleanup, configure } from "@testing-library/react";
// Lazy route chunks can take longer than Testing Library's 1s default on cold Windows runs.
configure({ asyncUtilTimeout: 5000 });
afterEach(cleanup);
global.ResizeObserver = class {
  observe() {}
  unobserve() {}
  disconnect() {}
};
window.matchMedia ||= () => ({
  matches: false,
  addListener() {},
  removeListener() {},
  addEventListener() {},
  removeEventListener() {},
  dispatchEvent() {
    return false;
  },
  media: "",
  onchange: null,
});
