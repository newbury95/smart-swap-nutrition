
import { BookOpen, Activity, MessageSquare, PhoneCall, Crown, Dumbbell, LogOut } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface NavTileProps {
  icon: React.ReactNode;
  label: string;
  href: string;
  isPremium?: boolean;
}

const NavTile = ({ icon, label, href, isPremium }: NavTileProps) => (
  <Link
    to={href}
    className={cn(
      "flex flex-col items-center gap-1 p-2 rounded-lg transition-colors",
      "hover:bg-gray-100",
      "text-gray-600 hover:text-gray-900"
    )}
  >
    <div className="relative">
      {icon}
      {isPremium && (
        <span className="absolute -top-1 -right-1 text-yellow-500">
          <Crown className="w-3 h-3" />
        </span>
      )}
    </div>
    <span className="text-xs">{label}</span>
  </Link>
);

const TopBanner = () => {
  const { user, signOut } = useAuth();
  const navigate = useNavigate();
  
  const handleSignOut = async () => {
    await signOut();
    navigate('/');
  };
  
  return (
    <nav className="bg-white border-b">
      <div className="container mx-auto px-4 py-2">
        <div className="flex justify-between items-center">
          <Link to="/" className="text-xl font-semibold text-green-600 hover:text-green-800 transition-colors mr-4">
            NutriTrack
          </Link>
          
          <div className="flex items-center">
            <div className="grid grid-cols-3 md:grid-cols-6 gap-2 md:gap-4">
              {user ? (
                <>
                  <NavTile
                    icon={<BookOpen className="w-4 h-4" />}
                    label="Food Diary"
                    href="/diary"
                  />
                  <NavTile
                    icon={<Activity className="w-4 h-4" />}
                    label="Tracking"
                    href="/tracking"
                  />
                  <NavTile
                    icon={<Crown className="w-4 h-4" />}
                    label="Meal Plans"
                    href="/meal-plans"
                    isPremium={true}
                  />
                  <NavTile
                    icon={<Dumbbell className="w-4 h-4" />}
                    label="Workouts"
                    href="/workouts"
                    isPremium={true}
                  />
                  <NavTile
                    icon={<MessageSquare className="w-4 h-4" />}
                    label="Forum"
                    href="/forum"
                  />
                  <NavTile
                    icon={<PhoneCall className="w-4 h-4" />}
                    label="Contact"
                    href="/contact"
                  />
                </>
              ) : (
                <>
                  <NavTile
                    icon={<Activity className="w-4 h-4" />}
                    label="Tracking"
                    href="/tracking"
                  />
                  <NavTile
                    icon={<MessageSquare className="w-4 h-4" />}
                    label="Forum"
                    href="/forum"
                  />
                  <NavTile
                    icon={<PhoneCall className="w-4 h-4" />}
                    label="Contact"
                    href="/contact"
                  />
                </>
              )}
            </div>
            
            <div className="ml-4 md:ml-8">
              {user ? (
                <Button 
                  variant="ghost" 
                  size="sm" 
                  onClick={handleSignOut}
                  className="flex items-center gap-1 text-gray-600"
                >
                  <LogOut className="w-4 h-4" />
                  <span className="hidden md:inline">Sign Out</span>
                </Button>
              ) : (
                <div className="flex gap-2">
                  <Link
                    to="/auth"
                    className="text-sm hover:text-green-600 transition-colors"
                  >
                    Sign In
                  </Link>
                  <Link
                    to="/signup"
                    className="bg-green-600 text-white px-3 py-1 rounded-md text-sm hover:bg-green-700 transition-colors"
                  >
                    Sign Up
                  </Link>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default TopBanner;
