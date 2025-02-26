
import { useState } from "react";
import { motion } from "framer-motion";
import { ChevronLeft, Activity, Flame, Footprints } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { format } from "date-fns";
import { useToast } from "@/hooks/use-toast";
import { useSupabase } from "@/hooks/useSupabase";
import { TimeRange, TrackingData } from "@/types/tracking";
import MetricCard from "@/components/tracking/MetricCard";
import BMIForm from "@/components/tracking/BMIForm";
import ProgressChart from "@/components/tracking/ProgressChart";
import TopNavigation from "@/components/navigation/TopNavigation";

const calculateBMI = (weight: number, height: number) => {
  const heightInMeters = height / 100;
  return Number((weight / (heightInMeters * heightInMeters)).toFixed(1));
};

const TrackingPage = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const { isPremium } = useSupabase();
  const [timeRange, setTimeRange] = useState<TimeRange>("daily");
  const [caloriesBurned, setCaloriesBurned] = useState(0);
  const [steps, setSteps] = useState(0);
  const [trackingData, setTrackingData] = useState<TrackingData[]>([]);

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

  const handleUpdateActivity = () => {
    if (!isPremium) {
      toast({
        title: "Premium Feature",
        description: "Upgrade to Premium to track activity and calories",
        variant: "destructive",
      });
      return;
    }
    setCaloriesBurned(prev => prev + 100);
    toast({
      title: "Activity Logged",
      description: "Your calories burned have been recorded",
    });
  };

  const handleUpdateSteps = () => {
    if (!isPremium) {
      toast({
        title: "Premium Feature",
        description: "Upgrade to Premium to track steps",
        variant: "destructive",
      });
      return;
    }
    setSteps(prev => prev + 1000);
    toast({
      title: "Steps Logged",
      description: "Your steps have been recorded",
    });
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
            className="grid md:grid-cols-3 gap-4 mb-8"
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
          </motion.div>

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
    </div>
  );
};

export default TrackingPage;
