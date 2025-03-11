
import { motion } from "framer-motion";
import { Apple } from "lucide-react";

interface CircularGoalProgressProps {
  value: number;
  maxValue: number;
  size?: number;
  strokeWidth?: number;
  children?: React.ReactNode;
  showIcon?: boolean;
}

const CircularGoalProgress = ({
  value,
  maxValue,
  size = 200,
  strokeWidth = 10,
  children,
  showIcon = true,
}: CircularGoalProgressProps) => {
  const radius = (size - strokeWidth) / 2;
  const circumference = radius * 2 * Math.PI;
  const progress = Math.min(value / maxValue, 1);
  const offset = circumference - progress * circumference;
  
  return (
    <div className="relative" style={{ width: size, height: size }}>
      <svg width={size} height={size} className="transform -rotate-90">
        {/* Background circle */}
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          strokeWidth={strokeWidth}
          stroke="#e5e7eb"
          fill="transparent"
        />
        
        {/* Progress circle */}
        <motion.circle
          initial={{ strokeDashoffset: circumference }}
          animate={{ strokeDashoffset: offset }}
          transition={{ duration: 1, ease: "easeOut" }}
          cx={size / 2}
          cy={size / 2}
          r={radius}
          strokeWidth={strokeWidth}
          stroke="#22c55e"
          fill="transparent"
          strokeLinecap="round"
          strokeDasharray={`${circumference} ${circumference}`}
        />
      </svg>
      
      {/* Center content */}
      <div className="absolute inset-0 flex flex-col items-center justify-center">
        {showIcon && (
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.5, type: "spring" }}
            className="mb-2"
          >
            <div className="bg-green-100 p-2 rounded-full">
              <Apple className="w-6 h-6 text-green-600" />
            </div>
          </motion.div>
        )}
        
        {children}
      </div>
    </div>
  );
};

export default CircularGoalProgress;
