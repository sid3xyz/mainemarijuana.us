/* Purchase limit calculator module (parity with original script.js) */
(function(){
  const { $, $$ } = window.MM || {};
  if(!$) return;

  const OUNCES_TO_GRAMS = 28.3495;
  const LIMIT_TOTAL_GRAMS = 2.5 * OUNCES_TO_GRAMS;
  const LIMIT_CONCENTRATE_GRAMS = 10;

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

  window.MM = window.MM || {};
  window.MM.initPurchaseCalculator = initPurchaseCalculator;
})();
