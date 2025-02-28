
import React, { useState } from "react";
import { useSupabase } from "@/hooks/useSupabase";
import { useNavigate } from "react-router-dom";
import TopNavigation from "@/components/navigation/TopNavigation";
import Header from "./components/Header";
import MuscleGroupGrid from "./components/MuscleGroupGrid";
import DifficultyTabs from "./components/DifficultyTabs";
import { muscleGroups, workoutPlans } from "./data/workoutData";
import { Difficulty, Workout } from "./components/WorkoutCard";
import { Button } from "@/components/ui/button";
import { Crown } from "lucide-react";

const WorkoutPlansPage = () => {
  const { isPremium } = useSupabase();
  const navigate = useNavigate();
  const [selectedMuscle, setSelectedMuscle] = useState<string | null>(null);
  const [difficulty, setDifficulty] = useState<Difficulty>('beginner');

  const handleMuscleSelect = (muscleId: string) => {
    if (!isPremium) {
      navigate('/premium-upgrade');
      return;
    }
    setSelectedMuscle(muscleId);
  };

  const handleDifficultyChange = (newDifficulty: Difficulty) => {
    setDifficulty(newDifficulty);
  };

  const getWorkoutsForSelectedMuscle = (): Workout[] => {
    if (!selectedMuscle) return [];
    return workoutPlans[selectedMuscle] || [];
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <TopNavigation />
      
      <main className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          <div className="bg-white rounded-xl p-8 shadow-sm">
            {!selectedMuscle ? (
              <>
                <Header 
                  title="Workout Plans" 
                  isPremium={isPremium} 
                />
                
                <MuscleGroupGrid 
                  muscleGroups={muscleGroups} 
                  isPremium={isPremium} 
                  onMuscleGroupSelect={handleMuscleSelect} 
                />
                
                {!isPremium && (
                  <div className="mt-8 text-center">
                    <Button 
                      variant="outline"
                      onClick={() => navigate('/premium-upgrade')}
                      className="inline-flex items-center gap-2"
                    >
                      <Crown className="w-4 h-4 text-yellow-500" />
                      Upgrade to Premium
                    </Button>
                  </div>
                )}
              </>
            ) : (
              <>
                <Header 
                  title={muscleGroups.find(m => m.id === selectedMuscle)?.name + " Workouts"} 
                  isPremium={isPremium}
                  onBackClick={() => setSelectedMuscle(null)}
                  backText="Back to Muscle Groups"
                />
                
                <DifficultyTabs 
                  workouts={getWorkoutsForSelectedMuscle()} 
                  onDifficultyChange={handleDifficultyChange} 
                />
              </>
            )}
          </div>
        </div>
      </main>
    </div>
  );
};

export default WorkoutPlansPage;
