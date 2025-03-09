
import { useState, useEffect } from 'react';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from './useAuth';

export const usePremiumStatus = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [isPremium, setIsPremium] = useState<boolean>(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let mounted = true;

    const checkPremiumStatus = async () => {
      if (!user) {
        if (mounted) {
          setIsPremium(false);
          setLoading(false);
        }
        return;
      }

      try {
        // Use maybeSingle instead of single to handle no rows gracefully
        const { data: profileData, error: profileError } = await supabase
          .from('profiles')
          .select('is_premium')
          .eq('id', user.id)
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

    return () => {
      mounted = false;
    };
  }, [user, toast]);

  const refreshPremiumStatus = async () => {
    if (!user) {
      setIsPremium(false);
      setLoading(false);
      return;
    }

    setLoading(true);
    try {
      const { data } = await supabase
        .from('profiles')
        .select('is_premium')
        .eq('id', user.id)
        .maybeSingle();
      
      if (data) {
        setIsPremium(data.is_premium);
        localStorage.setItem('isPremium', data.is_premium.toString());
      } else {
        setIsPremium(false);
        localStorage.setItem('isPremium', 'false');
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
