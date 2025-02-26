
import { useEffect, useState } from 'react';
import { createClient } from '@supabase/supabase-js';
import { usePremiumStatus } from './usePremiumStatus';
import { useCustomFoods } from './useCustomFoods';
import { useHealthMetrics } from './useHealthMetrics';
import { useMeals } from './useMeals';
import { useFoodSwaps } from './useFoodSwaps';

export type { CustomFood, HealthMetric, Meal, FoodSwap } from './types/supabase';

// When using Lovable's Supabase integration, these values are automatically injected
const supabaseUrl = (window as any).ENV?.VITE_SUPABASE_URL;
const supabaseKey = (window as any).ENV?.VITE_SUPABASE_ANON_KEY;

export const supabase = supabaseUrl && supabaseKey ? createClient(supabaseUrl, supabaseKey) : null;

export const useSupabase = () => {
  const { isPremium, loading } = usePremiumStatus();
  const { customFoods, addCustomFood } = useCustomFoods();
  const { addHealthMetric, getHealthMetrics } = useHealthMetrics();
  const { getMeals, addMeal, deleteMeal } = useMeals();
  const { getFoodSwaps } = useFoodSwaps();

  return {
    isPremium,
    customFoods,
    loading,
    addCustomFood,
    addHealthMetric,
    getHealthMetrics,
    getMeals,
    addMeal,
    deleteMeal,
    getFoodSwaps,
  };
};
