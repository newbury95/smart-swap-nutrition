
import { Activity, BookOpen, MessageSquare, PhoneCall, Crown, Dumbbell } from "lucide-react";
import { Link } from "react-router-dom";
import { useSupabase } from "@/hooks/useSupabase";
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
      "flex flex-col items-center gap-1 p-3 rounded-lg transition-colors",
      "hover:bg-gray-100",
      "text-gray-600 hover:text-gray-900"
    )}
  >
    <div className="relative">
      {icon}
      {isPremium && (
        <Crown className="absolute -top-2 -right-2 w-4 h-4 text-yellow-500" />
      )}
    </div>
    <span className="text-sm">{label}</span>
  </Link>
);

const TopNavigation = () => {
  const { isPremium } = useSupabase();

  return (
    <nav className="bg-white border-b">
      <div className="container mx-auto px-4 py-2">
        <div className="flex justify-between items-center">
          <div className="grid grid-cols-6 gap-4">
            <NavTile
              icon={<Activity className="w-5 h-5" />}
              label="Tracking"
              href="/tracking"
            />
            <NavTile
              icon={<BookOpen className="w-5 h-5" />}
              label="Food Diary"
              href="/diary"
            />
            <NavTile
              icon={<MessageSquare className="w-5 h-5" />}
              label="Forum"
              href="/forum"
            />
            <NavTile
              icon={<PhoneCall className="w-5 h-5" />}
              label="Contact"
              href="/contact"
            />
            <NavTile
              icon={<Dumbbell className="w-5 h-5" />}
              label="Workouts"
              href="/workout-plans"
              isPremium={true}
            />
          </div>
        </div>
      </div>
    </nav>
  );
};

export default TopNavigation;
