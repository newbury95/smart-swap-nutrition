import { memo, useState, useEffect } from "react";
import { useUserNutrition } from "@/hooks/useUserNutrition";
import { useToast } from "@/hooks/use-toast";
import { useSupabase } from "@/hooks/useSupabase";
import { ErrorBoundary } from "@/components/ErrorBoundary";
import TrackingHeader from "@/components/tracking/TrackingHeader";
import { PageLoading } from "@/components/PageLoading";
import { Card, CardContent } from "@/components/ui/card";
import { 
  Tabs, 
  TabsContent, 
  TabsList, 
  TabsTrigger 
} from "@/components/ui/tabs";
import { 
  Activity, 
  Weight, 
  ArrowRight,
  LineChart,
  Flame,
  Target
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { format, subDays } from "date-fns";
import { Progress } from "@/components/ui/progress";
import { Dialog, DialogContent, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog";
import { cn } from "@/lib/utils";
import { supabase } from "@/integrations/supabase/client";

const TrackingPage = () => {
  const { toast } = useToast();
  const [today] = useState(new Date());
  const { isPremium, addHealthMetric } = useSupabase();
  const [showGoalDialog, setShowGoalDialog] = useState(false);
  const [weightHistory, setWeightHistory] = useState<{date: string, weight: number}[]>([]);
  const [isWeightHistoryLoading, setIsWeightHistoryLoading] = useState(true);

  const {
    loading: settingsLoading,
    settings,
    calculations,
    updateSetting,
  } = useUserNutrition();

  useEffect(() => {
    const fetchWeightHistory = async () => {
      try {
        setIsWeightHistoryLoading(true);
        const { data: weightData, error } = await supabase
          .from('health_metrics')
          .select('value, recorded_at')
          .eq('metric_type', 'weight')
          .order('recorded_at', { ascending: false })
          .limit(30);
        
        if (error) throw error;
        
        const history = weightData?.map(record => ({
          date: format(new Date(record.recorded_at), 'yyyy-MM-dd'),
          weight: Number(record.value)
        })) || [];
        
        setWeightHistory(history);
        console.log("Weight history loaded:", history);
      } catch (error) {
        console.error("Error fetching weight history:", error);
        toast({
          variant: "destructive",
          title: "Error",
          description: "Failed to load weight history",
        });
      } finally {
        setIsWeightHistoryLoading(false);
      }
    };
    
    if (!settingsLoading) {
      fetchWeightHistory();
    }
  }, [settingsLoading, toast]);

  const handleUpdateCalories = async (calories: number) => {
    try {
      await updateSetting('calorieTarget', calories);
      
      toast({
        title: "Calorie Goal Updated",
        description: `Your daily target is now ${calories} calories`,
      });
      
      return Promise.resolve();
    } catch (error) {
      console.error("Error updating calorie goal:", error);
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to update calorie goal. Please try again.",
      });
      return Promise.reject(error);
    }
  };

  const handleBMISubmit = async (weight: number, height: number) => {
    try {
      await updateSetting('weight', weight);
      await updateSetting('height', height);
      
      await addHealthMetric({
        metric_type: 'activity',
        value: weight.toString(),
        source: 'weight-tracking'
      });
      
      setWeightHistory(prev => [{
        date: format(new Date(), 'yyyy-MM-dd'),
        weight
      }, ...prev]);
      
      toast({
        title: "Measurements Updated",
        description: "Your height and weight have been updated successfully.",
      });
    } catch (error) {
      console.error("Error updating measurements:", error);
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to update measurements. Please try again.",
      });
    }
  };

  const handleSetGoal = async (goal: 'weight_loss' | 'maintenance' | 'mass_building') => {
    try {
      await updateSetting('fitnessGoal', goal);
      setShowGoalDialog(false);
      
      toast({
        title: "Goal Updated",
        description: `Your fitness goal has been set to ${goal.replace('_', ' ')}`,
      });
    } catch (error) {
      console.error("Error updating goal:", error);
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to update goal. Please try again.",
      });
    }
  };

  if (settingsLoading) {
    return <PageLoading />;
  }

  const calorieTarget = calculations?.calorieTarget || 2000;
  const { protein: proteinTarget, carbs: carbsTarget, fats: fatsTarget } = calculations?.macros || { protein: 0, carbs: 0, fats: 0 };
  
  const consumedCalories = 1200;
  const consumedProtein = 60;
  const consumedCarbs = 120;
  const consumedFats = 45;
  
  const remainingCalories = calorieTarget - consumedCalories;
  const caloriePercentage = Math.min(Math.round((consumedCalories / calorieTarget) * 100), 100);
  const proteinPercentage = Math.min(Math.round((consumedProtein / proteinTarget) * 100), 100);
  const carbsPercentage = Math.min(Math.round((consumedCarbs / carbsTarget) * 100), 100);
  const fatsPercentage = Math.min(Math.round((consumedFats / fatsTarget) * 100), 100);
  
  const weightChartData = weightHistory.length > 0 ? weightHistory : 
    Array.from({ length: 7 }).map((_, i) => ({
      date: format(subDays(new Date(), i), 'yyyy-MM-dd'),
      weight: settings.weight,
    }));

  return (
    <div className="min-h-screen bg-gray-50">
      <TrackingHeader />

      <main className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-2xl font-bold text-gray-900 mb-6">Nutrition Tracking</h1>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
            <Card className="overflow-hidden shadow-sm hover:shadow-md transition-shadow">
              <CardContent className="p-0">
                <div className="relative w-full bg-gradient-to-br from-purple-50 to-purple-100 p-6">
                  <div className="absolute -right-5 -top-5 w-24 h-24 bg-white/20 rounded-full backdrop-blur-sm" />
                  
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="text-lg font-semibold text-purple-800">Basal Metabolic Rate</h3>
                      <p className="text-3xl font-bold mt-2 text-purple-900">{calculations?.bmr.toLocaleString()} kcal</p>
                    </div>
                    <div className="relative z-10">
                      <div className="bg-white p-3 rounded-full">
                        <Flame className="w-10 h-10 text-purple-600" />
                      </div>
                    </div>
                  </div>
                  
                  <div className="mt-4 text-sm text-purple-800">
                    <span className="flex items-center">
                      Your BMR is the calories your body needs at rest
                    </span>
                  </div>
                </div>
              </CardContent>
            </Card>
            
            <Card className="overflow-hidden shadow-sm hover:shadow-md transition-shadow">
              <CardContent className="p-0">
                <div className="relative w-full bg-gradient-to-br from-blue-50 to-blue-100 p-6">
                  <div className="absolute -right-5 -top-5 w-24 h-24 bg-white/20 rounded-full backdrop-blur-sm" />
                  
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="text-lg font-semibold text-blue-800">Calorie Target</h3>
                      <p className="text-3xl font-bold mt-2 text-blue-900">{calorieTarget.toLocaleString()} kcal</p>
                    </div>
                    <div className="relative z-10">
                      <div className="bg-white p-3 rounded-full">
                        <Activity className="w-10 h-10 text-blue-600" />
                      </div>
                    </div>
                  </div>
                  
                  <div className="mt-4">
                    <div className="flex justify-between text-sm mb-1">
                      <span className="text-blue-800">Consumed</span>
                      <span className="font-medium text-blue-900">{caloriePercentage}%</span>
                    </div>
                    <Progress 
                      value={caloriePercentage} 
                      className="h-2 bg-blue-200" 
                      indicatorClassName={caloriePercentage > 100 ? "bg-red-500" : "bg-blue-600"} 
                    />
                  </div>
                </div>
                
                <div className="p-4 bg-white rounded-b-lg">
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-500">Consumed</span>
                    <span className="font-medium">{consumedCalories.toLocaleString()} kcal</span>
                  </div>
                  <div className="flex justify-between text-sm mt-1">
                    <span className="text-gray-500">Remaining</span>
                    <span className={cn(
                      "font-medium",
                      remainingCalories < 0 ? "text-red-500" : "text-blue-500"
                    )}>
                      {remainingCalories.toLocaleString()} kcal
                    </span>
                  </div>
                </div>
              </CardContent>
            </Card>
            
            <Card className="overflow-hidden shadow-sm hover:shadow-md transition-shadow">
              <CardContent className="p-0">
                <div className="relative w-full bg-gradient-to-br from-green-50 to-green-100 p-6">
                  <div className="absolute -right-5 -top-5 w-24 h-24 bg-white/20 rounded-full backdrop-blur-sm" />
                  
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="text-lg font-semibold text-green-800">Current Goal</h3>
                      <p className="text-3xl font-bold mt-2 text-green-900 capitalize">
                        {settings.fitnessGoal.replace('_', ' ')}
                      </p>
                    </div>
                    <div className="relative z-10">
                      <div className="bg-white p-3 rounded-full">
                        <Target className="w-10 h-10 text-green-600" />
                      </div>
                    </div>
                  </div>
                  
                  <div className="mt-4">
                    <Button 
                      onClick={() => setShowGoalDialog(true)} 
                      className="w-full bg-green-600 hover:bg-green-700 text-white"
                    >
                      Change Goal
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
          
          <Card className="mb-6 overflow-hidden shadow-sm hover:shadow-md transition-shadow">
            <CardContent className="p-6">
              <h2 className="text-xl font-semibold mb-4">Macro Nutrients Progress</h2>
              
              <div className="space-y-4">
                <div>
                  <div className="flex justify-between text-sm mb-1">
                    <span className="text-gray-700">Protein ({consumedProtein}g of {proteinTarget}g)</span>
                    <span className="font-medium text-gray-900">{proteinPercentage}%</span>
                  </div>
                  <Progress 
                    value={proteinPercentage} 
                    className="h-2 bg-gray-200" 
                    indicatorClassName="bg-blue-600" 
                  />
                </div>
                
                <div>
                  <div className="flex justify-between text-sm mb-1">
                    <span className="text-gray-700">Carbs ({consumedCarbs}g of {carbsTarget}g)</span>
                    <span className="font-medium text-gray-900">{carbsPercentage}%</span>
                  </div>
                  <Progress 
                    value={carbsPercentage} 
                    className="h-2 bg-gray-200" 
                    indicatorClassName="bg-green-600" 
                  />
                </div>
                
                <div>
                  <div className="flex justify-between text-sm mb-1">
                    <span className="text-gray-700">Fats ({consumedFats}g of {fatsTarget}g)</span>
                    <span className="font-medium text-gray-900">{fatsPercentage}%</span>
                  </div>
                  <Progress 
                    value={fatsPercentage} 
                    className="h-2 bg-gray-200" 
                    indicatorClassName="bg-yellow-600" 
                  />
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card className="mb-6 overflow-hidden shadow-sm hover:shadow-md transition-shadow">
            <CardContent className="p-6">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-xl font-semibold">Your Measurements</h2>
                <button 
                  onClick={() => document.getElementById('measurements-form')?.scrollIntoView({ behavior: 'smooth' })}
                  className="text-sm text-blue-600 hover:text-blue-800 flex items-center"
                >
                  Update <ArrowRight className="ml-1 h-4 w-4" />
                </button>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="flex items-center p-4 bg-blue-50 rounded-lg">
                  <div className="p-3 bg-blue-100 rounded-full mr-4">
                    <Weight className="h-6 w-6 text-blue-600" />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-blue-600">Current Weight</p>
                    <p className="text-2xl font-bold text-blue-800">{settings.weight} kg</p>
                  </div>
                </div>
                
                <div className="flex items-center p-4 bg-purple-50 rounded-lg">
                  <div className="p-3 bg-purple-100 rounded-full mr-4">
                    <Activity className="h-6 w-6 text-purple-600" />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-purple-600">Current Height</p>
                    <p className="text-2xl font-bold text-purple-800">{settings.height} cm</p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card className="mb-6 overflow-hidden shadow-sm hover:shadow-md transition-shadow">
            <CardContent className="p-6">
              <h2 className="text-xl font-semibold mb-4">Weight History</h2>
              
              {isWeightHistoryLoading ? (
                <div className="h-64 flex items-center justify-center">
                  <p className="text-gray-500">Loading weight history...</p>
                </div>
              ) : weightHistory.length === 0 ? (
                <div className="h-64 flex items-center justify-center">
                  <div className="text-center">
                    <LineChart className="h-12 w-12 text-gray-300 mx-auto mb-2" />
                    <p className="text-gray-500">No weight history available yet.</p>
                    <p className="text-gray-400 text-sm">Update your measurements to start tracking.</p>
                  </div>
                </div>
              ) : (
                <div className="h-64">
                  <div className="bg-gray-100 h-full rounded-lg p-4 flex items-center justify-center">
                    <div className="text-center">
                      <p className="text-gray-800 font-medium">Weight Chart</p>
                      <p className="text-gray-500 text-sm">
                        Latest: {weightHistory[0]?.weight} kg on {format(new Date(weightHistory[0]?.date), 'PP')}
                      </p>
                    </div>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
          
          <Card id="measurements-form" className="overflow-hidden shadow-sm hover:shadow-md transition-shadow">
            <CardContent className="p-6">
              <h2 className="text-xl font-semibold mb-4">Update Your Measurements</h2>
              <p className="text-gray-600 mb-6">Enter your current weight and height to keep your BMR calculation accurate.</p>
              
              <form onSubmit={(e) => {
                e.preventDefault();
                const weightInput = (document.getElementById('weight-input') as HTMLInputElement)?.value;
                const heightInput = (document.getElementById('height-input') as HTMLInputElement)?.value;
                
                if (weightInput && heightInput) {
                  handleBMISubmit(
                    parseFloat(weightInput),
                    parseFloat(heightInput)
                  );
                }
              }} className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label htmlFor="weight-input" className="block text-sm font-medium text-gray-700 mb-1">
                      Weight (kg)
                    </label>
                    <input
                      id="weight-input"
                      type="number"
                      defaultValue={settings.weight}
                      step="0.1"
                      min="30"
                      max="250"
                      required
                      className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    />
                  </div>
                  <div>
                    <label htmlFor="height-input" className="block text-sm font-medium text-gray-700 mb-1">
                      Height (cm)
                    </label>
                    <input
                      id="height-input"
                      type="number"
                      defaultValue={settings.height}
                      step="0.1"
                      min="100"
                      max="250"
                      required
                      className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    />
                  </div>
                </div>
                <Button
                  type="submit"
                  className="w-full md:w-auto px-6 py-2 bg-blue-600 text-white font-medium rounded-md hover:bg-blue-700 transition-colors"
                >
                  Save Measurements
                </Button>
              </form>
            </CardContent>
          </Card>
          
          <Dialog open={showGoalDialog} onOpenChange={setShowGoalDialog}>
            <DialogContent className="sm:max-w-md">
              <DialogTitle>Choose Your Fitness Goal</DialogTitle>
              <DialogDescription>
                Select a goal based on what you want to achieve.
              </DialogDescription>
              
              <div className="grid grid-cols-1 gap-4 py-4">
                <div 
                  className="flex items-center justify-between p-4 rounded-lg border border-green-200 bg-green-50 cursor-pointer hover:bg-green-100 transition-colors"
                  onClick={() => handleSetGoal('weight_loss')}
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
                  className="flex items-center justify-between p-4 rounded-lg border border-blue-200 bg-blue-50 cursor-pointer hover:bg-blue-100 transition-colors"
                  onClick={() => handleSetGoal('maintenance')}
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
                  className="flex items-center justify-between p-4 rounded-lg border border-orange-200 bg-orange-50 cursor-pointer hover:bg-orange-100 transition-colors"
                  onClick={() => handleSetGoal('mass_building')}
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
                <Button variant="outline" onClick={() => setShowGoalDialog(false)}>
                  Cancel
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>
      </main>
    </div>
  );
};

export default memo(TrackingPage);
