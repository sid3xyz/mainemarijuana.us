/* MaineMarijuana.us Script */
(function() {
  const $ = (sel, ctx=document) => ctx.querySelector(sel);
  const $$ = (sel, ctx=document) => Array.from(ctx.querySelectorAll(sel));
  const LIMIT_TOTAL_OUNCES = 2.5;
  const OUNCES_TO_GRAMS = 28.3495;
  const LIMIT_TOTAL_GRAMS = LIMIT_TOTAL_OUNCES * OUNCES_TO_GRAMS;
  const LIMIT_CONCENTRATE_GRAMS = 10;

  function slugify(text) {
    return text.toLowerCase().trim()
      .replace(/[^a-z0-9\s-]/g,'')
      .replace(/\s+/g,'-')
      .replace(/-+/g,'-')
      .replace(/^-|-$/g,'');
  }

  function ensureHeadingIds() {
    const headings = $$('main h2, main h3, main h4');
    headings.forEach(h => {
      if(!h.id) {
        let base = slugify(h.textContent);
        let id = base; let i=2;
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
      a.textContent = h.textContent.replace(/§$/,'').trim();
      li.appendChild(a);
      ul.appendChild(li);
    });
    tocEl.innerHTML = '';
    tocEl.appendChild(ul);
  }

  function scrollSpy() {
    const tocLinks = $$('#toc a');
    if(!tocLinks.length) return;
    const map = tocLinks.map(a => ({ a, id: a.getAttribute('href').slice(1), el: document.getElementById(a.getAttribute('href').slice(1)) }));
    let lastActive;
    function onScroll() {
      const y = window.scrollY + 120; // offset for header
      let current = map[0];
      for(const item of map) {
        if(item.el && item.el.offsetTop <= y) current = item; else break;
      }
      if(current && current !== lastActive) {
        tocLinks.forEach(l => l.classList.remove('active'));
        current.a.classList.add('active');
        lastActive = current;
      }
    }
    window.addEventListener('scroll', onScroll, { passive:true });
    onScroll();
  }

  function markLastUpdated() {
    const el = $('.last-updated time');
    if(!el) return;
    // Embed last modified (naive - uses build time / browser load - could be replaced server-side if needed)
    const now = new Date(document.lastModified || Date.now());
    el.dateTime = now.toISOString();
    el.textContent = now.toLocaleDateString(undefined, { year:'numeric', month:'short', day:'numeric' });
  }

  function initSearch() {
    const searchInput = $('#resource-search') || $('#doc-search');
    if(!searchInput) return;
    const cards = $$('[data-search-item]');
    if(!cards.length) return;

    const emptyState = $('#search-empty');
    const countEl = $('#search-count') || $('#doc-count');
    const suggestionBox = $('#search-suggestions');
    const directAnswerEl = $('#direct-answer');
    const topicButtons = $$('.facet-chip[data-facet-topic]');
    const kindButtons = $$('.facet-chip[data-facet-kind]');

    const normalize = str => (str || '').toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g,'');

    // Document library mode
    if(searchInput.id === 'doc-search') {
      initDocumentSearch(searchInput, cards, countEl);
      return;
    }

    const items = cards.map(card => {
      const link = card.querySelector('a');
      const titleEl = card.querySelector('h3');
      const summaryEl = card.querySelector('p');
      const dataset = card.dataset.searchItem || '';
      const title = titleEl ? titleEl.textContent.trim() : '';
      const summary = summaryEl ? summaryEl.textContent.trim() : '';
      return {
        el: card,
        link,
        topic: (card.dataset.topic || 'misc').toLowerCase(),
        kind: (card.dataset.kind || 'guide').toLowerCase(),
        title,
        searchable: normalize([dataset, title, summary].join(' '))
      };
    });

    const suggestionSeeds = [
      'ID verification checklist',
      'Acceptable ID list',
      'Decline intoxicated customer',
      'Purchase limit calculator',
      'Concentrate limit (10 g)',
      'Packaging requirements',
      'Universal symbol rules',
      'Customer talking points',
      'On-site consumption rules',
      'Home grow limits'
    ];
    const dynamicSuggestions = items.map(item => item.title).filter(Boolean);
    const suggestions = Array.from(new Set([...suggestionSeeds, ...dynamicSuggestions]));

    const directAnswers = [
      {
        triggers: ['id verification', 'acceptable id', 'check id', 'id checklist', 'verify id'],
        title: 'ID Verification Essentials',
        html: '<p>Card every guest before discussing product or starting a sale. Accept only unexpired, government-issued photo ID. If the document looks altered or uncertain, decline the transaction and escalate to a supervisor.</p>',
  link: { href: 'guides/compliance/compliance_guide.html#age-id-verification', label: 'Review ID verification steps' }
      },
      {
        triggers: ['purchase limit', '2.5 oz', 'cart limit', 'weight limit', 'purchase math', 'concentrate limit', '10 g'],
        title: 'Purchase Limit Snapshot',
        html: '<p>Keep each adult-use sale at or under <strong>2.5 oz total product weight</strong>. Concentrates across the order can never exceed <strong>10 g</strong>. Add flower, infused goods, and concentrates together before ringing out.</p>',
  link: { href: 'guides/compliance/compliance_guide.html#purchase-possession-limits', label: 'See purchase limit guidance' }
      },
      {
        triggers: ['decline sale', 'intoxicated', 'refuse service', 'prohibited sale', 'vending machine', 'stop sale'],
        title: 'When to Decline a Sale',
        html: '<p>Stop the transaction if a guest is visibly intoxicated, attempts to use prohibited combinations (cannabis with alcohol or tobacco), or requests unattended dispensing. Document the incident and notify leadership immediately.</p>',
  link: { href: 'guides/compliance/compliance_guide.html#no-go-sales', label: 'Review prohibited sale rules' }
      },
      {
        triggers: ['packaging rules', 'label requirements', 'exit packaging', 'universal symbol', 'edible limits'],
        title: 'Packaging &amp; Labeling Toplines',
        html: '<p>Ensure every product leaves in compliant child-resistant, tamper-evident packaging with the universal symbol, batch, potency, warnings, and license numbers. Edibles stay within 10 mg per serving and 200 mg per package.</p>',
  link: { href: 'guides/compliance/compliance_guide.html#product-packaging-labeling', label: 'View packaging checklist' }
      }
    ];

    let activeTopic = 'all';
    let activeKind = 'all';

    function updateDirectAnswer(normalizedQuery) {
      if(!directAnswerEl) return;
      if(!normalizedQuery || normalizedQuery.length < 2) {
        directAnswerEl.classList.add('hidden');
        directAnswerEl.innerHTML = '';
        return;
      }
      const match = directAnswers.find(answer => answer.triggers.some(trigger => normalizedQuery.includes(normalize(trigger))));
      if(!match) {
        directAnswerEl.classList.add('hidden');
        directAnswerEl.innerHTML = '';
        return;
      }
      directAnswerEl.innerHTML = `
        <h3>${match.title}</h3>
        ${match.html}
        <a href="${match.link.href}">${match.link.label}</a>
      `;
      directAnswerEl.classList.remove('hidden');
    }

    function hideSuggestions() {
      if(!suggestionBox) return;
      suggestionBox.classList.add('hidden');
      suggestionBox.innerHTML = '';
    }

    function renderSuggestions(rawQuery) {
      if(!suggestionBox) return;
      const trimmed = rawQuery.trim();
      if(trimmed.length < 2) {
        hideSuggestions();
        return;
      }
      const normalizedQuery = normalize(trimmed);
      const matches = suggestions.filter(label => normalize(label).includes(normalizedQuery)).slice(0, 6);
      if(!matches.length) {
        hideSuggestions();
        return;
      }
      suggestionBox.innerHTML = matches.map(label => `<button type="button" role="option" class="suggestion-item" data-value="${label}">${label}</button>`).join('');
      suggestionBox.classList.remove('hidden');
    }

    function applySuggestion(value) {
      if(!value) return;
      searchInput.value = value;
      hideSuggestions();
      applyFilter(value);
      requestAnimationFrame(() => {
        searchInput.focus();
        const len = value.length;
        if(typeof searchInput.setSelectionRange === 'function') {
          searchInput.setSelectionRange(len, len);
        }
      });
    }

    function applyFilter(query) {
      const normalizedQuery = normalize(query.trim());
      let matches = 0;
      items.forEach(item => {
        const queryMatch = !normalizedQuery || item.searchable.includes(normalizedQuery);
        const topicMatch = activeTopic === 'all' || item.topic === activeTopic;
        const kindMatch = activeKind === 'all' || item.kind === activeKind;
        const show = queryMatch && topicMatch && kindMatch;
        item.el.classList.toggle('hidden', !show);
        if(item.link) {
          item.link.setAttribute('tabindex', show ? '0' : '-1');
          item.link.setAttribute('aria-hidden', show ? 'false' : 'true');
        }
        if(show) matches++;
      });
      if(countEl) countEl.textContent = matches;
      if(emptyState) emptyState.classList.toggle('hidden', matches !== 0);
      updateDirectAnswer(normalizedQuery);
    }

    function updateFacetState(buttons, target) {
      buttons.forEach(btn => {
        const isActive = btn === target;
        btn.classList.toggle('is-active', isActive);
        btn.setAttribute('aria-pressed', isActive ? 'true' : 'false');
      });
    }

    topicButtons.forEach(btn => {
      btn.addEventListener('click', () => {
        const value = (btn.dataset.facetTopic || 'all').toLowerCase();
        if(activeTopic === value) return;
        activeTopic = value;
        updateFacetState(topicButtons, btn);
        applyFilter(searchInput.value);
      });
    });

    kindButtons.forEach(btn => {
      btn.addEventListener('click', () => {
        const value = (btn.dataset.facetKind || 'all').toLowerCase();
        if(activeKind === value) return;
        activeKind = value;
        updateFacetState(kindButtons, btn);
        applyFilter(searchInput.value);
      });
    });

    if(suggestionBox) {
      suggestionBox.addEventListener('mousedown', e => {
        const btn = e.target.closest('.suggestion-item');
        if(!btn) return;
        e.preventDefault();
        applySuggestion(btn.dataset.value);
      });
      suggestionBox.addEventListener('click', e => {
        const btn = e.target.closest('.suggestion-item');
        if(!btn) return;
        applySuggestion(btn.dataset.value);
      });
      suggestionBox.addEventListener('keydown', e => {
        const target = e.target.closest('.suggestion-item');
        if(!target) return;
        const options = Array.from(suggestionBox.querySelectorAll('.suggestion-item'));
        const index = options.indexOf(target);
        if(e.key === 'ArrowDown') {
          e.preventDefault();
          (options[index + 1] || options[0]).focus();
        } else if(e.key === 'ArrowUp') {
          e.preventDefault();
          if(index <= 0) searchInput.focus();
          else options[index - 1].focus();
        } else if(e.key === 'Escape') {
          e.preventDefault();
          hideSuggestions();
          searchInput.focus();
        } else if(e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          applySuggestion(target.dataset.value);
        }
      });
    }

    searchInput.addEventListener('input', e => {
      const value = e.target.value;
      renderSuggestions(value);
      applyFilter(value);
    });

    searchInput.addEventListener('focus', () => {
      renderSuggestions(searchInput.value);
    });

    searchInput.addEventListener('blur', () => {
      setTimeout(() => hideSuggestions(), 120);
    });

    searchInput.addEventListener('keydown', e => {
      if(e.key === 'ArrowDown' && suggestionBox && !suggestionBox.classList.contains('hidden')) {
        const first = suggestionBox.querySelector('.suggestion-item');
        if(first) {
          e.preventDefault();
          first.focus();
        }
      } else if(e.key === 'Escape') {
        hideSuggestions();
      }
    });

    applyFilter(searchInput.value || '');
  }

  function initDocumentSearch(searchInput, items, countEl) {
    const normalize = str => (str || '').toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g,'');
    
    function doDocSearch() {
      const query = normalize(searchInput.value);
      let visibleCount = 0;
      
      items.forEach(item => {
        const searchableText = normalize(item.dataset.searchItem || '');
        const titleText = normalize(item.querySelector('.doc-title')?.textContent || '');
        const matches = !query || searchableText.includes(query) || titleText.includes(query);
        
        if(matches) {
          item.style.display = '';
          visibleCount++;
        } else {
          item.style.display = 'none';
        }
      });
      
      if(countEl) {
        countEl.textContent = visibleCount;
      }
    }
    
    searchInput.addEventListener('input', doDocSearch);
    doDocSearch(); // Initial count
  }

  function initPurchaseCalculator() {
    const calculator = $('#purchase-calculator');
    if(!calculator) return;

    const form = calculator.querySelector('.calc-form');
    const rowsContainer = form.querySelector('[data-role="rows"]');
    const addRowBtn = form.querySelector('[data-action="add-row"]');
    const resetBtn = form.querySelector('[data-action="reset"]');
    const template = calculator.querySelector('#purchase-line-template');
    const statusEl = calculator.querySelector('[data-role="status"]');
    const resultEls = {
      totalGrams: calculator.querySelector('[data-result="total-grams"]'),
      totalOunces: calculator.querySelector('[data-result="total-ounces"]'),
      concentrateGrams: calculator.querySelector('[data-result="concentrate-grams"]'),
      lineCount: calculator.querySelector('[data-result="line-count"]'),
      linesOver: calculator.querySelector('[data-result="lines-over"]')
    };

    if(!rowsContainer || !template) return;

    function formatNumber(value, digits=2) {
      return Number.isFinite(value) ? value.toFixed(digits) : '0.00';
    }

    function convertToGrams(amount, unit) {
      if(!Number.isFinite(amount) || amount <= 0) return 0;
      return unit === 'ounces' ? amount * OUNCES_TO_GRAMS : amount;
    }

    function updateRowLabels() {
      const rows = $$('.calc-row', rowsContainer);
      rows.forEach((row, index) => {
        const lineNumber = index + 1;
        $$('[data-label]', row).forEach(label => {
          const kind = label.dataset.label;
          if(kind === 'type') label.textContent = `Line ${lineNumber}: product type`;
          else if(kind === 'amount') label.textContent = `Line ${lineNumber}: amount`;
          else if(kind === 'unit') label.textContent = `Line ${lineNumber}: unit`;
        });
      });
    }

    function createRow(initial={}) {
      const content = document.importNode(template.content, true);
      const row = content.querySelector('[data-line]');
      if(!row) return null;
      if(initial.type) row.querySelector('[data-field="type"]').value = initial.type;
      if(Number.isFinite(initial.amount)) row.querySelector('[data-field="amount"]').value = initial.amount;
      if(initial.unit) row.querySelector('[data-field="unit"]').value = initial.unit;
      rowsContainer.appendChild(content);
      updateRowLabels();
      return row;
    }

    function summarize() {
      const rows = $$('.calc-row', rowsContainer);
      let totalGrams = 0;
      let concentrateGrams = 0;
      let activeLines = 0;
      const issues = [];

      rows.forEach(row => {
        const type = row.querySelector('[data-field="type"]').value;
        const amountField = row.querySelector('[data-field="amount"]');
        const unit = row.querySelector('[data-field="unit"]').value;
        let amount = parseFloat(amountField.value);
        if(!Number.isFinite(amount) || amount < 0) amount = 0;
        const grams = convertToGrams(amount, unit);
        if(grams > 0) activeLines++;
        totalGrams += grams;
        if(type === 'concentrate') concentrateGrams += grams;
      });

      if(resultEls.totalGrams) resultEls.totalGrams.textContent = `${formatNumber(totalGrams)} g`;
      if(resultEls.totalOunces) resultEls.totalOunces.textContent = `${formatNumber(totalGrams / OUNCES_TO_GRAMS)} oz`;
      if(resultEls.concentrateGrams) resultEls.concentrateGrams.textContent = `${formatNumber(concentrateGrams)} g`;
      if(resultEls.lineCount) resultEls.lineCount.textContent = `${activeLines}`;

      let statusClass = 'is-ok';
      let statusMsg = activeLines ? 'Totals look compliant.' : 'Enter product lines to check limits.';

      if(totalGrams > LIMIT_TOTAL_GRAMS) {
        statusClass = 'is-alert';
        issues.push('over the 2.5 oz total cap');
        statusMsg = 'Over the 2.5 oz total cap — reduce weight before completing the sale.';
      } else if(totalGrams >= LIMIT_TOTAL_GRAMS * 0.9) {
        statusClass = 'is-warn';
        statusMsg = 'Within 10% of the 2.5 oz limit — double-check before ringing out.';
      }

      if(concentrateGrams > LIMIT_CONCENTRATE_GRAMS) {
        statusClass = 'is-alert';
        issues.push('over the 10 g concentrate cap');
        statusMsg = 'Concentrates exceed 10 g — adjust concentrate items before completing the sale.';
      } else if(concentrateGrams >= LIMIT_CONCENTRATE_GRAMS * 0.9) {
        if(statusClass !== 'is-alert') statusClass = 'is-warn';
        statusMsg = 'Concentrates are near the 10 g cap — confirm limit compliance.';
      }

      if(statusEl) {
        statusEl.classList.remove('is-ok','is-warn','is-alert');
        statusEl.classList.add(statusClass);
        statusEl.textContent = statusMsg;
      }

      if(resultEls.linesOver) {
        if(!activeLines) {
          resultEls.linesOver.textContent = 'No lines entered yet';
        } else if(issues.length) {
          resultEls.linesOver.textContent = issues.join(' & ');
        } else {
          resultEls.linesOver.textContent = 'All compliant';
        }
      }
    }

    function handleInputEvent(e) {
      const input = e.target;
      if(input.matches('[data-field="amount"]')) {
        if(input.value === '') return summarize();
        const value = parseFloat(input.value);
        if(!Number.isFinite(value) || value < 0) input.value = '';
      }
      summarize();
    }

    function handleRemove(lineEl) {
      lineEl.remove();
      if(!$('[data-line]', rowsContainer)) {
        createRow();
      }
      updateRowLabels();
      summarize();
    }

    addRowBtn?.addEventListener('click', () => {
      createRow();
      summarize();
    });

    resetBtn?.addEventListener('click', () => {
      rowsContainer.innerHTML = '';
      createRow();
      summarize();
    });

    rowsContainer.addEventListener('input', handleInputEvent);
    rowsContainer.addEventListener('change', handleInputEvent);

    rowsContainer.addEventListener('click', e => {
      const btn = e.target.closest('[data-action="remove-line"]');
      if(!btn) return;
      const line = btn.closest('[data-line]');
      if(line) handleRemove(line);
    });

    // Initialize with one row and summary
    createRow();
    summarize();
  }

  function applyHashFocus() {
    if(!location.hash) return;
    const el = document.getElementById(location.hash.slice(1));
    if(!el) return;
    requestAnimationFrame(() => {
      el.scrollIntoView({ behavior:'auto', block:'start' });
    });
  }

  function initPrintButtons() {
    const triggers = $$('.btn-print, [data-action="print"]');
    if(!triggers.length) return;
    triggers.forEach(btn => {
      btn.addEventListener('click', e => {
        e.preventDefault();
        window.print();
      });
    });
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
    } catch(_) {
      // Ignore environments without Intl support
    }
  }

  function initResourceFilter() {
    const input = $('#filter');
    if(!input) return;
    const lists = ['#list-required', '#list-staff']
      .map(sel => $(sel))
      .filter(Boolean);
    if(!lists.length) return;

    const normalize = str => (str || '').toLowerCase();

    const applyFilter = value => {
      const query = normalize(value);
      lists.forEach(list => {
        Array.from(list.children).forEach(item => {
          if(!(item instanceof HTMLElement)) return;
          const text = normalize(item.textContent);
          const tags = normalize(item.getAttribute('data-tags'));
          const show = !query || text.includes(query) || tags.includes(query);
          item.style.display = show ? '' : 'none';
        });
      });
    };

    applyFilter(input.value);
    input.addEventListener('input', e => applyFilter(e.target.value));
  }

  function init() {
    ensureHeadingIds();
    buildTOC();
    scrollSpy();
    markLastUpdated();
    initSearch();
    initPurchaseCalculator();
    initResourceFilter();
    initDobCalculator();
    initPrintButtons();
    applyHashFocus();
  }

  if(document.readyState !== 'loading') init();
  else document.addEventListener('DOMContentLoaded', init);
})();
