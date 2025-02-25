
import { useState } from "react";
import { motion } from "framer-motion";
import { ChevronLeft, Activity, Flame, Footprints } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { format } from "date-fns";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from "recharts";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useToast } from "@/hooks/use-toast";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useSupabase } from "@/hooks/useSupabase";

type TimeRange = "daily" | "weekly" | "monthly" | "yearly";
type TrackingData = {
  date: string;
  weight: number;
  height: number;
  bmi: number;
  steps: number;
  exerciseMinutes: number;
  caloriesBurned: number;
};

const calculateBMI = (weight: number, height: number) => {
  const heightInMeters = height / 100;
  return Number((weight / (heightInMeters * heightInMeters)).toFixed(1));
};

const TrackingPage = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const { isPremium } = useSupabase();
  const [timeRange, setTimeRange] = useState<TimeRange>("daily");
  const [weight, setWeight] = useState<string>("");
  const [height, setHeight] = useState<string>("");
  const [caloriesBurned, setCaloriesBurned] = useState(0);
  const [steps, setSteps] = useState(0);
  const [trackingData, setTrackingData] = useState<TrackingData[]>([]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const weightNum = parseFloat(weight);
    const heightNum = parseFloat(height);

    if (isNaN(weightNum) || isNaN(heightNum)) {
      toast({
        variant: "destructive",
        title: "Invalid input",
        description: "Please enter valid numbers for weight and height",
      });
      return;
    }

    const bmi = calculateBMI(weightNum, heightNum);
    const newEntry: TrackingData = {
      date: format(new Date(), "yyyy-MM-dd"),
      weight: weightNum,
      height: heightNum,
      bmi,
      steps,
      exerciseMinutes: 0,
      caloriesBurned,
    };

    setTrackingData([...trackingData, newEntry]);
    setWeight("");
    setHeight("");

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
            {/* BMI Display */}
            <div className="bg-white rounded-xl p-4 shadow-sm">
              <div className="flex items-center gap-3 mb-2">
                <div className="p-2 bg-green-100 rounded-lg">
                  <Activity className="w-5 h-5 text-green-600" />
                </div>
                <h3 className="font-medium">Current BMI</h3>
              </div>
              <p className="text-2xl font-bold text-green-600 mb-1">{latestBMI}</p>
              <p className="text-sm text-gray-600">{getBMICategory(latestBMI)}</p>
            </div>

            {/* Calories Burned */}
            <div className="bg-white rounded-xl p-4 shadow-sm">
              <div className="flex items-center gap-3 mb-2">
                <div className="p-2 bg-orange-100 rounded-lg">
                  <Flame className="w-5 h-5 text-orange-600" />
                </div>
                <h3 className="font-medium">Calories Burned</h3>
              </div>
              <p className="text-2xl font-bold text-orange-600 mb-1">{caloriesBurned}</p>
              <Button 
                onClick={handleUpdateActivity} 
                variant="outline" 
                size="sm"
                className={!isPremium ? "cursor-not-allowed opacity-50" : ""}
              >
                Log Activity
              </Button>
            </div>

            {/* Steps */}
            <div className="bg-white rounded-xl p-4 shadow-sm">
              <div className="flex items-center gap-3 mb-2">
                <div className="p-2 bg-blue-100 rounded-lg">
                  <Footprints className="w-5 h-5 text-blue-600" />
                </div>
                <h3 className="font-medium">Daily Steps</h3>
              </div>
              <p className="text-2xl font-bold text-blue-600 mb-1">{steps}</p>
              <Button 
                onClick={handleUpdateSteps} 
                variant="outline" 
                size="sm"
                className={!isPremium ? "cursor-not-allowed opacity-50" : ""}
              >
                Log Steps
              </Button>
            </div>
          </motion.div>

          {/* BMI Input Form */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="bg-white rounded-xl p-6 shadow-sm mb-8"
          >
            <h2 className="text-lg font-semibold mb-4">Enter New Measurements</h2>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Weight (kg)
                </label>
                <Input
                  type="number"
                  value={weight}
                  onChange={(e) => setWeight(e.target.value)}
                  placeholder="Enter weight in kg"
                  step="0.1"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Height (cm)
                </label>
                <Input
                  type="number"
                  value={height}
                  onChange={(e) => setHeight(e.target.value)}
                  placeholder="Enter height in cm"
                  step="0.1"
                  required
                />
              </div>
              <Button type="submit" className="w-full">
                Save Measurements
              </Button>
            </form>
          </motion.div>

          {/* Progress Chart */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="bg-white rounded-xl p-6 shadow-sm"
          >
            <Tabs value={timeRange} onValueChange={(value) => setTimeRange(value as TimeRange)}>
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-lg font-semibold">Progress Tracking</h2>
                <TabsList>
                  <TabsTrigger value="daily">Daily</TabsTrigger>
                  <TabsTrigger value="weekly">Weekly</TabsTrigger>
                  <TabsTrigger value="monthly">Monthly</TabsTrigger>
                  <TabsTrigger value="yearly">Yearly</TabsTrigger>
                </TabsList>
              </div>

              <TabsContent value={timeRange} className="h-[400px]">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={trackingData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="date" />
                    <YAxis yAxisId="left" />
                    <YAxis yAxisId="right" orientation="right" />
                    <Tooltip />
                    <Legend />
                    <Line
                      yAxisId="left"
                      type="monotone"
                      dataKey="bmi"
                      name="BMI"
                      stroke="#22c55e"
                      strokeWidth={2}
                    />
                    {isPremium && (
                      <>
                        <Line
                          yAxisId="right"
                          type="monotone"
                          dataKey="caloriesBurned"
                          name="Calories"
                          stroke="#f97316"
                          strokeWidth={2}
                        />
                        <Line
                          yAxisId="right"
                          type="monotone"
                          dataKey="steps"
                          name="Steps"
                          stroke="#3b82f6"
                          strokeWidth={2}
                        />
                      </>
                    )}
                  </LineChart>
                </ResponsiveContainer>
              </TabsContent>
            </Tabs>
          </motion.div>
        </div>
      </main>
    </div>
  );
};

export default TrackingPage;

