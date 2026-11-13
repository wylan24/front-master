export type Theme = "light" | "dark";

/** localStorage key for the learner's chosen theme. */
export const THEME_STORAGE_KEY = "theme";

/**
 * Runs in <head> before the page is painted, so the right colours show from
 * the first frame. A saved choice wins; otherwise follow the system setting.
 * Kept as plain ES5 because it runs before any of the app's code loads.
 */
export const THEME_INIT_SCRIPT = `(function () {
  var theme = "light";
  try {
    var saved = localStorage.getItem("${THEME_STORAGE_KEY}");
    if (saved === "light" || saved === "dark") {
      theme = saved;
    } else if (window.matchMedia("(prefers-color-scheme: dark)").matches) {
      theme = "dark";
    }
  } catch (error) {
    // Storage blocked: fall back to light.
  }
  document.documentElement.dataset.theme = theme;
})();`;
