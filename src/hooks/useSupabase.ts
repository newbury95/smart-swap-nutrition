
import { useEffect, useState } from 'react';
import { createClient } from '@supabase/supabase-js';

// When using Lovable's Supabase integration, these values are automatically injected
const supabaseUrl = (window as any).ENV?.VITE_SUPABASE_URL;
const supabaseKey = (window as any).ENV?.VITE_SUPABASE_ANON_KEY;

const supabase = createClient(
  supabaseUrl ?? '',
  supabaseKey ?? ''
);

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

export const useSupabase = () => {
  const [isPremium, setIsPremium] = useState(false);
  const [customFoods, setCustomFoods] = useState<CustomFood[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (supabaseUrl && supabaseKey) {
      checkPremiumStatus();
      loadCustomFoods();
    } else {
      setLoading(false);
    }
  }, []);

  const checkPremiumStatus = async () => {
    const { data: { session } } = await supabase.auth.getSession();
    if (session?.user) {
      const { data } = await supabase
        .from('premium_users')
        .select('*')
        .eq('id', session.user.id)
        .single();
      setIsPremium(!!data);
    }
    setLoading(false);
  };

  const loadCustomFoods = async () => {
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

  return {
    isPremium,
    customFoods,
    loading,
    addCustomFood,
  };
};
