
import { useState } from "react";
import { useToast } from "@/hooks/use-toast";
import { FitnessGoal } from "@/utils/nutritionCalculations";
import { supabase } from "@/integrations/supabase/client";

export const useGoalManager = (
  onUpdateGoal: (goal: FitnessGoal) => Promise<void>
) => {
  const { toast } = useToast();
  const [showGoalDialog, setShowGoalDialog] = useState(false);
  const [isUpdating, setIsUpdating] = useState(false);

  const handleSetGoal = async (goal: FitnessGoal) => {
    try {
      // Prevent multiple rapid goal updates that could cause flickering
      if (isUpdating) {
        console.log("Goal update already in progress, ignoring request");
        return;
      }
      
      setIsUpdating(true);
      console.log("Setting fitness goal to:", goal);
      
      // Save the goal to the database
      await onUpdateGoal(goal);
      
      // Store in localStorage as a backup
      localStorage.setItem('fitnessGoal', goal);
      
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
    } finally {
      setIsUpdating(false);
    }
  };
  
  return {
    showGoalDialog,
    setShowGoalDialog,
    handleSetGoal,
    isUpdating
  };
};
