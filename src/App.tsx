
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Index from "./pages/Index";
import SignUp from "./pages/SignUp";
import NotFound from "./pages/NotFound";
import HealthGoals from "./pages/goals/HealthGoals";
import FitnessGoals from "./pages/goals/FitnessGoals";
import DietaryGoals from "./pages/goals/DietaryGoals";
import PersonalInfo from "./pages/signup/PersonalInfo";
import FoodDiary from "./pages/diary/FoodDiary";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Index />} />
          <Route path="/signup" element={<SignUp />} />
          <Route path="/goals/health" element={<HealthGoals />} />
          <Route path="/goals/fitness" element={<FitnessGoals />} />
          <Route path="/goals/dietary" element={<DietaryGoals />} />
          <Route path="/signup/personal-info" element={<PersonalInfo />} />
          <Route path="/diary" element={<FoodDiary />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
