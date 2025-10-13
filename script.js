/* [PURGED] All previous JavaScript has been removed. A new, clean theme engine will be implemented. */
(function() {
  'use strict';

  function applyTheme(theme) {
    document.documentElement.setAttribute('data-theme', theme);
    localStorage.setItem('theme', theme);
  }

  const themeToggle = document.createElement('button');
  themeToggle.id = 'theme-toggle';
  themeToggle.setAttribute('aria-label', 'Switch theme');
  document.body.appendChild(themeToggle);

  themeToggle.addEventListener('click', () => {
    const newTheme = document.documentElement.getAttribute('data-theme') === 'dark' ? 'light' : 'dark';
    applyTheme(newTheme);
  });

  const currentTheme = localStorage.getItem('theme');
  const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;

  applyTheme(currentTheme || (prefersDark ? 'dark' : 'light'));
})();


