/**
 * MaineMarijuana.us - Unified JavaScript
 * Handles theme toggle, automatic heading IDs, table of contents generation, and scrollspy
 */
(function() {
  'use strict';

  // ============================================================================
  // THEME MANAGEMENT
  // ============================================================================
  
  /**
   * Apply theme to document and persist to localStorage
   */
  function applyTheme(theme) {
    document.documentElement.setAttribute('data-theme', theme);
    localStorage.setItem('theme', theme);
    
    // Update button label if it exists
    const toggle = document.getElementById('theme-toggle');
    if (toggle) {
      const isDark = theme === 'dark';
      toggle.setAttribute('aria-label', isDark ? 'Switch to light mode' : 'Switch to dark mode');
      toggle.textContent = isDark ? '🌙' : '☀️';
    }
  }

  /**
   * Initialize theme toggle functionality
   * Uses existing #theme-toggle button from HTML (doesn't create one)
   */
  function initThemeToggle() {
    const toggle = document.getElementById('theme-toggle');
    if (!toggle) return; // Page doesn't have a theme toggle

    toggle.addEventListener('click', function() {
      const currentTheme = document.documentElement.getAttribute('data-theme');
      const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
      applyTheme(newTheme);
    });

    // Set initial button state based on current theme
    const currentTheme = document.documentElement.getAttribute('data-theme');
    const isDark = currentTheme === 'dark';
    toggle.setAttribute('aria-label', isDark ? 'Switch to light mode' : 'Switch to dark mode');
    toggle.textContent = isDark ? '🌙' : '☀️';
  }

  // ============================================================================
  // AUTOMATIC HEADING IDS & ANCHOR LINKS
  // ============================================================================
  
  /**
   * Generate slug from heading text
   */
  function slugify(text) {
    return text
      .toLowerCase()
      .trim()
      .replace(/[^\w\s-]/g, '')
      .replace(/[\s_-]+/g, '-')
      .replace(/^-+|-+$/g, '');
  }

  /**
   * Add IDs to headings and create anchor links
   */
  function initHeadingAnchors() {
    const headings = document.querySelectorAll('main h2, main h3, main h4');
    
    headings.forEach(function(heading) {
      if (heading.id) return; // Already has ID
      
      const slug = slugify(heading.textContent);
      heading.id = slug;
      
      // Add anchor link
      const anchor = document.createElement('a');
      anchor.href = '#' + slug;
      anchor.className = 'heading-anchor';
      anchor.setAttribute('aria-label', 'Link to ' + heading.textContent);
      anchor.textContent = '§';
      heading.appendChild(anchor);
    });
  }

  // ============================================================================
  // TABLE OF CONTENTS GENERATION
  // ============================================================================
  
  /**
   * Generate table of contents from headings
   */
  function initTableOfContents() {
    const tocContainer = document.querySelector('[data-toc]');
    if (!tocContainer) return;

    const headings = document.querySelectorAll('main h2, main h3, main h4');
    if (headings.length === 0) return;

    const nav = document.createElement('nav');
    nav.className = 'toc';
    nav.setAttribute('aria-label', 'Table of contents');
    
    const list = document.createElement('ol');
    
    headings.forEach(function(heading) {
      const item = document.createElement('li');
      item.className = 'toc-' + heading.tagName.toLowerCase();
      
      const link = document.createElement('a');
      link.href = '#' + heading.id;
      link.textContent = heading.textContent.replace('§', '').trim();
      
      item.appendChild(link);
      list.appendChild(item);
    });
    
    nav.appendChild(list);
    tocContainer.appendChild(nav);
  }

  // ============================================================================
  // SCROLLSPY (Active TOC Links)
  // ============================================================================
  
  /**
   * Update active TOC link based on scroll position
   */
  function initScrollspy() {
    const tocLinks = document.querySelectorAll('.toc a');
    if (tocLinks.length === 0) return;

    const headings = Array.from(document.querySelectorAll('main h2, main h3, main h4'));
    const headerOffset = 120; // Adjust for fixed header

    function updateActive() {
      const scrollPos = window.scrollY + headerOffset;
      
      // Find the current heading
      let current = headings[0];
      for (let i = headings.length - 1; i >= 0; i--) {
        if (headings[i].offsetTop <= scrollPos) {
          current = headings[i];
          break;
        }
      }
      
      // Update TOC links
      tocLinks.forEach(function(link) {
        link.classList.remove('active');
        if (link.getAttribute('href') === '#' + current.id) {
          link.classList.add('active');
        }
      });
    }

    window.addEventListener('scroll', updateActive);
    updateActive(); // Initial call
  }

  // ============================================================================
  // PRINT BUTTON
  // ============================================================================
  
  /**
   * Handle print button clicks
   */
  function initPrintButtons() {
    const printButtons = document.querySelectorAll('[data-action="print"]');
    
    printButtons.forEach(function(button) {
      button.addEventListener('click', function() {
        window.print();
      });
    });
  }

  // ============================================================================
  // INITIALIZATION
  // ============================================================================
  
  // Wait for DOM to be ready
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }

  function init() {
    initThemeToggle();
    initHeadingAnchors();
    initTableOfContents();
    initScrollspy();
    initPrintButtons();
  }

})();

