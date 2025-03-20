
import { memo } from "react";
import { Dialog, DialogContent, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Activity, ArrowRight, Flame } from "lucide-react";

interface GoalSelectionDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSelectGoal: (goal: 'weight_loss' | 'maintenance' | 'mass_building') => void;
  isUpdating?: boolean;
}

const GoalSelectionDialog = ({ open, onOpenChange, onSelectGoal, isUpdating = false }: GoalSelectionDialogProps) => {
  const handleGoalSelect = (goal: 'weight_loss' | 'maintenance' | 'mass_building') => {
    if (!isUpdating) {
      onSelectGoal(goal);
    }
  };

  return (
    <Dialog open={open} onOpenChange={(newOpen) => {
      // Only allow closing if we're not currently updating
      if (!isUpdating || !newOpen) {
        onOpenChange(newOpen);
      }
    }}>
      <DialogContent className="sm:max-w-md">
        <DialogTitle>Choose Your Fitness Goal</DialogTitle>
        <DialogDescription>
          Select a goal based on what you want to achieve.
        </DialogDescription>
        
        <div className="grid grid-cols-1 gap-4 py-4">
          <div 
            className={`flex items-center justify-between p-4 rounded-lg border border-green-200 bg-green-50 
                       ${isUpdating ? 'opacity-70 cursor-not-allowed' : 'cursor-pointer hover:bg-green-100 transition-colors'}`}
            onClick={() => handleGoalSelect('weight_loss')}
          >
            <div className="flex items-center">
              <div className="p-2 bg-green-100 rounded-full mr-3">
                <ArrowRight className="h-5 w-5 text-green-600" />
              </div>
              <div>
                <h4 className="font-medium">Weight Loss</h4>
                <p className="text-sm text-gray-500">Calorie deficit for weight loss</p>
              </div>
            </div>
          </div>
          
          <div 
            className={`flex items-center justify-between p-4 rounded-lg border border-blue-200 bg-blue-50 
                       ${isUpdating ? 'opacity-70 cursor-not-allowed' : 'cursor-pointer hover:bg-blue-100 transition-colors'}`}
            onClick={() => handleGoalSelect('maintenance')}
          >
            <div className="flex items-center">
              <div className="p-2 bg-blue-100 rounded-full mr-3">
                <Activity className="h-5 w-5 text-blue-600" />
              </div>
              <div>
                <h4 className="font-medium">Maintenance</h4>
                <p className="text-sm text-gray-500">Maintain current weight</p>
              </div>
            </div>
          </div>
          
          <div 
            className={`flex items-center justify-between p-4 rounded-lg border border-orange-200 bg-orange-50 
                       ${isUpdating ? 'opacity-70 cursor-not-allowed' : 'cursor-pointer hover:bg-orange-100 transition-colors'}`}
            onClick={() => handleGoalSelect('mass_building')}
          >
            <div className="flex items-center">
              <div className="p-2 bg-orange-100 rounded-full mr-3">
                <Flame className="h-5 w-5 text-orange-600" />
              </div>
              <div>
                <h4 className="font-medium">Mass Building</h4>
                <p className="text-sm text-gray-500">Calorie surplus for muscle gain</p>
              </div>
            </div>
          </div>
        </div>
        
        <DialogFooter>
          <Button 
            variant="outline" 
            onClick={() => onOpenChange(false)}
            disabled={isUpdating}
          >
            {isUpdating ? "Updating..." : "Cancel"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default memo(GoalSelectionDialog);
