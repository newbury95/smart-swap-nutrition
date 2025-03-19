
import { useState, useEffect } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Gender } from "@/utils/nutritionCalculations";
import { useToast } from "@/hooks/use-toast";

interface MeasurementsDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  initialWeight: number;
  initialHeight: number;
  initialAge: number;
  initialGender: Gender;
  onSubmit: (weight: number, height: number, age: number, gender: Gender) => Promise<void>;
  isSubmitting?: boolean;
}

const MeasurementsDialog = ({
  open,
  onOpenChange,
  initialWeight,
  initialHeight,
  initialAge,
  initialGender,
  onSubmit,
  isSubmitting = false
}: MeasurementsDialogProps) => {
  const [weight, setWeight] = useState<string>(initialWeight ? initialWeight.toString() : "");
  const [height, setHeight] = useState<string>(initialHeight ? initialHeight.toString() : "");
  const [age, setAge] = useState<string>(initialAge ? initialAge.toString() : "");
  const [gender, setGender] = useState<Gender>(initialGender || "other");
  const { toast } = useToast();

  // Update state when initial values change
  useEffect(() => {
    if (initialWeight) setWeight(initialWeight.toString());
    if (initialHeight) setHeight(initialHeight.toString());
    if (initialAge) setAge(initialAge.toString());
    if (initialGender) setGender(initialGender);
  }, [initialWeight, initialHeight, initialAge, initialGender]);

  const handleSubmit = async () => {
    const weightNum = parseFloat(weight);
    const heightNum = parseFloat(height);
    const ageNum = parseInt(age);

    if (isNaN(weightNum) || isNaN(heightNum) || isNaN(ageNum)) {
      toast({
        variant: "destructive",
        title: "Invalid input",
        description: "Please enter valid numbers for weight, height, and age",
      });
      return;
    }

    if (weightNum <= 0 || heightNum <= 0 || ageNum <= 0) {
      toast({
        variant: "destructive",
        title: "Invalid measurements",
        description: "Weight, height, and age must be greater than zero",
      });
      return;
    }

    try {
      await onSubmit(weightNum, heightNum, ageNum, gender);
      // Don't close the dialog here, let the parent handle closing after successful submission
    } catch (error) {
      console.error("Error submitting measurements:", error);
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to update measurements. Please try again.",
      });
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Update Your Measurements</DialogTitle>
          <DialogDescription>
            Enter your current measurements to calculate your nutrition needs.
          </DialogDescription>
        </DialogHeader>

        <div className="grid gap-4 py-4">
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

          <div className="space-y-2">
            <Label htmlFor="age" className="text-sm font-medium text-gray-700">
              Age (years)
            </Label>
            <Input
              id="age"
              type="number"
              value={age}
              onChange={(e) => setAge(e.target.value)}
              placeholder="Enter your age"
              min="1"
              max="120"
              required
            />
          </div>

          <div className="space-y-2">
            <Label className="text-sm font-medium text-gray-700">Gender</Label>
            <RadioGroup value={gender} onValueChange={(value: Gender) => setGender(value)}>
              <div className="flex space-x-6">
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="male" id="gender-male" />
                  <Label htmlFor="gender-male" className="cursor-pointer">Male</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="female" id="gender-female" />
                  <Label htmlFor="gender-female" className="cursor-pointer">Female</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="other" id="gender-other" />
                  <Label htmlFor="gender-other" className="cursor-pointer">Other</Label>
                </div>
              </div>
            </RadioGroup>
          </div>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>Cancel</Button>
          <Button 
            onClick={handleSubmit} 
            disabled={isSubmitting}
            className="bg-blue-600 hover:bg-blue-700"
          >
            {isSubmitting ? "Saving..." : "Save Measurements"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default MeasurementsDialog;
