
import { useNavigate } from "react-router-dom";
import { BookOpen, MessageSquare, PhoneCall, LogOut, Activity, Crown, Dumbbell, Menu } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { useEffect, useState } from "react";
import { Button } from "./ui/button";
import { cn } from "@/lib/utils";

const Header = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);

  useEffect(() => {
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setIsAuthenticated(!!session);
    });

    return () => subscription.unsubscribe();
  }, []);

  const handleNavigation = (path: string) => {
    const protectedRoutes = ['/diary', '/tracking', '/forum', '/workout-plans', '/meal-plans'];
    
    if (protectedRoutes.includes(path) && !isAuthenticated) {
      toast({
        title: "Authentication Required",
        description: "Please sign in to access this feature",
      });
      navigate('/auth');
      return;
    }
    
    navigate(path);
  };

  const handleSignOut = async () => {
    try {
      await supabase.auth.signOut();
      toast({
        title: "Signed out successfully",
        description: "You have been signed out of your account",
      });
      navigate('/');
    } catch (error: any) {
      toast({
        variant: "destructive",
        title: "Error signing out",
        description: error.message,
      });
    }
  };

  return (
    <header className="sticky top-0 z-50 border-b bg-white">
      <div className="container mx-auto px-4">
        <nav className="flex gap-4 justify-between py-3">
          <div className="grid grid-cols-6 gap-3 flex-1">
            <button
              onClick={() => handleNavigation('/diary')}
              className="flex flex-col items-center gap-1 p-2 rounded-lg text-gray-600 hover:bg-gray-100 hover:text-gray-900 transition-all duration-300"
            >
              <BookOpen className="w-4 h-4" />
              <span className="text-[10px]">Food Diary</span>
            </button>

            <button
              onClick={() => handleNavigation('/tracking')}
              className="flex flex-col items-center gap-1 p-2 rounded-lg text-gray-600 hover:bg-gray-100 hover:text-gray-900 transition-all duration-300"
            >
              <Activity className="w-4 h-4" />
              <span className="text-[10px]">Tracking</span>
            </button>

            <button
              onClick={() => handleNavigation('/meal-plans')}
              className="flex flex-col items-center gap-1 p-2 rounded-lg text-gray-600 hover:bg-gray-100 hover:text-gray-900 transition-all duration-300"
            >
              <div className="relative">
                <Menu className="w-4 h-4" />
                <Crown className="absolute -top-1.5 -right-1.5 w-3 h-3 text-yellow-500" />
              </div>
              <span className="text-[10px]">Meal Plans</span>
            </button>

            <button
              onClick={() => handleNavigation('/workout-plans')}
              className="flex flex-col items-center gap-1 p-2 rounded-lg text-gray-600 hover:bg-gray-100 hover:text-gray-900 transition-all duration-300"
            >
              <div className="relative">
                <Dumbbell className="w-4 h-4" />
                <Crown className="absolute -top-1.5 -right-1.5 w-3 h-3 text-yellow-500" />
              </div>
              <span className="text-[10px]">Workouts</span>
            </button>

            <button
              onClick={() => handleNavigation('/forum')}
              className="flex flex-col items-center gap-1 p-2 rounded-lg text-gray-600 hover:bg-gray-100 hover:text-gray-900 transition-all duration-300"
            >
              <MessageSquare className="w-4 h-4" />
              <span className="text-[10px]">Blogs</span>
            </button>

            <button
              onClick={() => handleNavigation('/contact')}
              className="flex flex-col items-center gap-1 p-2 rounded-lg text-gray-600 hover:bg-gray-100 hover:text-gray-900 transition-all duration-300"
            >
              <PhoneCall className="w-4 h-4" />
              <span className="text-[10px]">Contact</span>
            </button>
          </div>

          {isAuthenticated ? (
            <Button
              variant="ghost"
              className="text-gray-600 hover:text-gray-900"
              onClick={handleSignOut}
            >
              <LogOut className="w-4 h-4 mr-2" />
              Sign Out
            </Button>
          ) : (
            <Button
              variant="ghost"
              className="text-gray-600 hover:text-gray-900"
              onClick={() => navigate('/auth')}
            >
              Sign In
            </Button>
          )}
        </nav>
      </div>
    </header>
  );
};

export default Header;
