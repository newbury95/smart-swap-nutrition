
import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { ChevronLeft, Activity, Flame, Footprints, Dumbbell } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { format } from "date-fns";
import { useToast } from "@/hooks/use-toast";
import { useSupabase } from "@/hooks/useSupabase";
import { TimeRange, TrackingData } from "@/types/tracking";
import MetricCard from "@/components/tracking/MetricCard";
import BMIForm from "@/components/tracking/BMIForm";
import ProgressChart from "@/components/tracking/ProgressChart";
import TopNavigation from "@/components/navigation/TopNavigation";
import { 
  Dialog, 
  DialogContent, 
  DialogHeader, 
  DialogTitle, 
  DialogFooter 
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Label } from "@/components/ui/label";

const calculateBMI = (weight: number, height: number) => {
  const heightInMeters = height / 100;
  return Number((weight / (heightInMeters * heightInMeters)).toFixed(1));
};

type ExerciseType = 'cardio' | 'weightlifting' | 'yoga' | 'swimming' | 'running' | 'cycling' | 'other';

interface Exercise {
  id: string;
  type: ExerciseType;
  description: string;
  duration: number; // minutes
  caloriesBurned: number;
  date: string;
}

// Estimated calories burned per minute by exercise type (for a 70kg person)
const calorieEstimates: Record<ExerciseType, number> = {
  cardio: 8,
  weightlifting: 5,
  yoga: 3,
  swimming: 10,
  running: 12,
  cycling: 8,
  other: 6
};

