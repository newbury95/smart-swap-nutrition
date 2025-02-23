
import { createContext, useContext, useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
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
  const navigate = useNavigate();

  useEffect(() => {
    let mounted = true;

    async function checkProfile(userId: string) {
      try {
        const { data: profile } = await supabase
          .from('profiles')
          .select('*')
          .eq('id', userId)
          .single();

        if (mounted) {
          setHasProfile(!!profile);
          setCheckingProfile(false);
        }
      } catch (error) {
        console.error('Error checking profile:', error);
        if (mounted) {
          setHasProfile(false);
          setCheckingProfile(false);
        }
      }
    }

    async function getInitialSession() {
      try {
        const { data: { session: initialSession } } = await supabase.auth.getSession();
        if (mounted) {
          if (initialSession) {
            console.log('Initial session found:', initialSession.user.id);
            setSession(initialSession);
            await checkProfile(initialSession.user.id);
          } else {
            setHasProfile(null);
            setCheckingProfile(false);
          }
          setIsLoading(false);
        }
      } catch (error) {
        console.error('Error getting initial session:', error);
        if (mounted) {
          setIsLoading(false);
          setCheckingProfile(false);
        }
      }
    }

    getInitialSession();

    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (_event, currentSession) => {
      console.log('Auth state changed. Event:', _event, 'Session:', currentSession?.user?.id ?? 'none');
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
