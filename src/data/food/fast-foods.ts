
import { mcdonaldsFoods } from './mcdonalds-foods';
import { pizzaHutFoods } from './pizzahut-foods';
import { dominosFoods } from './dominos-foods';
import { kfcFoods } from './kfc-foods';
import { nandosFoods } from './nandos-foods';

// Ensure all food arrays are properly defined with the right structure
const validateFoodArray = (foods, source) => {
  if (!Array.isArray(foods)) {
    console.error(`${source} is not a valid array`);
    return [];
  }
  
  // Validate and map each food item to ensure consistent structure
  return foods.map(food => ({
    name: food.name || 'Unknown Item',
    calories: Number(food.calories) || 0,
    protein: Number(food.protein) || 0,
    carbs: Number(food.carbs) || 0,
    fat: Number(food.fat) || 0,
    saturates: Number(food.saturates) || 0,
    sugar: Number(food.sugar) || 0,
    salt: Number(food.salt) || 0,
    servingSize: food.servingSize || '100g',
    supermarket: food.supermarket || source,
    barcode: food.barcode || null
  }));
};

// Validate all fast food arrays
const validMcdonalds = validateFoodArray(mcdonaldsFoods, 'McDonalds');
const validPizzaHut = validateFoodArray(pizzaHutFoods, 'Pizza Hut');
const validDominos = validateFoodArray(dominosFoods, 'Dominos');
const validKfc = validateFoodArray(kfcFoods, 'KFC');
const validNandos = validateFoodArray(nandosFoods, 'Nandos');

// Combine all fast food items into one array
export const fastFoods = [
  ...validMcdonalds,
  ...validPizzaHut,
  ...validDominos,
  ...validKfc,
  ...validNandos
];

// Export individual arrays as well
export { 
  validMcdonalds as mcdonaldsFoods,
  validPizzaHut as pizzaHutFoods,
  validDominos as dominosFoods,
  validKfc as kfcFoods,
  validNandos as nandosFoods
};
