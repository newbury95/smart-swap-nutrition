
import React, { useState } from 'react';
import { Dumbbell } from 'lucide-react';
import { MealSectionHeader } from "./MealSectionHeader";
import { Button } from '@/components/ui/button';
import ExerciseDialog, { NewExercise } from '@/components/tracking/ExerciseDialog';
import { useExerciseTracking } from '@/hooks/useExerciseTracking';
import { useToast } from '@/hooks/use-toast';

export const ExerciseSection = () => {
  const { toast } = useToast();
  const [dialogOpen, setDialogOpen] = useState(false);
  
  // Use the exercise tracking hook with premium set to true for now to enable functionality
  const { 
    exercises, 
    handleAddExercise,
    loading 
  } = useExerciseTracking({ 
    isPremium: true 
  });
  
  const handleSaveExercise = (exercise: NewExercise) => {
    handleAddExercise(exercise);
    setDialogOpen(false);
  };
  
  return (
    <div className="bg-white rounded-xl p-6 shadow-sm">
      <MealSectionHeader 
        title="Exercise"
        onFoodSelect={() => setDialogOpen(true)}
        icon={<Dumbbell className="w-5 h-5 text-purple-600" />}
      />
      
      <div className="space-y-3">
        {exercises.length > 0 ? (
          <div className="space-y-2">
            {exercises.map((exercise) => (
              <div 
                key={exercise.id} 
                className="flex justify-between items-center p-2 bg-gray-50 rounded-md"
              >
                <div>
                  <p className="font-medium text-sm">{exercise.description}</p>
                  <p className="text-xs text-gray-500">{exercise.duration} minutes</p>
                </div>
                <div className="text-right">
                  <p className="font-medium text-sm">{exercise.caloriesBurned} kcal</p>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-gray-500 text-sm">No exercises logged today</p>
        )}
        
        <div className="mt-3">
          <Button 
            onClick={() => setDialogOpen(true)}
            variant="outline" 
            size="sm"
            className="w-full"
            disabled={loading}
          >
            <Dumbbell className="mr-2 h-4 w-4" />
            {loading ? "Logging..." : "Log Exercise Activity"}
          </Button>
        </div>
      </div>
      
      <ExerciseDialog
        open={dialogOpen}
        onOpenChange={setDialogOpen}
        onSave={handleSaveExercise}
        isPremium={true}
      />
    </div>
  );
};
