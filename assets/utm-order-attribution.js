/**
 * UTM / paid-click attribution → sessionStorage + cart attributes (Shopify order note attributes).
 */
(function () {
  'use strict';

  var STORAGE_KEY = 'tracki_utm_v1';
  var PARAM_KEYS = [
    'utm_source',
    'utm_medium',
    'utm_campaign',
    'utm_content',
    'utm_term',
    'gclid',
    'fbclid',
  ];

  function pickParams(search) {
    var params = new URLSearchParams(search || '');
    var out = {};
    PARAM_KEYS.forEach(function (key) {
      var v = params.get(key);
      if (v != null && String(v).trim() !== '') {
        out[key] = String(v).trim();
      }
    });
    return out;
  }

  function loadStored() {
    try {
      var raw = sessionStorage.getItem(STORAGE_KEY);
      return raw ? JSON.parse(raw) : {};
    } catch (e) {
      return {};
    }
  }

  function saveStored(obj) {
    try {
      sessionStorage.setItem(STORAGE_KEY, JSON.stringify(obj));
    } catch (e) {}
  }

  function mergeAttribution() {
    var stored = loadStored();
    var current = pickParams(window.location.search);
    var merged = Object.assign({}, stored, current);
    if (Object.keys(merged).length) {
      saveStored(merged);
    }
    return merged;
  }

  function shouldDecorateHref(href) {
    if (!href || href === '#') return false;
    if (href.charAt(0) === '#' && href.indexOf('/') === -1) return false;
    return true;
  }

  function hrefOutput(url, originalHref) {
    var abs = /^https?:\/\//i.test(originalHref);
    var protoRel = originalHref.substring(0, 2) === '//';
    if (abs || protoRel) {
      return url.toString();
    }
    return url.pathname + url.search + url.hash;
  }

  function decorateLinks(attr) {
    var keys = Object.keys(attr);
    if (!keys.length) return;

    document.querySelectorAll('a[href]').forEach(function (a) {
      var originalHref = a.getAttribute('href');
      if (!shouldDecorateHref(originalHref)) return;

      try {
        var url = new URL(originalHref, window.location.href);
        if (url.protocol === 'mailto:' || url.protocol === 'tel:' || url.protocol === 'javascript:') {
          return;
        }

        var host = url.hostname.toLowerCase();
        var isTracki = host === 'tracki.com' || host.endsWith('.tracki.com');
        var isSameOrigin = url.origin === window.location.origin;
        if (!isTracki && !isSameOrigin) return;

        keys.forEach(function (key) {
          if (!url.searchParams.get(key)) {
            url.searchParams.set(key, attr[key]);
          }
        });

        a.setAttribute('href', hrefOutput(url, originalHref));
      } catch (e) {}
    });
  }

  function updateCartAttributes(attr) {
    var keys = Object.keys(attr);
    if (!keys.length) return Promise.resolve();

    return fetch('/cart.js')
      .then(function (r) {
        return r.json();
      })
      .then(function (cart) {
        var attributes = Object.assign({}, cart.attributes || {});
        keys.forEach(function (key) {
          attributes[key] = attr[key];
        });
        return fetch('/cart/update.js', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Accept: 'application/json',
            'X-Requested-With': 'XMLHttpRequest',
          },
          body: JSON.stringify({ attributes: attributes }),
        });
      })
      .catch(function () {});
  }

  function syncCartFromMerged(attr) {
    var merged =
      attr && typeof attr === 'object' && Object.keys(attr).length
        ? attr
        : mergeAttribution();
    return updateCartAttributes(merged);
  }

  window.TrackiAttribution = {
    getMerged: mergeAttribution,
    syncCart: syncCartFromMerged,
  };

  function init() {
    var attr = mergeAttribution();
    decorateLinks(attr);
    updateCartAttributes(attr);
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
