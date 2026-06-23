// Shared Data: Categories, Brands, and Assets
// This file centralizes the core taxonomy and associated imagery for the entire platform.

import logo from '../ui/assets/rentalone-logo.png';
export { logo };

// Category Images (Relative to packages/shared/categories.ts)
import CameraImg from '../ui/assets/categories/camera.png';
import LenseImg from '../ui/assets/categories/lense.png';
import DroneImg from '../ui/assets/categories/drone.png';
import LightImg from '../ui/assets/categories/light.png';
import AudioImg from '../ui/assets/categories/mic.png';
import TripodImg from '../ui/assets/categories/tripod.png';

// Brand Images
import CanonImg from '../ui/assets/brands/canon.png';
import SonyImg from '../ui/assets/brands/sony.png';
import LeicaImg from '../ui/assets/brands/leica.png';
import NikonImg from '../ui/assets/brands/nikon.png';
import ZeissImg from '../ui/assets/brands/zeiss.png';

// 1. Simple category lists
export const CATEGORIES = [
  'All',
  'Cameras',
  'Lenses',
  'Drones',
  'Lights',
  'Audio',
  'Tripods',
];

export const CATEGORIES_LIST = [
  { category: 'Cameras', image: CameraImg, path: '/category?category=Cameras' },
  { category: 'Lenses', image: LenseImg, path: '/category?category=Lenses' },
  { category: 'Drones', image: DroneImg, path: '/category?category=Drones' },
  { category: 'Lights', image: LightImg, path: '/category?category=Lights' },
  { category: 'Audio', image: AudioImg, path: '/category?category=Audio' },
  { category: 'Tripods', image: TripodImg, path: '/category?category=Tripods' },
];

// 2. Simple brand lists
export const BRANDS = [
  'All',
  'Canon',
  'Sony',
  'Leica',
  'Nikon',
  'Zeiss'
];

export const BRANDS_LIST = [
  { category: 'Canon', image: CanonImg, path: '/category?category=Canon' },
  { category: 'Sony', image: SonyImg, path: '/category?category=Sony' },
  { category: 'Leica', image: LeicaImg, path: '/category?category=Leica' },
  { category: 'Nikon', image: NikonImg, path: '/category?category=Nikon' },
  { category: 'Zeiss', image: ZeissImg, path: '/category?category=Zeiss' },
];

// 3. Icons mapping for UI components
export const CATEGORY_ICONS: Record<string, string> = {
  Cameras: CameraImg,
  Lenses: LenseImg,
  Drones: DroneImg,
  Lights: LightImg,
  Audio: AudioImg,
  Tripods: TripodImg,
};

export const BRAND_ICONS: Record<string, string> = {
  Canon: CanonImg,
  Sony: SonyImg,
  Leica: LeicaImg,
  Nikon: NikonImg,
  Zeiss: ZeissImg,
};
