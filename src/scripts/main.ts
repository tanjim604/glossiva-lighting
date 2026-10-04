import { initAccordion } from './accordion';
import { initChrome } from './chrome';
import { initQuoteForm } from './form';
import { initLightbox } from './lightbox';
import { initReveal } from './reveal';

const reduceMotion = matchMedia('(prefers-reduced-motion: reduce)').matches;

initReveal();
initChrome();
initAccordion(reduceMotion);
initLightbox();
initQuoteForm();

// Momentum scrolling for mouse/trackpad only; phones keep native touch scrolling.
if (!reduceMotion && matchMedia('(hover: hover) and (pointer: fine)').matches) {
  import('./smooth-scroll').then((m) => m.initSmoothScroll());
}
