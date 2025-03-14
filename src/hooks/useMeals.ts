
import { useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';
import type { Meal } from '@/hooks/useSupabase';

export const useMeals = () => {
  const getMeals = useCallback(async (date: Date) => {
    try {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session?.user) return [];

      // Ensure valid date formatting
      const formattedDate = date instanceof Date 
        ? date.toISOString().split('T')[0]
        : new Date().toISOString().split('T')[0];

      const { data, error } = await supabase
        .from('meals')
        .select('*')
        .eq('user_id', session.user.id)
        .eq('date', formattedDate);

      if (error) {
        console.error('Error fetching meals:', error);
        return [];
      }
      
      return (data || []) as Meal[];
    } catch (error) {
      console.error('Error in getMeals:', error);
      return [];
    }
  }, []);

  const addMeal = useCallback(async (meal: Omit<Meal, 'id' | 'created_at'>) => {
    try {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session?.user) return null;

      // Sanitize meal data to prevent invalid values
      const sanitizedMeal = {
        ...meal,
        user_id: session.user.id,
        calories: isNaN(meal.calories) ? 0 : meal.calories,
        protein: isNaN(meal.protein) ? 0 : meal.protein,
        carbs: isNaN(meal.carbs) ? 0 : meal.carbs,
        fat: isNaN(meal.fat) ? 0 : meal.fat
      };

      const { data, error } = await supabase
        .from('meals')
        .insert([sanitizedMeal])
        .select()
        .single();

      if (error) {
        console.error('Error adding meal:', error);
        return null;
      }
      
      return data as Meal;
    } catch (error) {
      console.error('Error in addMeal:', error);
      return null;
    }
  }, []);

  const deleteMeal = useCallback(async (mealId: string) => {
    try {
      const { error } = await supabase
        .from('meals')
        .delete()
        .eq('id', mealId);

      if (error) {
        console.error('Error deleting meal:', error);
        throw error;
      }
    } catch (error) {
      console.error('Error in deleteMeal:', error);
      throw error;
    }
  }, []);

  return { getMeals, addMeal, deleteMeal };
};
