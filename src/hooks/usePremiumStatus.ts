
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
    
    try {
      const { data: { session } } = await supabase.auth.getSession();
      if (session?.user) {
        const { data, error } = await supabase
          .from('profiles')
          .select('is_premium')
          .eq('id', session.user.id)
          .single();
        
        if (error) {
          console.error('Error fetching premium status:', error);
          setIsPremium(false);
        } else {
          setIsPremium(!!data?.is_premium);
          
          // Also store in localStorage for quick access
          localStorage.setItem('isPremium', data?.is_premium ? 'true' : 'false');
        }
      } else {
        setIsPremium(false);
        localStorage.removeItem('isPremium');
      }
    } catch (error) {
      console.error('Error in premium status check:', error);
      setIsPremium(false);
    } finally {
      setLoading(false);
    }
  };

  const refreshPremiumStatus = () => {
    setLoading(true);
    checkPremiumStatus();
  };

  return { isPremium, loading, refreshPremiumStatus };
};
