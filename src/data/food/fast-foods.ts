
import { mcdonaldsFoods } from './mcdonalds-foods';
import { pizzaHutFoods } from './pizzahut-foods';
import { dominosFoods } from './dominos-foods';
import { kfcFoods } from './kfc-foods';
import { nandosFoods } from './nandos-foods';
import { burgerKingFoods } from './burger-king-foods';
import { costaCoffeeFoods } from './costa-foods';
import { starbucksFoods } from './starbucks-foods';
import { subwayFoods } from './subway-foods';
import { greggsFoods } from './greggs-foods';
import { dunkinFoods } from './dunkin-foods';
import { barBurritoFoods } from './barburrito-foods';
import { chopsticksNoodleBarFoods } from './chopsticks-foods';

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
const validBurgerKing = validateFoodArray(burgerKingFoods, 'Burger King');
const validCosta = validateFoodArray(costaCoffeeFoods, 'Costa Coffee');
const validStarbucks = validateFoodArray(starbucksFoods, 'Starbucks');
const validSubway = validateFoodArray(subwayFoods, 'Subway');
const validGreggs = validateFoodArray(greggsFoods, 'Greggs');
const validDunkin = validateFoodArray(dunkinFoods, 'Dunkin');
const validBarBurrito = validateFoodArray(barBurritoFoods, 'Bar Burrito');
const validChopsticks = validateFoodArray(chopsticksNoodleBarFoods, 'Chopsticks Noodle Bar');

// Combine all fast food items into one array
export const fastFoods = [
  ...validMcdonalds,
  ...validPizzaHut,
  ...validDominos,
  ...validKfc,
  ...validNandos,
  ...validBurgerKing,
  ...validCosta,
  ...validStarbucks,
  ...validSubway,
  ...validGreggs,
  ...validDunkin,
  ...validBarBurrito,
  ...validChopsticks
];

// Export individual arrays as well
export { 
  validMcdonalds as mcdonaldsFoods,
  validPizzaHut as pizzaHutFoods,
  validDominos as dominosFoods,
  validKfc as kfcFoods,
  validNandos as nandosFoods,
  validBurgerKing as burgerKingFoods,
  validCosta as costaCoffeeFoods,
  validStarbucks as starbucksFoods,
  validSubway as subwayFoods,
  validGreggs as greggsFoods,
  validDunkin as dunkinFoods,
  validBarBurrito as barBurritoFoods,
  validChopsticks as chopsticksNoodleBarFoods
};
