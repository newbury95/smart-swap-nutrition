
import { supabase } from './useSupabase';
import type { Meal } from './types/supabase';

export const useMeals = () => {
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

  return { getMeals, addMeal, deleteMeal };
};
