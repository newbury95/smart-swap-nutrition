
import { useState } from "react";
import { useToast } from "@/hooks/use-toast";
import { format } from "date-fns";
import { Gender } from "@/utils/nutritionCalculations";

export const useMeasurementManager = (
  initialWeight: number,
  initialHeight: number,
  initialAge: number,
  initialGender: Gender,
  onUpdateSettings: (weight: number, height: number, age: number, gender: Gender) => Promise<void>,
  addHealthMetric: (metric: any) => Promise<void>
) => {
  const { toast } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showMeasurementsDialog, setShowMeasurementsDialog] = useState(false);

  const handleMeasurementsSubmit = async (weight: number, height: number, age: number, gender: Gender) => {
    setIsSubmitting(true);
    try {
      await onUpdateSettings(weight, height, age, gender);
      
      try {
        // Record the new measurements in health metrics
        await addHealthMetric({
          metric_type: 'weight',
          value: weight.toString(),
          source: 'manual-tracking'
        });
        
        await addHealthMetric({
          metric_type: 'height',
          value: height.toString(),
          source: 'manual-tracking'
        });
        
        await addHealthMetric({
          metric_type: 'age',
          value: age.toString(),
          source: 'manual-tracking'
        });
        
        await addHealthMetric({
          metric_type: 'gender',
          value: gender,
          source: 'manual-tracking'
        });
        
        toast({
          title: "Measurements Updated",
          description: "Your measurements have been updated successfully.",
        });
        
        setShowMeasurementsDialog(false);
      } catch (error) {
        console.error("Error saving health metrics:", error);
        toast({
          variant: "destructive",
          title: "Partial Update",
          description: "Your settings were updated but we couldn't save the measurements history.",
        });
      }
    } catch (error) {
      console.error("Error updating measurements:", error);
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to update measurements. Please try again.",
      });
    } finally {
      setIsSubmitting(false);
    }
  };
  
  return {
    showMeasurementsDialog,
    setShowMeasurementsDialog,
    handleMeasurementsSubmit,
    isSubmitting
  };
};
