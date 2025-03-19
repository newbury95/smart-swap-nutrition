
import { useState, useEffect } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { Label } from "@/components/ui/label";

interface BMIFormProps {
  onSubmit: (weight: number, height: number) => void;
  initialWeight?: number;
  initialHeight?: number;
  isSubmitting?: boolean;
}

const BMIForm = ({ onSubmit, initialWeight, initialHeight, isSubmitting = false }: BMIFormProps) => {
  const [weight, setWeight] = useState<string>(initialWeight ? initialWeight.toString() : "");
  const [height, setHeight] = useState<string>(initialHeight ? initialHeight.toString() : "");
  const { toast } = useToast();

  // Only update the form fields when initialWeight/initialHeight props change
  useEffect(() => {
    if (initialWeight && initialWeight > 0) {
      setWeight(initialWeight.toString());
    }
  }, [initialWeight]);

  useEffect(() => {
    if (initialHeight && initialHeight > 0) {
      setHeight(initialHeight.toString());
    }
  }, [initialHeight]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
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

    if (weightNum <= 0 || heightNum <= 0) {
      toast({
        variant: "destructive",
        title: "Invalid measurements",
        description: "Weight and height must be greater than zero",
      });
      return;
    }

    onSubmit(weightNum, heightNum);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="space-y-2">
          <Label htmlFor="weight" className="text-sm font-medium text-gray-700">
            Weight (kg)
          </Label>
          <div className="relative">
            <Input
              id="weight"
              type="number"
              value={weight}
              onChange={(e) => setWeight(e.target.value)}
              placeholder="Enter weight in kg"
              step="0.1"
              min="1"
              className="pl-3 pr-12" 
              required
            />
            <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none text-sm text-gray-500">
              kg
            </div>
          </div>
        </div>
        <div className="space-y-2">
          <Label htmlFor="height" className="text-sm font-medium text-gray-700">
            Height (cm)
          </Label>
          <div className="relative">
            <Input
              id="height"
              type="number"
              value={height}
              onChange={(e) => setHeight(e.target.value)}
              placeholder="Enter height in cm"
              step="0.1"
              min="1"
              className="pl-3 pr-12"
              required
            />
            <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none text-sm text-gray-500">
              cm
            </div>
          </div>
        </div>
      </div>
      <Button 
        type="submit" 
        className="w-full bg-blue-600 hover:bg-blue-700" 
        disabled={isSubmitting}
      >
        {isSubmitting ? "Saving..." : "Save Measurements"}
      </Button>
    </form>
  );
};

export default BMIForm;
