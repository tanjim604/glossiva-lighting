import type { IconName } from '../components/Icon.astro';

export type PackageId = 'classic' | 'signature' | 'christmas' | 'custom';

export interface Package {
  id: PackageId;
  name: string;
  tier: string;
  description: string;
  /** Large price line, e.g. "$7", plus the small unit text next to it. */
  price: { main: string; unit?: string };
  services: { label: string; icon: IconName }[];
  features: string[];
  featured?: string;
}

const roofline = { label: 'Roofline', icon: 'home' } as const;
const wreaths = { label: 'Wreaths', icon: 'wreath' } as const;
const trees = { label: 'Trees', icon: 'tree' } as const;
const bushes = { label: 'Bushes', icon: 'leaf' } as const;

export const packages: Package[] = [
  {
    id: 'classic',
    name: 'Classic Roofline',
    tier: 'Essential',
    description: 'Clean, crisp roofline lighting that outlines your whole home.',
    price: { main: '$7', unit: '/ bulb / ft' },
    services: [roofline],
    features: ['Roofline lighting at $7/bulb/ft', 'Professional installation', 'Takedown in January', 'Rental: nothing to buy or store'],
  },
  {
    id: 'signature',
    name: 'Signature Home',
    tier: 'Enhanced',
    description: 'Roofline lighting paired with festive wreaths for a welcoming entrance.',
    price: { main: '$7', unit: '/ ft + wreaths' },
    services: [roofline, wreaths],
    features: ['Everything in Classic Roofline', 'Festive wreaths', 'Installed and taken down for you'],
  },
  {
    id: 'christmas',
    name: 'Glossiva Christmas',
    tier: 'Full showcase',
    description: 'The complete display: rooflines, wreaths, trees and bushes.',
    price: { main: 'Full property' },
    services: [roofline, wreaths, trees, bushes],
    features: ['Roofline lighting at $7/bulb/ft', 'Festive wreaths', 'Lit trees', 'Lit bushes and shrubs'],
    featured: 'Recommended',
  },
  {
    id: 'custom',
    name: 'Glossiva Custom',
    tier: 'Bespoke',
    description: 'A display designed around your property, from first idea to January takedown.',
    price: { main: 'Custom design' },
    services: [{ label: 'Custom design', icon: 'sparkle' }],
    features: ['A design planned with you', 'Any mix of lights, wreaths, trees and bushes', 'Ideal for larger homes'],
  },
];

// TODO: confirm how wreaths and trees & bushes are priced.
export const packagesFootnote =
  'Roofline lighting is $7 per bulb per foot. Wreaths, trees and bushes are priced in your free quote.';
