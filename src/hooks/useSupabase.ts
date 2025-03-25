
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

export const supabase = supabaseUrl && supabaseKey ? createClient(supabaseUrl, supabaseKey, {
  auth: {
    persistSession: true,
    autoRefreshToken: true,
    detectSessionInUrl: true,
  },
  global: {
    fetch: (...args) => {
      // Add performance headers
      const [url, config] = args;
      config.headers = {
        ...config.headers,
        'Cache-Control': 'max-age=600',
      };
      return fetch(url, config);
    }
  }
}) : null;

export const useSupabase = () => {
  const { isPremium, loading } = usePremiumStatus();
  const { customFoods, addCustomFood, loadCustomFoods } = useCustomFoods();
  const { addHealthMetric: rawAddHealthMetric, getHealthMetrics } = useHealthMetrics();
  const { getMeals, addMeal, deleteMeal } = useMeals();
  const { getFoodSwaps } = useFoodSwaps();

  // Wrapper function to convert the return type to void
  const addHealthMetric = async (metric: any): Promise<void> => {
    await rawAddHealthMetric(metric);
    // Return void explicitly
    return;
  };

  return {
    isPremium,
    customFoods,
    loading,
    addCustomFood,
    loadCustomFoods,
    addHealthMetric,
    getHealthMetrics,
    getMeals,
    addMeal,
    deleteMeal,
    getFoodSwaps,
  };
};
