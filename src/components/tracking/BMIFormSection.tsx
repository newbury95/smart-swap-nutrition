
import { motion } from "framer-motion";
import BMIForm from "@/components/tracking/BMIForm";

interface BMIFormSectionProps {
  onSubmit: (weight: number, height: number) => void;
  initialWeight?: number;
  initialHeight?: number;
  isSubmitting?: boolean;
  id?: string;
}

const BMIFormSection = ({ 
  onSubmit, 
  initialWeight, 
  initialHeight, 
  isSubmitting,
  id
}: BMIFormSectionProps) => {
  return (
    <motion.div
      id={id}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
      className="bg-white rounded-xl p-6 shadow-sm mb-8"
    >
      <h2 className="text-lg font-semibold mb-4">Update Your Measurements</h2>
      <p className="text-sm text-gray-500 mb-5">
        Enter your current weight and height to update your nutrition calculations and track your progress.
      </p>
      <BMIForm 
        onSubmit={onSubmit} 
        initialWeight={initialWeight}
        initialHeight={initialHeight}
        isSubmitting={isSubmitting}
      />
    </motion.div>
  );
};

export default BMIFormSection;
