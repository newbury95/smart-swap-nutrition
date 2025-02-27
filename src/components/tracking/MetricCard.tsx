
import { LucideIcon } from "lucide-react";
import { Button } from "@/components/ui/button";

interface MetricCardProps {
  icon: LucideIcon;
  iconColor: string;
  bgColor: string;
  title: string;
  value: number | string;
  unit?: string;
  onUpdate?: () => void;
  isPremium?: boolean;
  buttonLabel: string;
}

const MetricCard = ({
  icon: Icon,
  iconColor,
  bgColor,
  title,
  value,
  unit,
  onUpdate,
  isPremium,
  buttonLabel,
}: MetricCardProps) => {
  // Check if the buttonLabel is related to health sync
  const isHealthSync = buttonLabel.includes("Synced with Health");
  
  return (
    <div className="bg-white rounded-xl p-4 shadow-sm">
      <div className="flex items-center gap-3 mb-2">
        <div className={`p-2 ${bgColor} rounded-lg`}>
          <Icon className={`w-5 h-5 ${iconColor}`} />
        </div>
        <h3 className="font-medium">{title}</h3>
      </div>
      <p className={`text-2xl font-bold ${iconColor} mb-1`}>
        {value}
        {unit && <span className="text-sm ml-1">{unit}</span>}
      </p>
      
      {isHealthSync ? (
        <p className="text-xs text-gray-500">{buttonLabel}</p>
      ) : (
        <Button 
          onClick={onUpdate} 
          variant="outline" 
          size="sm"
          className={!isPremium ? "cursor-not-allowed opacity-50" : ""}
        >
          {buttonLabel}
        </Button>
      )}
    </div>
  );
};

export default MetricCard;
