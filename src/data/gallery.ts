import type { ImageMetadata } from 'astro';
import g01 from '../assets/gallery/g01-roofline-wreath.jpg';
import g02 from '../assets/gallery/g02-gabled-roofline.jpg';
import g03 from '../assets/gallery/g03-trees-shrubs.jpg';
import g04 from '../assets/gallery/g04-full-property.jpg';
import g05 from '../assets/gallery/g05-porch-wreath.jpg';
import g06 from '../assets/gallery/g06-snowy-home.jpg';
import g07 from '../assets/gallery/g07-evergreens.jpg';
import g08 from '../assets/gallery/g08-street.jpg';

export interface GalleryPhoto {
  src: ImageMetadata;
  alt: string;
  /** Aspect ratio of the grid tile (the photo is cropped to fit). */
  ratio: '4/5' | '1/1' | '4/3';
  /**
   * PLACEHOLDER photos from Wikimedia Commons, used under their CC licences until
   * Glossiva has photos of its own installs. Swap the import and delete `credit`.
   */
  credit?: { author: string; license: string; url: string };
}

export const gallery: GalleryPhoto[] = [
  {
    src: g01,
    alt: 'Two-storey home with warm white roofline lights and a lit wreath',
    ratio: '4/5',
    credit: { author: 'Corey Coyle', license: 'CC BY 3.0', url: 'https://commons.wikimedia.org/wiki/File:2014_Waunakee_Christmas_Lights_-_panoramio.jpg' },
  },
  {
    src: g03,
    alt: 'White house with glowing shrubs and trees in the snow',
    ratio: '1/1',
    credit: { author: 'Ross Dunn', license: 'CC BY-SA 2.0', url: 'https://commons.wikimedia.org/wiki/File:Neighbourhood_Christmas_Lights_(49229768087).jpg' },
  },
  {
    src: g02,
    alt: 'Steep gabled roofline outlined in warm white lights',
    ratio: '4/3',
    credit: { author: 'Hullian111', license: 'CC BY-SA 4.0', url: 'https://commons.wikimedia.org/wiki/File:Kirk_Ella_%27Golden_Mile%27_Christmas_Lights_2023,_West_Ella_Road_Homes_09.jpg' },
  },
  {
    src: g05,
    alt: 'Front porch with a wreath on the door and string lights',
    ratio: '4/5',
    credit: { author: 'Ross Dunn', license: 'CC BY-SA 2.0', url: 'https://commons.wikimedia.org/wiki/File:Neighbourhood_Christmas_Lights_(49229543191).jpg' },
  },
  {
    src: g04,
    alt: 'Whole property lit with roofline lights, glowing trees and light arches',
    ratio: '4/5',
    credit: { author: 'Mukilteoedits', license: 'CC BY-SA 4.0', url: 'https://commons.wikimedia.org/wiki/File:Lights_on_a_house_on_Peacock_Lane.jpg' },
  },
  {
    src: g06,
    alt: 'Snowy home with colourful lights around the windows and porch',
    ratio: '4/3',
    credit: { author: 'Wilfredor', license: 'CC BY-SA 4.0', url: 'https://commons.wikimedia.org/wiki/File:December_25_at_1_am_2017,_Qu%C3%A9bec_City_Limoilou,_Canad%C3%A1_04.jpg' },
  },
  {
    src: g07,
    alt: 'Evergreen trees wrapped in warm lights on a winter night',
    ratio: '1/1',
    credit: { author: 'epSos.de', license: 'CC BY 2.0', url: 'https://commons.wikimedia.org/wiki/File:Glowing_Christmas_Tree_Lights_in_the_Winter_Night.jpg' },
  },
  {
    src: g08,
    alt: 'Neighbourhood homes with glowing rooflines at night',
    ratio: '4/5',
    credit: { author: 'Michael from Calgary', license: 'CC BY 2.0', url: 'https://commons.wikimedia.org/wiki/File:Lights_Of_December_December_1,_2011_(6439170211).jpg' },
  },
];

/** Credit for the placeholder hero photo. Set to `null` once it's replaced with your own. */
export const heroCredit: GalleryPhoto['credit'] | null = {
  author: 'Ross Dunn',
  license: 'CC BY-SA 2.0',
  url: 'https://commons.wikimedia.org/wiki/File:Christmas_lights_in_Ottawa_(49235590818).jpg',
};
