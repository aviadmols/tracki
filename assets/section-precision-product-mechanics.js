(function () {
  document.querySelectorAll('[data-precision-mechanics-video]:not([data-no-video])').forEach((wrap) => {
    const poster = wrap.querySelector('[id^="Deferred-Poster-"]');
    poster?.addEventListener('click', () => {
      wrap.classList.add('is-playing');
    });
  });
})();
