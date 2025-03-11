
import { useState } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import { Form } from "@/components/ui/form";
import { 
  NutritionSettings,
  MacroRatio
} from "@/hooks/useUserNutrition";
import {
  BasicMeasurementsSection,
  PersonalDetailsSection,
  ActivityGoalsSection,
  MacroDistributionSection
} from "./FormSections";

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
        {/* Basic Measurements Section */}
        <BasicMeasurementsSection control={form.control} isPremium={isPremium} />
        
        {/* Personal Details Section */}
        <PersonalDetailsSection control={form.control} isPremium={isPremium} />
        
        {/* Activity & Goals Section */}
        <ActivityGoalsSection control={form.control} isPremium={isPremium} />
        
        {/* Custom Macro Distribution Section */}
        <MacroDistributionSection control={form.control} isPremium={isPremium} />

        <Button type="submit" className="w-full" disabled={loading}>
          {loading ? "Saving Changes..." : "Save Changes"}
        </Button>
      </form>
    </Form>
  );
};

export default NutritionSettingsForm;
