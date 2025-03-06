
import { useState, useEffect } from 'react';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';

export const usePremiumStatus = () => {
  const { toast } = useToast();
  const [isPremium, setIsPremium] = useState(() => {
    const storedValue = localStorage.getItem('isPremium');
    return storedValue ? storedValue === 'true' : false;
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let mounted = true;

    const checkPremiumStatus = async () => {
      try {
        const { data: { session } } = await supabase.auth.getSession();
        
        if (!session?.user) {
          if (mounted) {
            setIsPremium(false);
            setLoading(false);
          }
          return;
        }

        // Use maybeSingle instead of single to handle no rows gracefully
        const { data: profileData, error: profileError } = await supabase
          .from('profiles')
          .select('is_premium')
          .eq('id', session.user.id)
          .maybeSingle();
        
        if (profileError) {
          console.error('Error fetching premium status:', profileError);
          throw profileError;
        }

        if (mounted) {
          const premium = !!profileData?.is_premium;
          setIsPremium(premium);
          localStorage.setItem('isPremium', premium.toString());
        }
      } catch (error) {
        console.error('Error checking premium status:', error);
        if (mounted) {
          setIsPremium(false);
          toast({
            variant: "destructive",
            title: "Error checking premium status",
            description: "Please try refreshing the page",
          });
        }
      } finally {
        if (mounted) {
          setLoading(false);
        }
      }
    };

    checkPremiumStatus();

    // Set up auth state change listener
    const { data: { subscription } } = supabase.auth.onAuthStateChange(() => {
      checkPremiumStatus();
    });

    return () => {
      mounted = false;
      subscription.unsubscribe();
    };
  }, [toast]);

  const refreshPremiumStatus = async () => {
    setLoading(true);
    try {
      const { data: { session } } = await supabase.auth.getSession();
      
      if (!session?.user) {
        setIsPremium(false);
        return;
      }

      const { data } = await supabase
        .from('profiles')
        .select('is_premium')
        .eq('id', session.user.id)
        .maybeSingle();
      
      if (data) {
        setIsPremium(data.is_premium);
        localStorage.setItem('isPremium', data.is_premium.toString());
      }
    } catch (error) {
      console.error('Error refreshing premium status:', error);
      toast({
        variant: "destructive",
        title: "Error refreshing premium status",
        description: "Please try again",
      });
    } finally {
      setLoading(false);
    }
  };

  return { isPremium, loading, refreshPremiumStatus };
};
