
import { useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';
import type { Meal } from '@/hooks/useSupabase';

export const useMeals = () => {
  // Create a cache for meals by date
  const mealsCache = new Map<string, { timestamp: number, data: Meal[] }>();
  const CACHE_TTL = 60000; // 1 minute TTL
  
  const getMeals = useCallback(async (date: Date) => {
    try {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session?.user) return [];

      // Ensure valid date formatting
      const formattedDate = date instanceof Date 
        ? date.toISOString().split('T')[0]
        : new Date().toISOString().split('T')[0];
      
      // Check cache first
      const cacheKey = `${session.user.id}-${formattedDate}`;
      const cachedData = mealsCache.get(cacheKey);
      const now = Date.now();
      
      if (cachedData && (now - cachedData.timestamp < CACHE_TTL)) {
        console.log('Using cached meals data for:', formattedDate);
        return cachedData.data;
      }

      console.log('Fetching fresh meals data for:', formattedDate);
      const { data, error } = await supabase
        .from('meals')
        .select('*')
        .eq('user_id', session.user.id)
        .eq('date', formattedDate);

      if (error) {
        console.error('Error fetching meals:', error);
        return [];
      }
      
      // Store in cache
      mealsCache.set(cacheKey, { 
        timestamp: now,
        data: data || []
      });
      
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
      
      // Invalidate cache for this date
      const formattedDate = meal.date.split('T')[0];
      const cacheKey = `${session.user.id}-${formattedDate}`;
      mealsCache.delete(cacheKey);
      
      return data as Meal;
    } catch (error) {
      console.error('Error in addMeal:', error);
      return null;
    }
  }, []);

  const deleteMeal = useCallback(async (mealId: string) => {
    try {
      // Get the meal first to know which cache entry to invalidate
      const { data: meal } = await supabase
        .from('meals')
        .select('user_id, date')
        .eq('id', mealId)
        .single();
      
      const { error } = await supabase
        .from('meals')
        .delete()
        .eq('id', mealId);

      if (error) {
        console.error('Error deleting meal:', error);
        throw error;
      }
      
      // Invalidate cache if we got the meal info
      if (meal) {
        const formattedDate = meal.date.split('T')[0];
        const cacheKey = `${meal.user_id}-${formattedDate}`;
        mealsCache.delete(cacheKey);
      }
    } catch (error) {
      console.error('Error in deleteMeal:', error);
      throw error;
    }
  }, []);

  return { getMeals, addMeal, deleteMeal };
};
