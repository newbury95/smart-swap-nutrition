
import { Crown, Dumbbell } from "lucide-react";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { useSupabase } from "@/hooks/useSupabase";
import { useNavigate } from "react-router-dom";
import { useToast } from "@/hooks/use-toast";
import TopNavigation from "@/components/navigation/TopNavigation";

const muscleGroups = [
  { id: 'chest', name: 'Chest', icon: '💪' },
  { id: 'back', name: 'Back', icon: '🔙' },
  { id: 'shoulders', name: 'Shoulders', icon: '🏋️' },
  { id: 'arms', name: 'Arms', icon: '💪' },
  { id: 'legs', name: 'Legs', icon: '🦵' },
  { id: 'core', name: 'Core', icon: '🎯' },
  { id: 'full-body', name: 'Full Body', icon: '👤' },
  { id: 'cardio', name: 'Cardio', icon: '🏃' },
];

const WorkoutPlansPage = () => {
  const { isPremium } = useSupabase();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [selectedMuscle, setSelectedMuscle] = useState<string | null>(null);

  const handleMuscleClick = (muscleId: string) => {
    if (!isPremium) {
      toast({
        title: "Premium Feature",
        description: "Upgrade to Premium to access workout plans",
        variant: "destructive",
      });
      navigate('/premium-upgrade');  // Updated this line to use correct route
      return;
    }
    setSelectedMuscle(muscleId);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <TopNavigation />
      
      <main className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          <div className="bg-white rounded-xl p-8 shadow-sm">
            <div className="flex items-center gap-3 mb-6">
              <h1 className="text-2xl font-semibold">Workout Plans</h1>
              <Crown className="text-yellow-500 w-6 h-6" />
            </div>
            
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {muscleGroups.map((muscle) => (
                <button
                  key={muscle.id}
                  onClick={() => handleMuscleClick(muscle.id)}
                  className={`
                    p-6 rounded-lg text-center transition-all
                    ${isPremium 
                      ? 'hover:bg-green-50 hover:shadow-md bg-white border border-gray-200' 
                      : 'opacity-50 cursor-not-allowed bg-gray-100'}
                  `}
                >
                  <div className="text-3xl mb-2">{muscle.icon}</div>
                  <h3 className="font-medium">{muscle.name}</h3>
                </button>
              ))}
            </div>

            {!isPremium && (
              <div className="mt-8 text-center">
                <Button 
                  variant="outline"
                  onClick={() => navigate('/pricing')}
                  className="inline-flex items-center gap-2"
                >
                  <Crown className="w-4 h-4 text-yellow-500" />
                  Upgrade to Premium
                </Button>
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  );
};

export default WorkoutPlansPage;
