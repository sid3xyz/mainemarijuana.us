/*
  Gonzo-style purchase limit calculator for the Maine Medical Program.
  No separate concentrate limit, just a straight 2.5oz (70.87g) aggregate.
  Simpler, faster, and built for the patient.
*/
(function() {
  'use strict';

  const $ = (sel, ctx = document) => ctx.querySelector(sel);
  const $$ = (sel, ctx = document) => Array.from(ctx.querySelectorAll(sel));

  const MAX_GRAMS = 70.87; // 2.5 ounces in grams

  function initPurchaseCalculator() {
    const wrapper = $('.calculator-wrapper');
    if (!wrapper) return;

    const totalGramsEl = $('#total-grams');
    const statusCard = $('#status-card');
    const statusMessageEl = $('#status-message');
    const tableBody = $('#calculator-body');
    const template = $('#calculator-row-template');

    function updateTotals() {
      let totalGrams = 0;
      const rows = $$('#calculator-body .calculator-row');

      rows.forEach(row => {
        const quantity = parseFloat(row.querySelector('[data-input="quantity"]').value) || 0;
        const unit = row.querySelector('[data-input="unit"]').value;
        let grams = 0;

        if (unit === 'g') {
          grams = quantity;
        } else if (unit === 'oz') {
          grams = quantity * 28.3495;
        }
        totalGrams += grams;
      });

      totalGramsEl.textContent = totalGrams.toFixed(2);

      // Update status card
      statusCard.classList.remove('status--ok', 'status--warn', 'status--error');
      if (totalGrams > MAX_GRAMS) {
        statusMessageEl.textContent = 'Over Limit';
        statusCard.classList.add('status--error');
      } else if (totalGrams > MAX_GRAMS * 0.9) {
        statusMessageEl.textContent = 'Approaching Limit';
        statusCard.classList.add('status--warn');
      } else if (totalGrams > 0) {
        statusMessageEl.textContent = 'Under Limit';
        statusCard.classList.add('status--ok');
      } else {
        statusMessageEl.textContent = 'Ready to calculate';
      }
    }

    function addRow() {
      if (!template) return;
      const newRow = template.content.cloneNode(true);
      tableBody.appendChild(newRow);
    }

    function reset() {
      tableBody.innerHTML = '';
      addRow();
      updateTotals();
    }

    wrapper.addEventListener('input', updateTotals);
    wrapper.addEventListener('click', (e) => {
      const action = e.target.dataset.action;
      if (action === 'add-row') addRow();
      if (action === 'reset-calc') reset();
      if (action === 'remove-row') {
        e.target.closest('.calculator-row').remove();
        updateTotals();
      }
    });

    // Initial state
    reset();
  }

  // Since app.js initializes features, we just need to make sure this file is loaded.
  // The existing app.js in /med will call initPurchaseCalculator if it exists.
  document.addEventListener('DOMContentLoaded', initPurchaseCalculator);

})();
