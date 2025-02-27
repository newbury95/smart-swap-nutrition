
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Dumbbell, Plus } from 'lucide-react';
import { Button } from '@/components/ui/button';

export const ExerciseSection = () => {
  const navigate = useNavigate();
  
  return (
    <div className="bg-white rounded-xl p-6 shadow-sm">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <Dumbbell className="w-5 h-5 text-purple-600" />
          <h3 className="font-medium text-gray-800">Exercise</h3>
        </div>
        <Button 
          onClick={() => navigate('/tracking')}
          size="sm" 
          variant="ghost"
          className="h-8 w-8 p-0"
        >
          <Plus className="h-4 w-4" />
        </Button>
      </div>
      
      <div className="border-t pt-4">
        <p className="text-gray-500 text-sm">No exercises logged today</p>
        <div className="mt-3">
          <Button 
            onClick={() => navigate('/tracking')}
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
