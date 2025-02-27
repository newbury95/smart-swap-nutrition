
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Dumbbell } from 'lucide-react';
import { MealSectionHeader } from "./MealSectionHeader";
import { Button } from '@/components/ui/button';

export const ExerciseSection = () => {
  const navigate = useNavigate();

  const onLogExercise = () => {
    navigate('/tracking');
  };
  
  return (
    <div className="bg-white rounded-xl p-6 shadow-sm">
      <MealSectionHeader 
        title="Exercise"
        onFoodSelect={onLogExercise}
        icon={<Dumbbell className="w-5 h-5 text-purple-600" />}
      />
      
      <div className="space-y-3">
        <p className="text-gray-500 text-sm">No exercises logged today</p>
        <div className="mt-3">
          <Button 
            onClick={onLogExercise}
            variant="outline" 
            size="sm"
            className="w-full"
          >
            <Dumbbell className="mr-2 h-4 w-4" />
            Log Exercise Activity
          </Button>
        </div>
      </div>
    </div>
  );
};
