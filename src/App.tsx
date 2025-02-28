
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
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
import MealPlans from "./pages/premium/MealPlans";
import WorkoutPlansPage from "./pages/premium/WorkoutPlansPage";
import PersonalInfo from "./pages/signup/PersonalInfo";
import ContactPage from "./pages/contact/ContactPage";
import ActivityTracker from "./pages/activity/ActivityTracker";

import "./App.css";

function App() {
  return (
    <Router>
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
        <Route path="/meal-plans" element={<MealPlans />} />
        <Route path="/workout-plans" element={<WorkoutPlansPage />} />
        <Route path="/personal-info" element={<PersonalInfo />} />
        <Route path="/contact" element={<ContactPage />} />
        <Route path="/activity" element={<ActivityTracker />} />
        <Route path="*" element={<NotFound />} />
      </Routes>
      <Toaster />
    </Router>
  );
}

export default App;
