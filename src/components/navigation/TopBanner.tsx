
import { Link } from "react-router-dom";

const TopBanner = () => {
  return (
    <div className="bg-green-600 text-white py-2">
      <div className="container mx-auto px-4 flex justify-between items-center">
        <h1 className="text-xl font-semibold">NutriTrack</h1>
        <Link
          to="/auth"
          className="hover:underline transition-colors"
        >
          Sign In
        </Link>
      </div>
    </div>
  );
};

export default TopBanner;
