
import { useState } from "react";
import { ChevronLeft } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useToast } from "@/hooks/use-toast";
import { DiaryContent } from "@/components/diary/DiaryContent";
import { DiarySidebar } from "@/components/diary/DiarySidebar";
import { SponsorBanner } from "@/components/diary/SponsorBanner";
import { FoodSwapSuggestions } from "@/components/diary/FoodSwapSuggestions";
import { useMealManagement } from "@/hooks/useMealManagement";

const mockSwaps = [
  {
    original: "Fried egg on toast with butter",
    suggestion: "Scrambled egg on dry wholemeal toast",
    reason: "Lower in calories and saturated fats while maintaining protein content. Wholemeal bread provides more fiber and nutrients."
  }
];

const FoodDiary = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [date, setDate] = useState<Date>(new Date());
  const [showSwaps, setShowSwaps] = useState(false);
  
  const { meals, handleAddFood, handleDeleteFood, getAllMealsNutrients } = useMealManagement(date);

  const handleComplete = () => {
    setShowSwaps(true);
    toast({
      title: "Daily food diary completed",
      description: "Here are some suggested food swaps based on your goals",
    });
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

      <SponsorBanner />
      
      {showSwaps && (
        <FoodSwapSuggestions
          swaps={mockSwaps}
          onClose={() => setShowSwaps(false)}
        />
      )}
    </div>
  );
};

export default FoodDiary;
