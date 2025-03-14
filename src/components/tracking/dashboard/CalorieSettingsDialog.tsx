import { useState } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { 
  Form, 
  FormControl, 
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
import { 
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { useToast } from "@/hooks/use-toast";
import { 
  NutritionSettings,
  MacroRatio
} from "@/hooks/useUserNutrition";
import { ActivityLevel, FitnessGoal } from "@/utils/nutritionCalculations";

interface CalorieSettingsDialogProps {
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

const CalorieSettingsDialog = ({
  settings,
  isPremium,
  onUpdateSetting,
  onUpdateCustomMacroRatio,
  onClose
}: CalorieSettingsDialogProps) => {
  const [loading, setLoading] = useState(false);
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
        
        // Set default macro ratios based on fitness goal
        if (settings.customMacroRatio) {
          // Keep existing custom ratios
          await onUpdateCustomMacroRatio(settings.customMacroRatio);
        }
      }
      
      toast({
        title: "Settings updated",
        description: "Your calorie targets have been saved successfully.",
      });
      
      // Close dialog
      onClose();
      
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
    <DialogContent className="sm:max-w-[425px]">
      <DialogHeader>
        <DialogTitle>Calorie Target Settings</DialogTitle>
      </DialogHeader>
      
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4 py-4">
          {/* Basic measurements section */}
          <div className="space-y-4">
            <h3 className="text-sm font-semibold">Basic Measurements</h3>
            
            <div className="grid grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="weight"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Weight (kg)</FormLabel>
                    <FormControl>
                      <Input type="number" {...field} />
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
                      <Input type="number" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
          </div>
          
          {/* Premium settings section */}
          <div className={isPremium ? "" : "opacity-60"}>
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-sm font-semibold">Personal Details</h3>
              {!isPremium && (
                <span className="text-xs bg-purple-100 text-purple-800 px-2 py-1 rounded-full">
                  Premium
                </span>
              )}
            </div>
            
            <div className="grid grid-cols-2 gap-4 mb-4">
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
            
            <div className="grid grid-cols-2 gap-4">
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
                          <SelectValue placeholder="Select activity" />
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
                          <SelectValue placeholder="Select goal" />
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
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
          </div>
        </form>
      </Form>
      
      <DialogFooter>
        <Button 
          variant="outline" 
          onClick={onClose}
          disabled={loading}
        >
          Cancel
        </Button>
        <Button 
          type="submit"
          onClick={form.handleSubmit(onSubmit)}
          disabled={loading}
        >
          {loading ? "Saving..." : "Save Changes"}
        </Button>
      </DialogFooter>
    </DialogContent>
  );
};

export default CalorieSettingsDialog;
