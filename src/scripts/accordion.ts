/**
 * Smooth open/close for <details data-accordion>. Native <details> keeps it accessible
 * and working without JS; this only animates the height.
 */
export function initAccordion(reduceMotion: boolean) {
  if (reduceMotion) return;

  document.querySelectorAll<HTMLDetailsElement>('details[data-accordion]').forEach((details) => {
    const summary = details.querySelector('summary');
    const content = details.querySelector<HTMLElement>('[data-accordion-content]');
    if (!summary || !content) return;

    let animation: Animation | null = null;
    const easing = 'cubic-bezier(0.16, 1, 0.3, 1)';

    summary.addEventListener('click', (event) => {
      event.preventDefault();
      animation?.cancel();

      if (!details.open) {
        details.open = true;
        const height = content.offsetHeight;
        animation = content.animate(
          [
            { height: '0px', opacity: 0 },
            { height: `${height}px`, opacity: 1 },
          ],
          { duration: 460, easing },
        );
        animation.onfinish = () => (animation = null);
      } else {
        const height = content.offsetHeight;
        animation = content.animate(
          [
            { height: `${height}px`, opacity: 1 },
            { height: '0px', opacity: 0 },
          ],
          { duration: 340, easing },
        );
        animation.onfinish = () => {
          details.open = false;
          animation = null;
        };
      }
    });
  });
}
