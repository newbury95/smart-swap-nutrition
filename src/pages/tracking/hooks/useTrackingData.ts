
import { useState } from "react";
import { format } from "date-fns";
import { useToast } from "@/components/ui/use-toast";

export type TimeRange = "daily" | "weekly" | "monthly" | "yearly";

export type TrackingData = {
  date: string;
  weight: number;
  height: number;
  bmi: number;
};

export const calculateBMI = (weight: number, height: number) => {
  const heightInMeters = height / 100;
  return Number((weight / (heightInMeters * heightInMeters)).toFixed(1));
};

export const getBMICategory = (bmi: number) => {
  if (bmi < 18.5) return "Underweight";
  if (bmi < 25) return "Normal weight";
  if (bmi < 30) return "Overweight";
  return "Obese";
};

export const useTrackingData = () => {
  const { toast } = useToast();
  const [timeRange, setTimeRange] = useState<TimeRange>("daily");
  const [weight, setWeight] = useState<string>("");
  const [height, setHeight] = useState<string>("");
  const [trackingData, setTrackingData] = useState<TrackingData[]>([]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log('Submitting new measurements:', { weight, height });
    const weightNum = parseFloat(weight);
    const heightNum = parseFloat(height);

    if (isNaN(weightNum) || isNaN(heightNum)) {
      toast({
        variant: "destructive",
        title: "Invalid input",
        description: "Please enter valid numbers for weight and height",
      });
      return;
    }

    const bmi = calculateBMI(weightNum, heightNum);
    const newEntry: TrackingData = {
      date: format(new Date(), "yyyy-MM-dd"),
      weight: weightNum,
      height: heightNum,
      bmi,
    };

    setTrackingData([...trackingData, newEntry]);
    setWeight("");
    setHeight("");

    toast({
      title: "Measurements updated",
      description: `Your BMI is ${bmi}`,
    });
  };

  return {
    timeRange,
    setTimeRange,
    weight,
    setWeight,
    height,
    setHeight,
    trackingData,
    handleSubmit,
  };
};
