
import { BrowserRouter as Router, Routes, Route, useLocation } from "react-router-dom";
import { Toaster } from "@/components/ui/toaster";
import Index from "./pages/Index";
import SignUp from "./pages/SignUp";
import AuthPage from "./pages/auth/AuthPage";
import NotFound from "./pages/NotFound";
import FoodDiary from "./pages/diary/FoodDiary";
import TrackingPage from "./pages/tracking/TrackingPage";
import ForumPage from "./pages/forum/ForumPage";
import FitnessGoals from "./pages/goals/FitnessGoals";
import PremiumUpgradePage from "./pages/premium/PremiumUpgradePage";
import CustomFoodsPage from "./pages/custom-foods/CustomFoodsPage";
import MealPlansPage from "./pages/meal-plans/MealPlansPage";
import WorkoutPlansPage from "./pages/premium/WorkoutPlansPage";
import PersonalInfo from "./pages/signup/PersonalInfo";
import ContactPage from "./pages/contact/ContactPage";
import ActivityTracker from "./pages/activity/ActivityTracker";
import TopBanner from "./components/navigation/TopBanner";
import TopNavigation from "./components/navigation/TopNavigation";

import "./App.css";

// Wrapper component to conditionally render TopBanner and TopNavigation
const AppLayout = () => {
  const location = useLocation();
  const path = location.pathname;
  
  // Define the specific pages that should show navigation components
  const navigationRoutes = [
    '/workout-plans',
    '/meal-plans',
    '/diary',
    '/tracking',
    '/contact',
    '/forum',
    '/custom-foods',
    '/activity',
    '/premium'
  ];
  
  // Check if current path matches any of the navigation routes
  const showNavigation = navigationRoutes.some(route => 
    path === route || path.startsWith(route + '/')
  );

  // Pages that should never show banner or navigation
  const isExcludedPage = [
    '/', 
    '/signup', 
    '/goals', 
    '/auth',
    '/signup/personal-info'
  ].includes(path);

  // Final check - only show navigation components on appropriate pages
  const shouldShowComponents = showNavigation && !isExcludedPage;

  return (
    <>
      {shouldShowComponents && <TopBanner />}
      {shouldShowComponents && <TopNavigation />}
      <Routes>
        <Route path="/" element={<Index />} />
        <Route path="/auth" element={<AuthPage />} />
        <Route path="/signup" element={<SignUp />} />
        <Route path="/diary" element={<FoodDiary />} />
        <Route path="/tracking" element={<TrackingPage />} />
        <Route path="/forum" element={<ForumPage />} />
        <Route path="/goals" element={<FitnessGoals />} />
        <Route path="/premium" element={<PremiumUpgradePage />} />
        <Route path="/custom-foods" element={<CustomFoodsPage />} />
        <Route path="/meal-plans" element={<MealPlansPage />} />
        <Route path="/workout-plans" element={<WorkoutPlansPage />} />
        <Route path="/signup/personal-info" element={<PersonalInfo />} />
        <Route path="/contact" element={<ContactPage />} />
        <Route path="/activity" element={<ActivityTracker />} />
        <Route path="*" element={<NotFound />} />
      </Routes>
      <Toaster />
    </>
  );
};

function App() {
  return (
    <Router>
      <AppLayout />
    </Router>
  );
}

export default App;
