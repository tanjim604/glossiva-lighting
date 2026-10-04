import type { APIContext, APIRoute } from 'astro';
import { NOTIFICATION_EMAIL, RESEND_API_KEY, RESEND_FROM } from 'astro:env/server';
import { Resend } from 'resend';
import { packages } from '../data/packages';

// The page is static; this endpoint runs on demand as a Vercel function. It is injected as /api/quote
// by astro.config.mjs for Vercel builds only (GitHub Pages can't run server code).
export const prerender = false;

const PACKAGE_LABELS: Record<string, string> = {
  'not-sure': 'Not sure yet',
  ...Object.fromEntries(packages.map((p) => [p.id, p.name])),
};
const SOURCE_KEYS = ['utm_source', 'utm_medium', 'utm_campaign', 'utm_content', 'utm_term', 'fbclid'] as const;

type Lead = {
  name: string;
  phone: string;
  email: string;
  address: string;
  package: string;
  notes: string;
  source: Partial<Record<(typeof SOURCE_KEYS)[number], string>>;
  page: string;
};

export const POST: APIRoute = async ({ request, redirect }) => {
  const wantsJson = (request.headers.get('content-type') ?? '').includes('application/json');

  let raw: Record<string, unknown>;
  try {
    raw = wantsJson ? await request.json() : Object.fromEntries(await request.formData());
  } catch {
    return json({ ok: false, error: 'bad_request' }, 400);
  }
  const field = (key: string, max: number) => String(raw[key] ?? '').trim().slice(0, max);

  // Bots: the hidden honeypot was filled, or the form was submitted faster than a person could.
  // Pretend it worked so they don't retry.
  const elapsed = Number(field('elapsed', 12));
  if (field('company', 200) || (elapsed > 0 && elapsed < 2500)) return done(wantsJson, redirect);

  const lead: Lead = {
    name: field('name', 80),
    phone: field('phone', 25),
    email: field('email', 120),
    address: field('address', 160),
    package: PACKAGE_LABELS[field('package', 20)] ?? 'Not sure yet',
    notes: field('notes', 1000),
    source: Object.fromEntries(SOURCE_KEYS.map((k) => [k, field(k, 200)]).filter(([, v]) => v)),
    page: field('page', 300),
  };

  const errors = validate(lead);
  if (Object.keys(errors).length) {
    return wantsJson ? json({ ok: false, errors }, 422) : redirect('/#quote', 303);
  }

  try {
    await deliver(lead);
  } catch (err) {
    console.error('[quote] delivery failed:', err);
    return wantsJson ? json({ ok: false, error: 'send_failed' }, 502) : redirect('/#quote', 303);
  }
  return done(wantsJson, redirect);
};

function validate(lead: Lead) {
  const errors: Record<string, string> = {};
  if (lead.name.length < 2) errors.name = 'Please enter your name.';
  if (lead.phone.replace(/\D/g, '').length < 10) errors.phone = 'Please enter a phone number we can reach you at.';
  if (lead.email && !/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(lead.email)) errors.email = 'That email doesn’t look quite right.';
  if (lead.address.length < 3) errors.address = 'Please add your address or neighbourhood.';
  return errors;
}

async function deliver(lead: Lead) {
  if (!RESEND_API_KEY || !NOTIFICATION_EMAIL) {
    // Never lose a lead silently in production.
    if (import.meta.env.PROD) throw new Error('RESEND_API_KEY / NOTIFICATION_EMAIL are not set');
    console.info('[quote] RESEND_API_KEY not set, logging the lead instead of emailing it:\n', lead);
    return;
  }
  const resend = new Resend(RESEND_API_KEY);
  const { error } = await resend.emails.send({
    from: RESEND_FROM,
    to: [NOTIFICATION_EMAIL],
    replyTo: lead.email || undefined,
    subject: `🎄 New quote request: ${lead.name} (${lead.package})`,
    html: emailHtml(lead),
    text: emailText(lead),
  });
  if (error) throw new Error(`${error.name}: ${error.message}`);
}

const escape = (s: string) =>
  s.replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' })[c]!);

function sourceSummary(lead: Lead) {
  const s = lead.source;
  if (!Object.keys(s).length) return 'Direct / unknown';
  const parts = [s.utm_source, s.utm_medium, s.utm_campaign, s.utm_content].filter(Boolean);
  return [parts.join(' · ') || 'Unknown campaign', s.fbclid ? '(Meta ad click)' : ''].filter(Boolean).join(' ');
}

function emailHtml(lead: Lead) {
  const phoneHref = `tel:${lead.phone.replace(/[^\d+]/g, '')}`;
  const row = (label: string, value: string) =>
    `<tr><td style="padding:10px 0;color:#55665c;font-size:13px;width:120px;vertical-align:top">${label}</td><td style="padding:10px 0;color:#1c2b24;font-size:15px;font-weight:600">${value}</td></tr>`;
  return `<!doctype html><html><body style="margin:0;background:#f8f1e4;padding:24px;font-family:-apple-system,Segoe UI,Helvetica,Arial,sans-serif">
  <div style="max-width:520px;margin:0 auto;background:#fffcf7;border-radius:20px;padding:28px;border:1px solid #e8dcc8">
    <p style="margin:0 0 4px;color:#9a6b17;font-size:12px;font-weight:700;letter-spacing:.12em;text-transform:uppercase">New quote request</p>
    <h1 style="margin:0 0 18px;color:#1f4a36;font-size:24px">${escape(lead.name)}</h1>
    <a href="${phoneHref}" style="display:inline-block;background:#b5364b;color:#fff;text-decoration:none;font-weight:700;padding:12px 22px;border-radius:999px;font-size:15px">Call ${escape(lead.phone)}</a>
    <table style="width:100%;border-collapse:collapse;margin-top:18px;border-top:1px solid #e8dcc8">
      ${row('Phone', `<a href="${phoneHref}" style="color:#1f4a36">${escape(lead.phone)}</a>`)}
      ${row('Email', lead.email ? `<a href="mailto:${escape(lead.email)}" style="color:#1f4a36">${escape(lead.email)}</a>` : '—')}
      ${row('Address', escape(lead.address))}
      ${row('Package', escape(lead.package))}
      ${row('Notes', lead.notes ? escape(lead.notes).replace(/\n/g, '<br>') : '—')}
      ${row('Came from', escape(sourceSummary(lead)))}
    </table>
    <p style="margin:18px 0 0;color:#55665c;font-size:12px">Sent from the quote form${lead.page ? ` on ${escape(lead.page)}` : ''}.</p>
  </div></body></html>`;
}

function emailText(lead: Lead) {
  return [
    `New quote request: ${lead.name}`,
    `Phone: ${lead.phone}`,
    `Email: ${lead.email || '-'}`,
    `Address: ${lead.address}`,
    `Package: ${lead.package}`,
    `Notes: ${lead.notes || '-'}`,
    `Came from: ${sourceSummary(lead)}`,
  ].join('\n');
}

function json(body: unknown, status = 200) {
  return new Response(JSON.stringify(body), { status, headers: { 'Content-Type': 'application/json' } });
}

function done(wantsJson: boolean, redirect: APIContext['redirect']) {
  return wantsJson ? json({ ok: true }) : redirect('/thanks', 303);
}
