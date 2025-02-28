
import React from 'react';
import WorkoutTable from './WorkoutTable';

export type Difficulty = 'beginner' | 'intermediate' | 'advanced';

export interface Workout {
  id: string;
  name: string;
  description: string;
  difficulty: Difficulty;
  duration: string;
  exercises: {
    name: string;
    sets: number;
    reps: string;
    rest: string;
  }[];
}

interface WorkoutCardProps {
  workout: Workout;
}

const WorkoutCard: React.FC<WorkoutCardProps> = ({ workout }) => {
  return (
    <div key={workout.id} className="border rounded-lg p-6">
      <div className="flex justify-between items-start mb-4">
        <div>
          <h3 className="text-lg font-semibold">{workout.name}</h3>
          <p className="text-gray-600">{workout.description}</p>
        </div>
        <div className="flex items-center gap-2 text-sm">
          <span className="bg-green-100 text-green-800 px-2 py-1 rounded">
            {workout.duration}
          </span>
        </div>
      </div>
      
      <WorkoutTable exercises={workout.exercises} />
    </div>
  );
};

export default WorkoutCard;
