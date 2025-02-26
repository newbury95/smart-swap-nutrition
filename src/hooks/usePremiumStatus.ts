
import { useState, useEffect } from 'react';
import { supabase } from './useSupabase';

export const usePremiumStatus = () => {
  const [isPremium, setIsPremium] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (supabase) {
      checkPremiumStatus();
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

  return { isPremium, loading };
};
