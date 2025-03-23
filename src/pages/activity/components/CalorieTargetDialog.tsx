
import { Button } from "@/components/ui/button";
import { 
  Dialog, 
  DialogContent, 
  DialogTitle, 
  DialogDescription, 
  DialogFooter 
} from "@/components/ui/dialog";

interface CalorieTargetDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  bmr: number;
  tdee: number;
  calorieTarget: number;
  weightGoal: string;
  onAcceptRecommended: () => void;
}

const CalorieTargetDialog = ({
  open,
  onOpenChange,
  bmr,
  tdee,
  calorieTarget,
  weightGoal,
  onAcceptRecommended
}: CalorieTargetDialogProps) => {
  return (
    <DialogContent className="sm:max-w-md">
      <DialogTitle>Recommended Calorie Target</DialogTitle>
      <DialogDescription>
        Based on your metrics, we recommend the following daily calorie intake:
      </DialogDescription>
      
      <div className="my-6">
        <div className="bg-purple-50 p-6 rounded-lg text-center">
          <h3 className="text-lg text-purple-800 font-medium mb-2">Recommended Daily Calories</h3>
          <p className="text-3xl font-bold text-purple-900">{calorieTarget} kcal</p>
          <p className="text-sm text-purple-700 mt-2">Based on your BMR, activity level, and weight goal</p>
        </div>
        
        <div className="grid grid-cols-3 gap-4 mt-4">
          <div className="bg-blue-50 p-3 rounded-md text-center">
            <p className="text-sm text-blue-800 font-medium">BMR</p>
            <p className="text-lg font-semibold text-blue-900">{bmr} kcal</p>
          </div>
          <div className="bg-green-50 p-3 rounded-md text-center">
            <p className="text-sm text-green-800 font-medium">TDEE</p>
            <p className="text-lg font-semibold text-green-900">{tdee} kcal</p>
          </div>
          <div className="bg-orange-50 p-3 rounded-md text-center">
            <p className="text-sm text-orange-800 font-medium">Goal</p>
            <p className="text-lg font-semibold text-orange-900">{weightGoal}</p>
          </div>
        </div>
      </div>
      
      <DialogFooter className="flex-col sm:flex-row sm:justify-between">
        <Button 
          variant="outline" 
          onClick={() => onOpenChange(false)}
        >
          Adjust Settings
        </Button>
        <Button 
          onClick={onAcceptRecommended}
          className="bg-purple-600 hover:bg-purple-700"
        >
          Accept Recommended
        </Button>
      </DialogFooter>
    </DialogContent>
  );
};

export default CalorieTargetDialog;
