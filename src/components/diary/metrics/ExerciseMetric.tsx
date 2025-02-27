
import { Dumbbell } from "lucide-react";
import { useNavigate } from "react-router-dom";

export const ExerciseMetric = () => {
  const navigate = useNavigate();
  
  return (
    <div className="bg-white rounded-xl p-4 border">
      <div className="flex items-center gap-3">
        <div className="p-2 bg-purple-100 rounded-lg">
          <Dumbbell className="w-5 h-5 text-purple-600" />
        </div>
        <div>
          <h4 className="text-sm font-medium text-gray-800">Exercise</h4>
          <p className="text-xl font-semibold">Log</p>
        </div>
      </div>
      <div className="mt-2">
        <button
          onClick={() => navigate('/tracking')}
          className="w-full px-2 py-1 text-sm bg-purple-100 text-purple-600 rounded hover:bg-purple-200 transition-colors"
        >
          Log Exercise
        </button>
      </div>
    </div>
  );
};
