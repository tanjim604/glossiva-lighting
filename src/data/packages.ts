export type PackageId = 'classic' | 'signature' | 'christmas' | 'custom';

export interface Package {
  id: PackageId;
  name: string;
  tagline: string;
  /** Lighting level shown in the house illustration (1–4). */
  level: 1 | 2 | 3 | 4;
  /** What this tier adds on top of the previous one. */
  adds: string[];
  /** Everything included, shown as the checklist. */
  includes: string[];
  priceLine: string;
  badge?: string;
}

export const packages: Package[] = [
  {
    id: 'classic',
    name: 'Classic Roofline',
    tagline: 'Clean, crisp lines that make the whole house glow.',
    level: 1,
    adds: ['Roofline lighting'],
    includes: ['Roofline lighting'],
    priceLine: 'Roofline at $7/bulb/ft',
  },
  {
    id: 'signature',
    name: 'Signature Home',
    tagline: 'A warm welcome, right at the front door.',
    level: 2,
    adds: ['Wreaths'],
    includes: ['Roofline lighting', 'Wreaths'],
    priceLine: 'Roofline at $7/bulb/ft',
  },
  {
    id: 'christmas',
    name: 'Glossiva Christmas',
    tagline: 'The full festive look, from rooftop to garden.',
    level: 3,
    adds: ['Trees & bushes'],
    includes: ['Roofline lighting', 'Wreaths', 'Trees & bushes'],
    priceLine: 'Roofline at $7/bulb/ft',
    badge: 'Recommended',
  },
  {
    id: 'custom',
    name: 'Glossiva Custom',
    tagline: 'Dream it up and we’ll light it, designed around your home.',
    level: 4,
    adds: ['Custom design'],
    includes: ['A display designed for your home', 'Any mix of lights, wreaths, trees & bushes'],
    priceLine: 'Custom quote',
  },
];

// TODO: confirm how wreaths and trees & bushes are priced.
export const packagesFootnote =
  'Roofline lighting is $7 per bulb per foot. Wreaths, trees & bushes are priced in your free quote.';
