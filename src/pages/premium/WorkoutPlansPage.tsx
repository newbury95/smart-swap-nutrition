
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';
import { usePremiumStatus } from '@/hooks/usePremiumStatus';
import { workoutData, Workout } from './data/workoutData';
import MuscleGroupGrid from './components/MuscleGroupGrid';
import DifficultyTabs from './components/DifficultyTabs';
import WorkoutList from './components/WorkoutList';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Dumbbell, Plus, X } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { useWorkoutManagement } from '@/hooks/useWorkoutManagement';

const WorkoutPlansPage = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { isPremium } = usePremiumStatus();
  const { toast } = useToast();
  const { addWorkout } = useWorkoutManagement();

  const [selectedMuscleGroup, setSelectedMuscleGroup] = useState<string>("all");
  const [selectedDifficulty, setSelectedDifficulty] = useState<string>("all");
  const [showAllWorkouts, setShowAllWorkouts] = useState(false);
  const [selectedWorkout, setSelectedWorkout] = useState<Workout | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  // Filter workouts based on selected criteria
  const filteredWorkouts = workoutData.filter(workout => {
    const matchesMuscle = selectedMuscleGroup === "all" || workout.muscleGroup === selectedMuscleGroup;
    const matchesDifficulty = selectedDifficulty === "all" || workout.difficulty === selectedDifficulty;
    return matchesMuscle && matchesDifficulty;
  });

  // Get recommended workouts (limited selection for initial display)
  const recommendedWorkouts = showAllWorkouts 
    ? filteredWorkouts 
    : filteredWorkouts.slice(0, 3);

  const handleWorkoutSelect = (workoutId: string) => {
    const workout = workoutData.find(w => w.id === workoutId);
    if (workout) {
      setSelectedWorkout(workout);
      setIsDialogOpen(true);
    }
  };

  const handleAddToWorkouts = (workoutId: string) => {
    if (!user) {
      toast({
        title: "Authentication Required",
        description: "Please sign in to add workouts to your plan",
        variant: "destructive",
      });
      navigate('/auth');
      return;
    }

    if (!isPremium) {
      toast({
        title: "Premium Feature",
        description: "Upgrade to Premium to add workouts to your plan",
        variant: "destructive",
      });
      navigate('/premium-upgrade');
      return;
    }

    const workout = workoutData.find(w => w.id === workoutId);
    if (workout) {
      addWorkout(workout);
      toast({
        title: "Workout Added",
        description: `${workout.name} has been added to your workouts`,
      });
      setIsDialogOpen(false);
    }
  };

  const muscleGroups = [
    { id: "all", name: "All", icon: "💪" },
    { id: "chest", name: "Chest", icon: "🫁" },
    { id: "back", name: "Back", icon: "🔙" },
    { id: "legs", name: "Legs", icon: "🦵" },
    { id: "arms", name: "Arms", icon: "💪" },
    { id: "shoulders", name: "Shoulders", icon: "🤷" },
    { id: "core", name: "Core", icon: "⭕" },
    { id: "fullbody", name: "Full Body", icon: "👤" }
  ];

  return (
    <div className="min-h-screen bg-gray-50 pb-20">
      <div className="max-w-7xl mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold mb-8">Workout Plans</h1>
        
        <div className="mb-8">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-semibold">Recommended Workouts</h2>
          </div>
          
          {/* Always show filters */}
          <div className="bg-white p-4 rounded-lg shadow-sm mb-6">
            <div className="mb-4">
              <h3 className="text-sm font-medium mb-2">Target Muscle Group</h3>
              <MuscleGroupGrid 
                muscleGroups={muscleGroups} 
                isPremium={isPremium} 
                onMuscleGroupSelect={setSelectedMuscleGroup}
                selectedMuscleGroup={selectedMuscleGroup}
              />
            </div>
            
            <div>
              <h3 className="text-sm font-medium mb-2">Difficulty Level</h3>
              <DifficultyTabs 
                selectedDifficulty={selectedDifficulty} 
                onSelectDifficulty={setSelectedDifficulty} 
              />
            </div>
          </div>
          
          <div className="mt-6">
            <WorkoutList 
              workouts={recommendedWorkouts} 
              onSelect={handleWorkoutSelect}
            />
            
            {filteredWorkouts.length > 3 && !showAllWorkouts && (
              <div className="mt-4 text-center">
                <Button 
                  variant="outline" 
                  onClick={() => setShowAllWorkouts(true)}
                >
                  View All {filteredWorkouts.length} Workouts
                </Button>
              </div>
            )}
            
            {showAllWorkouts && filteredWorkouts.length > 3 && (
              <div className="mt-4 text-center">
                <Button 
                  variant="outline" 
                  onClick={() => setShowAllWorkouts(false)}
                >
                  Show Less
                </Button>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Workout Detail Dialog */}
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="max-w-3xl">
          {selectedWorkout && (
            <>
              <DialogHeader>
                <div className="flex justify-between items-center">
                  <DialogTitle className="text-2xl">{selectedWorkout.name}</DialogTitle>
                  <button 
                    onClick={() => setIsDialogOpen(false)} 
                    className="text-gray-500 hover:text-gray-700"
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>
                <DialogDescription className="text-base">
                  {selectedWorkout.description}
                </DialogDescription>
              </DialogHeader>
              
              <div className="py-4">
                <div className="flex flex-wrap gap-2 mb-4">
                  <span className="px-3 py-1 bg-gray-100 rounded-full text-sm text-gray-700">
                    {selectedWorkout.difficulty.charAt(0).toUpperCase() + selectedWorkout.difficulty.slice(1)}
                  </span>
                  <span className="px-3 py-1 bg-gray-100 rounded-full text-sm text-gray-700">
                    {selectedWorkout.duration}
                  </span>
                  <span className="px-3 py-1 bg-gray-100 rounded-full text-sm text-gray-700">
                    {selectedWorkout.muscleGroup.charAt(0).toUpperCase() + selectedWorkout.muscleGroup.slice(1)}
                  </span>
                </div>
                
                <h3 className="font-semibold text-lg mb-2">Exercises</h3>
                <div className="space-y-3">
                  {selectedWorkout.exercises.map((exercise, index) => (
                    <div key={index} className="p-3 border rounded-md">
                      <div className="font-medium">{exercise.name}</div>
                      <div className="text-sm text-gray-600 mt-1">
                        {exercise.sets} sets × {exercise.reps} reps
                        {exercise.rest && ` • ${exercise.rest} rest`}
                      </div>
                      {exercise.note && (
                        <div className="text-sm italic mt-1">{exercise.note}</div>
                      )}
                    </div>
                  ))}
                </div>
              </div>
              
              <DialogFooter>
                <Button 
                  className="w-full sm:w-auto" 
                  onClick={() => handleAddToWorkouts(selectedWorkout.id)}
                >
                  <Plus className="w-4 h-4 mr-2" />
                  Add to My Workouts
                </Button>
              </DialogFooter>
            </>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default WorkoutPlansPage;
