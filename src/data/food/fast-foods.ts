
import { mcdonaldsFoods } from './mcdonalds-foods';
import { pizzaHutFoods } from './pizzahut-foods';
import { dominosFoods } from './dominos-foods';
import { kfcFoods } from './kfc-foods';
import { nandosFoods } from './nandos-foods';

// Combine all fast food items into one array
export const fastFoods = [
  ...mcdonaldsFoods,
  ...pizzaHutFoods,
  ...dominosFoods,
  ...kfcFoods,
  ...nandosFoods
];

// Export individual arrays as well
export { 
  mcdonaldsFoods,
  pizzaHutFoods,
  dominosFoods,
  kfcFoods,
  nandosFoods
};
