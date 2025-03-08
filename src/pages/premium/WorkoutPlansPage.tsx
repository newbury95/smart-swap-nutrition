
import React, { useState } from 'react';
import { ChevronLeft } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { workouts } from './data/workoutData';
import DifficultyTabs from './components/DifficultyTabs';
import Header from './components/Header';
import MuscleGroupGrid from './components/MuscleGroupGrid';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import WorkoutList from './components/WorkoutList';

const WorkoutPlansPage = () => {
  const navigate = useNavigate();
  const [selectedMuscleGroup, setSelectedMuscleGroup] = useState<string | null>(null);
  const [selectedDifficulty, setSelectedDifficulty] = useState<string | null>(null);
  const [selectedWorkout, setSelectedWorkout] = useState(null);
  const [showWorkoutDetails, setShowWorkoutDetails] = useState(false);

  // Filter workouts based on selection
  const filteredWorkouts = workouts.filter(workout => {
    const matchesMuscleGroup = !selectedMuscleGroup || workout.muscleGroups.includes(selectedMuscleGroup);
    const matchesDifficulty = !selectedDifficulty || workout.difficulty === selectedDifficulty;
    return matchesMuscleGroup && matchesDifficulty;
  });

  const handleWorkoutSelect = (workoutId) => {
    const workout = workouts.find(w => w.id === workoutId);
    setSelectedWorkout(workout);
    setShowWorkoutDetails(true);
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
                selectedMuscleGroup={selectedMuscleGroup} 
                onSelect={setSelectedMuscleGroup}
              />
            </div>
            
            <div>
              <h3 className="text-md font-medium mb-3">Difficulty Level</h3>
              <DifficultyTabs 
                selectedDifficulty={selectedDifficulty} 
                onSelect={setSelectedDifficulty}
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
            onSave={handleWorkoutSelect} 
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
                      <span className="text-gray-600">Equipment:</span>
                      <span>{selectedWorkout.equipment.join(', ') || 'None'}</span>
                    </li>
                  </ul>
                </div>
                
                <div>
                  <h4 className="font-medium mb-2">Exercises</h4>
                  <ul className="space-y-2">
                    {selectedWorkout.exercises.map((exercise, idx) => (
                      <li key={idx} className="text-sm border-b pb-2">
                        <div className="font-medium">{exercise.name}</div>
                        <div className="text-gray-600">{exercise.sets} sets × {exercise.reps} reps</div>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default WorkoutPlansPage;
