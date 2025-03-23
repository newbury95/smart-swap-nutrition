
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

export type Gender = "male" | "female" | "other";
export type ActivityLevel = "sedentary" | "light" | "moderate" | "active" | "very_active";
export type WeightGoal = "lose" | "maintain" | "gain";

interface BMRSettingsProps {
  weight: number;
  setWeight: (value: number) => void;
  height: number;
  setHeight: (value: number) => void;
  age: number;
  setAge: (value: number) => void;
  gender: Gender;
  setGender: (value: Gender) => void;
  activityLevel: ActivityLevel;
  setActivityLevel: (value: ActivityLevel) => void;
  weightGoal: WeightGoal;
  setWeightGoal: (value: WeightGoal) => void;
  onSave: () => void;
}

const BMRSettingsTab = ({
  weight,
  setWeight,
  height,
  setHeight,
  age,
  setAge,
  gender,
  setGender,
  activityLevel,
  setActivityLevel,
  weightGoal,
  setWeightGoal,
  onSave
}: BMRSettingsProps) => {
  return (
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
          onClick={onSave}
        >
          Save Settings
        </Button>
      </CardContent>
    </Card>
  );
};

export default BMRSettingsTab;
