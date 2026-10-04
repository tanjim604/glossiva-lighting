/** Gallery lightbox on a native <dialog>: Esc to close, arrow keys, and swipe on touch. */
export function initLightbox() {
  const dialog = document.querySelector<HTMLDialogElement>('[data-lightbox]');
  const triggers = Array.from(document.querySelectorAll<HTMLButtonElement>('[data-lightbox-item]'));
  if (!dialog || !triggers.length || typeof dialog.showModal !== 'function') return;

  const img = dialog.querySelector<HTMLImageElement>('[data-lightbox-img]')!;
  const altText = dialog.querySelector<HTMLElement>('[data-lightbox-alt]')!;
  const credit = dialog.querySelector<HTMLAnchorElement>('[data-lightbox-credit]')!;
  let index = 0;
  let opener: HTMLElement | null = null;
  let swiped = false;

  const render = (i: number, animate = true) => {
    index = (i + triggers.length) % triggers.length;
    const t = triggers[index].dataset;
    const apply = () => {
      img.src = t.full ?? '';
      img.alt = t.alt ?? '';
      altText.textContent = t.alt ?? '';
      credit.textContent = t.credit ?? '';
      credit.hidden = !t.credit;
      if (t.creditUrl) credit.href = t.creditUrl;
      img.classList.remove('is-swapping');
    };
    if (!animate) return apply();
    img.classList.add('is-swapping');
    window.setTimeout(apply, 180);
  };

  const close = () => dialog.close();

  triggers.forEach((btn, i) =>
    btn.addEventListener('click', () => {
      opener = btn;
      render(i, false);
      dialog.showModal();
      document.dispatchEvent(new Event('lightbox:open'));
    }),
  );

  dialog.addEventListener('close', () => {
    document.dispatchEvent(new Event('lightbox:close'));
    opener?.focus();
  });
  // Click on the backdrop (outside the stage and buttons) closes.
  dialog.addEventListener('click', (e) => {
    if (swiped) return void (swiped = false);
    if (e.target === dialog) close();
  });
  dialog.querySelector('[data-lightbox-close]')?.addEventListener('click', close);
  dialog.querySelector('[data-lightbox-prev]')?.addEventListener('click', () => render(index - 1));
  dialog.querySelector('[data-lightbox-next]')?.addEventListener('click', () => render(index + 1));
  dialog.addEventListener('keydown', (e) => {
    if (e.key === 'ArrowLeft') render(index - 1);
    if (e.key === 'ArrowRight') render(index + 1);
  });

  // Swipe left/right.
  let startX = 0;
  let startY = 0;
  dialog.addEventListener('pointerdown', (e) => {
    startX = e.clientX;
    startY = e.clientY;
  });
  dialog.addEventListener('pointerup', (e) => {
    const dx = e.clientX - startX;
    swiped = Math.abs(dx) > 50 && Math.abs(dx) > Math.abs(e.clientY - startY);
    if (swiped) render(index + (dx < 0 ? 1 : -1));
  });
}
