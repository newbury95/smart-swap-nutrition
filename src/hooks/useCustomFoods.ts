
import { useState, useEffect } from 'react';
import { supabase } from './useSupabase';
import type { CustomFood } from './types/supabase';

export const useCustomFoods = () => {
  const [customFoods, setCustomFoods] = useState<CustomFood[]>([]);

  useEffect(() => {
    if (supabase) {
      loadCustomFoods();
    }
  }, []);

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

  return { customFoods, addCustomFood };
};
