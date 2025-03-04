
import { Link } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";

const TopBanner = () => {
  const { user, signOut } = useAuth();
  
  return (
    <div className="bg-green-600 text-white py-2">
      <div className="container mx-auto px-4 flex flex-wrap justify-between items-center gap-2">
        <h1 className="text-xl font-semibold">NutriTrack</h1>
        {user ? (
          <button
            onClick={signOut}
            className="hover:underline transition-colors text-sm sm:text-base"
          >
            Sign Out
          </button>
        ) : (
          <Link
            to="/auth"
            className="hover:underline transition-colors text-sm sm:text-base"
          >
            Sign In
          </Link>
        )}
      </div>
    </div>
  );
};

export default TopBanner;
