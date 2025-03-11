
import { useState } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { motion } from "framer-motion";
import { 
  Weight, 
  Ruler, 
  CalendarClock, 
  UserCircle2, 
  Activity, 
  Target,
  Lock
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { 
  Form, 
  FormControl, 
  FormDescription, 
  FormField, 
  FormItem, 
  FormLabel, 
  FormMessage 
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { 
  NutritionSettings, 
  MacroRatio 
} from "@/hooks/useUserNutrition";
import { 
  ActivityLevel,
  FitnessGoal,
  Gender
} from "@/utils/nutritionCalculations";

interface NutritionSettingsFormProps {
  settings: NutritionSettings;
  isPremium: boolean;
  onUpdateSetting: <K extends keyof NutritionSettings>(key: K, value: NutritionSettings[K]) => Promise<void>;
  onUpdateCustomMacroRatio: (ratio: MacroRatio) => Promise<void>;
}

// Form validation schema
const formSchema = z.object({
  weight: z.coerce.number().positive("Weight must be positive"),
  height: z.coerce.number().positive("Height must be positive"),
  age: z.coerce.number().int().positive("Age must be positive"),
  gender: z.enum(["male", "female", "other"] as const),
  activityLevel: z.enum([
    "sedentary", 
    "light", 
    "moderate", 
    "active", 
    "very_active"
  ] as const),
  fitnessGoal: z.enum([
    "weight_loss", 
    "maintenance", 
    "mass_building"
  ] as const),
  customProtein: z.coerce.number().min(0).max(100),
  customCarbs: z.coerce.number().min(0).max(100),
  customFats: z.coerce.number().min(0).max(100),
});

// Activity level labels
const activityLevelLabels: Record<ActivityLevel, string> = {
  sedentary: "Sedentary (little to no exercise)",
  light: "Light (exercise 1-3 days/week)",
  moderate: "Moderate (exercise 3-5 days/week)",
  active: "Active (exercise 6-7 days/week)",
  very_active: "Very Active (intense exercise daily)"
};

// Fitness goal labels
const fitnessGoalLabels: Record<FitnessGoal, string> = {
  weight_loss: "Weight Loss",
  maintenance: "Maintenance",
  mass_building: "Mass Building"
};

const NutritionSettingsForm = ({
  settings,
  isPremium,
  onUpdateSetting,
  onUpdateCustomMacroRatio
}: NutritionSettingsFormProps) => {
  const [loading, setLoading] = useState(false);
  
  // Set up form with default values
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      weight: settings.weight,
      height: settings.height,
      age: settings.age,
      gender: settings.gender,
      activityLevel: settings.activityLevel,
      fitnessGoal: settings.fitnessGoal,
      customProtein: settings.customMacroRatio?.protein || 30,
      customCarbs: settings.customMacroRatio?.carbs || 40,
      customFats: settings.customMacroRatio?.fats || 30,
    },
  });

  // Handle form submission
  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    setLoading(true);
    
    try {
      // Update basic metrics
      await onUpdateSetting('weight', values.weight);
      await onUpdateSetting('height', values.height);
      
      // Update premium metrics if user is premium
      if (isPremium) {
        await onUpdateSetting('age', values.age);
        await onUpdateSetting('gender', values.gender);
        await onUpdateSetting('activityLevel', values.activityLevel);
        await onUpdateSetting('fitnessGoal', values.fitnessGoal);
        
        // Update custom macro ratios
        const total = values.customProtein + values.customCarbs + values.customFats;
        
        if (Math.abs(total - 100) <= 1) {
          await onUpdateCustomMacroRatio({
            protein: values.customProtein,
            carbs: values.customCarbs,
            fats: values.customFats,
          });
        }
      }
    } catch (error) {
      console.error("Error updating settings:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <Card>
            <CardHeader>
              <CardTitle className="text-xl">Basic Measurements</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {/* Weight input */}
              <FormField
                control={form.control}
                name="weight"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="flex items-center gap-2">
                      <Weight className="w-4 h-4" />
                      Weight (kg)
                    </FormLabel>
                    <FormControl>
                      <Input type="number" step="0.1" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              {/* Height input */}
              <FormField
                control={form.control}
                name="height"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="flex items-center gap-2">
                      <Ruler className="w-4 h-4" />
                      Height (cm)
                    </FormLabel>
                    <FormControl>
                      <Input type="number" step="0.1" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </CardContent>
          </Card>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
        >
          <Card className={!isPremium ? "relative overflow-hidden" : ""}>
            {!isPremium && (
              <div className="absolute inset-0 bg-gray-200/70 backdrop-blur-sm flex items-center justify-center z-10">
                <div className="bg-white p-4 rounded-lg shadow-lg text-center">
                  <Lock className="w-8 h-8 mx-auto text-purple-500 mb-2" />
                  <h3 className="text-lg font-medium">Premium Feature</h3>
                  <p className="text-sm text-gray-500 mb-3">Upgrade to customize these settings</p>
                  <Button variant="default" className="bg-purple-600 hover:bg-purple-700">
                    Upgrade to Premium
                  </Button>
                </div>
              </div>
            )}
            
            <CardHeader>
              <CardTitle className="text-xl">Personal Details</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {/* Age input */}
              <FormField
                control={form.control}
                name="age"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="flex items-center gap-2">
                      <CalendarClock className="w-4 h-4" />
                      Age
                    </FormLabel>
                    <FormControl>
                      <Input type="number" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              {/* Gender selection */}
              <FormField
                control={form.control}
                name="gender"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="flex items-center gap-2">
                      <UserCircle2 className="w-4 h-4" />
                      Gender
                    </FormLabel>
                    <FormControl>
                      <RadioGroup
                        onValueChange={field.onChange}
                        defaultValue={field.value}
                        className="flex space-x-4"
                      >
                        <FormItem className="flex items-center space-x-2 space-y-0">
                          <FormControl>
                            <RadioGroupItem value="male" />
                          </FormControl>
                          <FormLabel className="font-normal cursor-pointer">
                            Male
                          </FormLabel>
                        </FormItem>
                        <FormItem className="flex items-center space-x-2 space-y-0">
                          <FormControl>
                            <RadioGroupItem value="female" />
                          </FormControl>
                          <FormLabel className="font-normal cursor-pointer">
                            Female
                          </FormLabel>
                        </FormItem>
                        <FormItem className="flex items-center space-x-2 space-y-0">
                          <FormControl>
                            <RadioGroupItem value="other" />
                          </FormControl>
                          <FormLabel className="font-normal cursor-pointer">
                            Other
                          </FormLabel>
                        </FormItem>
                      </RadioGroup>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </CardContent>
          </Card>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
        >
          <Card className={!isPremium ? "relative overflow-hidden" : ""}>
            {!isPremium && (
              <div className="absolute inset-0 bg-gray-200/70 backdrop-blur-sm flex items-center justify-center z-10">
                <div className="bg-white p-4 rounded-lg shadow-lg text-center">
                  <Lock className="w-8 h-8 mx-auto text-purple-500 mb-2" />
                  <h3 className="text-lg font-medium">Premium Feature</h3>
                  <p className="text-sm text-gray-500">Upgrade to customize goals and activity levels</p>
                </div>
              </div>
            )}
            
            <CardHeader>
              <CardTitle className="text-xl">Activity & Goals</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {/* Activity level selection */}
              <FormField
                control={form.control}
                name="activityLevel"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="flex items-center gap-2">
                      <Activity className="w-4 h-4" />
                      Activity Level
                    </FormLabel>
                    <Select
                      onValueChange={field.onChange}
                      defaultValue={field.value}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select activity level" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {Object.entries(activityLevelLabels).map(([value, label]) => (
                          <SelectItem key={value} value={value}>
                            {label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              {/* Fitness goal selection */}
              <FormField
                control={form.control}
                name="fitnessGoal"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="flex items-center gap-2">
                      <Target className="w-4 h-4" />
                      Fitness Goal
                    </FormLabel>
                    <Select
                      onValueChange={field.onChange}
                      defaultValue={field.value}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select fitness goal" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {Object.entries(fitnessGoalLabels).map(([value, label]) => (
                          <SelectItem key={value} value={value}>
                            {label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormDescription>
                      This determines your calorie target and macro distribution
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </CardContent>
          </Card>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.3 }}
        >
          <Card className={!isPremium ? "relative overflow-hidden" : ""}>
            {!isPremium && (
              <div className="absolute inset-0 bg-gray-200/70 backdrop-blur-sm flex items-center justify-center z-10">
                <div className="bg-white p-4 rounded-lg shadow-lg text-center">
                  <Lock className="w-8 h-8 mx-auto text-purple-500 mb-2" />
                  <h3 className="text-lg font-medium">Premium Feature</h3>
                  <p className="text-sm text-gray-500">Upgrade to set custom macro ratios</p>
                </div>
              </div>
            )}
            
            <CardHeader>
              <CardTitle className="text-xl">Custom Macro Distribution</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-3 gap-4">
                {/* Protein percentage */}
                <FormField
                  control={form.control}
                  name="customProtein"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Protein (%)</FormLabel>
                      <FormControl>
                        <Input type="number" min="0" max="100" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                {/* Carbs percentage */}
                <FormField
                  control={form.control}
                  name="customCarbs"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Carbs (%)</FormLabel>
                      <FormControl>
                        <Input type="number" min="0" max="100" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                {/* Fats percentage */}
                <FormField
                  control={form.control}
                  name="customFats"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Fats (%)</FormLabel>
                      <FormControl>
                        <Input type="number" min="0" max="100" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
              
              <FormDescription>
                Percentages should add up to 100%. Default ratios are automatically set
                based on your fitness goal.
              </FormDescription>
            </CardContent>
          </Card>
        </motion.div>

        <Button type="submit" className="w-full" disabled={loading}>
          {loading ? "Saving Changes..." : "Save Changes"}
        </Button>
      </form>
    </Form>
  );
};

export default NutritionSettingsForm;
