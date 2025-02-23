
import { useEffect, useState } from 'react';
import { createClient } from '@supabase/supabase-js';

// When using Lovable's Supabase integration, these values are automatically injected
const supabaseUrl = (window as any).ENV?.VITE_SUPABASE_URL;
const supabaseKey = (window as any).ENV?.VITE_SUPABASE_ANON_KEY;

const supabase = supabaseUrl && supabaseKey ? createClient(supabaseUrl, supabaseKey) : null;

export type CustomFood = {
  id: string;
  name: string;
  brand?: string;
  calories: number;
  protein: number;
  carbs: number;
  fat: number;
  serving_size: string;
  created_at: string;
};

export type HealthMetric = {
  id: string;
  metric_type: 'activity' | 'heart-rate' | 'steps';
  value: number;
  recorded_at: string;
  source: string;
};

export type Meal = {
  id: string;
  food_name: string;
  calories: number;
  protein: number;
  carbs: number;
  fat: number;
  meal_type: 'breakfast' | 'lunch' | 'dinner' | 'snack';
  serving_size?: string;
  created_at: string;
  date: string;
};

export const useSupabase = () => {
  const [isPremium, setIsPremium] = useState(false);
  const [customFoods, setCustomFoods] = useState<CustomFood[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (supabase) {
      checkPremiumStatus();
      loadCustomFoods();
    } else {
      setLoading(false);
    }
  }, []);

  const checkPremiumStatus = async () => {
    if (!supabase) return;
    
    const { data: { session } } = await supabase.auth.getSession();
    if (session?.user) {
      const { data } = await supabase
        .from('profiles')
        .select('is_premium')
        .eq('id', session.user.id)
        .single();
      setIsPremium(!!data?.is_premium);
    }
    setLoading(false);
  };

  const loadCustomFoods = async () => {
    if (!supabase) return;

    const { data: { session } } = await supabase.auth.getSession();
    if (session?.user) {
      const { data } = await supabase
        .from('custom_foods')
        .select('*')
        .eq('user_id', session.user.id);
      if (data) setCustomFoods(data);
    }
  };

  const addCustomFood = async (food: Omit<CustomFood, 'id' | 'created_at'>) => {
    if (!supabase) return null;

    const { data: { session } } = await supabase.auth.getSession();
    if (!session?.user) return null;

    const { data, error } = await supabase
      .from('custom_foods')
      .insert([{ ...food, user_id: session.user.id }])
      .select()
      .single();

    if (error) throw error;
    if (data) {
      setCustomFoods([...customFoods, data]);
      return data;
    }
    return null;
  };

  const getMeals = async (date: Date) => {
    if (!supabase) return [];

    const { data: { session } } = await supabase.auth.getSession();
    if (!session?.user) return [];

    const { data, error } = await supabase
      .from('meals')
      .select('*')
      .eq('user_id', session.user.id)
      .eq('date', date.toISOString().split('T')[0]);

    if (error) throw error;
    return (data || []) as Meal[];
  };

  const addMeal = async (meal: Omit<Meal, 'id' | 'created_at'>) => {
    if (!supabase) return null;

    const { data: { session } } = await supabase.auth.getSession();
    if (!session?.user) return null;

    const { data, error } = await supabase
      .from('meals')
      .insert([{ ...meal, user_id: session.user.id }])
      .select()
      .single();

    if (error) throw error;
    return data as Meal;
  };

  const deleteMeal = async (mealId: string) => {
    if (!supabase) return;

    const { error } = await supabase
      .from('meals')
      .delete()
      .eq('id', mealId);

    if (error) throw error;
  };

  const addHealthMetric = async (metric: Omit<HealthMetric, 'id' | 'recorded_at'>) => {
    if (!supabase) return null;

    const { data: { session } } = await supabase.auth.getSession();
    if (!session?.user) return null;

    const { data, error } = await supabase
      .from('health_metrics')
      .insert([{ ...metric, user_id: session.user.id }])
      .select()
      .single();

    if (error) throw error;
    return data;
  };

  const getHealthMetrics = async (type: HealthMetric['metric_type']) => {
    if (!supabase) return [];

    const { data, error } = await supabase
      .from('health_metrics')
      .select('*')
      .eq('metric_type', type)
      .order('recorded_at', { ascending: false })
      .limit(30);

    if (error) throw error;
    return data || [];
  };

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
  };
};