const TrackingPage = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const { isPremium, addHealthMetric } = useSupabase();
  const [timeRange, setTimeRange] = useState<TimeRange>("daily");
  const [caloriesBurned, setCaloriesBurned] = useState(0);
  const [steps, setSteps] = useState(0);
  const [heartRate, setHeartRate] = useState(0);
  const [trackingData, setTrackingData] = useState<TrackingData[]>([]);
  const [showExerciseDialog, setShowExerciseDialog] = useState(false);
  const [exercises, setExercises] = useState<Exercise[]>([]);
  const [newExercise, setNewExercise] = useState<{
    type: ExerciseType;
    description: string;
    duration: number;
    caloriesBurned: number;
  }>({
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

  useEffect(() => {
    // Save caloriesBurned to localStorage for sharing with other components
    localStorage.setItem('caloriesBurned', caloriesBurned.toString());
  }, [caloriesBurned]);

  const handleBMISubmit = (weight: number, height: number) => {
    const bmi = calculateBMI(weight, height);
    const newEntry: TrackingData = {
      date: format(new Date(), "yyyy-MM-dd"),
      weight,
      height,
      bmi,
      steps,
      exerciseMinutes: 0,
      caloriesBurned,
    };

    setTrackingData([...trackingData, newEntry]);

    toast({
      title: "Measurements updated",
      description: `Your BMI is ${bmi}`,
    });
  };

  const handleUpdateActivity = async () => {
    if (!isPremium) {
      toast({
        title: "Premium Feature",
        description: "Upgrade to Premium to track activity and calories",
        variant: "destructive",
      });
      return;
    }
    try {
      await addHealthMetric({
        metric_type: 'activity',
        value: 100,
        source: 'manual'
      });
      setCaloriesBurned(prev => prev + 100);
      toast({
        title: "Activity Logged",
        description: "Your calories burned have been recorded",
      });
    } catch (error) {
      console.error('Error logging activity:', error);
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to log activity",
      });
    }
  };

  const handleUpdateSteps = async () => {
    if (!isPremium) {
      toast({
        title: "Premium Feature",
        description: "Upgrade to Premium to track steps",
        variant: "destructive",
      });
      return;
    }
    try {
      await addHealthMetric({
        metric_type: 'steps',
        value: 1000,
        source: 'manual'
      });
      setSteps(prev => prev + 1000);
      toast({
        title: "Steps Logged",
        description: "Your steps have been recorded",
      });
    } catch (error) {
      console.error('Error logging steps:', error);
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to log steps",
      });
    }
  };

  const handleUpdateHeartRate = async () => {
    if (!isPremium) {
      toast({
        title: "Premium Feature",
        description: "Upgrade to Premium to track heart rate",
        variant: "destructive",
      });
      return;
    }
    try {
      await addHealthMetric({
        metric_type: 'heart-rate',
        value: 75,
        source: 'manual'
      });
      setHeartRate(75);
      toast({
        title: "Heart Rate Logged",
        description: "Your heart rate has been recorded",
      });
    } catch (error) {
      console.error('Error logging heart rate:', error);
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to log heart rate",
      });
    }
  };

  const handleAddExercise = async () => {
    if (!isPremium) {
      toast({
        title: "Premium Feature",
        description: "Upgrade to Premium to log exercises",
        variant: "destructive",
      });
      return;
    }

    if (!newExercise.description) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "Please provide a description for your exercise",
      });
      return;
    }

    try {
      // In a real app, this would be saved to the database
      const exercise: Exercise = {
        id: Date.now().toString(),
        ...newExercise,
        date: new Date().toISOString()
      };
      
      setExercises([...exercises, exercise]);
      setCaloriesBurned(prev => prev + newExercise.caloriesBurned);

      // Log the exercise activity
      await addHealthMetric({
        metric_type: 'activity',
        value: newExercise.caloriesBurned,
        source: 'exercise'
      });
      
      toast({
        title: "Exercise Logged",
        description: `Added ${newExercise.description} (${newExercise.caloriesBurned} calories)`,
      });
      
      // Reset form and close dialog
      setNewExercise({
        type: 'cardio',
        description: '',
        duration: 30,
        caloriesBurned: 240,
      });
      setShowExerciseDialog(false);
    } catch (error) {
      console.error('Error logging exercise:', error);
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to log exercise",
      });
    }
  };

  const getBMICategory = (bmi: number) => {
    if (bmi < 18.5) return "Underweight";
    if (bmi < 25) return "Normal weight";
    if (bmi < 30) return "Overweight";
    return "Obese";
  };

  const latestBMI = trackingData[trackingData.length - 1]?.bmi || 0;

  return (
    <div className="min-h-screen bg-gray-50">
      <TopNavigation />
      
      <header className="bg-white border-b">
        <div className="container mx-auto px-4 py-4">
          <button 
            onClick={() => navigate('/')}
            className="flex items-center gap-2 text-gray-600 hover:text-gray-800 transition-colors"
          >
            <ChevronLeft className="w-4 h-4" />
            Back to Dashboard
          </button>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="grid md:grid-cols-4 gap-4 mb-8"
          >
            <MetricCard
              icon={Activity}
              iconColor="text-green-600"
              bgColor="bg-green-100"
              title="Current BMI"
              value={latestBMI}
              buttonLabel={getBMICategory(latestBMI)}
              isPremium={true}
            />

            <MetricCard
              icon={Flame}
              iconColor="text-orange-600"
              bgColor="bg-orange-100"
              title="Calories Burned"
              value={caloriesBurned}
              onUpdate={handleUpdateActivity}
              isPremium={isPremium}
              buttonLabel="Log Activity"
            />

            <MetricCard
              icon={Footprints}
              iconColor="text-blue-600"
              bgColor="bg-blue-100"
              title="Daily Steps"
              value={steps}
              onUpdate={handleUpdateSteps}
              isPremium={isPremium}
              buttonLabel="Log Steps"
            />
            
            <MetricCard
              icon={Dumbbell}
              iconColor="text-purple-600"
              bgColor="bg-purple-100"
              title="Exercise"
              value={exercises.length}
              onUpdate={() => setShowExerciseDialog(true)}
              isPremium={isPremium}
              buttonLabel="Log Exercise"
            />
          </motion.div>

          {exercises.length > 0 && (
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
          )}

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="bg-white rounded-xl p-6 shadow-sm mb-8"
          >
            <h2 className="text-lg font-semibold mb-4">Enter New Measurements</h2>
            <BMIForm onSubmit={handleBMISubmit} />
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="bg-white rounded-xl p-6 shadow-sm"
          >
            <ProgressChart 
              data={trackingData}
              timeRange={timeRange}
              onTimeRangeChange={setTimeRange}
              isPremium={isPremium}
            />
          </motion.div>
        </div>
      </main>

      <Dialog open={showExerciseDialog} onOpenChange={setShowExerciseDialog}>
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
            <Button variant="outline" onClick={() => setShowExerciseDialog(false)}>
              Cancel
            </Button>
            <Button onClick={handleAddExercise}>
              Save Exercise
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default TrackingPage;
