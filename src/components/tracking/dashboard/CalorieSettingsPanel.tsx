
import { useState } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import { 
  Form, 
  FormControl, 
  FormDescription, 
  FormField, 
  FormItem, 
  FormLabel, 
  FormMessage 
} from "@/components/ui/form";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { CheckCircle, Save, X } from "lucide-react";
import { 
  NutritionSettings,
  MacroRatio
} from "@/hooks/useUserNutrition";
import { ActivityLevel, FitnessGoal, Gender } from "@/utils/nutritionCalculations";
import { useToast } from "@/hooks/use-toast";

interface CalorieSettingsPanelProps {
  settings: NutritionSettings;
  isPremium: boolean;
  onUpdateSetting: <K extends keyof NutritionSettings>(key: K, value: NutritionSettings[K]) => Promise<void>;
  onUpdateCustomMacroRatio: (ratio: MacroRatio) => Promise<void>;
  onClose: () => void;
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
  customMacros: z.boolean().default(false),
  customProtein: z.coerce.number().min(0).max(100).default(30),
  customCarbs: z.coerce.number().min(0).max(100).default(40),
  customFats: z.coerce.number().min(0).max(100).default(30),
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

const CalorieSettingsPanel = ({
  settings,
  isPremium,
  onUpdateSetting,
  onUpdateCustomMacroRatio,
  onClose
}: CalorieSettingsPanelProps) => {
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const { toast } = useToast();
  
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
      customMacros: !!settings.customMacroRatio,
      customProtein: settings.customMacroRatio?.protein || 30,
      customCarbs: settings.customMacroRatio?.carbs || 40,
      customFats: settings.customMacroRatio?.fats || 30,
    },
  });

  // Handle form submission
  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    setLoading(true);
    setSuccess(false);
    
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
        
        // Update custom macro ratios if enabled
        if (values.customMacros) {
          const total = values.customProtein + values.customCarbs + values.customFats;
          
          if (Math.abs(total - 100) <= 1) {
            await onUpdateCustomMacroRatio({
              protein: values.customProtein,
              carbs: values.customCarbs,
              fats: values.customFats,
            });
          } else {
            toast({
              title: "Macro ratios must add up to 100%",
              description: `Current total: ${total}%`,
              variant: "destructive"
            });
            setLoading(false);
            return;
          }
        } else if (settings.customMacroRatio) {
          // If custom macros were disabled, remove them
          await onUpdateSetting('customMacroRatio', undefined);
        }
      }
      
      setSuccess(true);
      toast({
        title: "Settings updated",
        description: "Your nutrition settings have been saved successfully.",
      });

      // Close panel after a moment
      setTimeout(() => {
        onClose();
      }, 1500);
      
    } catch (error) {
      console.error("Error updating settings:", error);
      toast({
        title: "Failed to update settings",
        description: "Please try again later.",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card className="w-full">
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle>Calorie & Nutrition Settings</CardTitle>
        <Button variant="ghost" size="icon" onClick={onClose}>
          <X className="h-4 w-4" />
        </Button>
      </CardHeader>
      <CardContent>
        {success && (
          <Alert className="mb-4 bg-green-50 border-green-200">
            <CheckCircle className="h-4 w-4 text-green-600" />
            <AlertDescription className="text-green-600">
              Settings saved successfully! Your calorie targets will update based on these settings.
            </AlertDescription>
          </Alert>
        )}
        
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Basic measurements */}
              <div className="space-y-4">
                <h3 className="text-sm font-semibold">Basic Measurements</h3>
                
                <FormField
                  control={form.control}
                  name="weight"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Weight (kg)</FormLabel>
                      <FormControl>
                        <Input type="number" step="0.1" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={form.control}
                  name="height"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Height (cm)</FormLabel>
                      <FormControl>
                        <Input type="number" step="0.1" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
              
              {/* Personal details */}
              <div className={`space-y-4 ${!isPremium ? "opacity-60" : ""}`}>
                <div className="flex items-center justify-between">
                  <h3 className="text-sm font-semibold">Personal Details</h3>
                  {!isPremium && (
                    <span className="text-xs bg-purple-100 text-purple-800 px-2 py-1 rounded-full">
                      Premium
                    </span>
                  )}
                </div>
                
                <FormField
                  control={form.control}
                  name="age"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Age</FormLabel>
                      <FormControl>
                        <Input type="number" {...field} disabled={!isPremium} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={form.control}
                  name="gender"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Gender</FormLabel>
                      <Select 
                        onValueChange={field.onChange} 
                        defaultValue={field.value}
                        disabled={!isPremium}
                      >
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select gender" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="male">Male</SelectItem>
                          <SelectItem value="female">Female</SelectItem>
                          <SelectItem value="other">Other</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
            </div>
            
            {/* Activity & Goals */}
            <div className={`space-y-4 ${!isPremium ? "opacity-60" : ""}`}>
              <div className="flex items-center justify-between">
                <h3 className="text-sm font-semibold">Activity & Goals</h3>
                {!isPremium && (
                  <span className="text-xs bg-purple-100 text-purple-800 px-2 py-1 rounded-full">
                    Premium
                  </span>
                )}
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="activityLevel"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Activity Level</FormLabel>
                      <Select 
                        onValueChange={field.onChange} 
                        defaultValue={field.value}
                        disabled={!isPremium}
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
                
                <FormField
                  control={form.control}
                  name="fitnessGoal"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Fitness Goal</FormLabel>
                      <Select 
                        onValueChange={field.onChange} 
                        defaultValue={field.value}
                        disabled={!isPremium}
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
                      <FormDescription className="text-xs">
                        This determines your calorie target and macro distribution
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
            </div>
            
            {/* Custom Macro Distribution */}
            <div className={`space-y-4 ${!isPremium ? "opacity-60" : ""}`}>
              <div className="flex items-center justify-between">
                <h3 className="text-sm font-semibold">Custom Macro Distribution</h3>
                {!isPremium && (
                  <span className="text-xs bg-purple-100 text-purple-800 px-2 py-1 rounded-full">
                    Premium
                  </span>
                )}
              </div>
              
              <FormField
                control={form.control}
                name="customMacros"
                render={({ field }) => (
                  <FormItem className="flex flex-row items-start space-x-3 space-y-0 pb-2">
                    <FormControl>
                      <Checkbox
                        checked={field.value}
                        onCheckedChange={field.onChange}
                        disabled={!isPremium}
                      />
                    </FormControl>
                    <div className="space-y-1 leading-none">
                      <FormLabel>Use custom macro ratios</FormLabel>
                      <FormDescription className="text-xs">
                        Override the default macro distribution based on your fitness goal
                      </FormDescription>
                    </div>
                  </FormItem>
                )}
              />
              
              {form.watch("customMacros") && (
                <div className="grid grid-cols-3 gap-4">
                  <FormField
                    control={form.control}
                    name="customProtein"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Protein (%)</FormLabel>
                        <FormControl>
                          <Input 
                            type="number" 
                            min="0" 
                            max="100" 
                            {...field} 
                            disabled={!isPremium}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <FormField
                    control={form.control}
                    name="customCarbs"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Carbs (%)</FormLabel>
                        <FormControl>
                          <Input 
                            type="number" 
                            min="0" 
                            max="100" 
                            {...field} 
                            disabled={!isPremium}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <FormField
                    control={form.control}
                    name="customFats"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Fats (%)</FormLabel>
                        <FormControl>
                          <Input 
                            type="number" 
                            min="0" 
                            max="100" 
                            {...field} 
                            disabled={!isPremium}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
              )}
              
              <div className="text-xs text-muted-foreground">
                Total: {form.watch("customMacros") ? 
                  (form.watch("customProtein") + form.watch("customCarbs") + form.watch("customFats"))
                  : 100}%
                {form.watch("customMacros") && 
                  Math.abs((form.watch("customProtein") + form.watch("customCarbs") + form.watch("customFats")) - 100) > 1 && 
                  <span className="text-red-500 ml-2">
                    (Must equal 100%)
                  </span>
                }
              </div>
            </div>
            
            <Button 
              type="submit" 
              className="w-full flex items-center gap-2" 
              disabled={loading}
            >
              {loading ? "Saving..." : "Save Settings"}
              <Save className="w-4 h-4" />
            </Button>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
};

export default CalorieSettingsPanel;
