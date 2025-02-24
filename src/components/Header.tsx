
import { useNavigate } from "react-router-dom";
import { Crown, LogOut } from "lucide-react";
import { Button } from "./ui/button";
import { useSupabase } from "@/hooks/useSupabase";
import { useToast } from "@/hooks/use-toast";
import { useLocation } from "react-router-dom";
import { memo } from "react";

const Header = memo(() => {
  const navigate = useNavigate();
  const location = useLocation();
  const { toast } = useToast();
  const { isPremium, loading } = useSupabase();
  const isOnDashboard = location.pathname === "/";

  const handleLogout = async () => {
    const supabase = (window as any).supabase;
    if (supabase) {
      await supabase.auth.signOut();
      toast({
        title: "Logged out successfully",
        description: "See you next time!",
      });
      navigate("/");
    }
  };

  if (loading) {
    return null;
  }

  return (
    <header className="border-b bg-white">
      <div className="container mx-auto px-4 h-16 flex items-center justify-between">
        <div className="flex items-center gap-4">
          <h1 
            onClick={() => navigate("/")}
            className="text-xl font-semibold text-green-600 cursor-pointer"
          >
            NutriTrack
          </h1>
          
          {!isOnDashboard && (
            <nav className="flex items-center gap-4">
              <Button
                variant="outline"
                className="flex items-center gap-2"
                onClick={() => navigate("/")}
              >
                Dashboard
              </Button>
              
              <Button
                variant="outline"
                className="flex items-center gap-2"
                onClick={() => navigate("/diary")}
              >
                Food Diary
              </Button>

              <Button
                variant="outline"
                className="flex items-center gap-2"
                onClick={() => navigate("/activity")}
              >
                Activity
              </Button>

              <Button
                variant="outline"
                className="flex items-center gap-2"
                onClick={() => navigate("/forum")}
              >
                Forum
              </Button>

              {isPremium && (
                <>
                  <Button
                    variant="outline"
                    className="flex items-center gap-2"
                    onClick={() => navigate("/meal-plans")}
                  >
                    Meal Plans
                    <Crown className="h-4 w-4 text-yellow-500" />
                  </Button>

                  <Button
                    variant="outline"
                    className="flex items-center gap-2"
                    onClick={() => navigate("/workout-plans")}
                  >
                    Workouts
                    <Crown className="h-4 w-4 text-yellow-500" />
                  </Button>
                </>
              )}

              <Button
                variant="outline"
                className="flex items-center gap-2"
                onClick={() => navigate("/contact")}
              >
                Contact
              </Button>
            </nav>
          )}
        </div>
        
        <Button
          variant="ghost"
          onClick={handleLogout}
          className="flex items-center gap-2"
        >
          <span>Log out</span>
          <LogOut className="h-4 w-4" />
        </Button>
      </div>
    </header>
  );
});

Header.displayName = 'Header';

export default Header;
