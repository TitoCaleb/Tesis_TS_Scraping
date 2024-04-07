import { Category } from '../domain/Category';

export enum CategoryNames {
  MOTHERBOARD = 'MOTHERBOARD',
  PROCESSOR = 'PROCESSOR',
  MEMORY_RAM = 'MEMORY_RAM',
  STORAGE = 'STORAGE',
  VIDEO_CARD = 'VIDEO_CARD',
  POWER_SUPPLY = 'POWER_SUPPLY',
  COOLING = 'COOLING',
  CASE = 'CASE',
  LIQUID_COOLING = 'LIQUID_COOLING',
  MONITOR = 'MONITOR',
  MOUSE_AND_KEYBOARD = 'MOUSE_AND_KEYBOARD',
  HEADPHONES = 'HEADPHONES',
}

export const categoryList: Category[] = [
  {
    name: CategoryNames.MOTHERBOARD,
  },
  {
    name: CategoryNames.PROCESSOR,
  },
  {
    name: CategoryNames.MEMORY_RAM,
  },
  {
    name: CategoryNames.STORAGE,
  },
  {
    name: CategoryNames.VIDEO_CARD,
  },
  {
    name: CategoryNames.POWER_SUPPLY,
  },
  {
    name: CategoryNames.COOLING,
  },
  {
    name: CategoryNames.CASE,
  },
  {
    name: CategoryNames.LIQUID_COOLING,
  },
  {
    name: CategoryNames.MONITOR,
  },
  {
    name: CategoryNames.MOUSE_AND_KEYBOARD,
  },
  {
    name: CategoryNames.HEADPHONES,
  },
];
