/* App bootstrap wiring */
(function(){
  const boot = () => {
    const MM = window.MM || {};
    // Core always
    MM.ensureHeadingIds?.();
    MM.buildTOC?.();
    MM.initPrintButtons?.();
    MM.initDobCalculator?.();
  MM.scrollSpy?.();
  MM.applyHashFocus?.();

    // Page-specific features (safe to call when absent)
    MM.initSearch?.();
    MM.initDocumentSearch?.();
    MM.initPurchaseCalculator?.();
    MM.initResourceFilter?.();
  };

  if(document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', boot);
  } else {
    boot();
  }
})();
