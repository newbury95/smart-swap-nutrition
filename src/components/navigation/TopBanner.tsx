
import { BookOpen, Activity, MessageSquare, PhoneCall, Crown, Dumbbell, LogOut, BadgePercent } from "lucide-react";
import { Link, useNavigate, useLocation } from "react-router-dom";
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
      "hover:bg-primary-lighter/20",
      "text-gray-600 hover:text-primary"
    )}
  >
    <div className="relative">
      {icon}
      {isPremium && (
        <span className="absolute -top-1 -right-1 text-primary">
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
  const location = useLocation();
  const isIndexPage = location.pathname === "/";
  const isAuthPage = location.pathname === "/auth";
  
  // Hide banner completely on auth page
  if (isAuthPage) {
    return null;
  }
  
  const handleSignOut = async () => {
    await signOut();
    navigate('/');
  };
  
  return (
    <nav className="bg-white border-b">
      <div className="container mx-auto px-4 py-2">
        <div className="flex justify-between items-center">
          <Link to="/" className="text-xl font-semibold text-primary hover:text-primary-dark transition-colors mr-4">
            NutriTrack
          </Link>
          
          <div className="flex items-center">
            {isIndexPage && !user ? (
              // Show only sign in/sign up on index page for non-authenticated users
              <div className="flex gap-2">
                <Link
                  to="/auth"
                  className="text-sm hover:text-primary transition-colors"
                >
                  Sign In
                </Link>
                <Link
                  to="/auth?tab=signup"
                  className="bg-primary text-white px-3 py-1 rounded-md text-sm hover:bg-primary-dark transition-colors"
                >
                  Sign Up
                </Link>
              </div>
            ) : (
              <>
                <div className="grid grid-cols-3 md:grid-cols-7 gap-2 md:gap-4">
                  {user ? (
                    <>
                      {/* Free features */}
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
                      
                      {/* Premium features */}
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
                        icon={<BadgePercent className="w-4 h-4" />}
                        label="Offers"
                        href="/offers"
                        isPremium={true}
                      />
                      
                      {/* General features */}
                      <NavTile
                        icon={<MessageSquare className="w-4 h-4" />}
                        label="Blogs"
                        href="/forum"
                      />
                      <NavTile
                        icon={<PhoneCall className="w-4 h-4" />}
                        label="Contact"
                        href="/contact"
                      />
                    </>
                  ) : !isIndexPage && (
                    <>
                      {/* Show limited options for non-authenticated users on non-index pages */}
                      <NavTile
                        icon={<Activity className="w-4 h-4" />}
                        label="Tracking"
                        href="/tracking"
                      />
                      <NavTile
                        icon={<MessageSquare className="w-4 h-4" />}
                        label="Blogs"
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
                
                {user && (
                  <div className="ml-4 md:ml-8">
                    <Button 
                      variant="ghost" 
                      size="sm" 
                      onClick={handleSignOut}
                      className="flex items-center gap-1 text-gray-600 hover:text-primary hover:bg-primary-lighter/20"
                    >
                      <LogOut className="w-4 h-4" />
                      <span className="hidden md:inline">Sign Out</span>
                    </Button>
                  </div>
                )}
                
                {!user && !isIndexPage && (
                  <div className="ml-4 md:ml-8 flex gap-2">
                    <Link
                      to="/auth"
                      className="text-sm hover:text-primary transition-colors"
                    >
                      Sign In
                    </Link>
                    <Link
                      to="/auth?tab=signup"
                      className="bg-primary text-white px-3 py-1 rounded-md text-sm hover:bg-primary-dark transition-colors"
                    >
                      Sign Up
                    </Link>
                  </div>
                )}
              </>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
};

export default TopBanner;
