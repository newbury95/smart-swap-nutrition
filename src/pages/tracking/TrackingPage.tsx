
import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { ChevronLeft, Activity, Flame, Footprints, Dumbbell } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { format } from "date-fns";
import { useToast } from "@/hooks/use-toast";
import { useSupabase } from "@/hooks/useSupabase";
import { TimeRange, TrackingData } from "@/types/tracking";
import { calculateBMI, getBMICategory } from "@/utils/healthCalculations";
import { useExerciseTracking } from "@/hooks/useExerciseTracking";
import MetricCard from "@/components/tracking/MetricCard";
import BMIForm from "@/components/tracking/BMIForm";
import ProgressChart from "@/components/tracking/ProgressChart";
import TopNavigation from "@/components/navigation/TopNavigation";
import RecentExercises from "@/components/tracking/RecentExercises";
import ExerciseDialog from "@/components/tracking/ExerciseDialog";

const TrackingPage = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [timeRange, setTimeRange] = useState<TimeRange>("daily");
  const [steps, setSteps] = useState(0);
  const [heartRate, setHeartRate] = useState(0);
  const [trackingData, setTrackingData] = useState<TrackingData[]>([]);
  const { isPremium, addHealthMetric } = useSupabase();
  
  // Use the exercise tracking hook
  const { 
    exercises, 
    caloriesBurned, 
    showExerciseDialog, 
    setShowExerciseDialog, 
    handleAddExercise 
  } = useExerciseTracking({ 
    isPremium, 
    addHealthMetric 
  });

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

  const latestBMI = trackingData[trackingData.length - 1]?.bmi || 0;

  return (
    <div className="min-h-screen bg-gray-50">
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
            {/* Reordered cards - BMI first, Exercise second */}
            <MetricCard
              icon={Activity}
              iconColor="text-green-600"
              bgColor="bg-green-100"
              title="Current BMI"
              value={latestBMI}
              buttonLabel={getBMICategory(latestBMI)}
              isPremium={true}
              priority={1}
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
              priority={2}
            />
            
            <MetricCard
              icon={Flame}
              iconColor="text-orange-600"
              bgColor="bg-orange-100"
              title="Calories Burned"
              value={caloriesBurned}
              isPremium={isPremium}
              buttonLabel="Synced with Health"
              priority={3}
            />

            <MetricCard
              icon={Footprints}
              iconColor="text-blue-600"
              bgColor="bg-blue-100"
              title="Daily Steps"
              value={steps}
              isPremium={isPremium}
              buttonLabel="Synced with Health"
              priority={4}
            />
          </motion.div>

          <RecentExercises exercises={exercises} />

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

      <ExerciseDialog 
        open={showExerciseDialog}
        onOpenChange={setShowExerciseDialog}
        onSave={handleAddExercise}
        isPremium={isPremium}
      />
    </div>
  );
};

export default TrackingPage;
