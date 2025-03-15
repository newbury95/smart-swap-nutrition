
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
  
  const handleSaveSettings = () => {
    toast({
      title: "Settings Saved",
      description: "Your BMR and calorie targets have been updated",
    });
  };

  return (
    <div className="min-h-screen bg-gray-50 pb-32">
      <main className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          <Card className="bg-white rounded-xl p-8 shadow-sm mb-6">
            <CardHeader className="px-0 pt-0">
              <CardTitle className="text-2xl font-semibold">Activity Tracking</CardTitle>
              <CardDescription>Track your daily activities and manage your calorie targets</CardDescription>
            </CardHeader>
            
            <CardContent className="px-0 pb-0">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                <div className="p-4 bg-green-50 rounded-lg flex flex-col items-center justify-center">
                  <h2 className="text-lg font-medium mb-1">Current BMR</h2>
                  <p className="text-2xl font-bold text-green-600">{bmr} kcal</p>
                  <p className="text-sm text-gray-500 mt-1">Base Metabolic Rate</p>
                </div>
                
                <div className="p-4 bg-blue-50 rounded-lg flex flex-col items-center justify-center">
                  <h2 className="text-lg font-medium mb-1">Daily TDEE</h2>
                  <p className="text-2xl font-bold text-blue-600">{tdee} kcal</p>
                  <p className="text-sm text-gray-500 mt-1">Total Daily Energy</p>
                </div>
                
                <div className="p-4 bg-purple-50 rounded-lg flex flex-col items-center justify-center">
                  <h2 className="text-lg font-medium mb-1">Calorie Target</h2>
                  <p className="text-2xl font-bold text-purple-600">{calorieTarget} kcal</p>
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
                  <h3 className="text-xl font-medium mb-2">Today's Steps</h3>
                  <p className="text-3xl font-bold text-green-600 mb-4">{steps}</p>
                  <Button onClick={handleUpdateSteps}>Log Steps</Button>
                </div>
                
                <div className="p-6 bg-white border rounded-lg">
                  <h3 className="text-xl font-medium mb-2">Exercise Minutes</h3>
                  <p className="text-3xl font-bold text-green-600 mb-4">{exercise} min</p>
                  <Button onClick={handleUpdateExercise}>Log Exercise</Button>
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
                      />
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="height">Height (cm)</Label>
                      <Input
                        id="height"
                        type="number"
                        value={height}
                        onChange={(e) => setHeight(Number(e.target.value))}
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
                      />
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="gender">Gender</Label>
                      <Select value={gender} onValueChange={(value: Gender) => setGender(value)}>
                        <SelectTrigger id="gender">
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
                        <SelectTrigger id="activity">
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
                        <SelectTrigger id="goal">
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
                  
                  <Button className="w-full" onClick={handleSaveSettings}>
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
