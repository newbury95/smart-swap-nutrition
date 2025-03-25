
import React from 'react';
import { motion } from 'framer-motion';
import { ArrowRight } from 'lucide-react';
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardFooter, 
  CardHeader, 
  CardTitle 
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { MealPlan, MealPlanType } from '@/components/food/types';

interface MealPlanCardProps {
  planType: { 
    type: MealPlanType; 
    icon: React.ReactNode; 
    color: string 
  };
  index: number;
  onOpenMealPlan: (mealPlan: MealPlan) => void;
  filteredPlans: MealPlan[];
}

const MealPlanCard: React.FC<MealPlanCardProps> = ({ 
  planType, 
  index, 
  onOpenMealPlan, 
  filteredPlans 
}) => {
  const getPlanDescription = (type: MealPlanType) => {
    switch(type) {
      case "Low Calorie": return "Meals with reduced calories for weight management";
      case "High Protein": return "Protein-focused meals ideal for muscle building";
      case "High Carb": return "Carbohydrate-rich meals perfect for athletes";
      case "Balanced": return "Well-balanced nutrition for overall health";
      case "Weight Loss": return "Structured meal plans designed for weight loss";
      case "Diabetic Friendly": return "Meals suitable for managing blood sugar levels";
      case "Heart Healthy": return "Low sodium, low fat meals for cardiovascular health";
      case "Coeliac Friendly": return "Gluten-free options for those with coeliac disease";
      case "Dairy Free": return "Meals without dairy products for those with lactose intolerance";
      default: return "Customized meal plan";
    }
  };

  const handleClick = () => {
    if (filteredPlans && filteredPlans.length > 0) {
      onOpenMealPlan(filteredPlans[0]);
    }
  };

  // All cards use the primary color in different shade variants
  const bgColor = "bg-primary-lighter";
  const iconColor = "text-primary";

  return (
    <motion.div
      key={planType.type}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, delay: index * 0.05 }}
    >
      <Card 
        className="cursor-pointer hover:shadow-md transition-shadow border-primary-lighter/40"
        onClick={handleClick}
      >
        <CardHeader className="pb-2">
          <div className={`w-10 h-10 rounded-full ${bgColor} flex items-center justify-center mb-2`}>
            {React.cloneElement(planType.icon as React.ReactElement, { className: `h-5 w-5 ${iconColor}` })}
          </div>
          <CardTitle className="text-lg">{planType.type}</CardTitle>
        </CardHeader>
        <CardContent className="pb-2">
          <CardDescription>
            {getPlanDescription(planType.type)}
          </CardDescription>
        </CardContent>
        <CardFooter>
          <Button variant="ghost" className="w-full flex justify-between items-center text-primary hover:bg-soft-green hover:text-primary-dark">
            <span>View Plan</span>
            <ArrowRight className="h-4 w-4" />
          </Button>
        </CardFooter>
      </Card>
    </motion.div>
  );
};

export default MealPlanCard;
