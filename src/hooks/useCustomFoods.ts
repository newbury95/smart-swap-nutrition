
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import type { CustomFood } from './types/supabase';

export const useCustomFoods = () => {
  const [customFoods, setCustomFoods] = useState<CustomFood[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    loadCustomFoods();
  }, []);

  const loadCustomFoods = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const { data: { session } } = await supabase.auth.getSession();
      if (!session?.user) {
        setCustomFoods([]);
        return;
      }

      const { data, error: fetchError } = await supabase
        .from('custom_foods')
        .select('*')
        .eq('user_id', session.user.id);
      
      if (fetchError) {
        console.error('Error loading custom foods:', fetchError);
        setError(fetchError.message);
        return;
      }
      
      if (data) {
        console.log('Loaded custom foods:', data);
        setCustomFoods(data);
      }
    } catch (err) {
      console.error('Unexpected error in loadCustomFoods:', err);
      setError('Failed to load custom foods');
    } finally {
      setLoading(false);
    }
  };

  const addCustomFood = async (food: Omit<CustomFood, 'id' | 'created_at' | 'user_id'>) => {
    try {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session?.user) {
        throw new Error('User not authenticated');
      }

      console.log('Adding custom food:', food);

      const { data, error: insertError } = await supabase
        .from('custom_foods')
        .insert([{ ...food, user_id: session.user.id }])
        .select()
        .single();

      if (insertError) {
        console.error('Error adding custom food:', insertError);
        throw insertError;
      }

      if (data) {
        console.log('Added custom food:', data);
        setCustomFoods(prev => [...prev, data]);
        return data;
      }
      
      return null;
    } catch (err) {
      console.error('Error in addCustomFood:', err);
      throw err;
    }
  };

  return { 
    customFoods, 
    addCustomFood, 
    loadCustomFoods,
    loading,
    error
  };
};
