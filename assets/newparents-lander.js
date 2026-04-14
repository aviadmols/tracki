/* ============================================================
   newparents-lander.js — Tracki Parents (device-only) interactions
   ============================================================ */

// ── Announce bar close ──────────────────────────────────────
const announceBar  = document.getElementById('announce-bar');
const announceClose = document.getElementById('announce-close');
const nav = document.getElementById('nav');

function updateNavTop() {
  if (!announceBar || announceBar.classList.contains('hidden')) {
    nav.classList.add('no-bar');
    nav.style.top = '0';
  } else {
    nav.style.top = announceBar.offsetHeight + 'px';
  }
}

if (announceClose) {
  announceClose.addEventListener('click', () => {
    announceBar.classList.add('hidden');
    setTimeout(updateNavTop, 300);
  });
}
updateNavTop();
window.addEventListener('resize', updateNavTop);

// ── Mobile sticky bar after hero ───────────────────────────
const mobBar = document.getElementById('mob-bar');
const heroEl = document.getElementById('hero');

const heroObs = new IntersectionObserver(([e]) => {
  if (e.isIntersecting) {
    mobBar?.classList.remove('visible');
  } else {
    mobBar?.classList.add('visible');
  }
}, { threshold: 0.05 });
if (heroEl) heroObs.observe(heroEl);

// ── FAQ accordion ──────────────────────────────────────────
window.toggleFaq = function(id) {
  const item = document.getElementById(id);
  const isActive = item.classList.contains('active');
  document.querySelectorAll('.faq-item').forEach(i => i.classList.remove('active'));
  if (!isActive) item.classList.add('active');
};

// ── Scroll reveal ──────────────────────────────────────────
const revealEls = document.querySelectorAll(
  '.feature-card, .review-card, .hiw-step, .pricing-card, .stat-item, .compare-card, .spec-row, .faq-item, .device-img-wrap'
);

const revealObs = new IntersectionObserver((entries) => {
  entries.forEach((entry, i) => {
    if (entry.isIntersecting) {
      const delay = entry.target.dataset.delay || (i % 4) * 80;
      setTimeout(() => entry.target.classList.add('visible'), Number(delay));
      revealObs.unobserve(entry.target);
    }
  });
}, { threshold: 0.1, rootMargin: '0px 0px -32px 0px' });

revealEls.forEach(el => {
  el.classList.add('reveal');
  revealObs.observe(el);
});

// ── Smooth anchor scroll ───────────────────────────────────
document.querySelectorAll('a[href^="#"]').forEach(a => {
  a.addEventListener('click', e => {
    const target = document.querySelector(a.getAttribute('href'));
    if (!target) return;
    e.preventDefault();
    const offset = (nav?.offsetHeight || 64) + 16;
    window.scrollTo({ top: target.getBoundingClientRect().top + scrollY - offset, behavior: 'smooth' });
  });
});

// ── Live tracker counter ───────────────────────────────────
let count = 3841;
const livePillText = document.querySelector('.hero-pill');
if (livePillText) {
  setInterval(() => {
    count += Math.floor(Math.random() * 3) - 1;
    count = Math.max(3820, count);
  }, 5000);
}

// ── Battery bar fill animation ─────────────────────────────
const batteryFill = document.querySelector('.battery-fill');
if (batteryFill) {
  setTimeout(() => { batteryFill.style.width = '87%'; }, 600);
}

// ── Nav active link on scroll ──────────────────────────────
const sections = document.querySelectorAll('section[id]');
const navLinks = document.querySelectorAll('.nav-links a');

const sectionObs = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      navLinks.forEach(link => {
        link.style.color = link.getAttribute('href') === `#${entry.target.id}`
          ? '#46c160' : '';
      });
    }
  });
}, { threshold: 0.4 });

sections.forEach(s => sectionObs.observe(s));

// ── Hamburger menu (mobile) ────────────────────────────────
const hamburger = document.getElementById('nav-hamburger');
const navLinksEl = document.getElementById('nav-links');

if (hamburger) {
  hamburger.addEventListener('click', () => {
    const open = navLinksEl.style.display === 'flex';
    navLinksEl.style.cssText = open
      ? ''
      : 'display:flex;flex-direction:column;position:absolute;top:64px;left:0;right:0;background:rgba(17,24,39,.98);padding:20px 28px;gap:18px;border-bottom:1px solid rgba(255,255,255,.08)';
  });
}

// ── CTA analytics logging ──────────────────────────────────
document.querySelectorAll('[id$="-cta"], [id$="cta-main"]').forEach(btn => {
  btn.addEventListener('click', () => {
    console.log('[Tracki]', 'CTA click:', btn.id);
  });
});

// ── Video Playback Logic ───────────────────────────────────
const video = document.getElementById('tracki-video');
const playBtn = document.getElementById('video-play-btn');
const videoWrap = document.querySelector('.video-wrap');

if (video && playBtn && videoWrap) {
  videoWrap.addEventListener('click', () => {
    if (video.paused) {
      video.muted = false;
      video.play();
      playBtn.classList.add('hidden');
    } else {
      video.pause();
      playBtn.classList.remove('hidden');
    }
  });

  video.addEventListener('ended', () => {
    playBtn.classList.remove('hidden');
  });

  let hasPlayed = false;
  const vidObs = new IntersectionObserver(([e]) => {
    if (e.isIntersecting && !hasPlayed) {
      hasPlayed = true;
      video.muted = true;
      video.play().then(() => {
        playBtn.classList.add('hidden');
      }).catch(err => {
        console.warn('Autoplay prevented:', err);
        playBtn.classList.remove('hidden');
      });
    } else if (!e.isIntersecting && !video.paused) {
      video.pause();
      playBtn.classList.remove('hidden');
    }
  }, { threshold: 0.5 });
  vidObs.observe(videoWrap);
}
