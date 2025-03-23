
import { Activity, Dumbbell } from "lucide-react";
import { Button } from "@/components/ui/button";

interface DailyActivityTabProps {
  steps: number;
  exercise: number;
  onUpdateSteps: () => void;
  onUpdateExercise: () => void;
}

const DailyActivityTab = ({ steps, exercise, onUpdateSteps, onUpdateExercise }: DailyActivityTabProps) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      <div className="p-6 bg-white border rounded-lg">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-xl font-medium">Today's Steps</h3>
          <div className="bg-blue-100 p-2 rounded-full">
            <Activity className="h-5 w-5 text-blue-600" />
          </div>
        </div>
        <p className="text-3xl font-bold text-blue-600 mb-4">{steps}</p>
        <Button 
          onClick={onUpdateSteps}
          className="w-full bg-blue-600 hover:bg-blue-700"
        >
          Log Steps
        </Button>
      </div>
      
      <div className="p-6 bg-white border rounded-lg">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-xl font-medium">Exercise Minutes</h3>
          <div className="bg-green-100 p-2 rounded-full">
            <Dumbbell className="h-5 w-5 text-green-600" />
          </div>
        </div>
        <p className="text-3xl font-bold text-green-600 mb-4">{exercise} min</p>
        <Button 
          onClick={onUpdateExercise}
          className="w-full bg-green-600 hover:bg-green-700"
        >
          Log Exercise
        </Button>
      </div>
    </div>
  );
};

export default DailyActivityTab;
