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
document.addEventListener('DOMContentLoaded', () => {
  const toggle = document.getElementById('theme-toggle');
  if (!toggle) return; // Skip if toggle not present

  const body = document.body;
  const currentTheme = localStorage.getItem('theme') || 'light';

  if (currentTheme === 'dark') {
    body.classList.add('dark-mode');
    toggle.textContent = '🌙';
    toggle.setAttribute('aria-label', 'Switch to light mode');
  } else {
    toggle.textContent = '☀️';
    toggle.setAttribute('aria-label', 'Switch to dark mode');
  }

  toggle.addEventListener('click', () => {
    body.classList.toggle('dark-mode');
    const theme = body.classList.contains('dark-mode') ? 'dark' : 'light';
    localStorage.setItem('theme', theme);
    toggle.textContent = theme === 'dark' ? '🌙' : '☀️';
    toggle.setAttribute('aria-label', theme === 'dark' ? 'Switch to light mode' : 'Switch to dark mode');
  });
});


