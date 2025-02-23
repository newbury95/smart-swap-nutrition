
import { createContext, useContext, useEffect, useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Session } from '@supabase/supabase-js';

interface AuthContextType {
  session: Session | null;
  isLoading: boolean;
  userProfile: any | null;
}

const AuthContext = createContext<AuthContextType>({ 
  session: null, 
  isLoading: true,
  userProfile: null 
});

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [session, setSession] = useState<Session | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [userProfile, setUserProfile] = useState<any | null>(null);

  useEffect(() => {
    // Get initial session
    supabase.auth.getSession().then(({ data: { session: initialSession } }) => {
      setSession(initialSession);
      
      if (initialSession?.user) {
        console.log('Initial session found:', initialSession.user.id);
        // Get initial profile
        supabase
          .from('profiles')
          .select('*')
          .eq('id', initialSession.user.id)
          .maybeSingle()
          .then(({ data: profile }) => {
            setUserProfile(profile);
            setIsLoading(false);
          });
      } else {
        setIsLoading(false);
      }
    });

    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, newSession) => {
      console.log('Auth state changed. New session:', newSession?.user?.id ?? 'none');
      setSession(newSession);

      if (newSession?.user) {
        // Get profile on auth change
        supabase
          .from('profiles')
          .select('*')
          .eq('id', newSession.user.id)
          .maybeSingle()
          .then(({ data: profile }) => {
            setUserProfile(profile);
            setIsLoading(false);
          });
      } else {
        setUserProfile(null);
        setIsLoading(false);
      }
    });

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  const value = {
    session,
    isLoading,
    userProfile
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};
