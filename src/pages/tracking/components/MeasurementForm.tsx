
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

interface MeasurementFormProps {
  weight: string;
  height: string;
  onWeightChange: (value: string) => void;
  onHeightChange: (value: string) => void;
  onSubmit: (e: React.FormEvent) => void;
}

export const MeasurementForm = ({
  weight,
  height,
  onWeightChange,
  onHeightChange,
  onSubmit,
}: MeasurementFormProps) => {
  return (
    <div className="bg-white rounded-xl p-6 shadow-sm">
      <h2 className="text-lg font-semibold mb-4">Enter New Measurements</h2>
      <form onSubmit={onSubmit} className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Weight (kg)
          </label>
          <Input
            type="number"
            value={weight}
            onChange={(e) => onWeightChange(e.target.value)}
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
            onChange={(e) => onHeightChange(e.target.value)}
            placeholder="Enter height in cm"
            step="0.1"
            required
          />
        </div>
        <Button type="submit" className="w-full">
          Save Measurements
        </Button>
      </form>
    </div>
  );
};
