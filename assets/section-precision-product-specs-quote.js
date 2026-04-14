(function () {
  function goTo(root, index) {
    const track = root.querySelector('[data-track]');
    const dots = root.querySelectorAll('[data-dot]');
    const slides = root.querySelectorAll('[data-slide]');
    const len = slides.length;
    if (!track || len === 0) return;
    const i = ((index % len) + len) % len;
    track.style.transform = 'translateX(-' + i * 100 + '%)';
    root.dataset.activeIndex = String(i);
    dots.forEach(function (d, di) {
      var active = di === i;
      d.classList.toggle('is-active', active);
      d.setAttribute('aria-selected', active ? 'true' : 'false');
    });
    return i;
  }

  function init(root) {
    var track = root.querySelector('[data-track]');
    var slides = root.querySelectorAll('[data-slide]');
    if (!track || slides.length < 2) return;

    var prev = root.querySelector('[data-prev]');
    var next = root.querySelector('[data-next]');
    var dots = root.querySelectorAll('[data-dot]');
    var index = 0;

    function step(delta) {
      index = goTo(root, index + delta);
    }

    if (prev) prev.addEventListener('click', function () { step(-1); });
    if (next) next.addEventListener('click', function () { step(1); });

    dots.forEach(function (dot) {
      dot.addEventListener('click', function () {
        var idx = parseInt(dot.getAttribute('data-index'), 10);
        if (!isNaN(idx)) index = goTo(root, idx);
      });
    });

    var viewport = root.querySelector('.precision-specs-quote__viewport');
    if (viewport && 'ontouchstart' in window) {
      var startX = 0;
      viewport.addEventListener(
        'touchstart',
        function (e) {
          if (e.changedTouches && e.changedTouches[0]) startX = e.changedTouches[0].screenX;
        },
        { passive: true }
      );
      viewport.addEventListener(
        'touchend',
        function (e) {
          if (!e.changedTouches || !e.changedTouches[0]) return;
          var dx = e.changedTouches[0].screenX - startX;
          if (Math.abs(dx) > 45) step(dx < 0 ? 1 : -1);
        },
        { passive: true }
      );
    }
  }

  document.querySelectorAll('[data-prec-specs-quote]').forEach(init);
})();
