
import { CheckCircle2 } from "lucide-react";

interface PlanFeatureListProps {
  features: string[];
}

const PlanFeatureList = ({ features }: PlanFeatureListProps) => {
  return (
    <div className="space-y-4 mb-8">
      {features.map((feature, index) => (
        <div key={index} className="flex items-center gap-3">
          <CheckCircle2 className="w-5 h-5 text-primary" />
          <span className="text-gray-600">{feature}</span>
        </div>
      ))}
    </div>
  );
};

export default PlanFeatureList;
