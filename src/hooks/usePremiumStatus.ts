
import { useState, useEffect } from 'react';
import { supabase } from './useSupabase';

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
          // Check premium status from user metadata or subscription table
          // For demo purposes, we're just using localStorage
          const premium = localStorage.getItem('isPremium') === 'true';
          setIsPremium(premium);
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
    // In a real app, this would check with the server
    const premium = localStorage.getItem('isPremium') === 'true';
    setIsPremium(premium);
  };

  return { isPremium, loading, refreshPremiumStatus };
};
