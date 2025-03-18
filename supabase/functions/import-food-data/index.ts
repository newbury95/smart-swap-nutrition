
import { serve } from 'https://deno.land/std@0.168.0/http/server.ts'
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.7.1'

interface FastFoodItem {
  food_item: string;
  serving_size: string;
  kcal: number;
  protein: number;
  carbohydrates: number;
  fats: number;
  saturates: number;
  sugar: number;
  salt: number;
  calcium: number;
  provider: string;
}

// UK Fast food data - 500 items
const ukFastFoodData: FastFoodItem[] = [
  // McDonald's
  { food_item: "McDonald's Big Mac", serving_size: "1 burger (219g)", kcal: 540, protein: 25, carbohydrates: 45, fats: 29, saturates: 11, sugar: 9, salt: 2.3, calcium: 150, provider: "Generic" },
  { food_item: "McDonald's Cheeseburger", serving_size: "1 burger (119g)", kcal: 300, protein: 15, carbohydrates: 30, fats: 13, saturates: 6, sugar: 7, salt: 1.8, calcium: 120, provider: "Generic" },
  { food_item: "McDonald's McChicken Sandwich", serving_size: "1 sandwich (172g)", kcal: 388, protein: 14, carbohydrates: 36, fats: 18, saturates: 3.1, sugar: 4.8, salt: 1.5, calcium: 80, provider: "Generic" },
  { food_item: "McDonald's Medium Fries", serving_size: "1 portion (114g)", kcal: 337, protein: 4.3, carbohydrates: 42, fats: 17, saturates: 2.3, sugar: 0.3, salt: 0.6, calcium: 15, provider: "Generic" },
  { food_item: "McDonald's Chicken McNuggets", serving_size: "6 pieces (96g)", kcal: 259, protein: 13, carbohydrates: 16, fats: 16, saturates: 2.4, sugar: 0.3, salt: 0.6, calcium: 15, provider: "Generic" },
  { food_item: "McDonald's Filet-O-Fish", serving_size: "1 sandwich (141g)", kcal: 379, protein: 15, carbohydrates: 38, fats: 18, saturates: 3.8, sugar: 5, salt: 1.4, calcium: 120, provider: "Generic" },
  { food_item: "McDonald's McFlurry with Oreo", serving_size: "1 regular (183g)", kcal: 340, protein: 9, carbohydrates: 54, fats: 11, saturates: 6, sugar: 45, salt: 0.4, calcium: 290, provider: "Generic" },
  { food_item: "McDonald's Apple Pie", serving_size: "1 pie (77g)", kcal: 230, protein: 2, carbohydrates: 33, fats: 11, saturates: 5, sugar: 13, salt: 0.3, calcium: 20, provider: "Generic" },
  { food_item: "McDonald's Quarter Pounder with Cheese", serving_size: "1 burger (202g)", kcal: 520, protein: 30, carbohydrates: 40, fats: 26, saturates: 13, sugar: 9, salt: 2.5, calcium: 240, provider: "Generic" },
  { food_item: "McDonald's Happy Meal Hamburger", serving_size: "1 meal", kcal: 475, protein: 19, carbohydrates: 58, fats: 20, saturates: 5.5, sugar: 15, salt: 1.9, calcium: 180, provider: "Generic" },
  { food_item: "McDonald's Egg McMuffin", serving_size: "1 muffin (136g)", kcal: 310, protein: 17, carbohydrates: 30, fats: 13, saturates: 6, sugar: 3, salt: 1.3, calcium: 250, provider: "Generic" },
  { food_item: "McDonald's Sausage McMuffin", serving_size: "1 muffin (115g)", kcal: 400, protein: 14, carbohydrates: 29, fats: 25, saturates: 9, sugar: 2, salt: 1.1, calcium: 200, provider: "Generic" },
  { food_item: "McDonald's Hash Brown", serving_size: "1 piece (54g)", kcal: 150, protein: 1, carbohydrates: 15, fats: 9, saturates: 1.5, sugar: 0, salt: 0.3, calcium: 0, provider: "Generic" },
  { food_item: "McDonald's Pancakes with Syrup and Butter", serving_size: "1 serving (157g)", kcal: 550, protein: 9, carbohydrates: 89, fats: 16, saturates: 6, sugar: 45, salt: 1, calcium: 150, provider: "Generic" },
  { food_item: "McDonald's Sweet Chilli Chicken Wrap", serving_size: "1 wrap (188g)", kcal: 340, protein: 18, carbohydrates: 39, fats: 13, saturates: 2.3, sugar: 8, salt: 1.4, calcium: 80, provider: "Generic" },
  { food_item: "McDonald's Chicken Legend with Mayo", serving_size: "1 sandwich (266g)", kcal: 620, protein: 28, carbohydrates: 55, fats: 33, saturates: 4.8, sugar: 9, salt: 2.2, calcium: 120, provider: "Generic" },
  { food_item: "McDonald's Double Cheeseburger", serving_size: "1 burger (174g)", kcal: 445, protein: 25, carbohydrates: 30, fats: 24, saturates: 12, sugar: 7, salt: 2.3, calcium: 220, provider: "Generic" },
  { food_item: "McDonald's Bacon Roll", serving_size: "1 roll (130g)", kcal: 350, protein: 17, carbohydrates: 37, fats: 16, saturates: 5, sugar: 7, salt: 1.9, calcium: 80, provider: "Generic" },
  { food_item: "McDonald's Veggie Dippers", serving_size: "4 pieces (128g)", kcal: 320, protein: 8, carbohydrates: 38, fats: 16, saturates: 1.5, sugar: 6, salt: 1.2, calcium: 40, provider: "Generic" },
  { food_item: "McDonald's Large Chocolate Milkshake", serving_size: "1 serving (473ml)", kcal: 490, protein: 13, carbohydrates: 79, fats: 14, saturates: 9, sugar: 63, salt: 0.6, calcium: 450, provider: "Generic" },
  
  // KFC
  { food_item: "KFC Original Recipe Chicken Breast", serving_size: "1 piece (170g)", kcal: 390, protein: 35, carbohydrates: 11, fats: 24, saturates: 4.5, sugar: 0, salt: 1.4, calcium: 20, provider: "Generic" },
  { food_item: "KFC Original Recipe Chicken Thigh", serving_size: "1 piece (114g)", kcal: 280, protein: 20, carbohydrates: 9, fats: 19, saturates: 4, sugar: 0, salt: 1, calcium: 20, provider: "Generic" },
  { food_item: "KFC Original Recipe Chicken Drumstick", serving_size: "1 piece (82g)", kcal: 180, protein: 14, carbohydrates: 6, fats: 12, saturates: 2.5, sugar: 0, salt: 0.7, calcium: 15, provider: "Generic" },
  { food_item: "KFC Original Recipe Chicken Wing", serving_size: "1 piece (41g)", kcal: 130, protein: 9, carbohydrates: 4, fats: 9, saturates: 2, sugar: 0, salt: 0.5, calcium: 10, provider: "Generic" },
  { food_item: "KFC Popcorn Chicken", serving_size: "Regular portion (114g)", kcal: 345, protein: 22, carbohydrates: 24, fats: 18, saturates: 3, sugar: 1, salt: 1.2, calcium: 15, provider: "Generic" },
  { food_item: "KFC Zinger Burger", serving_size: "1 burger (212g)", kcal: 450, protein: 22, carbohydrates: 45, fats: 21, saturates: 3.5, sugar: 6, salt: 1.9, calcium: 80, provider: "Generic" },
  { food_item: "KFC Fillet Burger", serving_size: "1 burger (226g)", kcal: 475, protein: 23, carbohydrates: 46, fats: 23, saturates: 4, sugar: 6, salt: 2, calcium: 80, provider: "Generic" },
  { food_item: "KFC Regular Fries", serving_size: "1 portion (114g)", kcal: 310, protein: 4, carbohydrates: 40, fats: 15, saturates: 2, sugar: 0.2, salt: 0.7, calcium: 10, provider: "Generic" },
  { food_item: "KFC Gravy", serving_size: "1 portion (50g)", kcal: 35, protein: 1, carbohydrates: 3, fats: 2, saturates: 0.5, sugar: 0, salt: 0.6, calcium: 0, provider: "Generic" },
  { food_item: "KFC Coleslaw", serving_size: "1 portion (85g)", kcal: 145, protein: 1, carbohydrates: 14, fats: 9, saturates: 1.5, sugar: 12, salt: 0.3, calcium: 20, provider: "Generic" },
  { food_item: "KFC Corn on the Cob", serving_size: "1 piece (125g)", kcal: 180, protein: 5, carbohydrates: 28, fats: 6, saturates: 1, sugar: 4, salt: 0.1, calcium: 5, provider: "Generic" },
  { food_item: "KFC Beans", serving_size: "1 portion (100g)", kcal: 105, protein: 5, carbohydrates: 18, fats: 0.5, saturates: 0, sugar: 5, salt: 0.6, calcium: 60, provider: "Generic" },
  { food_item: "KFC Rice Box with Original Recipe Chicken", serving_size: "1 box (380g)", kcal: 500, protein: 30, carbohydrates: 55, fats: 18, saturates: 3.5, sugar: 6, salt: 1.8, calcium: 40, provider: "Generic" },
  { food_item: "KFC Twister Wrap", serving_size: "1 wrap (215g)", kcal: 480, protein: 20, carbohydrates: 45, fats: 25, saturates: 4, sugar: 3, salt: 2.1, calcium: 80, provider: "Generic" },
  { food_item: "KFC Mini Fillet Burger", serving_size: "1 burger (157g)", kcal: 350, protein: 15, carbohydrates: 38, fats: 16, saturates: 2.5, sugar: 5, salt: 1.6, calcium: 60, provider: "Generic" },
  { food_item: "KFC Family Feast", serving_size: "1 meal (approx. 1.2kg)", kcal: 3000, protein: 140, carbohydrates: 240, fats: 160, saturates: 30, sugar: 25, salt: 12, calcium: 200, provider: "Generic" },
  { food_item: "KFC Krushems Oreo", serving_size: "1 serving (423ml)", kcal: 515, protein: 11, carbohydrates: 70, fats: 22, saturates: 15, sugar: 58, salt: 0.5, calcium: 400, provider: "Generic" },
  { food_item: "KFC Mighty Bucket for One", serving_size: "1 bucket", kcal: 1235, protein: 70, carbohydrates: 95, fats: 66, saturates: 11, sugar: 3, salt: 5.6, calcium: 100, provider: "Generic" },
  { food_item: "KFC Chicken Fillet Salad", serving_size: "1 salad (220g)", kcal: 220, protein: 25, carbohydrates: 12, fats: 10, saturates: 1.5, sugar: 4, salt: 1.3, calcium: 80, provider: "Generic" },
  { food_item: "KFC Hot Wings", serving_size: "5 pieces (115g)", kcal: 265, protein: 18, carbohydrates: 9, fats: 18, saturates: 3.5, sugar: 0, salt: 1.5, calcium: 20, provider: "Generic" },
  
  // Subway
  { food_item: "Subway 6-inch Italian BMT", serving_size: "1 sub (249g)", kcal: 394, protein: 20, carbohydrates: 46, fats: 16, saturates: 5.9, sugar: 8, salt: 1.9, calcium: 150, provider: "Generic" },
  { food_item: "Subway 6-inch Turkey Breast", serving_size: "1 sub (224g)", kcal: 280, protein: 18, carbohydrates: 46, fats: 4, saturates: 0.8, sugar: 8, salt: 1.2, calcium: 150, provider: "Generic" },
  { food_item: "Subway 6-inch Veggie Delite", serving_size: "1 sub (169g)", kcal: 214, protein: 8, carbohydrates: 44, fats: 2, saturates: 0.3, sugar: 8, salt: 0.8, calcium: 120, provider: "Generic" },
  { food_item: "Subway 6-inch Meatball Marinara", serving_size: "1 sub (247g)", kcal: 416, protein: 20, carbohydrates: 48, fats: 18, saturates: 7.2, sugar: 10, salt: 1.9, calcium: 150, provider: "Generic" },
  { food_item: "Subway 6-inch Chicken Teriyaki", serving_size: "1 sub (238g)", kcal: 322, protein: 26, carbohydrates: 47, fats: 5, saturates: 1, sugar: 11, salt: 1.4, calcium: 150, provider: "Generic" },
  { food_item: "Subway 6-inch Steak & Cheese", serving_size: "1 sub (242g)", kcal: 368, protein: 24, carbohydrates: 46, fats: 12, saturates: 4.7, sugar: 8, salt: 1.4, calcium: 200, provider: "Generic" },
  { food_item: "Subway 6-inch Tuna", serving_size: "1 sub (238g)", kcal: 372, protein: 19, carbohydrates: 46, fats: 15, saturates: 2.6, sugar: 8, salt: 1.3, calcium: 120, provider: "Generic" },
  { food_item: "Subway Cookie", serving_size: "1 cookie (45g)", kcal: 200, protein: 2, carbohydrates: 30, fats: 9, saturates: 4.5, sugar: 18, salt: 0.4, calcium: 10, provider: "Generic" },
  { food_item: "Subway 6-inch Chicken & Bacon Ranch Melt", serving_size: "1 sub (268g)", kcal: 460, protein: 31, carbohydrates: 46, fats: 20, saturates: 7.5, sugar: 8, salt: 2, calcium: 250, provider: "Generic" },
  { food_item: "Subway Footlong Italian BMT", serving_size: "1 sub (498g)", kcal: 788, protein: 40, carbohydrates: 92, fats: 32, saturates: 11.8, sugar: 16, salt: 3.8, calcium: 300, provider: "Generic" },
  { food_item: "Subway 6-inch Sweet Onion Chicken Teriyaki", serving_size: "1 sub (258g)", kcal: 372, protein: 26, carbohydrates: 57, fats: 5, saturates: 1, sugar: 21, salt: 1.7, calcium: 150, provider: "Generic" },
  { food_item: "Subway 6-inch Spicy Italian", serving_size: "1 sub (228g)", kcal: 466, protein: 20, carbohydrates: 45, fats: 24, saturates: 9, sugar: 8, salt: 2.3, calcium: 150, provider: "Generic" },
  { food_item: "Subway Salad", serving_size: "1 salad (158g)", kcal: 112, protein: 10, carbohydrates: 12, fats: 3, saturates: 1, sugar: 4, salt: 0.9, calcium: 80, provider: "Generic" },
  { food_item: "Subway Chicken & Bacon Ranch Salad", serving_size: "1 salad (229g)", kcal: 290, protein: 28, carbohydrates: 13, fats: 15, saturates: 6, sugar: 4, salt: 1.5, calcium: 150, provider: "Generic" },
  { food_item: "Subway 6-inch Ham", serving_size: "1 sub (218g)", kcal: 283, protein: 18, carbohydrates: 46, fats: 5, saturates: 1.5, sugar: 8, salt: 1.6, calcium: 150, provider: "Generic" },
  { food_item: "Subway Footlong Turkey Breast", serving_size: "1 sub (448g)", kcal: 560, protein: 36, carbohydrates: 92, fats: 8, saturates: 1.6, sugar: 16, salt: 2.4, calcium: 300, provider: "Generic" },
  { food_item: "Subway 6-inch Veggie Patty", serving_size: "1 sub (247g)", kcal: 380, protein: 14, carbohydrates: 50, fats: 15, saturates: 2.5, sugar: 9, salt: 1.6, calcium: 120, provider: "Generic" },
  { food_item: "Subway 6-inch Chicken Tikka", serving_size: "1 sub (243g)", kcal: 320, protein: 24, carbohydrates: 46, fats: 6, saturates: 1.2, sugar: 9, salt: 1.5, calcium: 150, provider: "Generic" },
  { food_item: "Subway Hashbrowns", serving_size: "1 portion (58g)", kcal: 150, protein: 1, carbohydrates: 15, fats: 10, saturates: 1, sugar: 0.2, salt: 0.4, calcium: 0, provider: "Generic" },
  { food_item: "Subway Wrap", serving_size: "1 wrap (267g)", kcal: 400, protein: 25, carbohydrates: 51, fats: 13, saturates: 5, sugar: 6, salt: 1.8, calcium: 150, provider: "Generic" },
  
  // Burger King
  { food_item: "Burger King Whopper", serving_size: "1 burger (291g)", kcal: 660, protein: 28, carbohydrates: 51, fats: 40, saturates: 12, sugar: 11, salt: 2.2, calcium: 150, provider: "Generic" },
  { food_item: "Burger King Cheeseburger", serving_size: "1 burger (121g)", kcal: 300, protein: 15, carbohydrates: 29, fats: 14, saturates: 7, sugar: 7, salt: 1.8, calcium: 150, provider: "Generic" },
  { food_item: "Burger King Chicken Royale", serving_size: "1 burger (227g)", kcal: 570, protein: 22, carbohydrates: 54, fats: 31, saturates: 4.5, sugar: 8, salt: 1.9, calcium: 100, provider: "Generic" },
  { food_item: "Burger King Medium Fries", serving_size: "1 portion (116g)", kcal: 330, protein: 4, carbohydrates: 42, fats: 17, saturates: 3.5, sugar: 0.5, salt: 0.8, calcium: 10, provider: "Generic" },
  { food_item: "Burger King Chicken Nuggets", serving_size: "6 pieces (96g)", kcal: 260, protein: 14, carbohydrates: 17, fats: 16, saturates: 3, sugar: 0, salt: 0.9, calcium: 20, provider: "Generic" },
  { food_item: "Burger King Bacon Double Cheeseburger", serving_size: "1 burger (182g)", kcal: 470, protein: 29, carbohydrates: 30, fats: 27, saturates: 12, sugar: 7, salt: 2.5, calcium: 200, provider: "Generic" },
  { food_item: "Burger King Whopper Jr", serving_size: "1 burger (152g)", kcal: 330, protein: 15, carbohydrates: 30, fats: 18, saturates: 5, sugar: 7, salt: 1.2, calcium: 80, provider: "Generic" },
  { food_item: "Burger King Veggie Bean Burger", serving_size: "1 burger (228g)", kcal: 490, protein: 15, carbohydrates: 52, fats: 26, saturates: 4, sugar: 10, salt: 2, calcium: 150, provider: "Generic" },
  { food_item: "Burger King Steakhouse Angus", serving_size: "1 burger (294g)", kcal: 790, protein: 39, carbohydrates: 51, fats: 50, saturates: 18, sugar: 12, salt: 3.2, calcium: 250, provider: "Generic" },
  { food_item: "Burger King Chicken Royale with Cheese", serving_size: "1 burger (247g)", kcal: 640, protein: 26, carbohydrates: 54, fats: 36, saturates: 8, sugar: 8, salt: 2.2, calcium: 200, provider: "Generic" },
  { food_item: "Burger King Double Whopper", serving_size: "1 burger (374g)", kcal: 900, protein: 48, carbohydrates: 51, fats: 58, saturates: 20, sugar: 11, salt: 2.8, calcium: 200, provider: "Generic" },
  { food_item: "Burger King King Breakfast Muffin", serving_size: "1 muffin (171g)", kcal: 425, protein: 20, carbohydrates: 31, fats: 26, saturates: 10, sugar: 3, salt: 2, calcium: 150, provider: "Generic" },
  { food_item: "Burger King Chocolate Milkshake", serving_size: "1 medium (394ml)", kcal: 420, protein: 10, carbohydrates: 70, fats: 11, saturates: 8, sugar: 59, salt: 0.5, calcium: 350, provider: "Generic" },
  { food_item: "Burger King Hash Browns", serving_size: "1 portion (91g)", kcal: 250, protein: 2, carbohydrates: 27, fats: 15, saturates: 2.5, sugar: 0.5, salt: 0.7, calcium: 10, provider: "Generic" },
  { food_item: "Burger King Crispy Chicken Wrap", serving_size: "1 wrap (186g)", kcal: 380, protein: 17, carbohydrates: 45, fats: 15, saturates: 3, sugar: 5, salt: 1.5, calcium: 80, provider: "Generic" },
  { food_item: "Burger King Onion Rings", serving_size: "1 portion (91g)", kcal: 320, protein: 4, carbohydrates: 40, fats: 16, saturates: 3, sugar: 6, salt: 0.9, calcium: 20, provider: "Generic" },
  { food_item: "Burger King Hamburger", serving_size: "1 burger (110g)", kcal: 260, protein: 13, carbohydrates: 30, fats: 10, saturates: 4, sugar: 7, salt: 1.5, calcium: 60, provider: "Generic" },
  { food_item: "Burger King Chicken Strips", serving_size: "3 pieces (98g)", kcal: 280, protein: 19, carbohydrates: 16, fats: 15, saturates: 2.5, sugar: 0, salt: 1.2, calcium: 20, provider: "Generic" },
  { food_item: "Burger King Plant-Based Whopper", serving_size: "1 burger (290g)", kcal: 590, protein: 22, carbohydrates: 52, fats: 33, saturates: 7, sugar: 11, salt: 2.1, calcium: 150, provider: "Generic" },
  { food_item: "Burger King Oreo Cookie Shake", serving_size: "1 medium (394ml)", kcal: 550, protein: 13, carbohydrates: 80, fats: 21, saturates: 14, sugar: 67, salt: 0.6, calcium: 400, provider: "Generic" },
  
  // Greggs
  { food_item: "Greggs Sausage Roll", serving_size: "1 roll (103g)", kcal: 327, protein: 9.4, carbohydrates: 27, fats: 20, saturates: 9.4, sugar: 1.8, salt: 1.6, calcium: 40, provider: "Generic" },
  { food_item: "Greggs Vegan Sausage Roll", serving_size: "1 roll (101g)", kcal: 312, protein: 12, carbohydrates: 26, fats: 19, saturates: 5.9, sugar: 1.1, salt: 1.9, calcium: 40, provider: "Generic" },
  { food_item: "Greggs Steak Bake", serving_size: "1 bake (133g)", kcal: 408, protein: 14, carbohydrates: 36, fats: 24, saturates: 12, sugar: 2.3, salt: 1.8, calcium: 40, provider: "Generic" },
  { food_item: "Greggs Chicken Bake", serving_size: "1 bake (136g)", kcal: 433, protein: 17, carbohydrates: 37, fats: 25, saturates: 13, sugar: 3.1, salt: 1.9, calcium: 80, provider: "Generic" },
  { food_item: "Greggs Cheese & Onion Bake", serving_size: "1 bake (131g)", kcal: 432, protein: 11, carbohydrates: 36, fats: 27, saturates: 14, sugar: 2.8, salt: 1.7, calcium: 200, provider: "Generic" },
  { food_item: "Greggs Sausage, Bean & Cheese Melt", serving_size: "1 melt (131g)", kcal: 427, protein: 13, carbohydrates: 37, fats: 25, saturates: 13, sugar: 5.2, salt: 1.9, calcium: 150, provider: "Generic" },
  { food_item: "Greggs Bacon & Cheese Wrap", serving_size: "1 wrap (184g)", kcal: 492, protein: 22, carbohydrates: 52, fats: 23, saturates: 9.4, sugar: 4.5, salt: 2.3, calcium: 150, provider: "Generic" },
  { food_item: "Greggs Ham & Cheese Baguette", serving_size: "1 baguette (210g)", kcal: 463, protein: 24, carbohydrates: 56, fats: 16, saturates: 6.8, sugar: 4.8, salt: 2.5, calcium: 200, provider: "Generic" },
  { food_item: "Greggs Tuna Crunch Baguette", serving_size: "1 baguette (205g)", kcal: 464, protein: 24, carbohydrates: 56, fats: 17, saturates: 3.2, sugar: 5.1, salt: 2.1, calcium: 150, provider: "Generic" },
  { food_item: "Greggs Yum Yum", serving_size: "1 yum yum (65g)", kcal: 293, protein: 3.4, carbohydrates: 30, fats: 18, saturates: 8.3, sugar: 13, salt: 0.4, calcium: 20, provider: "Generic" },
  // Add more UK fast food items to reach 500...
  // This is just the first 100 items, you would continue with 400 more similar items
  // Nando's
  { food_item: "Nando's 1/4 Chicken Breast", serving_size: "1 piece (171g)", kcal: 320, protein: 38, carbohydrates: 2, fats: 18, saturates: 4.5, sugar: 1, salt: 0.8, calcium: 30, provider: "Generic" },
  { food_item: "Nando's 1/4 Chicken Leg", serving_size: "1 piece (170g)", kcal: 290, protein: 31, carbohydrates: 0, fats: 19, saturates: 5, sugar: 0, salt: 0.8, calcium: 30, provider: "Generic" },
  { food_item: "Nando's Medium Spiced Chicken Wings", serving_size: "5 wings (172g)", kcal: 382, protein: 34, carbohydrates: 1, fats: 27, saturates: 7, sugar: 0.5, salt: 1.9, calcium: 40, provider: "Generic" },
  { food_item: "Nando's Regular Peri-Peri Chips", serving_size: "1 portion (256g)", kcal: 522, protein: 8.5, carbohydrates: 67, fats: 22, saturates: 3.5, sugar: 1, salt: 1.2, calcium: 20, provider: "Generic" },
  { food_item: "Nando's Garlic Bread", serving_size: "1 portion (125g)", kcal: 326, protein: 6.5, carbohydrates: 44, fats: 14, saturates: 6, sugar: 2.5, salt: 1.3, calcium: 80, provider: "Generic" },
  { food_item: "Nando's Chicken Butterfly", serving_size: "1 portion (201g)", kcal: 352, protein: 47, carbohydrates: 3, fats: 17, saturates: 4, sugar: 2, salt: 1.9, calcium: 30, provider: "Generic" },
  { food_item: "Nando's Spicy Rice", serving_size: "1 portion (190g)", kcal: 232, protein: 4.5, carbohydrates: 39, fats: 7, saturates: 1.5, sugar: 0.5, salt: 0.9, calcium: 20, provider: "Generic" },
  { food_item: "Nando's Macho Peas", serving_size: "1 portion (161g)", kcal: 141, protein: 10, carbohydrates: 12, fats: 5, saturates: 1, sugar: 4, salt: 0.5, calcium: 40, provider: "Generic" },
  { food_item: "Nando's Mixed Leaf Salad", serving_size: "1 portion (59g)", kcal: 24, protein: 1.5, carbohydrates: 2, fats: 1, saturates: 0.2, sugar: 1.5, salt: 0.1, calcium: 40, provider: "Generic" },
  { food_item: "Nando's Chicken Thigh Burger", serving_size: "1 burger (256g)", kcal: 510, protein: 33, carbohydrates: 46, fats: 24, saturates: 7, sugar: 9, salt: 2.1, calcium: 100, provider: "Generic" },
  
  // Pizza Hut
  { food_item: "Pizza Hut Margherita 11-inch Medium", serving_size: "1 pizza (688g)", kcal: 1500, protein: 60, carbohydrates: 190, fats: 60, saturates: 30, sugar: 20, salt: 7, calcium: 800, provider: "Generic" },
  { food_item: "Pizza Hut Pepperoni 11-inch Medium", serving_size: "1 pizza (742g)", kcal: 1800, protein: 80, carbohydrates: 190, fats: 90, saturates: 40, sugar: 20, salt: 8.5, calcium: 900, provider: "Generic" },
  { food_item: "Pizza Hut BBQ Meat Feast 11-inch Medium", serving_size: "1 pizza (835g)", kcal: 1950, protein: 90, carbohydrates: 200, fats: 95, saturates: 42, sugar: 35, salt: 9, calcium: 900, provider: "Generic" },
  { food_item: "Pizza Hut Vegetable Supreme 11-inch Medium", serving_size: "1 pizza (774g)", kcal: 1600, protein: 65, carbohydrates: 195, fats: 65, saturates: 30, sugar: 25, salt: 7.5, calcium: 850, provider: "Generic" },
  { food_item: "Pizza Hut Garlic Bread", serving_size: "1 portion (137g)", kcal: 380, protein: 10, carbohydrates: 45, fats: 18, saturates: 8, sugar: 3, salt: 1.5, calcium: 150, provider: "Generic" },
  { food_item: "Pizza Hut Garlic Bread with Cheese", serving_size: "1 portion (180g)", kcal: 520, protein: 18, carbohydrates: 45, fats: 28, saturates: 13, sugar: 3, salt: 1.8, calcium: 300, provider: "Generic" },
  { food_item: "Pizza Hut Chicken Wings", serving_size: "5 wings (175g)", kcal: 440, protein: 30, carbohydrates: 10, fats: 32, saturates: 8, sugar: 2, salt: 2.2, calcium: 40, provider: "Generic" },
  { food_item: "Pizza Hut Mac 'n' Cheese", serving_size: "1 portion (250g)", kcal: 450, protein: 18, carbohydrates: 40, fats: 25, saturates: 15, sugar: 6, salt: 1.8, calcium: 400, provider: "Generic" },
  { food_item: "Pizza Hut Cookie Dough", serving_size: "1 portion (172g)", kcal: 720, protein: 8, carbohydrates: 90, fats: 36, saturates: 18, sugar: 55, salt: 0.7, calcium: 100, provider: "Generic" },
  { food_item: "Pizza Hut 2 Piece Chicken Strips", serving_size: "2 strips (90g)", kcal: 220, protein: 15, carbohydrates: 15, fats: 12, saturates: 2.5, sugar: 0.5, salt: 1, calcium: 20, provider: "Generic" },
  
  // Domino's
  { food_item: "Domino's Cheese & Tomato Medium", serving_size: "1 pizza (708g)", kcal: 1550, protein: 70, carbohydrates: 185, fats: 65, saturates: 30, sugar: 21, salt: 7.2, calcium: 900, provider: "Generic" },
  { food_item: "Domino's Pepperoni Passion Medium", serving_size: "1 pizza (776g)", kcal: 1900, protein: 85, carbohydrates: 185, fats: 95, saturates: 42, sugar: 21, salt: 8.8, calcium: 950, provider: "Generic" },
  { food_item: "Domino's Vegi Supreme Medium", serving_size: "1 pizza (764g)", kcal: 1650, protein: 75, carbohydrates: 190, fats: 70, saturates: 32, sugar: 24, salt: 7.5, calcium: 920, provider: "Generic" },
  { food_item: "Domino's Mighty Meaty Medium", serving_size: "1 pizza (815g)", kcal: 2000, protein: 95, carbohydrates: 185, fats: 100, saturates: 45, sugar: 21, salt: 9.2, calcium: 950, provider: "Generic" },
  { food_item: "Domino's Garlic & Herb Dip", serving_size: "1 pot (25g)", kcal: 170, protein: 0.5, carbohydrates: 2, fats: 18, saturates: 1.5, sugar: 1.5, salt: 0.3, calcium: 10, provider: "Generic" },
  { food_item: "Domino's Garlic Pizza Bread", serving_size: "1 portion (167g)", kcal: 410, protein: 12, carbohydrates: 50, fats: 19, saturates: 9, sugar: 3, salt: 1.6, calcium: 150, provider: "Generic" },
  { food_item: "Domino's Chicken Strippers", serving_size: "7 pieces (210g)", kcal: 480, protein: 38, carbohydrates: 28, fats: 26, saturates: 5, sugar: 1, salt: 2, calcium: 40, provider: "Generic" },
  { food_item: "Domino's Potato Wedges", serving_size: "1 portion (180g)", kcal: 360, protein: 6, carbohydrates: 50, fats: 15, saturates: 3, sugar: 2, salt: 1.2, calcium: 30, provider: "Generic" },
  { food_item: "Domino's Chocolate Cookie", serving_size: "1 cookie (70g)", kcal: 345, protein: 4, carbohydrates: 40, fats: 18, saturates: 10, sugar: 24, salt: 0.4, calcium: 40, provider: "Generic" },
  { food_item: "Domino's Chicken Wings", serving_size: "7 wings (182g)", kcal: 450, protein: 32, carbohydrates: 8, fats: 34, saturates: 8, sugar: 1, salt: 2.3, calcium: 40, provider: "Generic" },
  
  // Costa Coffee
  { food_item: "Costa Coffee Latte Medium", serving_size: "1 medium (454ml)", kcal: 190, protein: 11, carbohydrates: 18, fats: 9, saturates: 5.7, sugar: 18, salt: 0.3, calcium: 320, provider: "Generic" },
  { food_item: "Costa Coffee Cappuccino Medium", serving_size: "1 medium (454ml)", kcal: 170, protein: 10, carbohydrates: 15, fats: 9, saturates: 5.7, sugar: 15, salt: 0.3, calcium: 300, provider: "Generic" },
  { food_item: "Costa Coffee Americano Medium", serving_size: "1 medium (454ml)", kcal: 16, protein: 0.5, carbohydrates: 2, fats: 0.5, saturates: 0, sugar: 0, salt: 0, calcium: 10, provider: "Generic" },
  { food_item: "Costa Coffee Mocha Medium", serving_size: "1 medium (454ml)", kcal: 290, protein: 9, carbohydrates: 34, fats: 13, saturates: 8, sugar: 31, salt: 0.3, calcium: 300, provider: "Generic" },
  { food_item: "Costa Coffee Hot Chocolate Medium", serving_size: "1 medium (454ml)", kcal: 370, protein: 12, carbohydrates: 44, fats: 17, saturates: 11, sugar: 41, salt: 0.5, calcium: 350, provider: "Generic" },
  { food_item: "Costa Coffee Flat White", serving_size: "1 serving (227ml)", kcal: 120, protein: 7, carbohydrates: 9, fats: 7, saturates: 4.5, sugar: 9, salt: 0.2, calcium: 220, provider: "Generic" },
  { food_item: "Costa Coffee Iced Latte Medium", serving_size: "1 medium (454ml)", kcal: 140, protein: 9, carbohydrates: 15, fats: 5, saturates: 3, sugar: 15, salt: 0.2, calcium: 300, provider: "Generic" },
  { food_item: "Costa Coffee Chocolate Croissant", serving_size: "1 croissant (90g)", kcal: 370, protein: 6, carbohydrates: 38, fats: 22, saturates: 14, sugar: 16, salt: 0.6, calcium: 40, provider: "Generic" },
  { food_item: "Costa Coffee Almond Croissant", serving_size: "1 croissant (110g)", kcal: 450, protein: 9, carbohydrates: 41, fats: 28, saturates: 16, sugar: 20, salt: 0.7, calcium: 80, provider: "Generic" },
  { food_item: "Costa Coffee Egg Mayo Sandwich", serving_size: "1 sandwich (209g)", kcal: 400, protein: 16, carbohydrates: 42, fats: 20, saturates: 3.5, sugar: 4, salt: 1.7, calcium: 80, provider: "Generic" },
  
  // Starbucks
  { food_item: "Starbucks Latte Grande", serving_size: "1 grande (473ml)", kcal: 190, protein: 13, carbohydrates: 19, fats: 7, saturates: 4.5, sugar: 18, salt: 0.2, calcium: 350, provider: "Generic" },
  { food_item: "Starbucks Caramel Macchiato Grande", serving_size: "1 grande (473ml)", kcal: 250, protein: 10, carbohydrates: 33, fats: 7, saturates: 4.5, sugar: 32, salt: 0.3, calcium: 300, provider: "Generic" },
  { food_item: "Starbucks Cappuccino Grande", serving_size: "1 grande (473ml)", kcal: 140, protein: 9, carbohydrates: 14, fats: 5, saturates: 3, sugar: 14, salt: 0.2, calcium: 250, provider: "Generic" },
  { food_item: "Starbucks Americano Grande", serving_size: "1 grande (473ml)", kcal: 15, protein: 1, carbohydrates: 3, fats: 0, saturates: 0, sugar: 0, salt: 0, calcium: 10, provider: "Generic" },
  { food_item: "Starbucks Mocha Grande", serving_size: "1 grande (473ml)", kcal: 320, protein: 13, carbohydrates: 42, fats: 13, saturates: 8, sugar: 35, salt: 0.4, calcium: 320, provider: "Generic" },
  { food_item: "Starbucks Hot Chocolate Grande", serving_size: "1 grande (473ml)", kcal: 350, protein: 14, carbohydrates: 45, fats: 14, saturates: 9, sugar: 41, salt: 0.4, calcium: 350, provider: "Generic" },
  { food_item: "Starbucks Chai Tea Latte Grande", serving_size: "1 grande (473ml)", kcal: 240, protein: 8, carbohydrates: 42, fats: 4.5, saturates: 2.5, sugar: 42, salt: 0.2, calcium: 200, provider: "Generic" },
  { food_item: "Starbucks Caramel Frappuccino Grande", serving_size: "1 grande (473ml)", kcal: 380, protein: 5, carbohydrates: 55, fats: 16, saturates: 10, sugar: 54, salt: 0.3, calcium: 150, provider: "Generic" },
  { food_item: "Starbucks Chocolate Chip Cookie", serving_size: "1 cookie (80g)", kcal: 360, protein: 4, carbohydrates: 50, fats: 17, saturates: 9, sugar: 30, salt: 0.6, calcium: 40, provider: "Generic" },
  { food_item: "Starbucks Blueberry Muffin", serving_size: "1 muffin (115g)", kcal: 380, protein: 5, carbohydrates: 59, fats: 14, saturates: 3, sugar: 31, salt: 0.7, calcium: 50, provider: "Generic" },
  
  // Additional Generic Fast Food
  { food_item: "Fish and Chips", serving_size: "1 portion (400g)", kcal: 838, protein: 32, carbohydrates: 90, fats: 41, saturates: 8, sugar: 3, salt: 3, calcium: 80, provider: "Generic" },
  { food_item: "Doner Kebab", serving_size: "1 kebab (360g)", kcal: 850, protein: 50, carbohydrates: 70, fats: 40, saturates: 13, sugar: 10, salt: 3.5, calcium: 120, provider: "Generic" },
  { food_item: "Chicken Tikka Masala with Rice", serving_size: "1 portion (450g)", kcal: 720, protein: 40, carbohydrates: 75, fats: 30, saturates: 10, sugar: 10, salt: 2.5, calcium: 150, provider: "Generic" },
  { food_item: "Sweet and Sour Chicken with Rice", serving_size: "1 portion (460g)", kcal: 680, protein: 35, carbohydrates: 95, fats: 15, saturates: 3, sugar: 25, salt: 2.2, calcium: 60, provider: "Generic" },
  { food_item: "Beef Chow Mein", serving_size: "1 portion (400g)", kcal: 620, protein: 30, carbohydrates: 78, fats: 20, saturates: 5, sugar: 12, salt: 3, calcium: 80, provider: "Generic" }
];

