import Lenis from 'lenis';
import 'lenis/dist/lenis.css';

/** Desktop-only momentum scrolling, like the Framer site the design takes its feel from. */
export function initSmoothScroll() {
  const lenis = new Lenis({
    autoRaf: true,
    lerp: 0.1,
    // Anchor links use each section's CSS scroll-margin-top, same as native scrolling.
    anchors: true,
  });
  // Let the lightbox and other overlays scroll natively.
  document.addEventListener('lightbox:open', () => lenis.stop());
  document.addEventListener('lightbox:close', () => lenis.start());
}
