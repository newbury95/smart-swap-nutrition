
import { Weight, Ruler, CalendarClock, UserCircle2, Activity, Target } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { FormField, FormControl, FormItem, FormLabel, FormMessage, FormDescription } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Lock } from "lucide-react";
import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";

// Types
import { ActivityLevel, FitnessGoal } from "@/utils/nutritionCalculations";
import { Control } from "react-hook-form";

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

interface FormSectionProps {
  isPremium: boolean;
}

interface ControlledFormSectionProps extends FormSectionProps {
  control: Control<any>;
}

// Premium feature overlay component
export const PremiumFeatureOverlay = () => (
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
);

// Basic Measurements Section
export const BasicMeasurementsSection = ({ control }: ControlledFormSectionProps) => (
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
          control={control}
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
          control={control}
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
);

// Personal Details Section
export const PersonalDetailsSection = ({ control, isPremium }: ControlledFormSectionProps) => (
  <motion.div
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ duration: 0.5, delay: 0.1 }}
  >
    <Card className={!isPremium ? "relative overflow-hidden" : ""}>
      {!isPremium && <PremiumFeatureOverlay />}
      
      <CardHeader>
        <CardTitle className="text-xl">Personal Details</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Age input */}
        <FormField
          control={control}
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
          control={control}
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
);

// Activity & Goals Section
export const ActivityGoalsSection = ({ control, isPremium }: ControlledFormSectionProps) => (
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
          control={control}
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
          control={control}
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
);

// Custom Macro Distribution Section
export const MacroDistributionSection = ({ control, isPremium }: ControlledFormSectionProps) => (
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
            control={control}
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
            control={control}
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
            control={control}
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
);
