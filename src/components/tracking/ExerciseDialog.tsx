
import { useState, useEffect } from "react";
import { 
  Dialog, 
  DialogContent, 
  DialogHeader, 
  DialogTitle, 
  DialogFooter 
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { ExerciseType, calorieEstimates } from "@/utils/healthCalculations";

export interface NewExercise {
  type: ExerciseType;
  description: string;
  duration: number;
  caloriesBurned: number;
}

interface ExerciseDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSave: (exercise: NewExercise) => void;
  isPremium: boolean;
}

const ExerciseDialog = ({ open, onOpenChange, onSave, isPremium }: ExerciseDialogProps) => {
  const [newExercise, setNewExercise] = useState<NewExercise>({
    type: 'cardio',
    description: '',
    duration: 30,
    caloriesBurned: 240, // Default: 30 min * 8 cal/min
  });

  useEffect(() => {
    // Update estimated calories based on type and duration
    const estimatedCalories = Math.round(newExercise.duration * calorieEstimates[newExercise.type]);
    setNewExercise(prev => ({
      ...prev,
      caloriesBurned: estimatedCalories
    }));
  }, [newExercise.type, newExercise.duration]);

  const handleSave = () => {
    onSave(newExercise);
    // Reset form for next time
    setNewExercise({
      type: 'cardio',
      description: '',
      duration: 30,
      caloriesBurned: 240,
    });
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Log Exercise</DialogTitle>
        </DialogHeader>
        <div className="space-y-4 py-4">
          <div className="space-y-2">
            <Label htmlFor="exercise-type">Exercise Type</Label>
            <Select 
              value={newExercise.type} 
              onValueChange={(value: ExerciseType) => 
                setNewExercise(prev => ({ ...prev, type: value }))
              }
            >
              <SelectTrigger id="exercise-type">
                <SelectValue placeholder="Select type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="cardio">Cardio</SelectItem>
                <SelectItem value="weightlifting">Weightlifting</SelectItem>
                <SelectItem value="yoga">Yoga</SelectItem>
                <SelectItem value="swimming">Swimming</SelectItem>
                <SelectItem value="running">Running</SelectItem>
                <SelectItem value="cycling">Cycling</SelectItem>
                <SelectItem value="other">Other</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="exercise-description">Description</Label>
            <Input
              id="exercise-description"
              placeholder="e.g., Treadmill run, Bench press"
              value={newExercise.description}
              onChange={(e) => setNewExercise(prev => ({ 
                ...prev, 
                description: e.target.value 
              }))}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="exercise-duration">Duration (minutes)</Label>
            <Input
              id="exercise-duration"
              type="number"
              min="1"
              value={newExercise.duration}
              onChange={(e) => setNewExercise(prev => ({ 
                ...prev, 
                duration: parseInt(e.target.value) || 0 
              }))}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="exercise-calories">Calories Burned</Label>
            <Input
              id="exercise-calories"
              type="number"
              min="1"
              value={newExercise.caloriesBurned}
              onChange={(e) => setNewExercise(prev => ({ 
                ...prev, 
                caloriesBurned: parseInt(e.target.value) || 0 
              }))}
            />
            <p className="text-sm text-gray-500">
              Estimated: ~{Math.round(newExercise.duration * calorieEstimates[newExercise.type])} calories 
              for {newExercise.duration} minutes of {newExercise.type}
            </p>
          </div>
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Cancel
          </Button>
          <Button onClick={handleSave}>
            Save Exercise
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default ExerciseDialog;
