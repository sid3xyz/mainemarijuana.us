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

