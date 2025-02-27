
import { motion } from "framer-motion";
import BMIForm from "@/components/tracking/BMIForm";

interface BMIFormSectionProps {
  onSubmit: (weight: number, height: number) => void;
}

const BMIFormSection = ({ onSubmit }: BMIFormSectionProps) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
      className="bg-white rounded-xl p-6 shadow-sm mb-8"
    >
      <h2 className="text-lg font-semibold mb-4">Enter New Measurements</h2>
      <BMIForm onSubmit={onSubmit} />
    </motion.div>
  );
};

export default BMIFormSection;
