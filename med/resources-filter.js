/* Resources list/text filter module */
(function(){
  const { $, normalize: sharedNormalize } = window.MM || {};
  if(!$) return;
  const normalize = sharedNormalize || (text => (text || '').toLowerCase().normalize('NFKD').replace(/[\u0300-\u036f]/g, ''));

  function initResourceFilter() {
    const input = $('#filter');
    if(!input) return;
    const lists = ['#list-required', '#list-staff']
      .map(sel => $(sel))
      .filter(Boolean);
    if(!lists.length) return;

    function apply(value) {
      const q = normalize(value);
      lists.forEach(list => {
        Array.from(list.children).forEach(item => {
          if(!(item instanceof HTMLElement)) return;
          const text = normalize(item.textContent);
          const tags = normalize(item.getAttribute('data-tags'));
          const show = !q || text.includes(q) || tags.includes(q);
          item.style.display = show ? '' : 'none';
        });
      });
    }

    apply(input.value);
    input.addEventListener('input', e => apply(e.target.value));
  }

  window.MM = window.MM || {};
  window.MM.initResourceFilter = initResourceFilter;
})();
