import type { ImageMetadata } from 'astro';
import customDisplay from '../assets/photos/custom-display.jpg';
import rooflineGable from '../assets/photos/roofline-gable.jpg';
import treesBushes from '../assets/photos/trees-bushes-home.jpg';
import wreathDoor from '../assets/photos/wreath-door.jpg';

export type PackageId = 'classic' | 'signature' | 'christmas' | 'custom';

export interface Package {
  id: PackageId;
  name: string;
  tier: string;
  /** Public-domain (CC0) photo; swap for a photo of your own install later. */
  image: ImageMetadata;
  imageAlt: string;
  /** Large price line, e.g. "$7", plus the small unit text next to it. */
  price: { main: string; unit?: string };
  features: string[];
  featured?: string;
}

export const packages: Package[] = [
  {
    id: 'classic',
    name: 'Classic Roofline',
    tier: 'Essential',
    image: rooflineGable,
    imageAlt: 'House with its roofline outlined in warm white lights',
    price: { main: '$7', unit: '/ bulb / ft' },
    features: ['Roofline lighting', 'Install & January takedown'],
  },
  {
    id: 'signature',
    name: 'Signature Home',
    tier: 'Enhanced',
    image: wreathDoor,
    imageAlt: 'Front door decorated with a Christmas wreath',
    price: { main: '$7', unit: '/ ft + wreaths' },
    features: ['Roofline lighting', 'Festive wreaths'],
  },
  {
    id: 'christmas',
    name: 'Glossiva Christmas',
    tier: 'Full showcase',
    image: treesBushes,
    imageAlt: 'House with a lit tree, glowing bushes and a light arch',
    price: { main: 'Full property' },
    features: ['Roofline & wreaths', 'Lit trees & bushes'],
    featured: 'Recommended',
  },
  {
    id: 'custom',
    name: 'Glossiva Custom',
    tier: 'Bespoke',
    image: customDisplay,
    imageAlt: 'Home covered in an elaborate custom Christmas light display',
    price: { main: 'Custom design' },
    features: ['Designed for your home', 'Any mix of lights & décor'],
  },
];

// TODO: confirm how wreaths and trees & bushes are priced.
export const packagesFootnote = 'Wreaths, trees and bushes are priced in your free quote.';
