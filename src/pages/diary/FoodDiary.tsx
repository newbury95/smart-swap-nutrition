
import { useState, useCallback, memo } from "react";
import { ChevronLeft } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useToast } from "@/hooks/use-toast";
import { DiaryContent } from "@/components/diary/DiaryContent";
import { DiarySidebar } from "@/components/diary/DiarySidebar";
import { FoodSwapSuggestions } from "@/components/diary/FoodSwapSuggestions";
import { useMealManagement } from "@/hooks/useMealManagement";
import { useSupabase, type FoodSwap } from "@/hooks/useSupabase";

// Create a separate header component to improve maintainability
const DiaryHeader = memo(({ 
  date, 
  onComplete 
}: { 
  date: Date; 
  onComplete: () => Promise<void>;
}) => {
  const navigate = useNavigate();
  
  return (
    <header className="bg-gradient-to-r from-green-600 to-green-500 text-white shadow-md">
      <div className="container mx-auto px-4 py-4">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between">
          <div>
            <button 
              onClick={() => navigate('/')}
              className="flex items-center gap-2 text-white hover:text-green-100 transition-colors"
            >
              <ChevronLeft className="w-4 h-4" />
              Back to Dashboard
            </button>
            <h1 className="text-2xl font-bold mt-2">Food Diary</h1>
            <p className="text-green-100">{date.toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' })}</p>
          </div>
          <div className="mt-3 md:mt-0">
            <button 
              onClick={onComplete}
              className="px-4 py-2 bg-white text-green-600 rounded-md hover:bg-green-50 transition-colors font-medium"
            >
              Complete Day
            </button>
          </div>
        </div>
      </div>
    </header>
  );
});

DiaryHeader.displayName = 'DiaryHeader';

const FoodDiary = () => {
  const { toast } = useToast();
  const [date, setDate] = useState<Date>(new Date());
  const [showSwaps, setShowSwaps] = useState(false);
  const [foodSwaps, setFoodSwaps] = useState<FoodSwap[]>([]);
  const { getFoodSwaps } = useSupabase();
  
  const { meals, handleAddFood, handleDeleteFood, getAllMealsNutrients } = useMealManagement(date);

  const handleComplete = useCallback(async () => {
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
  }, [date, getFoodSwaps, toast]);

  return (
    <div className="min-h-screen bg-gray-50 pb-16">
      <DiaryHeader date={date} onComplete={handleComplete} />

      <main className="container mx-auto px-4 py-6">
        <div className="grid grid-cols-1 md:grid-cols-[300px_1fr] gap-6">
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

export default memo(FoodDiary);
