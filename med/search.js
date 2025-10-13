/* Search and filtering module (mirrors legacy behavior) */
(function(){
  const { $, $$, normalize: sharedNormalize } = window.MM || {};
  if(!$) return;
  const normalize = sharedNormalize || (str => (str || '').toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g,''));

  function initSearch() {
    const searchInput = $('#resource-search') || $('#doc-search');
    if(!searchInput) return;
    const cards = $$('[data-search-item]');
    if(!cards.length) return;

    const emptyState = $('#search-empty');
    const countEl = $('#search-count') || $('#doc-count');
    const topicButtons = $$('.facet-chip[data-facet-topic]');
    const kindButtons = $$('.facet-chip[data-facet-kind]');

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

    let activeTopic = 'all';
    let activeKind = 'all';

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

    searchInput.addEventListener('input', e => {
      applyFilter(e.target.value);
    });

    applyFilter(searchInput.value || '');
  }

  function initDocumentSearch(searchInput, items, countEl) {
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

      if(countEl) countEl.textContent = visibleCount;
    }

    searchInput.addEventListener('input', doDocSearch);
    doDocSearch();
  }

  window.MM = window.MM || {};
  window.MM.initSearch = initSearch;
  window.MM.initDocumentSearch = initDocumentSearch;
})();
