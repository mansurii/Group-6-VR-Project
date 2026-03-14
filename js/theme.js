/*
  theme.js
  Handles switching between dark mode and light mode.

  How it works:
  - When the page first loads, it checks if the user previously chose
    a theme. If they did, it uses that. If not, it checks their OS setting.
  - It applies the theme before the page renders to avoid a flash of
    the wrong colours (this is called FOUC — Flash of Unstyled Content).
  - The toggle button in the header calls toggle() to flip between modes.
  - The choice is saved to localStorage so it persists between page loads.
*/

(function () {

  const STORAGE_KEY = 'vr-theme';
  const DARK  = 'dark';
  const LIGHT = 'light';

  // Check what was saved last time, fall back to OS preference
  const saved      = localStorage.getItem(STORAGE_KEY);
  const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
  const initial    = saved || (prefersDark ? DARK : LIGHT);

  // Apply right away so there's no colour flash
  applyTheme(initial);


  // Sets the data-theme attribute on <html>
  // styles.css watches this to switch colour variables
  function applyTheme(theme) {
    document.documentElement.setAttribute('data-theme', theme === LIGHT ? LIGHT : '');
  }

  // Returns 'dark' or 'light' based on the current attribute
  function getTheme() {
    return document.documentElement.getAttribute('data-theme') === LIGHT ? LIGHT : DARK;
  }

  // Sets a new theme and saves it
  function setTheme(theme) {
    applyTheme(theme);
    localStorage.setItem(STORAGE_KEY, theme);
    updateButton(theme);
  }

  // Flips between dark and light
  function toggle() {
    setTheme(getTheme() === DARK ? LIGHT : DARK);
  }

  // Updates the button emoji and tooltip to match the current theme
  function updateButton(theme) {
    const btn = document.getElementById('themeToggle');
    if (!btn) return;
    const isDark = theme === DARK;
    btn.textContent = isDark ? '☀️' : '🌙';
    btn.title = isDark ? 'Switch to light mode' : 'Switch to dark mode';
    btn.setAttribute('aria-label', btn.title);
  }

  // Wire up the button once the DOM is ready
  document.addEventListener('DOMContentLoaded', function () {
    const btn = document.getElementById('themeToggle');
    if (btn) {
      btn.addEventListener('click', toggle);
      updateButton(getTheme());
    }
  });

  // Make toggle available globally in case you want to call it from elsewhere
  window.VRTheme = { toggle, setTheme, getTheme };

})();
