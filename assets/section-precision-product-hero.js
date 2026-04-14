/**
 * Precision PDP — מחלקת תבנית + סרגל Add to cart דביק אחרי גלילה מהאזור הראשי
 */
document.documentElement.classList.add('precision-pdp-template');

(function () {
  function initStickyAtc() {
    var bar = document.querySelector('.precision-pdp-sticky-atc');
    var sentinel = document.querySelector('.precision-pdp-sticky-sentinel');
    if (!bar || !sentinel) return;

    var sectionId = bar.getAttribute('data-section-id');
    if (!sectionId) return;

    var mainPrice = document.getElementById('price-' + sectionId);
    var stickyPrice = document.getElementById('sticky-price-' + sectionId);
    var submitId = 'ProductSubmitButton-' + sectionId;
    var stickyBtn = document.getElementById('precision-sticky-submit-' + sectionId);

    function syncPrice() {
      if (mainPrice && stickyPrice) {
        stickyPrice.innerHTML = mainPrice.innerHTML;
      }
    }

    function syncButton() {
      var mainBtn = document.getElementById(submitId);
      if (!mainBtn || !stickyBtn) return;
      stickyBtn.disabled = !!mainBtn.disabled;
      var aria = mainBtn.getAttribute('aria-disabled');
      if (aria === 'true') {
        stickyBtn.setAttribute('aria-disabled', 'true');
      } else {
        stickyBtn.removeAttribute('aria-disabled');
      }
      var mainSpan = mainBtn.querySelector('span');
      var stickySpan = stickyBtn.querySelector('span');
      if (mainSpan && stickySpan) {
        stickySpan.textContent = mainSpan.textContent;
      }
      if (mainBtn.classList.contains('loading')) {
        stickyBtn.classList.add('loading');
      } else {
        stickyBtn.classList.remove('loading');
      }
    }

    function syncAll() {
      syncPrice();
      syncButton();
    }

    if (stickyBtn) {
      stickyBtn.addEventListener('click', function () {
        var mainBtn = document.getElementById(submitId);
        if (!mainBtn) return;
        if (mainBtn.disabled || mainBtn.getAttribute('aria-disabled') === 'true') return;
        mainBtn.click();
      });
    }

    var io = new IntersectionObserver(
      function (entries) {
        entries.forEach(function (entry) {
          if (entry.isIntersecting) {
            bar.classList.remove('is-visible');
            bar.setAttribute('hidden', '');
            document.body.classList.remove('precision-pdp-sticky-atc-open');
          } else {
            bar.classList.add('is-visible');
            bar.removeAttribute('hidden');
            document.body.classList.add('precision-pdp-sticky-atc-open');
            syncAll();
          }
        });
      },
      { root: null, rootMargin: '0px', threshold: 0 }
    );
    io.observe(sentinel);

    if (typeof subscribe === 'function' && typeof PUB_SUB_EVENTS !== 'undefined') {
      subscribe(PUB_SUB_EVENTS.variantChange, syncAll);
    }

    var mainBtn = document.getElementById(submitId);
    if (mainBtn) {
      var mo = new MutationObserver(syncButton);
      mo.observe(mainBtn, {
        attributes: true,
        attributeFilter: ['disabled', 'aria-disabled', 'class'],
        subtree: true,
        childList: true,
        characterData: true,
      });
    }

    syncAll();
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initStickyAtc);
  } else {
    initStickyAtc();
  }
})();
