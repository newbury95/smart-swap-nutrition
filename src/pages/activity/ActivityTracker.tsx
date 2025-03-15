
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger,
  SelectValue 
} from "@/components/ui/select";
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardHeader, 
  CardTitle 
} from "@/components/ui/card";
import { Dialog, DialogContent, DialogTitle, DialogDescription, DialogFooter, DialogTrigger } from "@/components/ui/dialog";
import { Activity, Calculator, Target, Dumbbell } from "lucide-react";

type Gender = "male" | "female" | "other";
type ActivityLevel = "sedentary" | "light" | "moderate" | "active" | "very_active";
type WeightGoal = "lose" | "maintain" | "gain";

const ActivityTracker = () => {
  const { toast } = useToast();
  const [steps, setSteps] = useState(0);
  const [exercise, setExercise] = useState(0);
  
  // User metrics for BMR calculation
  const [weight, setWeight] = useState(70); // in kg
  const [height, setHeight] = useState(170); // in cm
  const [age, setAge] = useState(30);
  const [gender, setGender] = useState<Gender>("male");
  const [activityLevel, setActivityLevel] = useState<ActivityLevel>("moderate");
  const [weightGoal, setWeightGoal] = useState<WeightGoal>("maintain");
  
  // Calculated values
  const [bmr, setBmr] = useState(0);
  const [tdee, setTdee] = useState(0);
  const [calorieTarget, setCalorieTarget] = useState(0);
  
  // Dialog state
  const [showDialog, setShowDialog] = useState(false);
  
  // Calculate BMR, TDEE and calorie target when inputs change
  useEffect(() => {
    // Mifflin-St Jeor Equation for BMR
    let calculatedBmr = 10 * weight + 6.25 * height - 5 * age;
    if (gender === "male") {
      calculatedBmr += 5;
    } else if (gender === "female") {
      calculatedBmr -= 161;
    } else {
      // Average for non-binary
      calculatedBmr -= 78;
    }
    
    // Activity multipliers
    const activityMultipliers = {
      sedentary: 1.2,
      light: 1.375,
      moderate: 1.55,
      active: 1.725,
      very_active: 1.9
    };
    
    // Calculate TDEE
    const calculatedTdee = calculatedBmr * activityMultipliers[activityLevel];
    
    // Calculate calorie target based on weight goal
    let calculatedCalorieTarget = calculatedTdee;
    if (weightGoal === "lose") {
      calculatedCalorieTarget = calculatedTdee * 0.8; // 20% deficit
    } else if (weightGoal === "gain") {
      calculatedCalorieTarget = calculatedTdee * 1.15; // 15% surplus
    }
    
    // Update state with calculated values
    setBmr(Math.round(calculatedBmr));
    setTdee(Math.round(calculatedTdee));
    setCalorieTarget(Math.round(calculatedCalorieTarget));
  }, [weight, height, age, gender, activityLevel, weightGoal]);

  const handleUpdateSteps = () => {
    setSteps(prev => prev + 1000);
    toast({
      title: "Activity Logged",
      description: "Your steps have been recorded for the day",
    });
  };

  const handleUpdateExercise = () => {
    setExercise(prev => prev + 30);
    toast({
      title: "Exercise Logged",
      description: "Your exercise minutes have been recorded for the day",
    });
  };
  
  const handleAcceptRecommended = () => {
    toast({
      title: "Recommended Calorie Target Applied",
      description: `Your daily target has been set to ${calorieTarget} calories`,
    });
    setShowDialog(false);
  };
  
  const handleSaveCustom = () => {
    toast({
      title: "Custom Settings Saved",
      description: "Your custom BMR and calorie targets have been updated",
    });
    setShowDialog(false);
  };

  return (
    <div className="min-h-screen bg-gray-50 pb-32">
      <main className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          <Card className="bg-white rounded-xl p-8 shadow-sm mb-6">
            <CardHeader className="px-0 pt-0">
              <div className="flex justify-between items-center">
                <div>
                  <CardTitle className="text-2xl font-semibold">Activity Tracking</CardTitle>
                  <CardDescription>Track your daily activities and manage your calorie targets</CardDescription>
                </div>
                
                <Dialog open={showDialog} onOpenChange={setShowDialog}>
                  <DialogTrigger asChild>
                    <Button variant="outline" className="gap-2">
                      <Calculator className="h-4 w-4" />
                      <span>Calculate Targets</span>
                    </Button>
                  </DialogTrigger>
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
                        onClick={() => setShowDialog(false)}
                      >
                        Adjust Settings
                      </Button>
                      <Button 
                        onClick={handleAcceptRecommended}
                        className="bg-purple-600 hover:bg-purple-700"
                      >
                        Accept Recommended
                      </Button>
                    </DialogFooter>
                  </DialogContent>
                </Dialog>
              </div>
            </CardHeader>
            
            <CardContent className="px-0 pb-0">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                <div className="p-4 bg-purple-50 rounded-lg flex flex-col items-center justify-center">
                  <div className="bg-purple-100 p-2 rounded-full mb-2">
                    <Calculator className="h-5 w-5 text-purple-600" />
                  </div>
                  <h2 className="text-lg font-medium mb-1">Current BMR</h2>
                  <p className="text-2xl font-bold text-purple-600">{bmr} kcal</p>
                  <p className="text-sm text-gray-500 mt-1">Base Metabolic Rate</p>
                </div>
                
                <div className="p-4 bg-blue-50 rounded-lg flex flex-col items-center justify-center">
                  <div className="bg-blue-100 p-2 rounded-full mb-2">
                    <Activity className="h-5 w-5 text-blue-600" />
                  </div>
                  <h2 className="text-lg font-medium mb-1">Daily TDEE</h2>
                  <p className="text-2xl font-bold text-blue-600">{tdee} kcal</p>
                  <p className="text-sm text-gray-500 mt-1">Total Daily Energy</p>
                </div>
                
                <div className="p-4 bg-green-50 rounded-lg flex flex-col items-center justify-center">
                  <div className="bg-green-100 p-2 rounded-full mb-2">
                    <Target className="h-5 w-5 text-green-600" />
                  </div>
                  <h2 className="text-lg font-medium mb-1">Calorie Target</h2>
                  <p className="text-2xl font-bold text-green-600">{calorieTarget} kcal</p>
                  <p className="text-sm text-gray-500 mt-1">Based on your goal</p>
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Tabs defaultValue="activity" className="space-y-4">
            <TabsList>
              <TabsTrigger value="activity">Daily Activity</TabsTrigger>
              <TabsTrigger value="settings">BMR Settings</TabsTrigger>
            </TabsList>

            <TabsContent value="activity" className="space-y-4">
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
                    onClick={handleUpdateSteps}
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
                    onClick={handleUpdateExercise}
                    className="w-full bg-green-600 hover:bg-green-700"
                  >
                    Log Exercise
                  </Button>
                </div>
              </div>
            </TabsContent>

            <TabsContent value="settings" className="space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle>BMR & Calorie Settings</CardTitle>
                  <CardDescription>
                    Update your personal metrics to calculate your BMR and calorie targets
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="weight">Weight (kg)</Label>
                      <Input
                        id="weight"
                        type="number"
                        value={weight}
                        onChange={(e) => setWeight(Number(e.target.value))}
                        className="focus-visible:ring-purple-500"
                      />
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="height">Height (cm)</Label>
                      <Input
                        id="height"
                        type="number"
                        value={height}
                        onChange={(e) => setHeight(Number(e.target.value))}
                        className="focus-visible:ring-purple-500"
                      />
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="age">Age</Label>
                      <Input
                        id="age"
                        type="number"
                        value={age}
                        onChange={(e) => setAge(Number(e.target.value))}
                        className="focus-visible:ring-purple-500"
                      />
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="gender">Gender</Label>
                      <Select value={gender} onValueChange={(value: Gender) => setGender(value)}>
                        <SelectTrigger id="gender" className="focus-visible:ring-purple-500">
                          <SelectValue placeholder="Select gender" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="male">Male</SelectItem>
                          <SelectItem value="female">Female</SelectItem>
                          <SelectItem value="other">Other</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="activity">Activity Level</Label>
                      <Select value={activityLevel} onValueChange={(value: ActivityLevel) => setActivityLevel(value)}>
                        <SelectTrigger id="activity" className="focus-visible:ring-purple-500">
                          <SelectValue placeholder="Select activity level" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="sedentary">Sedentary (little or no exercise)</SelectItem>
                          <SelectItem value="light">Light (exercise 1-3 days/week)</SelectItem>
                          <SelectItem value="moderate">Moderate (exercise 3-5 days/week)</SelectItem>
                          <SelectItem value="active">Active (exercise 6-7 days/week)</SelectItem>
                          <SelectItem value="very_active">Very Active (intense exercise daily)</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="goal">Weight Goal</Label>
                      <Select value={weightGoal} onValueChange={(value: WeightGoal) => setWeightGoal(value)}>
                        <SelectTrigger id="goal" className="focus-visible:ring-purple-500">
                          <SelectValue placeholder="Select weight goal" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="lose">Lose Weight (20% calorie deficit)</SelectItem>
                          <SelectItem value="maintain">Maintain Weight</SelectItem>
                          <SelectItem value="gain">Gain Weight (15% calorie surplus)</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                  
                  <Button 
                    className="w-full bg-purple-600 hover:bg-purple-700 mt-4" 
                    onClick={handleSaveCustom}
                  >
                    Save Settings
                  </Button>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </main>
    </div>
  );
};

export default ActivityTracker;