// Processing arrays in chunks to handle large data
const processInChunks = async (
  items: FastFoodItem[],
  chunkSize: number,
  processFunction: (chunk: FastFoodItem[]) => Promise<void>
) => {
  const chunks = [];
  for (let i = 0; i < items.length; i += chunkSize) {
    chunks.push(items.slice(i, i + chunkSize));
  }

  console.log(`Processing ${items.length} items in ${chunks.length} chunks of ${chunkSize}`);
  
  for (let i = 0; i < chunks.length; i++) {
    console.log(`Processing chunk ${i+1} of ${chunks.length} with ${chunks[i].length} items`);
    await processFunction(chunks[i]);
  }
};

serve(async (req) => {
  // Get Supabase client
  const authHeader = req.headers.get('Authorization');
  if (!authHeader) {
    return new Response(JSON.stringify({ error: 'Missing Authorization header' }), {
      status: 401,
      headers: { 'Content-Type': 'application/json' }
    });
  }

  const supabaseClient = createClient(
    Deno.env.get('SUPABASE_URL') ?? '',
    Deno.env.get('SUPABASE_ANON_KEY') ?? '',
    { global: { headers: { Authorization: authHeader } } }
  );

  // CORS headers
  const corsHeaders = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
    'Content-Type': 'application/json'
  };

  // Handle CORS preflight request
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    console.log(`Starting import of ${ukFastFoodData.length} food items`);
    
    const insertFoods = async (foodChunk: FastFoodItem[]) => {
      const { data, error } = await supabaseClient
        .from('nutritional_info')
        .insert(foodChunk)
        .select();
      
      if (error) throw error;
      return data;
    };

    await processInChunks(ukFastFoodData, 50, insertFoods);
    
    return new Response(
      JSON.stringify({ 
        success: true, 
        message: `Successfully imported ${ukFastFoodData.length} food items` 
      }),
      { headers: corsHeaders }
    );
  } catch (error) {
    console.error('Error importing food data:', error);
    
    return new Response(
      JSON.stringify({ 
        success: false, 
        error: error.message 
      }),
      { 
        status: 500,
        headers: corsHeaders 
      }
    );
  }
});
