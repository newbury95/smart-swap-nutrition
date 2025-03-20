
import React from "react";
import { Link } from "react-router-dom";
import { Utensils, PieChart, Activity, Home } from "lucide-react";

const TrackingHeader = () => {
  return (
    <header className="bg-white border-b sticky top-0 z-10">
      <div className="container mx-auto px-4">
        <div className="flex justify-between items-center h-16">
          <Link to="/" className="font-semibold text-xl text-blue-600">
            NutriTrack
          </Link>
          <nav>
            <ul className="flex space-x-4">
              <li>
                <Link
                  to="/"
                  className="px-3 py-2 rounded-md flex items-center text-gray-700 hover:bg-gray-100"
                >
                  <Home className="h-4 w-4 mr-1" />
                  <span>Home</span>
                </Link>
              </li>
              <li>
                <Link
                  to="/tracking"
                  className="px-3 py-2 rounded-md flex items-center text-blue-600 font-medium"
                >
                  <PieChart className="h-4 w-4 mr-1" />
                  <span>Tracking</span>
                </Link>
              </li>
              <li>
                <Link
                  to="/diary"
                  className="px-3 py-2 rounded-md flex items-center text-gray-700 hover:bg-gray-100"
                >
                  <Utensils className="h-4 w-4 mr-1" />
                  <span>Food Diary</span>
                </Link>
              </li>
              <li>
                <Link
                  to="/activity"
                  className="px-3 py-2 rounded-md flex items-center text-gray-700 hover:bg-gray-100"
                >
                  <Activity className="h-4 w-4 mr-1" />
                  <span>Activity</span>
                </Link>
              </li>
            </ul>
          </nav>
        </div>
      </div>
    </header>
  );
};

export default TrackingHeader;
