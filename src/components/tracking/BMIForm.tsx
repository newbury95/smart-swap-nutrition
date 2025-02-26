
import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";

interface BMIFormProps {
  onSubmit: (weight: number, height: number) => void;
}

const BMIForm = ({ onSubmit }: BMIFormProps) => {
  const [weight, setWeight] = useState<string>("");
  const [height, setHeight] = useState<string>("");
  const { toast } = useToast();

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

    onSubmit(weightNum, heightNum);
    setWeight("");
    setHeight("");
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Weight (kg)
        </label>
        <Input
          type="number"
          value={weight}
          onChange={(e) => setWeight(e.target.value)}
          placeholder="Enter weight in kg"
          step="0.1"
          required
        />
      </div>
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Height (cm)
        </label>
        <Input
          type="number"
          value={height}
          onChange={(e) => setHeight(e.target.value)}
          placeholder="Enter height in cm"
          step="0.1"
          required
        />
      </div>
      <Button type="submit" className="w-full">
        Save Measurements
      </Button>
    </form>
  );
};

export default BMIForm;
