
import React from 'react';
import WorkoutCard, { Workout, Difficulty } from './WorkoutCard';

interface WorkoutListProps {
  workouts: Workout[];
  difficulty: Difficulty;
}

const WorkoutList: React.FC<WorkoutListProps> = ({ workouts, difficulty }) => {
  const filteredWorkouts = workouts.filter(workout => workout.difficulty === difficulty);
  
  return (
    <div className="space-y-6">
      {filteredWorkouts.length > 0 ? (
        filteredWorkouts.map((workout) => (
          <WorkoutCard key={workout.id} workout={workout} />
        ))
      ) : (
        <div className="text-center py-10">
          <p className="text-gray-500">No workouts available for this muscle group yet.</p>
        </div>
      )}
    </div>
  );
};

export default WorkoutList;
