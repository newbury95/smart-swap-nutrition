
import React, { useState } from "react";
import { motion } from "framer-motion";
import { Activity, Flame, ArrowDown, ArrowUp, Minus, Calculator, Info } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog";
import { Card, CardContent } from "@/components/ui/card";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Input } from "@/components/ui/input";
import { useToast } from "@/hooks/use-toast";

interface HealthMetricsProps {
  bmr: number;
  currentCalories: number;
  isPremium: boolean;
  onUpdateCalories: (calories: number) => Promise<void>;
}

export const HealthMetrics: React.FC<HealthMetricsProps> = ({
  bmr,
  currentCalories,
  isPremium,
  onUpdateCalories
}) => {
  const { toast } = useToast();
  const [showGoalDialog, setShowGoalDialog] = useState(false);
  const [showCustomDialog, setShowCustomDialog] = useState(false);
  const [customCalories, setCustomCalories] = useState(currentCalories || bmr);
  
  // Calculate goal-based calories
  const weightLossCalories = Math.round(bmr * 0.8); // 20% deficit
  const maintenanceCalories = Math.round(bmr);
  const weightGainCalories = Math.round(bmr * 1.15); // 15% surplus
  
  const handleSelectGoal = async (calories: number) => {
    try {
      await onUpdateCalories(calories);
      setShowGoalDialog(false);
      toast({
        title: "Calorie goal updated",
        description: `Your daily target is now ${calories} calories`,
      });
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Failed to update goal",
        description: "There was an error updating your calorie goal"
      });
    }
  };
  
  const handleCustomCalories = async () => {
    if (customCalories < 1000) {
      toast({
        variant: "destructive",
        title: "Invalid calorie amount",
        description: "Please enter at least 1000 calories for safety"
      });
      return;
    }
    
    if (customCalories > 5000) {
      toast({
        variant: "destructive",
        title: "Invalid calorie amount",
        description: "Please enter a value below 5000 calories"
      });
      return;
    }
    
    try {
      await onUpdateCalories(customCalories);
      setShowCustomDialog(false);
      setShowGoalDialog(false);
      toast({
        title: "Custom calories set",
        description: `Your daily target is now ${customCalories} calories`,
      });
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Failed to update goal",
        description: "There was an error updating your calorie goal"
      });
    }
  };

  return (
    <>
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6"
      >
        {/* BMR Card */}
        <Card className="overflow-hidden shadow-sm hover:shadow-md transition-shadow">
          <CardContent className="p-0">
            <div className="relative w-full bg-gradient-to-br from-blue-50 to-blue-100 p-6">
              <div className="absolute -right-5 -top-5 w-24 h-24 bg-white/20 rounded-full backdrop-blur-sm" />
              
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-lg font-semibold text-blue-800">Basal Metabolic Rate</h3>
                  <p className="text-3xl font-bold mt-2 text-blue-900">{bmr.toLocaleString()} kcal</p>
                </div>
                <div className="relative z-10">
                  <div className="bg-white p-3 rounded-full">
                    <Flame className="w-10 h-10 text-blue-600" />
                  </div>
                </div>
              </div>
              
              <div className="mt-4 text-sm text-blue-800">
                <span className="flex items-center">
                  Your BMR is the number of calories your body needs at rest
                  <Popover>
                    <PopoverTrigger>
                      <Info className="h-3.5 w-3.5 ml-1 text-blue-400 cursor-help" />
                    </PopoverTrigger>
                    <PopoverContent className="w-80 text-xs p-3">
                      <p>Your Basal Metabolic Rate (BMR) is the number of calories your body needs at complete rest to maintain basic functions like breathing and circulation.</p>
                    </PopoverContent>
                  </Popover>
                </span>
              </div>
            </div>
          </CardContent>
        </Card>
        
        {/* Current Calorie Goal Card */}
        <Card className="overflow-hidden shadow-sm hover:shadow-md transition-shadow">
          <CardContent className="p-0">
            <div className="relative w-full bg-gradient-to-br from-purple-50 to-purple-100 p-6">
              <div className="absolute -right-5 -top-5 w-24 h-24 bg-white/20 rounded-full backdrop-blur-sm" />
              
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-lg font-semibold text-purple-800">Current Goal</h3>
                  <p className="text-3xl font-bold mt-2 text-purple-900">{currentCalories.toLocaleString()} kcal</p>
                </div>
                <div className="relative z-10">
                  <div className="bg-white p-3 rounded-full">
                    <Activity className="w-10 h-10 text-purple-600" />
                  </div>
                </div>
              </div>
              
              <div className="mt-4">
                <Button 
                  onClick={() => setShowGoalDialog(true)} 
                  className="w-full bg-purple-600 hover:bg-purple-700 text-white"
                >
                  Update Calorie Goal
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
        
        {/* Weight Loss Estimate */}
        <Card className="overflow-hidden shadow-sm hover:shadow-md transition-shadow">
          <CardContent className="p-0">
            <div className="relative w-full bg-gradient-to-br from-green-50 to-green-100 p-6">
              <div className="absolute -right-5 -top-5 w-24 h-24 bg-white/20 rounded-full backdrop-blur-sm" />
              
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-lg font-semibold text-green-800">Weight Loss</h3>
                  <p className="text-3xl font-bold mt-2 text-green-900">{weightLossCalories.toLocaleString()} kcal</p>
                </div>
                <div className="relative z-10">
                  <div className="bg-white p-3 rounded-full">
                    <ArrowDown className="w-10 h-10 text-green-600" />
                  </div>
                </div>
              </div>
              
              <div className="mt-4">
                <Button 
                  onClick={() => handleSelectGoal(weightLossCalories)} 
                  className="w-full bg-green-600 hover:bg-green-700 text-white"
                >
                  Set as Goal
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
        
        {/* Weight Gain Estimate */}
        <Card className="overflow-hidden shadow-sm hover:shadow-md transition-shadow">
          <CardContent className="p-0">
            <div className="relative w-full bg-gradient-to-br from-orange-50 to-orange-100 p-6">
              <div className="absolute -right-5 -top-5 w-24 h-24 bg-white/20 rounded-full backdrop-blur-sm" />
              
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-lg font-semibold text-orange-800">Weight Gain</h3>
                  <p className="text-3xl font-bold mt-2 text-orange-900">{weightGainCalories.toLocaleString()} kcal</p>
                </div>
                <div className="relative z-10">
                  <div className="bg-white p-3 rounded-full">
                    <ArrowUp className="w-10 h-10 text-orange-600" />
                  </div>
                </div>
              </div>
              
              <div className="mt-4">
                <Button 
                  onClick={() => handleSelectGoal(weightGainCalories)} 
                  className="w-full bg-orange-600 hover:bg-orange-700 text-white"
                >
                  Set as Goal
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      </motion.div>
      
      {/* Calorie Goal Selection Dialog */}
      <Dialog open={showGoalDialog} onOpenChange={setShowGoalDialog}>
        <DialogContent className="sm:max-w-md">
          <DialogTitle>Choose Your Calorie Goal</DialogTitle>
          <DialogDescription>
            Select a preset goal based on your needs or enter a custom value.
          </DialogDescription>
          
          <div className="grid grid-cols-1 gap-4 py-4">
            <div 
              className="flex items-center justify-between p-4 rounded-lg border border-green-200 bg-green-50 cursor-pointer hover:bg-green-100 transition-colors"
              onClick={() => handleSelectGoal(weightLossCalories)}
            >
              <div className="flex items-center">
                <div className="p-2 bg-green-100 rounded-full mr-3">
                  <ArrowDown className="h-5 w-5 text-green-600" />
                </div>
                <div>
                  <h4 className="font-medium">Weight Loss</h4>
                  <p className="text-sm text-gray-500">20% calorie deficit</p>
                </div>
              </div>
              <p className="text-lg font-semibold text-green-800">{weightLossCalories} kcal</p>
            </div>
            
            <div 
              className="flex items-center justify-between p-4 rounded-lg border border-blue-200 bg-blue-50 cursor-pointer hover:bg-blue-100 transition-colors"
              onClick={() => handleSelectGoal(maintenanceCalories)}
            >
              <div className="flex items-center">
                <div className="p-2 bg-blue-100 rounded-full mr-3">
                  <Minus className="h-5 w-5 text-blue-600" />
                </div>
                <div>
                  <h4 className="font-medium">Maintenance</h4>
                  <p className="text-sm text-gray-500">Maintain current weight</p>
                </div>
              </div>
              <p className="text-lg font-semibold text-blue-800">{maintenanceCalories} kcal</p>
            </div>
            
            <div 
              className="flex items-center justify-between p-4 rounded-lg border border-orange-200 bg-orange-50 cursor-pointer hover:bg-orange-100 transition-colors"
              onClick={() => handleSelectGoal(weightGainCalories)}
            >
              <div className="flex items-center">
                <div className="p-2 bg-orange-100 rounded-full mr-3">
                  <ArrowUp className="h-5 w-5 text-orange-600" />
                </div>
                <div>
                  <h4 className="font-medium">Weight Gain</h4>
                  <p className="text-sm text-gray-500">15% calorie surplus</p>
                </div>
              </div>
              <p className="text-lg font-semibold text-orange-800">{weightGainCalories} kcal</p>
            </div>
            
            <div 
              className="flex items-center justify-between p-4 rounded-lg border border-purple-200 bg-purple-50 cursor-pointer hover:bg-purple-100 transition-colors"
              onClick={() => setShowCustomDialog(true)}
            >
              <div className="flex items-center">
                <div className="p-2 bg-purple-100 rounded-full mr-3">
                  <Calculator className="h-5 w-5 text-purple-600" />
                </div>
                <div>
                  <h4 className="font-medium">Custom Goal</h4>
                  <p className="text-sm text-gray-500">Set your own calorie target</p>
                </div>
              </div>
              <p className="text-lg font-semibold text-purple-800">Custom</p>
            </div>
          </div>
          
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowGoalDialog(false)}>
              Cancel
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
      
      {/* Custom Calorie Dialog */}
      <Dialog open={showCustomDialog} onOpenChange={setShowCustomDialog}>
        <DialogContent className="sm:max-w-md">
          <DialogTitle>Set Custom Calorie Goal</DialogTitle>
          <DialogDescription>
            Enter your desired daily calorie intake.
          </DialogDescription>
          
          <div className="flex flex-col gap-4 py-4">
            <Input
              type="number"
              value={customCalories}
              onChange={(e) => setCustomCalories(parseInt(e.target.value) || 0)}
              className="text-lg"
              min="1000"
              max="5000"
            />
            
            <p className="text-xs text-gray-500">
              For safety reasons, we recommend a minimum of 1000 calories per day.
              Please consult with a healthcare professional before making significant
              changes to your diet.
            </p>
          </div>
          
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowCustomDialog(false)}>
              Cancel
            </Button>
            <Button onClick={handleCustomCalories}>
              Set Custom Goal
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
};
