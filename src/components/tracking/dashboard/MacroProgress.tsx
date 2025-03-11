
import { Progress } from "@/components/ui/progress";

interface MacroProgressProps {
  label: string;
  color: string;
  percentage: number;
  current: number;
  target: number;
  ratio: number;
}

const MacroProgress = ({ 
  label, 
  color, 
  percentage, 
  current, 
  target, 
  ratio 
}: MacroProgressProps) => {
  return (
    <div className="space-y-2">
      <div className="flex justify-between text-sm">
        <div className="flex items-center">
          <div className={`w-3 h-3 ${color} rounded-full mr-2`}></div>
          <span>{label} ({ratio}%)</span>
        </div>
        <span className="font-medium">
          {current}g / {target}g
        </span>
      </div>
      <Progress 
        value={percentage} 
        className="h-2" 
        indicatorClassName={color} 
      />
    </div>
  );
};

export default MacroProgress;
