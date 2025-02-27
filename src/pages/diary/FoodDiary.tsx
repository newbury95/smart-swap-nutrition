
import { useState } from "react";
import { ChevronLeft } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useToast } from "@/hooks/use-toast";
import { DiaryContent } from "@/components/diary/DiaryContent";
import { DiarySidebar } from "@/components/diary/DiarySidebar";
import { FoodSwapSuggestions } from "@/components/diary/FoodSwapSuggestions";
import { useMealManagement } from "@/hooks/useMealManagement";
import { useSupabase, type FoodSwap } from "@/hooks/useSupabase";

const FoodDiary = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [date, setDate] = useState<Date>(new Date());
  const [showSwaps, setShowSwaps] = useState(false);
  const [foodSwaps, setFoodSwaps] = useState<FoodSwap[]>([]);
  const { getFoodSwaps } = useSupabase();
  
  const { meals, handleAddFood, handleDeleteFood, getAllMealsNutrients } = useMealManagement(date);

  const handleComplete = async () => {
    try {
      const swaps = await getFoodSwaps(date);
      setFoodSwaps(swaps);
      setShowSwaps(true);
      toast({
        title: "Daily food diary completed",
        description: "Here are some suggested food swaps based on your goals",
      });
    } catch (error) {
      console.error('Error getting food swaps:', error);
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to get food swap suggestions",
      });
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 pb-32">
      <header className="bg-white border-b">
        <div className="container mx-auto px-4 py-4">
          <button 
            onClick={() => navigate('/')}
            className="flex items-center gap-2 text-gray-600 hover:text-gray-800 transition-colors"
          >
            <ChevronLeft className="w-4 h-4" />
            Back to Dashboard
          </button>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 md:grid-cols-[300px_1fr] gap-8">
          <DiarySidebar 
            date={date}
            onSelectDate={(newDate) => newDate && setDate(newDate)}
            dailyTotals={getAllMealsNutrients()}
          />
          <DiaryContent
            meals={meals}
            onAddFood={handleAddFood}
            onDeleteFood={handleDeleteFood}
            onComplete={handleComplete}
          />
        </div>
      </main>
      
      {showSwaps && (
        <FoodSwapSuggestions
          swaps={foodSwaps}
          onClose={() => setShowSwaps(false)}
        />
      )}
    </div>
  );
};

export default FoodDiary;
