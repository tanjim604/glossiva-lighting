/** Page chrome: header scroll state, the floating mobile CTA, light strings, and pausing off-screen animation. */
export function initChrome() {
  initHeader();
  initStickyCta();
  initLightStrings();
  initPauseOffscreen();
}

function initHeader() {
  const header = document.querySelector<HTMLElement>('[data-header]');
  if (!header) return;
  let ticking = false;
  const update = () => {
    header.classList.toggle('is-scrolled', window.scrollY > 16);
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

  const hideNear = document.querySelectorAll('#quote, [data-hide-sticky]');
  const io = new IntersectionObserver((entries) => {
    for (const entry of entries) {
      if (entry.isIntersecting) blockers.add(entry.target);
      else blockers.delete(entry.target);
    }
    update();
  });
  hideNear.forEach((el) => io.observe(el));
}

/** Light strings that aren't autoplaying switch on the first time they scroll into view. */
function initLightStrings() {
  const strings = document.querySelectorAll<HTMLElement>('[data-light-string]');
  if (!strings.length) return;
  const io = new IntersectionObserver(
    (entries) => {
      for (const entry of entries) {
        if (!entry.isIntersecting) continue;
        entry.target.classList.add('is-on');
        io.unobserve(entry.target);
      }
    },
    { threshold: 0.4 },
  );
  strings.forEach((el) => io.observe(el));
}

/** Infinite animations (twinkle, bokeh, sway) stop running while their section is off-screen. */
function initPauseOffscreen() {
  const sections = document.querySelectorAll<HTMLElement>('[data-pause-offscreen]');
  const io = new IntersectionObserver((entries) => {
    for (const entry of entries) entry.target.classList.toggle('is-paused', !entry.isIntersecting);
  });
  sections.forEach((el) => io.observe(el));
}
