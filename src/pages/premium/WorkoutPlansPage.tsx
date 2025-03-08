
import React, { useState } from 'react';
import { ChevronLeft, Plus } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { workoutData } from './data/workoutData';
import DifficultyTabs from './components/DifficultyTabs';
import Header from './components/Header';
import MuscleGroupGrid from './components/MuscleGroupGrid';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import WorkoutList from './components/WorkoutList';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';

const WorkoutPlansPage = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [selectedMuscleGroup, setSelectedMuscleGroup] = useState<string | null>(null);
  const [selectedDifficulty, setSelectedDifficulty] = useState<string | null>(null);
  const [selectedWorkout, setSelectedWorkout] = useState(null);
  const [showWorkoutDetails, setShowWorkoutDetails] = useState(false);
  const [savedWorkouts, setSavedWorkouts] = useState<string[]>([]);

  // Filter workouts based on selection
  const filteredWorkouts = workoutData.filter(workout => {
    const matchesMuscleGroup = !selectedMuscleGroup || workout.primaryMuscleGroups.includes(selectedMuscleGroup) || workout.secondaryMuscleGroups.includes(selectedMuscleGroup);
    const matchesDifficulty = !selectedDifficulty || workout.difficulty === selectedDifficulty;
    return matchesMuscleGroup && matchesDifficulty;
  });

  const handleWorkoutSelect = (workoutId) => {
    const workout = workoutData.find(w => w.id === workoutId);
    setSelectedWorkout(workout);
    setShowWorkoutDetails(true);
  };

  const handleAddToWorkouts = (workoutId) => {
    if (!savedWorkouts.includes(workoutId)) {
      setSavedWorkouts([...savedWorkouts, workoutId]);
      toast({
        title: "Workout Saved",
        description: "This workout has been added to your saved workouts.",
      });
    } else {
      toast({
        title: "Already Saved",
        description: "This workout is already in your saved workouts.",
      });
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Header title="Workout Plans" />
      
      <div className="container mx-auto px-4 py-8">
        <button 
          onClick={() => navigate('/premium')}
          className="flex items-center gap-2 text-gray-600 hover:text-gray-800 mb-6"
        >
          <ChevronLeft className="h-4 w-4" />
          Back to Premium
        </button>
        
        <div className="bg-white rounded-lg shadow-sm p-6 mb-8">
          <h2 className="text-xl font-semibold mb-4">Filter Workouts</h2>
          
          <div className="space-y-6">
            <div>
              <h3 className="text-md font-medium mb-3">Muscle Groups</h3>
              <MuscleGroupGrid 
                muscleGroups={[
                  { id: "chest", name: "Chest", icon: "💪" },
                  { id: "back", name: "Back", icon: "🔙" },
                  { id: "legs", name: "Legs", icon: "🦵" },
                  { id: "shoulders", name: "Shoulders", icon: "🏋️" },
                  { id: "arms", name: "Arms", icon: "💪" },
                  { id: "core", name: "Core", icon: "🧠" }
                ]}
                isPremium={true}
                onMuscleGroupSelect={setSelectedMuscleGroup}
              />
            </div>
            
            <div>
              <h3 className="text-md font-medium mb-3">Difficulty Level</h3>
              <DifficultyTabs 
                selectedDifficulty={selectedDifficulty || "all"} 
                onSelectDifficulty={setSelectedDifficulty}
              />
            </div>
          </div>
        </div>
        
        <div className="bg-white rounded-lg shadow-sm p-6">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-semibold">Recommended Workouts</h2>
            <span className="text-sm text-gray-500">{filteredWorkouts.length} workouts</span>
          </div>
          
          <WorkoutList 
            workouts={filteredWorkouts} 
            onSelect={handleWorkoutSelect} 
          />
        </div>
      </div>

      <Dialog open={showWorkoutDetails} onOpenChange={setShowWorkoutDetails}>
        <DialogContent className="sm:max-w-md">
          {selectedWorkout && (
            <>
              <DialogHeader>
                <DialogTitle>{selectedWorkout.name}</DialogTitle>
                <DialogDescription>
                  {selectedWorkout.description}
                </DialogDescription>
              </DialogHeader>
              
              <div className="mt-4 space-y-4">
                <div>
                  <h4 className="font-medium mb-2">Details</h4>
                  <ul className="space-y-2">
                    <li className="text-sm flex justify-between">
                      <span className="text-gray-600">Duration:</span>
                      <span>{selectedWorkout.duration}</span>
                    </li>
                    <li className="text-sm flex justify-between">
                      <span className="text-gray-600">Difficulty:</span>
                      <span className="capitalize">{selectedWorkout.difficulty}</span>
                    </li>
                    <li className="text-sm flex justify-between">
                      <span className="text-gray-600">Primary Muscle Groups:</span>
                      <span>{selectedWorkout.primaryMuscleGroups.join(', ')}</span>
                    </li>
                  </ul>
                </div>
                
                <div>
                  <h4 className="font-medium mb-2">Exercises</h4>
                  <ul className="space-y-2">
                    {selectedWorkout.exercises.map((exercise, idx) => (
                      <li key={idx} className="text-sm border-b pb-2">
                        <div className="font-medium">{exercise.name}</div>
                        <div className="text-gray-600">{exercise.sets} sets × {exercise.reps}</div>
                      </li>
                    ))}
                  </ul>
                </div>

                <Button 
                  className="w-full mt-6" 
                  onClick={() => handleAddToWorkouts(selectedWorkout.id)}
                >
                  <Plus className="h-4 w-4 mr-2" />
                  Add to My Workouts
                </Button>
              </div>
            </>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default WorkoutPlansPage;
