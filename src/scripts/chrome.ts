/** Page chrome: header shadow on scroll, the mobile menu, and the floating mobile CTA. */
export function initChrome() {
  initHeader();
  initMobileMenu();
  initStickyCta();
}

function initHeader() {
  const header = document.querySelector<HTMLElement>('[data-header]');
  if (!header) return;
  let ticking = false;
  const update = () => {
    header.classList.toggle('is-scrolled', window.scrollY > 40);
    ticking = false;
  };
  window.addEventListener(
    'scroll',
    () => {
      if (ticking) return;
      ticking = true;
      requestAnimationFrame(update);
    },
    { passive: true },
  );
  update();
}

function initMobileMenu() {
  const toggle = document.querySelector<HTMLButtonElement>('[data-menu-toggle]');
  const menu = document.querySelector<HTMLElement>('[data-mobile-menu]');
  if (!toggle || !menu) return;

  const setOpen = (open: boolean) => {
    menu.hidden = !open;
    toggle.setAttribute('aria-expanded', String(open));
    toggle.setAttribute('aria-label', open ? 'Close menu' : 'Open menu');
  };
  toggle.addEventListener('click', () => setOpen(menu.hidden !== false));
  menu.querySelectorAll('[data-menu-link]').forEach((link) => link.addEventListener('click', () => setOpen(false)));
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && !menu.hidden) {
      setOpen(false);
      toggle.focus();
    }
  });
  // Close if the layout switches to desktop while open.
  matchMedia('(min-width: 64rem)').addEventListener('change', (e) => e.matches && setOpen(false));
}

/** Show the floating "Get my free quote" pill once the hero CTA is scrolled past, and hide it near the form/footer. */
function initStickyCta() {
  const sticky = document.querySelector<HTMLElement>('[data-sticky-cta]');
  const heroCta = document.querySelector('[data-hero-cta]');
  if (!sticky || !heroCta) return;
  const link = sticky.querySelector('a');

  let pastHero = false;
  const blockers = new Set<Element>();
  const update = () => {
    const show = pastHero && blockers.size === 0;
    sticky.classList.toggle('is-visible', show);
    link?.setAttribute('tabindex', show ? '0' : '-1');
  };

  new IntersectionObserver(([entry]) => {
    pastHero = !entry.isIntersecting && entry.boundingClientRect.top < 0;
    update();
  }).observe(heroCta);

  const io = new IntersectionObserver((entries) => {
    for (const entry of entries) {
      if (entry.isIntersecting) blockers.add(entry.target);
      else blockers.delete(entry.target);
    }
    update();
  });
  document.querySelectorAll('#quote, [data-hide-sticky]').forEach((el) => io.observe(el));
}
