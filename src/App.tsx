
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { AuthProvider } from "@/hooks/useAuth";
import TopBanner from "@/components/navigation/TopBanner";
import TrackingPage from "@/pages/tracking/TrackingPage";
import { default as DiaryPage } from "@/pages/diary/FoodDiary";
import MealPlansPage from "@/pages/meal-plans/MealPlansPage";
import { default as PremiumPage } from "@/pages/premium/PremiumUpgradePage";
import AuthPage from "@/pages/auth/AuthPage";
import { default as SignupPage } from "@/pages/SignUp";
import PersonalInfo from "@/pages/signup/PersonalInfo";

const queryClient = new QueryClient();

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <Router>
          <TopBanner />
          <Routes>
            <Route path="/" element={<TrackingPage />} />
            <Route path="/tracking" element={<TrackingPage />} />
            <Route path="/diary" element={<DiaryPage />} />
            <Route path="/meal-plans" element={<MealPlansPage />} />
            <Route path="/premium" element={<PremiumPage />} />
            <Route path="/auth" element={<AuthPage />} />
            <Route path="/signup" element={<SignupPage />} />
            <Route path="/personal-info" element={<PersonalInfo />} />
          </Routes>
        </Router>
        <Toaster />
      </AuthProvider>
    </QueryClientProvider>
  );
}

export default App;
