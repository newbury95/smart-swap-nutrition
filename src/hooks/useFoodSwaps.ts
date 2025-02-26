
import { supabase } from './useSupabase';
import type { FoodSwap } from './types/supabase';

export const useFoodSwaps = () => {
  const getFoodSwaps = async (date: Date) => {
    if (!supabase) return [];

    const { data: { session } } = await supabase.auth.getSession();
    if (!session?.user) return [];

    const { data, error } = await supabase.rpc(
      'get_food_swaps',
      { 
        meal_date: date.toISOString().split('T')[0],
        user_id: session.user.id
      }
    );

    if (error) throw error;
    return data as FoodSwap[];
  };

  return { getFoodSwaps };
};
