/* =====================================================
   PORTFOLIO — scroll.js
   Intersection Observer: reveal animations & skill bars
   ===================================================== */

/* ---- Scroll Reveal ---- */
const revealObserver = new IntersectionObserver(
  (entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        revealObserver.unobserve(entry.target); // fire once
      }
    });
  },
  { threshold: 0.12, rootMargin: '0px 0px -60px 0px' }
);

document.querySelectorAll('.reveal-up, .reveal-left, .reveal-right').forEach(el => {
  revealObserver.observe(el);
});

/* ---- Skill Bar Fill ---- */
const skillObserver = new IntersectionObserver(
  (entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.querySelectorAll('.skill-fill').forEach((bar, i) => {
          const targetWidth = bar.dataset.width;
          // Stagger each bar slightly
          setTimeout(() => {
            bar.style.width = targetWidth + '%';
          }, i * 100);
        });
        skillObserver.unobserve(entry.target);
      }
    });
  },
  { threshold: 0.2 }
);

document.querySelectorAll('.skill-category').forEach(el => {
  skillObserver.observe(el);
});

/* ---- Timeline items alternating reveal ---- */
document.querySelectorAll('.timeline-item').forEach((item, index) => {
  const card = item.querySelector('.timeline-card');
  if (!card) return;
  if (index % 2 === 0) {
    card.classList.add('reveal-left');
  } else {
    card.classList.add('reveal-right');
  }
  revealObserver.observe(card);
});
