
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
          <span className="font-medium">{label} ({ratio}%)</span>
        </div>
        <span className="font-semibold">
          {current}g 
          <span className="text-gray-500 text-xs ml-1">/ {target}g</span>
        </span>
      </div>
      <Progress 
        value={percentage} 
        className="h-2.5 bg-gray-100" 
        indicatorClassName={`${color} transition-all duration-500`} 
      />
      <div className="text-xs text-gray-500 text-right">
        {percentage}% of daily target
      </div>
    </div>
  );
};

export default MacroProgress;
