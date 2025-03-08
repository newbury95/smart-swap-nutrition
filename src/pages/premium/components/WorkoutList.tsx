
import React from 'react';
import { Button } from '@/components/ui/button';
import { Clock, Info } from 'lucide-react';
import { Workout } from '../data/workoutData';

export interface WorkoutListProps {
  workouts: Workout[];
  onSelect?: (workoutId: string) => void;
}

const WorkoutList: React.FC<WorkoutListProps> = ({ workouts, onSelect }) => {
  // Function to get the badge color based on difficulty
  const getDifficultyColor = (difficulty: string) => {
    switch(difficulty) {
      case 'beginner':
        return 'bg-green-100 text-green-800';
      case 'intermediate':
        return 'bg-yellow-100 text-yellow-800';
      case 'advanced':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  if (workouts.length === 0) {
    return (
      <div className="text-center py-10">
        <p className="text-gray-500">No workouts available with the current filters.</p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {workouts.map((workout) => (
        <div key={workout.id} className="border rounded-lg p-4 flex flex-col md:flex-row md:items-center gap-4 hover:bg-gray-50 transition-colors">
          <div className="flex-grow">
            <div className="flex flex-wrap items-center gap-2 mb-1">
              <h3 className="font-medium">{workout.name}</h3>
              <span className={`px-2 py-1 rounded-full text-xs ${getDifficultyColor(workout.difficulty)}`}>
                {workout.difficulty.charAt(0).toUpperCase() + workout.difficulty.slice(1)}
              </span>
            </div>
            
            <p className="text-sm text-gray-600 mb-2">{workout.description}</p>
            
            <div className="flex items-center text-sm text-gray-500">
              <Clock className="w-4 h-4 mr-1" />
              <span>{workout.duration}</span>
              <span className="mx-2">•</span>
              <span>{workout.exercises.length} exercises</span>
            </div>
          </div>
          
          {onSelect && (
            <Button 
              variant="outline"
              size="sm"
              onClick={() => onSelect(workout.id)}
              className="md:self-center whitespace-nowrap"
            >
              <Info className="w-4 h-4 mr-2" />
              Details
            </Button>
          )}
        </div>
      ))}
    </div>
  );
};

export default WorkoutList;
