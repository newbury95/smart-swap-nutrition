
import { BookOpen, Activity, MessageSquare, PhoneCall, Crown, Dumbbell, LogOut } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import { useSupabase } from "@/hooks/useSupabase";
import { cn } from "@/lib/utils";
import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";

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
    <span className="text-sm">{label}</span>
  </Link>
);

const TopNavigation = () => {
  const { isPremium } = useSupabase();
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const checkAuth = async () => {
      const { data } = await supabase.auth.getSession();
      setIsLoggedIn(!!data.session);
    };
    
    checkAuth();
    
    const { data: authListener } = supabase.auth.onAuthStateChange((event, session) => {
      setIsLoggedIn(!!session);
    });
    
    return () => {
      authListener.subscription.unsubscribe();
    };
  }, []);

  const handleSignOut = async () => {
    await supabase.auth.signOut();
    navigate('/');
  };

  return (
    <nav className="bg-white border-b">
      <div className="container mx-auto px-4 py-2">
        <div className="flex justify-between items-center">
          <div className="grid grid-cols-6 gap-4">
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
              href="/workout-plans"
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
          </div>
          
          {isLoggedIn && (
            <Button 
              variant="ghost" 
              size="sm" 
              onClick={handleSignOut}
              className="flex items-center gap-1 text-gray-600"
            >
              <LogOut className="w-4 h-4" />
              <span>Sign Out</span>
            </Button>
          )}
        </div>
      </div>
    </nav>
  );
};

export default TopNavigation;
