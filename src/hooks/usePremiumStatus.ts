
import { useState, useEffect } from 'react';
import { supabase } from './useSupabase';

export const usePremiumStatus = () => {
  // Always return isPremium as true for testing
  const [isPremium, setIsPremium] = useState(true);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    // For testing, we're setting isPremium to true and not checking with Supabase
    setIsPremium(true);
    setLoading(false);
    
    // Store in localStorage for quick access
    localStorage.setItem('isPremium', 'true');
  }, []);

  const refreshPremiumStatus = () => {
    // For testing, this does nothing since we always want isPremium to be true
    setIsPremium(true);
  };

  return { isPremium, loading, refreshPremiumStatus };
};
