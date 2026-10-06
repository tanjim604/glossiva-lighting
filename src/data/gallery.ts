import type { ImageMetadata } from 'astro';
import evergreens from '../assets/photos/lit-evergreens.jpg';
import napaHome from '../assets/photos/napa-home.jpg';
import redDoor from '../assets/photos/wreath-red-door.jpg';
import streetHomes from '../assets/photos/roofline-street.jpg';
import timberHouse from '../assets/photos/timber-house.jpg';
import treesBushes from '../assets/photos/trees-bushes-home.jpg';

/**
 * Gallery photos. These are public-domain (CC0) stand-ins, so no credit is required.
 * Swap in photos of Glossiva's own installs when they're available.
 */
export interface GalleryPhoto {
  src: ImageMetadata;
  alt: string;
}

export const gallery: GalleryPhoto[] = [
  { src: streetHomes, alt: 'Homes with rooflines and decks outlined in Christmas lights' },
  { src: treesBushes, alt: 'House with a lit tree, glowing bushes and a light arch' },
  { src: timberHouse, alt: 'Timber-framed house with colourful Christmas lights' },
  { src: redDoor, alt: 'Red front door with a Christmas wreath' },
  { src: evergreens, alt: 'Evergreen trees wrapped in warm white lights' },
  { src: napaHome, alt: 'Single-storey home decorated with Christmas lights at night' },
];
