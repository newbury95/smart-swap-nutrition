
import React, { useState } from 'react';
import { Dumbbell } from 'lucide-react';
import { MealSectionHeader } from "./MealSectionHeader";
import { Button } from '@/components/ui/button';
import ExerciseDialog, { NewExercise } from '@/components/tracking/ExerciseDialog';
import { useToast } from '@/hooks/use-toast';

export const ExerciseSection = () => {
  const { toast } = useToast();
  const [dialogOpen, setDialogOpen] = useState(false);
  
  const handleSaveExercise = (exercise: NewExercise) => {
    // Here you would normally save the exercise to the database
    toast({
      title: "Exercise logged",
      description: `${exercise.description} for ${exercise.duration} minutes`,
    });
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
        <p className="text-gray-500 text-sm">No exercises logged today</p>
        <div className="mt-3">
          <Button 
            onClick={() => setDialogOpen(true)}
            variant="outline" 
            size="sm"
            className="w-full"
          >
            <Dumbbell className="mr-2 h-4 w-4" />
            Log Exercise Activity
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
