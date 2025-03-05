
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";
import { Button } from "@/components/ui/button";

const TopBanner = () => {
  const { user, signOut } = useAuth();
  const navigate = useNavigate();
  
  const handleSignOut = async () => {
    await signOut();
    navigate('/');
  };
  
  return (
    <div className="bg-green-600 text-white py-3">
      <div className="container mx-auto px-4 flex flex-wrap justify-between items-center gap-4">
        <Link to="/" className="text-xl font-semibold hover:text-white/90 transition-colors">
          NutriTrack
        </Link>
        
        <div className="flex flex-wrap items-center gap-4">
          {user ? (
            <>
              <Link 
                to="/tracking" 
                className="text-sm sm:text-base hover:text-white/90 transition-colors"
              >
                Tracking
              </Link>
              <Link 
                to="/diary" 
                className="text-sm sm:text-base hover:text-white/90 transition-colors"
              >
                Food Diary
              </Link>
              <Link 
                to="/meal-plans" 
                className="text-sm sm:text-base hover:text-white/90 transition-colors"
              >
                Meal Plans
              </Link>
              <Button
                onClick={handleSignOut}
                variant="ghost"
                className="text-sm sm:text-base hover:text-white/90 transition-colors"
              >
                Sign Out
              </Button>
            </>
          ) : (
            <>
              <Link
                to="/auth"
                className="text-sm sm:text-base hover:text-white/90 transition-colors"
              >
                Sign In
              </Link>
              <Link
                to="/signup"
                className="bg-white text-green-600 px-4 py-2 rounded-md text-sm sm:text-base hover:bg-white/90 transition-colors"
              >
                Sign Up
              </Link>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default TopBanner;
