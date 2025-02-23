
import { createContext, useContext, useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Session } from '@supabase/supabase-js';
import { supabase } from '@/integrations/supabase/client';

interface AuthContextType {
  session: Session | null;
  isLoading: boolean;
}

const AuthContext = createContext<AuthContextType>({ session: null, isLoading: true });

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [session, setSession] = useState<Session | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    let mounted = true;

    async function getInitialSession() {
      try {
        const { data: { session: initialSession } } = await supabase.auth.getSession();
        if (mounted) {
          if (initialSession) {
            console.log('Initial session found:', initialSession.user.id);
            // Check if user has a profile
            const { data: profile } = await supabase
              .from('profiles')
              .select('*')
              .eq('id', initialSession.user.id)
              .single();

            setSession(initialSession);

            if (!profile && !window.location.pathname.includes('/signup')) {
              console.log('No profile found, redirecting to personal info');
              navigate('/signup/personal-info');
            }
          } else {
            console.log('No initial session found');
            if (!window.location.pathname.includes('/signup')) {
              navigate('/signup');
            }
          }
          setIsLoading(false);
        }
      } catch (error) {
        console.error('Error getting initial session:', error);
        if (mounted) {
          setIsLoading(false);
          if (!window.location.pathname.includes('/signup')) {
            navigate('/signup');
          }
        }
      }
    }

    getInitialSession();

    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (_event, currentSession) => {
      console.log('Auth state changed. Event:', _event, 'Session:', currentSession?.user?.id ?? 'none');
      if (mounted) {
        setSession(currentSession);
        
        if (!currentSession) {
          console.log('No session detected, redirecting to signup');
          navigate('/signup');
        } else {
          // Check if user has a profile
          const { data: profile } = await supabase
            .from('profiles')
            .select('*')
            .eq('id', currentSession.user.id)
            .single();

          if (!profile && !window.location.pathname.includes('/signup')) {
            console.log('No profile found, redirecting to personal info');
            navigate('/signup/personal-info');
          } else if (profile && window.location.pathname.includes('/signup')) {
            console.log('Profile exists, redirecting to diary');
            navigate('/diary');
          }
        }
      }
    });

    return () => {
      mounted = false;
      subscription.unsubscribe();
    };
  }, [navigate]);

  return (
    <AuthContext.Provider value={{ session, isLoading }}>
      {children}
    </AuthContext.Provider>
  );
};
