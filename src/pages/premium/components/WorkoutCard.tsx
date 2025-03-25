
import React from 'react';
import { Button } from '@/components/ui/button';
import { Exercise } from '../data/workoutData';

export interface Workout {
  id: string;
  name: string;
  description: string;
  difficulty: 'beginner' | 'intermediate' | 'advanced';
  duration: string;
  primaryMuscleGroups: string[];
  secondaryMuscleGroups: string[];
  exercises: Exercise[];
  imageUrl?: string;
}

export interface WorkoutCardProps {
  workout: Workout;
  onSave?: () => void;
}

const WorkoutCard: React.FC<WorkoutCardProps> = ({ workout, onSave }) => {
  // Function to get the badge color based on difficulty
  const getDifficultyColor = (difficulty: string) => {
    switch(difficulty) {
      case 'beginner':
        return 'bg-soft-green text-primary-dark';
      case 'intermediate':
        return 'bg-primary-lighter text-primary-dark';
      case 'advanced':
        return 'bg-primary-light/30 text-primary-darker';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="border rounded-lg overflow-hidden shadow-sm hover:shadow-md transition-shadow border-primary-lighter/40">
      <div className="p-4">
        <div className="flex justify-between items-start mb-2">
          <h3 className="text-lg font-semibold">{workout.name}</h3>
          <span className={`px-2 py-1 rounded text-xs font-medium ${getDifficultyColor(workout.difficulty)}`}>
            {workout.difficulty.charAt(0).toUpperCase() + workout.difficulty.slice(1)}
          </span>
        </div>
        
        <p className="text-gray-600 text-sm mb-3">{workout.description}</p>
        
        <div className="flex flex-wrap gap-2 mb-3">
          <span className="bg-gray-100 text-gray-800 px-2 py-1 rounded text-xs">
            {workout.duration}
          </span>
          {workout.primaryMuscleGroups.map((muscle, index) => (
            <span key={index} className="bg-soft-green text-primary-dark px-2 py-1 rounded text-xs">
              {muscle.charAt(0).toUpperCase() + muscle.slice(1)}
            </span>
          ))}
        </div>
        
        <div className="mt-4">
          <h4 className="text-sm font-medium mb-2">Exercises:</h4>
          <ul className="text-sm text-gray-600 space-y-1">
            {workout.exercises.slice(0, 2).map((exercise, index) => (
              <li key={index} className="flex justify-between">
                <span>{exercise.name}</span>
                <span>{exercise.sets} sets × {exercise.reps}</span>
              </li>
            ))}
            {workout.exercises.length > 2 && (
              <li className="text-primary text-xs">+{workout.exercises.length - 2} more exercises</li>
            )}
          </ul>
        </div>
        
        {onSave && (
          <Button 
            className="w-full mt-4"
            variant="outline"
            onClick={onSave}
          >
            Save Workout
          </Button>
        )}
      </div>
    </div>
  );
};

export default WorkoutCard;
