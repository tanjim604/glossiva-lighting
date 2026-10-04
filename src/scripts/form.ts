/**
 * Quote form: ad-source capture, package pre-fill, inline validation, and AJAX submit.
 * Without JS the form still posts to the endpoint (/api/quote on Vercel) and lands on /thanks.
 * When no endpoint is configured (the GitHub Pages preview), submitting explains that instead of failing.
 */
const TRACKING = ['utm_source', 'utm_medium', 'utm_campaign', 'utm_content', 'utm_term', 'fbclid'] as const;
const STORAGE_KEY = 'glossiva-source';

type FieldName = 'name' | 'phone' | 'email' | 'address';

const messages: Record<FieldName, (value: string) => string | null> = {
  name: (v) => (v.trim().length >= 2 ? null : 'Please enter your name.'),
  phone: (v) => (v.replace(/\D/g, '').length >= 10 ? null : 'Please enter a phone number we can reach you at.'),
  email: (v) => (!v.trim() || /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(v.trim()) ? null : 'That email doesn’t look quite right.'),
  address: (v) => (v.trim().length >= 3 ? null : 'Please add your address or neighbourhood.'),
};

export function initQuoteForm() {
  const form = document.querySelector<HTMLFormElement>('[data-quote-form]');
  if (!form) return;

  const loadedAt = performance.now();
  const select = form.querySelector<HTMLSelectElement>('[data-package-select]');
  const submit = form.querySelector<HTMLButtonElement>('[data-submit]')!;
  const formError = form.querySelector<HTMLElement>('[data-form-error]')!;
  const success = document.querySelector<HTMLElement>('[data-form-success]');
  let attempted = false;

  captureSource(form);
  initPackagePicking(select);

  // After the first submit attempt, re-check fields as people fix them.
  (Object.keys(messages) as FieldName[]).forEach((name) => {
    const input = form.elements.namedItem(name) as HTMLInputElement | null;
    input?.addEventListener('input', () => attempted && validateField(form, name));
    input?.addEventListener('blur', () => attempted && validateField(form, name));
  });

  form.addEventListener('submit', async (event) => {
    event.preventDefault();
    attempted = true;
    formError.hidden = true;

    const invalid = (Object.keys(messages) as FieldName[]).filter((name) => !validateField(form, name));
    if (invalid.length) {
      (form.elements.namedItem(invalid[0]) as HTMLInputElement).focus();
      return;
    }

    if (!form.dataset.endpoint) {
      formError.textContent = form.dataset.notConnectedText ?? 'Online quote requests aren’t switched on yet.';
      formError.hidden = false;
      return;
    }

    setField(form, 'elapsed', String(Math.round(performance.now() - loadedAt)));
    setField(form, 'page', location.origin + location.pathname);

    submit.setAttribute('aria-busy', 'true');
    submit.querySelector('.submit-label')!.textContent = 'Sending…';

    try {
      const response = await fetch(form.dataset.endpoint, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
        body: JSON.stringify(Object.fromEntries(new FormData(form))),
      });
      const result = await response.json().catch(() => ({}));

      if (!response.ok || !result.ok) {
        if (result.errors) {
          for (const [name, message] of Object.entries(result.errors as Record<string, string>)) {
            showError(form, name, message);
          }
        }
        throw new Error(result.error ?? `HTTP ${response.status}`);
      }

      const firstName = String(new FormData(form).get('name') ?? '').trim().split(/\s+/)[0];
      form.hidden = true;
      if (success) {
        const nameSlot = success.querySelector('[data-success-name]');
        if (nameSlot && firstName) nameSlot.textContent = `, ${firstName}`;
        success.hidden = false;
        success.focus({ preventScroll: true });
        success.scrollIntoView({ behavior: 'smooth', block: 'center' });
      }
      // Hook for analytics (e.g. a Meta Pixel `Lead` event) if it's added later.
      window.dispatchEvent(new CustomEvent('quote:submitted', { detail: { package: select?.value } }));
    } catch {
      formError.textContent = form.dataset.errorText ?? 'Something went wrong. Please try again.';
      formError.hidden = false;
    } finally {
      submit.removeAttribute('aria-busy');
      submit.querySelector('.submit-label')!.textContent = 'Send my free quote request';
    }
  });
}

function validateField(form: HTMLFormElement, name: FieldName) {
  const input = form.elements.namedItem(name) as HTMLInputElement | null;
  if (!input) return true;
  const message = messages[name](input.value);
  if (message) showError(form, name, message);
  else clearError(form, name);
  return !message;
}

function showError(form: HTMLFormElement, name: string, message: string) {
  const input = form.elements.namedItem(name) as HTMLInputElement | null;
  const error = form.querySelector<HTMLElement>(`#q-${name}-err`);
  input?.setAttribute('aria-invalid', 'true');
  if (error) {
    error.textContent = message;
    error.hidden = false;
  }
}

function clearError(form: HTMLFormElement, name: string) {
  const input = form.elements.namedItem(name) as HTMLInputElement | null;
  const error = form.querySelector<HTMLElement>(`#q-${name}-err`);
  input?.removeAttribute('aria-invalid');
  if (error) error.hidden = true;
}

function setField(form: HTMLFormElement, name: string, value: string) {
  const input = form.elements.namedItem(name) as HTMLInputElement | null;
  if (input) input.value = value;
}

/** Remember which ad brought the visitor (first touch this session) and put it in hidden fields. */
function captureSource(form: HTMLFormElement) {
  const params = new URLSearchParams(location.search);
  let source: Record<string, string> = {};
  try {
    source = JSON.parse(sessionStorage.getItem(STORAGE_KEY) ?? '{}');
  } catch {}
  if (TRACKING.some((key) => params.has(key))) {
    source = Object.fromEntries(TRACKING.filter((key) => params.has(key)).map((key) => [key, params.get(key)!.slice(0, 200)]));
    try {
      sessionStorage.setItem(STORAGE_KEY, JSON.stringify(source));
    } catch {}
  }
  for (const [key, value] of Object.entries(source)) setField(form, key, value);
}

/** "Choose …" buttons on the package cards (and ?package=…) pre-select the package. */
function initPackagePicking(select: HTMLSelectElement | null) {
  if (!select) return;
  const pick = (id: string | null | undefined) => {
    if (!id || !Array.from(select.options).some((o) => o.value === id)) return;
    select.value = id;
    select.classList.remove('is-picked');
    void select.offsetWidth; // restart the highlight animation
    select.classList.add('is-picked');
  };
  pick(new URLSearchParams(location.search).get('package'));
  document.querySelectorAll<HTMLElement>('[data-package-pick]').forEach((btn) =>
    btn.addEventListener('click', () => pick(btn.dataset.packagePick)),
  );
}
