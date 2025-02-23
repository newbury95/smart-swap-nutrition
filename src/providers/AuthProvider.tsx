
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
    // Initial session and profile fetch
    const initializeAuth = async () => {
      try {
        const { data: { session: initialSession } } = await supabase.auth.getSession();
        console.log('Initial auth check:', initialSession?.user?.id ?? 'no session');
        
        setSession(initialSession);

        if (initialSession?.user) {
          const { data: profile } = await supabase
            .from('profiles')
            .select('*')
            .eq('id', initialSession.user.id)
            .maybeSingle();
          
          setUserProfile(profile);
          console.log('Profile loaded:', profile ? 'yes' : 'no');
        }
      } catch (error) {
        console.error('Error during auth initialization:', error);
      } finally {
        setIsLoading(false);
      }
    };

    initializeAuth();

    // Subscribe to auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (_event, newSession) => {
        console.log('Auth state changed:', newSession?.user?.id ?? 'no session');
        setSession(newSession);

        if (newSession?.user) {
          const { data: profile } = await supabase
            .from('profiles')
            .select('*')
            .eq('id', newSession.user.id)
            .maybeSingle();
          
          setUserProfile(profile);
          console.log('Profile updated:', profile ? 'yes' : 'no');
        } else {
          setUserProfile(null);
        }
      }
    );

    return () => subscription.unsubscribe();
  }, []);

  return (
    <AuthContext.Provider value={{ session, isLoading, userProfile }}>
      {children}
    </AuthContext.Provider>
  );
};
