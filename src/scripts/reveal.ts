/**
 * Scroll reveals. Elements with [data-reveal] start hidden (only when JS is running — see
 * `html.js` in global.css) and get `.is-in` once they scroll into view.
 * A [data-stagger="90"] parent staggers its direct [data-reveal] children by that many ms.
 */
export function initReveal() {
  const items = document.querySelectorAll<HTMLElement>('[data-reveal]');
  if (!items.length) return;

  document.querySelectorAll<HTMLElement>('[data-stagger]').forEach((group) => {
    const step = Number(group.dataset.stagger) || 90;
    group.querySelectorAll<HTMLElement>(':scope > [data-reveal]').forEach((el, i) => {
      el.style.setProperty('--d', `${i * step}ms`);
    });
  });

  if (!('IntersectionObserver' in window)) {
    items.forEach((el) => el.classList.add('is-in'));
    return;
  }

  const io = new IntersectionObserver(
    (entries) => {
      for (const entry of entries) {
        if (!entry.isIntersecting) continue;
        entry.target.classList.add('is-in');
        io.unobserve(entry.target);
      }
    },
    { rootMargin: '0px 0px -8% 0px', threshold: 0.12 },
  );
  items.forEach((el) => io.observe(el));
}
