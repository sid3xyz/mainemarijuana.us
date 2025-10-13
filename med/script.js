/* Lightweight loader to include modular JS without changing HTML references. */
(function(){
  function load(src) {
    return new Promise((resolve, reject) => {
      const s = document.createElement('script');
      s.src = src; s.defer = true; s.onload = resolve; s.onerror = reject;
      document.head.appendChild(s);
    });
  }

  // Determine base path from this script's src
  const cur = document.currentScript && document.currentScript.src || '';
  const base = cur ? cur.replace(/[^/]+$/, '') : '';
  const files = [
    base + 'core.js',
    base + 'search.js',
    base + 'calc.js',
    base + 'resources-filter.js',
    base + 'app.js'
  ];

  // Load sequentially to preserve dependencies
  (async () => {
    for(const f of files) {
      try { await load(f); } catch(_) { /* continue to attempt others */ }
    }
  })();
})();

// Theme toggle functionality

// Gonzo theme toggle: robust, accessible, persistent
document.addEventListener('DOMContentLoaded', function() {
  const toggle = document.getElementById('theme-toggle');
  if (!toggle) return;
  const body = document.body;
  // Prefer system theme if no localStorage value
  function getSystemTheme() {
    return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
  }
  function getTheme() {
    return localStorage.getItem('theme') || getSystemTheme();
  }
  function setTheme(theme) {
    body.setAttribute('data-theme', theme);
    localStorage.setItem('theme', theme);
    toggle.textContent = theme === 'dark' ? '🌙' : '☀️';
    toggle.setAttribute('aria-label', theme === 'dark' ? 'Switch to light mode' : 'Switch to dark mode');
    toggle.setAttribute('aria-pressed', theme === 'dark');
  }
  setTheme(getTheme());
  toggle.addEventListener('click', function() {
    const current = getTheme();
    const next = current === 'dark' ? 'light' : 'dark';
    setTheme(next);
  });
  // Listen for system theme changes
  window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', e => {
    if (!localStorage.getItem('theme')) setTheme(e.matches ? 'dark' : 'light');
  });
});

// Lazy-load non-critical scripts for performance optimization
const lazyLoadScripts = [
  'resources-filter.js',
  'app.js'
];

lazyLoadScripts.forEach(src => {
  const script = document.createElement('script');
  script.src = base + src;
  script.defer = true;
  script.onload = () => console.log(`${src} loaded`);
  document.body.appendChild(script);
});


