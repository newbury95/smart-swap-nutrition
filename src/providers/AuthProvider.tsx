
import { createContext, useContext, useEffect, useState } from 'react';
import { Session } from '@supabase/supabase-js';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

interface AuthContextType {
  session: Session | null;
  isLoading: boolean;
  hasProfile: boolean | null;
  checkingProfile: boolean;
}

const AuthContext = createContext<AuthContextType>({ 
  session: null, 
  isLoading: true,
  hasProfile: null,
  checkingProfile: true
});

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [session, setSession] = useState<Session | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [hasProfile, setHasProfile] = useState<boolean | null>(null);
  const [checkingProfile, setCheckingProfile] = useState(true);
  const { toast } = useToast();

  const checkProfile = async (userId: string) => {
    try {
      console.log('Checking profile for user:', userId);
      const { data, error } = await supabase
        .from('profiles')
        .select('id')
        .eq('id', userId)
        .maybeSingle();

      if (error) {
        console.error('Error checking profile:', error);
        toast({
          variant: "destructive",
          title: "Error",
          description: "Failed to check user profile. Please try again.",
        });
        setHasProfile(false);
        return;
      }

      console.log('Profile check result:', data);
      setHasProfile(!!data);
    } catch (error) {
      console.error('Error in checkProfile:', error);
      setHasProfile(false);
    } finally {
      setCheckingProfile(false);
    }
  };

  useEffect(() => {
    let mounted = true;
    console.log('AuthProvider initialized');
    
    const initializeAuth = async () => {
      try {
        const { data: { session: initialSession }} = await supabase.auth.getSession();
        console.log('Initial session:', initialSession?.user?.id);
        
        if (mounted) {
          setSession(initialSession);
          if (initialSession?.user) {
            await checkProfile(initialSession.user.id);
          } else {
            setHasProfile(null);
            setCheckingProfile(false);
          }
          setIsLoading(false);
        }
      } catch (error) {
        console.error('Error initializing auth:', error);
        if (mounted) {
          setIsLoading(false);
          setCheckingProfile(false);
        }
      }
    };

    initializeAuth();

    const { data: { subscription }} = supabase.auth.onAuthStateChange(async (_event, session) => {
      console.log('Auth state changed:', session?.user?.id);
      if (mounted) {
        setSession(session);
        setCheckingProfile(true);
        
        if (session?.user) {
          await checkProfile(session.user.id);
        } else {
          setHasProfile(null);
          setCheckingProfile(false);
        }
      }
    });

    return () => {
      mounted = false;
      subscription.unsubscribe();
    };
  }, []);

  return (
    <AuthContext.Provider value={{ 
      session, 
      isLoading, 
      hasProfile, 
      checkingProfile 
    }}>
      {children}
    </AuthContext.Provider>
  );
};

