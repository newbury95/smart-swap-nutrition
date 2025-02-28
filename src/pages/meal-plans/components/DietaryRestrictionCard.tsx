
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

interface DietaryRestrictionCardProps {
  restriction: string;
  index: number;
}

const DietaryRestrictionCard: React.FC<DietaryRestrictionCardProps> = ({ restriction, index }) => {
  return (
    <motion.div
      key={restriction}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, delay: index * 0.05 }}
    >
      <Card className="cursor-pointer hover:shadow-md transition-shadow">
        <CardHeader>
          <CardTitle className="text-lg">{restriction}</CardTitle>
        </CardHeader>
        <CardContent>
          <CardDescription>
            Meal plans suitable for {restriction.toLowerCase()} diets
          </CardDescription>
        </CardContent>
        <CardFooter>
          <Button variant="ghost" className="w-full flex justify-between items-center">
            <span>View Plans</span>
            <ArrowRight className="h-4 w-4" />
          </Button>
        </CardFooter>
      </Card>
    </motion.div>
  );
};

export default DietaryRestrictionCard;
