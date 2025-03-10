
import { useState, useCallback, memo } from "react";
import { ChevronLeft, Calendar } from "lucide-react";
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
  onComplete,
  onSelectDate
}: { 
  date: Date; 
  onComplete: () => Promise<void>;
  onSelectDate: (newDate: Date) => void;
}) => {
  const navigate = useNavigate();
  
  // Function to format date as "Month D, YYYY" (e.g. "March 10, 2025")
  const formatDate = (date: Date) => {
    return date.toLocaleDateString('en-US', { 
      month: 'long', 
      day: 'numeric', 
      year: 'numeric'
    });
  };
  
  // Calculate previous and next dates
  const previousDay = new Date(date);
  previousDay.setDate(date.getDate() - 1);
  
  const nextDay = new Date(date);
  nextDay.setDate(date.getDate() + 1);
  
  const isToday = () => {
    const today = new Date();
    return date.getDate() === today.getDate() && 
           date.getMonth() === today.getMonth() && 
           date.getFullYear() === today.getFullYear();
  };
  
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
            <div className="flex items-center gap-3 mt-2">
              <h1 className="text-2xl font-bold">Food Diary</h1>
              <button 
                onClick={() => onSelectDate(new Date())}
                className={`text-sm px-2 py-1 rounded ${isToday() ? 'bg-green-700 text-white' : 'bg-green-100 text-green-800'}`}
              >
                Today
              </button>
            </div>
            <div className="flex items-center gap-2 mt-2">
              <button
                onClick={() => onSelectDate(previousDay)}
                className="text-xs bg-green-700 rounded-full p-1 hover:bg-green-800 transition-colors"
              >
                <ChevronLeft className="w-3 h-3" />
              </button>
              <p className="text-green-100 flex items-center gap-1">
                <Calendar className="w-3 h-3" />
                {formatDate(date)}
              </p>
              <button
                onClick={() => onSelectDate(nextDay)}
                className="text-xs bg-green-700 rounded-full p-1 hover:bg-green-800 transition-colors rotate-180"
              >
                <ChevronLeft className="w-3 h-3" />
              </button>
            </div>
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
  
  const handleDateSelect = (newDate: Date) => {
    setDate(newDate);
  };

  return (
    <div className="min-h-screen bg-gray-50 pb-16">
      <DiaryHeader 
        date={date} 
        onComplete={handleComplete} 
        onSelectDate={handleDateSelect}
      />

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
