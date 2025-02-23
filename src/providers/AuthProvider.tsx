
import { createContext, useContext, useEffect, useState } from 'react';
import { Session } from '@supabase/supabase-js';
import { supabase } from '@/integrations/supabase/client';

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

  const checkProfile = async (userId: string) => {
    try {
      console.log('[AuthProvider] Checking profile for user:', userId);
      const { data: profile, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', userId)
        .maybeSingle();

      if (error) {
        console.error('[AuthProvider] Error checking profile:', error);
        setHasProfile(false);
        return;
      }

      console.log('[AuthProvider] Profile check result:', profile);
      setHasProfile(!!profile);
    } catch (error) {
      console.error('[AuthProvider] Exception checking profile:', error);
      setHasProfile(false);
    } finally {
      setCheckingProfile(false);
    }
  };

  useEffect(() => {
    let mounted = true;

    const getInitialSession = async () => {
      try {
        console.log('[AuthProvider] Getting initial session...');
        const { data: { session: initialSession } } = await supabase.auth.getSession();

        if (mounted) {
          setSession(initialSession);
          if (initialSession) {
            console.log('[AuthProvider] Initial session found:', initialSession.user.id);
            await checkProfile(initialSession.user.id);
          } else {
            console.log('[AuthProvider] No initial session found');
            setHasProfile(null);
            setCheckingProfile(false);
          }
        }
      } catch (error) {
        console.error('[AuthProvider] Exception getting initial session:', error);
        if (mounted) {
          setHasProfile(null);
          setCheckingProfile(false);
        }
      } finally {
        if (mounted) {
          setIsLoading(false);
        }
      }
    };

    getInitialSession();

    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (_event, currentSession) => {
      console.log('[AuthProvider] Auth state changed. Event:', _event, 'Session:', currentSession?.user?.id ?? 'none');
      
      if (mounted) {
        setSession(currentSession);
        if (currentSession) {
          await checkProfile(currentSession.user.id);
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
    <AuthContext.Provider value={{ session, isLoading, hasProfile, checkingProfile }}>
      {children}
    </AuthContext.Provider>
  );
};
