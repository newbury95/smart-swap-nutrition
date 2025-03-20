
import { useState, useEffect } from "react";
import { format } from "date-fns";
import { supabase } from "@/integrations/supabase/client";

export const useNutritionData = () => {
  const [consumedNutrition, setConsumedNutrition] = useState({
    calories: 0,
    protein: 0,
    carbs: 0,
    fats: 0
  });
  
  useEffect(() => {
    const fetchTodayNutrition = async () => {
      try {
        const today = format(new Date(), 'yyyy-MM-dd');
        const { data, error } = await supabase
          .from('meals')
          .select('calories, protein, carbs, fat')
          .eq('date', today);
        
        if (error) throw error;
        
        if (data && data.length > 0) {
          const totals = data.reduce((acc, meal) => {
            return {
              calories: acc.calories + (meal.calories || 0),
              protein: acc.protein + (meal.protein || 0),
              carbs: acc.carbs + (meal.carbs || 0),
              fats: acc.fats + (meal.fat || 0)
            };
          }, { calories: 0, protein: 0, carbs: 0, fats: 0 });
          
          setConsumedNutrition(totals);
        } else {
          setConsumedNutrition({
            calories: 0,
            protein: 0,
            carbs: 0,
            fats: 0
          });
        }
      } catch (error) {
        console.error("Error fetching today's nutrition:", error);
      }
    };
    
    fetchTodayNutrition();
  }, []);
  
  return consumedNutrition;
};
