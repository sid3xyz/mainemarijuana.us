/* Core utilities and shared initializers */
(function() {
  try { document.documentElement.classList.add('js'); } catch(_) {}
  const MM = (window.MM = window.MM || {});

  const $ = (sel, ctx=document) => ctx.querySelector(sel);
  const $$ = (sel, ctx=document) => Array.from(ctx.querySelectorAll(sel));
  const normalize = (text='', form='NFKD') =>
    text.toLowerCase().normalize(form).replace(/[\u0300-\u036f]/g, '');

  function slugify(text) {
    return (text || '').toLowerCase().trim()
      .replace(/[^a-z0-9\s-]/g, '')
      .replace(/\s+/g, '-')
      .replace(/-+/g, '-')
      .replace(/^-|-$/g, '');
  }

  function ensureHeadingIds() {
    $$('main h2, main h3, main h4').forEach(h => {
      if(!h.id) {
        let base = slugify(h.textContent);
        let id = base; let i = 2;
        while(document.getElementById(id)) id = base + '-' + i++;
        h.id = id;
      }
      if(!h.classList.contains('anchor-added')) {
        const link = document.createElement('a');
        link.href = '#' + h.id;
        link.setAttribute('aria-label', 'Link to this section');
        link.className = 'anchor-link';
        link.innerHTML = '§';
        h.appendChild(link);
        h.classList.add('anchor-added');
      }
    });
  }

  function buildTOC() {
    const tocEl = $('#toc');
    if(!tocEl) return;
    const headings = $$('main h2, main h3, main h4');
    const ul = document.createElement('ul');
    ul.className = 'toc';
    headings.forEach(h => {
      const li = document.createElement('li');
      li.className = 'toc-depth-' + h.tagName.substring(1);
      const a = document.createElement('a');
      a.href = '#' + h.id;
      a.textContent = h.textContent.replace(/§$/, '').trim();
      li.appendChild(a);
      ul.appendChild(li);
    });
    tocEl.innerHTML = '';
    tocEl.appendChild(ul);
  }

  function initDobCalculator() {
    const dobDate = $('.dob-date');
    const dobUpdated = $('.dob-updated');
    if(!dobDate && !dobUpdated) return;
    try {
      const today = new Date();
      const cutoff = new Date(today.getFullYear() - 21, today.getMonth(), today.getDate());
      const formatter = new Intl.DateTimeFormat('en-US', { month:'long', day:'numeric', year:'numeric' });
      if(dobDate) dobDate.textContent = formatter.format(cutoff);
      if(dobUpdated) dobUpdated.textContent = `Updated for today: ${formatter.format(today)}`;
    } catch(_) { /* ignore */ }
  }

  function initPrintButtons() {
    const triggers = $$('.btn-print, [data-action="print"]');
    if(!triggers.length) return;
    triggers.forEach(btn => {
      btn.addEventListener('click', e => { e.preventDefault(); window.print(); });
    });
  }

  function scrollSpy() {
    const tocLinks = $$('#toc a');
    if(!tocLinks.length) return;
    const map = tocLinks.map(a => ({
      a,
      id: a.getAttribute('href').slice(1),
      el: document.getElementById(a.getAttribute('href').slice(1))
    }));
    let lastActive;

    function onScroll() {
      const y = window.scrollY + 120;
      let current = map[0];
      for(const item of map) {
        if(item.el && item.el.offsetTop <= y) current = item; else break;
      }
      if(current && current !== lastActive) {
        tocLinks.forEach(link => link.classList.remove('active'));
        current.a.classList.add('active');
        lastActive = current;
      }
    }

    window.addEventListener('scroll', onScroll, { passive: true });
    onScroll();
  }

  function applyHashFocus() {
    if(!location.hash) return;
    const el = document.getElementById(location.hash.slice(1));
    if(!el) return;
    requestAnimationFrame(() => {
      el.scrollIntoView({ behavior: 'auto', block: 'start' });
    });
  }

  // expose
  MM.$ = $; MM.$$ = $$; MM.slugify = slugify;
  MM.ensureHeadingIds = ensureHeadingIds;
  MM.buildTOC = buildTOC;
  MM.initDobCalculator = initDobCalculator;
  MM.initPrintButtons = initPrintButtons;
  MM.scrollSpy = scrollSpy;
  MM.applyHashFocus = applyHashFocus;
  MM.normalize = normalize;
})();
