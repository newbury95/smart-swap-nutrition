
import { Input } from "@/components/ui/input";
import { type FoodCategory, type Supermarket, type NutritionFilters } from "./types";

interface FoodFiltersProps {
  selectedSupermarket: Supermarket | "all";
  setSelectedSupermarket: (value: Supermarket | "all") => void;
  selectedCategory: FoodCategory;
  setSelectedCategory: (value: FoodCategory) => void;
  nutritionFilters: NutritionFilters;
  setNutritionFilters: (filters: NutritionFilters) => void;
}

export const FoodFilters = ({
  selectedSupermarket,
  setSelectedSupermarket,
  selectedCategory,
  setSelectedCategory,
  nutritionFilters,
  setNutritionFilters,
}: FoodFiltersProps) => {
  return (
    <div className="space-y-4 p-4 border rounded-lg">
      <div className="grid grid-cols-2 gap-4">
        <select
          className="w-full p-2 rounded-md border border-gray-300"
          value={selectedSupermarket}
          onChange={(e) => setSelectedSupermarket(e.target.value as Supermarket | "all")}
        >
          <option value="all">All Supermarkets</option>
          <option value="Tesco">Tesco</option>
          <option value="Sainsburys">Sainsbury's</option>
          <option value="Asda">Asda</option>
          <option value="Morrisons">Morrisons</option>
          <option value="Waitrose">Waitrose</option>
          <option value="Coop">Co-op</option>
          <option value="M&S">M&S</option>
          <option value="Ocado">Ocado</option>
        </select>

        <select
          className="w-full p-2 rounded-md border border-gray-300"
          value={selectedCategory}
          onChange={(e) => setSelectedCategory(e.target.value as FoodCategory)}
        >
          <option value="All Categories">All Categories</option>
          <option value="Dairy & Eggs">Dairy & Eggs</option>
          <option value="Fruits & Vegetables">Fruits & Vegetables</option>
          <option value="Meat & Fish">Meat & Fish</option>
          <option value="Bread & Bakery">Bread & Bakery</option>
          <option value="Drinks">Drinks</option>
          <option value="Snacks">Snacks</option>
          <option value="Ready Meals">Ready Meals</option>
          <option value="Cereals">Cereals</option>
          <option value="Pasta & Rice">Pasta & Rice</option>
          <option value="Condiments">Condiments</option>
          <option value="Frozen Foods">Frozen Foods</option>
        </select>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <p className="text-sm font-medium mb-2">Calories</p>
          <div className="flex gap-2">
            <Input
              type="number"
              placeholder="Min"
              value={nutritionFilters.minCalories}
              onChange={(e) => setNutritionFilters({...nutritionFilters, minCalories: e.target.value})}
            />
            <Input
              type="number"
              placeholder="Max"
              value={nutritionFilters.maxCalories}
              onChange={(e) => setNutritionFilters({...nutritionFilters, maxCalories: e.target.value})}
            />
          </div>
        </div>
        <div>
          <p className="text-sm font-medium mb-2">Protein</p>
          <div className="flex gap-2">
            <Input
              type="number"
              placeholder="Min"
              value={nutritionFilters.minProtein}
              onChange={(e) => setNutritionFilters({...nutritionFilters, minProtein: e.target.value})}
            />
            <Input
              type="number"
              placeholder="Max"
              value={nutritionFilters.maxProtein}
              onChange={(e) => setNutritionFilters({...nutritionFilters, maxProtein: e.target.value})}
            />
          </div>
        </div>
      </div>
    </div>
  );
};
