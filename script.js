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

  // --- Scroll-Spy for TOC ---
  document.addEventListener('DOMContentLoaded', () => {
    const tocLinks = document.querySelectorAll('.toc-nav__list a');
    if (tocLinks.length === 0) return;

    const sections = Array.from(tocLinks).map(link => {
      const id = link.getAttribute('href').substring(1);
      return document.getElementById(id);
    }).filter(Boolean);

    const observer = new IntersectionObserver(entries => {
      entries.forEach(entry => {
        const id = entry.target.getAttribute('id');
        const link = document.querySelector(`.toc-nav__list a[href="#${id}"]`);
        if (entry.isIntersecting) {
          tocLinks.forEach(l => l.classList.remove('active'));
          link.classList.add('active');
        }
      });
    }, { rootMargin: "-50% 0px -50% 0px" }); // Highlight when section is in the middle of the screen

    sections.forEach(section => {
      observer.observe(section);
    });
  });

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


