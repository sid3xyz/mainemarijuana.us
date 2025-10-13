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

// Lightweight loader for other scripts
(function() {
  'use strict';

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
})();

/* Modern Theme Engine */
(function() {
  'use strict';

  // --- Decoupled Theme Toggle Handler ---
  const themeToggle = document.getElementById('theme-toggle');
  if (themeToggle) {
    themeToggle.addEventListener('click', () => {
      const currentTheme = document.documentElement.getAttribute('data-theme');
      const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
      document.documentElement.setAttribute('data-theme', newTheme);
      localStorage.setItem('theme', newTheme);
      themeToggle.textContent = newTheme === 'dark' ? '🌙' : '☀️';
      themeToggle.setAttribute('aria-label', `Switch to ${newTheme === 'dark' ? 'light' : 'dark'} mode`);
    });
  }
})();


