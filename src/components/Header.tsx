
import { useNavigate } from "react-router-dom";
import { Crown, LogOut } from "lucide-react";
import { Button } from "./ui/button";
import { useSupabase } from "@/hooks/useSupabase";
import { useToast } from "@/hooks/use-toast";
import { useLocation } from "react-router-dom";

const Header = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { toast } = useToast();
  const { isPremium } = useSupabase();
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

  return (
    <header className="border-b bg-white">
      <div className="container mx-auto px-4 h-16 flex items-center justify-between">
        <div className="flex items-center gap-4">
          <h1 className="text-xl font-semibold text-green-600">NutriTrack</h1>
          
          {!isOnDashboard && (
            <div className="flex items-center gap-4">
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
                onClick={() => navigate("/tracking")}
              >
                Tracker
                <Crown className="h-4 w-4 text-yellow-500" />
              </Button>
            </div>
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
};

export default Header;
