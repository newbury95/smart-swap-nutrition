
import { useState } from "react";
import { motion } from "framer-motion";
import { ChevronLeft } from "lucide-react";
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
} from "recharts";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useToast } from "@/hooks/use-toast";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

type TimeRange = "daily" | "weekly" | "monthly" | "yearly";
type TrackingData = {
  date: string;
  weight: number;
  height: number;
  bmi: number;
  steps: number;
  exerciseMinutes: number;
};

const calculateBMI = (weight: number, height: number) => {
  const heightInMeters = height / 100;
  return Number((weight / (heightInMeters * heightInMeters)).toFixed(1));
};

const TrackingPage = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [timeRange, setTimeRange] = useState<TimeRange>("daily");
  const [weight, setWeight] = useState<string>("");
  const [height, setHeight] = useState<string>("");
  const [steps, setSteps] = useState(0);
  const [exerciseMinutes, setExerciseMinutes] = useState(0);
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
      exerciseMinutes
    };

    setTrackingData([...trackingData, newEntry]);
    setWeight("");
    setHeight("");

    toast({
      title: "Measurements updated",
      description: `Your BMI is ${bmi}`,
    });
  };

  const handleUpdateSteps = () => {
    setSteps(prev => prev + 1000);
    toast({
      title: "Activity Logged",
      description: "Your steps have been recorded for the day",
    });
  };

  const handleUpdateExercise = () => {
    setExerciseMinutes(prev => prev + 30);
    toast({
      title: "Exercise Logged",
      description: "Your exercise minutes have been recorded for the day",
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
            className="grid md:grid-cols-2 gap-8 mb-8"
          >
            {/* BMI Calculator Section */}
            <div className="bg-white rounded-xl p-6 shadow-sm">
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
            </div>

            {/* Current BMI Display */}
            <div className="bg-white rounded-xl p-6 shadow-sm">
              <h2 className="text-lg font-semibold mb-4">Current BMI</h2>
              <div className="text-center">
                <div className="text-4xl font-bold text-green-600 mb-2">
                  {latestBMI}
                </div>
                <div className="text-gray-600 mb-4">
                  {getBMICategory(latestBMI)}
                </div>
                <div className="text-sm text-gray-500">
                  Last updated: {trackingData[trackingData.length - 1]?.date || "Never"}
                </div>
              </div>
            </div>
          </motion.div>

          {/* Activity Tracking */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="bg-white rounded-xl p-6 shadow-sm mb-8"
          >
            <h2 className="text-lg font-semibold mb-4">Activity Tracking</h2>
            <Tabs defaultValue="steps" className="space-y-4">
              <TabsList>
                <TabsTrigger value="steps">Steps</TabsTrigger>
                <TabsTrigger value="exercise">Exercise</TabsTrigger>
              </TabsList>

              <TabsContent value="steps" className="space-y-4">
                <div className="p-6 bg-white border rounded-lg">
                  <h3 className="text-xl font-medium mb-2">Today's Steps</h3>
                  <p className="text-3xl font-bold text-green-600 mb-4">{steps}</p>
                  <Button onClick={handleUpdateSteps}>Log Steps</Button>
                </div>
              </TabsContent>

              <TabsContent value="exercise" className="space-y-4">
                <div className="p-6 bg-white border rounded-lg">
                  <h3 className="text-xl font-medium mb-2">Exercise Minutes</h3>
                  <p className="text-3xl font-bold text-green-600 mb-4">{exerciseMinutes} min</p>
                  <Button onClick={handleUpdateExercise}>Log Exercise</Button>
                </div>
              </TabsContent>
            </Tabs>
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
                    <YAxis />
                    <Tooltip />
                    <Line
                      type="monotone"
                      dataKey="bmi"
                      stroke="#22c55e"
                      strokeWidth={2}
                    />
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
