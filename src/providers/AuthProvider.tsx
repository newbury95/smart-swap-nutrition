
import { createContext, useContext, useEffect, useState } from 'react';
import { Session } from '@supabase/supabase-js';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

interface AuthContextType {
  session: Session | null;
  isLoading: boolean;
  hasProfile: boolean | null;
  checkingProfile: boolean;
  signUp: (email: string, password: string) => Promise<void>;
}

const AuthContext = createContext<AuthContextType>({
  session: null,
  isLoading: true,
  hasProfile: null,
  checkingProfile: true,
  signUp: async () => {},
});

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [session, setSession] = useState<Session | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [hasProfile, setHasProfile] = useState<boolean | null>(null);
  const [checkingProfile, setCheckingProfile] = useState(true);
  const { toast } = useToast();

  const checkProfile = async (userId: string) => {
    console.log('AuthProvider: Checking profile for user:', userId);
    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('id')
        .eq('id', userId)
        .single();

      if (error && error.code !== 'PGRST116') { // PGRST116 is the "not found" error code
        console.error('AuthProvider: Error checking profile:', error);
        toast({
          variant: "destructive",
          title: "Error",
          description: "Failed to check user profile",
        });
        setHasProfile(false);
        return;
      }
      
      const profileExists = !!data;
      console.log('AuthProvider: Profile exists?', profileExists);
      setHasProfile(profileExists);
    } catch (error) {
      console.error('AuthProvider: Error in checkProfile:', error);
      setHasProfile(false);
    } finally {
      console.log('AuthProvider: Finished checking profile');
      setCheckingProfile(false);
    }
  };

  const signUp = async (email: string, password: string) => {
    try {
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
      });

      if (error) throw error;

      toast({
        title: "Success",
        description: "Please check your email to verify your account",
      });

    } catch (error: any) {
      toast({
        variant: "destructive",
        title: "Error",
        description: error.message,
      });
      throw error;
    }
  };

  useEffect(() => {
    console.log('AuthProvider: Initializing...');
    let mounted = true;

    const initialize = async () => {
      try {
        console.log('AuthProvider: Getting initial session...');
        const { data: { session: initialSession } } = await supabase.auth.getSession();
        
        if (!mounted) return;
        
        console.log('AuthProvider: Initial session:', initialSession ? 'exists' : 'null');
        setSession(initialSession);
        
        if (initialSession?.user) {
          console.log('AuthProvider: Initial session has user, checking profile...');
          await checkProfile(initialSession.user.id);
        } else {
          console.log('AuthProvider: No initial session user');
          setHasProfile(null);
          setCheckingProfile(false);
        }
      } catch (error) {
        console.error('AuthProvider: Auth initialization error:', error);
        if (mounted) {
          setHasProfile(null);
          setCheckingProfile(false);
        }
      } finally {
        if (mounted) {
          console.log('AuthProvider: Finished initialization');
          setIsLoading(false);
        }
      }
    };

    initialize();

    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, newSession) => {
        console.log('AuthProvider: Auth state changed:', event);
        if (!mounted) return;

        setSession(newSession);
        setCheckingProfile(true);

        if (newSession?.user) {
          console.log('AuthProvider: New session has user, checking profile...');
          await checkProfile(newSession.user.id);
        } else {
          console.log('AuthProvider: No user in new session');
          setHasProfile(null);
          setCheckingProfile(false);
        }
      }
    );

    return () => {
      console.log('AuthProvider: Cleaning up...');
      mounted = false;
      subscription.unsubscribe();
    };
  }, []);

  return (
    <AuthContext.Provider value={{
      session,
      isLoading,
      hasProfile,
      checkingProfile,
      signUp
    }}>
      {children}
    </AuthContext.Provider>
  );
};
