
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';

export const usePremiumStatus = () => {
  // Initialize premium status from localStorage or default to false
  const [isPremium, setIsPremium] = useState(() => {
    const storedValue = localStorage.getItem('isPremium');
    return storedValue ? storedValue === 'true' : false;
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const checkPremiumStatus = async () => {
      setLoading(true);
      try {
        const { data: { session } } = await supabase.auth.getSession();
        
        if (session?.user) {
          // Try to get profile information from profiles table
          const { data: profileData, error: profileError } = await supabase
            .from('profiles')
            .select('is_premium')
            .eq('id', session.user.id)
            .single();
          
          if (profileError) {
            console.error('Error fetching premium status from profile:', profileError);
            // Fallback to localStorage if we can't get from database
            const premium = localStorage.getItem('isPremium') === 'true';
            setIsPremium(premium);
          } else if (profileData) {
            // Update localStorage with the latest from database
            setIsPremium(profileData.is_premium);
            localStorage.setItem('isPremium', profileData.is_premium.toString());
          } else {
            setIsPremium(false);
          }
        } else {
          setIsPremium(false);
        }
      } catch (error) {
        console.error('Error checking premium status:', error);
        setIsPremium(false);
      } finally {
        setLoading(false);
      }
    };

    checkPremiumStatus();
  }, []);

  const refreshPremiumStatus = async () => {
    try {
      const { data: { session } } = await supabase.auth.getSession();
      
      if (session?.user) {
        const { data } = await supabase
          .from('profiles')
          .select('is_premium')
          .eq('id', session.user.id)
          .single();
        
        if (data) {
          setIsPremium(data.is_premium);
          localStorage.setItem('isPremium', data.is_premium.toString());
        }
      }
    } catch (error) {
      console.error('Error refreshing premium status:', error);
    }
  };

  return { isPremium, loading, refreshPremiumStatus };
};
