
import { motion } from "framer-motion";
import { Exercise } from "@/hooks/useExerciseTracking";

interface RecentExercisesProps {
  exercises: Exercise[];
}

const RecentExercises = ({ exercises }: RecentExercisesProps) => {
  if (exercises.length === 0) {
    return null;
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
      className="bg-white rounded-xl p-6 shadow-sm mb-8"
    >
      <h2 className="text-lg font-semibold mb-4">Recent Exercises</h2>
      <div className="space-y-3">
        {exercises.map((exercise) => (
          <div 
            key={exercise.id}
            className="flex justify-between items-center p-3 bg-gray-50 rounded-lg"
          >
            <div>
              <div className="font-medium">{exercise.description}</div>
              <div className="text-sm text-gray-500">
                {exercise.type}, {exercise.duration} mins
              </div>
            </div>
            <div className="text-orange-600 font-medium">
              {exercise.caloriesBurned} kcal
            </div>
          </div>
        ))}
      </div>
    </motion.div>
  );
};

export default RecentExercises;
