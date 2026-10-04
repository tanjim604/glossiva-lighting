// Single source of truth for business details. Everything on the page reads from here,
// so changing a value updates every place it appears.
// Values marked TODO are placeholders waiting on the owner.

export const site = {
  name: 'Glossiva Lighting & Decor',
  shortName: 'Glossiva',
  tagline: 'Christmas light rental & installation in Kamloops, BC',

  // The two headline facts.
  price: {
    amount: '$7',
    unit: 'per bulb / ft',
    compact: '$7/bulb/ft',
    short: '$7/ft',
  },
  insurance: {
    amount: '$3M',
    label: 'insurance coverage',
  },

  // TODO: real contact details.
  phone: '', // e.g. '250-555-0123' — leave empty to hide phone links
  email: '', // e.g. 'hello@glossivalighting.ca' — leave empty to hide
  serviceArea: 'Kamloops & surrounding area', // TODO: confirm (Sun Peaks? Chase?)
  city: 'Kamloops',
  region: 'BC',

  // TODO: real social links (leave empty to hide).
  social: {
    instagram: '',
    facebook: '',
  },

  responseTime: 'within 24 hours', // TODO: confirm this promise
} as const;

export const nav = [
  { label: 'Packages', href: '#packages' },
  { label: 'How it works', href: '#how-it-works' },
  { label: 'Why Glossiva', href: '#why' },
  { label: 'Gallery', href: '#gallery' },
  { label: 'FAQ', href: '#faq' },
] as const;

export const telHref = (phone: string) => `tel:${phone.replace(/[^\d+]/g, '')}`;
