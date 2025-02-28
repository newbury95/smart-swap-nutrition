
import React from 'react';
import { Dumbbell } from 'lucide-react';

interface Exercise {
  name: string;
  sets: number;
  reps: string;
  rest: string;
}

interface WorkoutTableProps {
  exercises: Exercise[];
}

const WorkoutTable: React.FC<WorkoutTableProps> = ({ exercises }) => {
  return (
    <div>
      <h4 className="font-medium mb-2 flex items-center gap-2">
        <Dumbbell className="w-4 h-4" />
        Exercises
      </h4>
      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b">
              <th className="text-left py-2 pr-4">Exercise</th>
              <th className="text-center py-2 px-4">Sets</th>
              <th className="text-center py-2 px-4">Reps</th>
              <th className="text-center py-2 pl-4">Rest</th>
            </tr>
          </thead>
          <tbody>
            {exercises.map((exercise, idx) => (
              <tr key={idx} className={idx % 2 === 0 ? 'bg-gray-50' : 'bg-white'}>
                <td className="py-2 pr-4">{exercise.name}</td>
                <td className="text-center py-2 px-4">{exercise.sets}</td>
                <td className="text-center py-2 px-4">{exercise.reps}</td>
                <td className="text-center py-2 pl-4">{exercise.rest}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default WorkoutTable;
