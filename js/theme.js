/*
  theme.js
  Switches the site between dark and light mode.
  Loaded on index.html only (LsbuTour.html doesn't need it).

  On first visit it checks the user's OS preference.
  After that it remembers whatever they chose last time.
  The theme is applied before the page renders to avoid a flash.
*/

(function () {

  var STORAGE_KEY = 'vr-theme';
  var DARK  = 'dark';
  var LIGHT = 'light';

  // Figure out which theme to start with
  var saved      = localStorage.getItem(STORAGE_KEY);
  var prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
  var initial    = saved || (prefersDark ? DARK : LIGHT);
  applyTheme(initial);

  function applyTheme(theme) {
    // Setting data-theme="light" on <html> triggers the light-mode CSS variables.
    // Removing the attribute (empty string) goes back to dark mode.
    document.documentElement.setAttribute('data-theme', theme === LIGHT ? LIGHT : '');
  }

  function getTheme() {
    return document.documentElement.getAttribute('data-theme') === LIGHT ? LIGHT : DARK;
  }

  function setTheme(theme) {
    applyTheme(theme);
    localStorage.setItem(STORAGE_KEY, theme);
    updateButton(theme);
  }

  function toggle() {
    setTheme(getTheme() === DARK ? LIGHT : DARK);
  }

  function updateButton(theme) {
    var btn = document.getElementById('themeToggle');
    if (!btn) return;
    var isDark = theme === DARK;
    btn.textContent = isDark ? '☀️' : '🌙';
    btn.title       = isDark ? 'Switch to light mode' : 'Switch to dark mode';
    btn.setAttribute('aria-label', btn.title);
  }

  document.addEventListener('DOMContentLoaded', function () {
    var btn = document.getElementById('themeToggle');
    if (btn) {
      btn.addEventListener('click', toggle);
      updateButton(getTheme());
    }
  });

  // Available globally if needed
  window.VRTheme = { toggle: toggle, setTheme: setTheme, getTheme: getTheme };

})();
