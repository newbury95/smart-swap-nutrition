
import { useState } from "react";
import { motion } from "framer-motion";
import { ChevronLeft, Heart } from "lucide-react";
import { useNavigate } from "react-router-dom";

interface HealthGoal {
  id: string;
  title: string;
  description: string;
  icon: JSX.Element;
}

const healthGoals: HealthGoal[] = [
  {
    id: "diabetes",
    title: "Diabetes Management",
    description: "Personalized meal plans to help manage blood sugar levels",
    icon: <Heart className="w-6 h-6" />
  },
  {
    id: "heart",
    title: "Heart Health",
    description: "Heart-healthy alternatives and cardiovascular-focused nutrition",
    icon: <Heart className="w-6 h-6" />
  },
  {
    id: "digestive",
    title: "Digestive Health",
    description: "Foods and plans that support optimal digestive function",
    icon: <Heart className="w-6 h-6" />
  },
  {
    id: "food-allergies",
    title: "Food Allergies",
    description: "Safe alternatives for common food allergens",
    icon: <Heart className="w-6 h-6" />
  }
];

const HealthGoals = () => {
  const navigate = useNavigate();
  const [selectedGoal, setSelectedGoal] = useState<string | null>(null);

  const handleSelectGoal = (goalId: string) => {
    setSelectedGoal(goalId);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-white via-soft-green/20 to-white">
      <div className="container mx-auto px-4 py-12">
        <button 
          onClick={() => navigate('/signup')}
          className="flex items-center gap-2 text-gray-600 hover:text-gray-800 transition-colors mb-8"
        >
          <ChevronLeft className="w-4 h-4" />
          Back to Goals
        </button>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="max-w-4xl mx-auto"
        >
          <h1 className="text-4xl font-bold mb-4 text-center bg-gradient-to-r from-green-600 to-green-400 bg-clip-text text-transparent">
            Select Your Health Focus
          </h1>
          <p className="text-gray-600 text-center mb-12">
            Choose a specific health condition to receive tailored nutrition guidance
          </p>

          <div className="grid md:grid-cols-2 gap-6">
            {healthGoals.map((goal) => (
              <motion.div
                key={goal.id}
                className={`relative p-6 rounded-3xl backdrop-blur-sm border-2 transition-all duration-300 cursor-pointer overflow-hidden group
                  ${selectedGoal === goal.id 
                    ? 'bg-green-50/80 border-green-400 shadow-xl' 
                    : 'bg-white/80 border-gray-100 hover:border-green-200 hover:shadow-lg'}`}
                onClick={() => handleSelectGoal(goal.id)}
                whileHover={{ scale: 1.02, y: -5 }}
                whileTap={{ scale: 0.98 }}
              >
                <div className="relative z-10">
                  <div className="flex items-center gap-3 mb-4">
                    <div className="p-3 rounded-2xl bg-green-50 text-green-600">
                      {goal.icon}
                    </div>
                    <h3 className="text-xl font-semibold">{goal.title}</h3>
                  </div>
                  <p className="text-gray-600 text-sm">{goal.description}</p>
                </div>
              </motion.div>
            ))}
          </div>

          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: selectedGoal ? 1 : 0 }}
            className="mt-12 text-center"
          >
            {selectedGoal && (
              <button 
                className="bg-gradient-to-r from-green-600 to-green-400 text-white px-8 py-4 rounded-full font-medium hover:opacity-90 transition-all duration-300 shadow-lg hover:shadow-xl"
                onClick={() => navigate('/signup/personal-info')}
              >
                Continue
              </button>
            )}
          </motion.div>
        </motion.div>
      </div>
    </div>
  );
};

export default HealthGoals;
