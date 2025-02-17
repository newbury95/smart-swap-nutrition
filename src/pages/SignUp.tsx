
import { useState } from "react";
import { motion } from "framer-motion";
import { ChevronLeft } from "lucide-react";
import { useNavigate } from "react-router-dom";

type GoalType = "health" | "fitness" | "dietary";

interface GoalOption {
  id: GoalType;
  title: string;
  description: string;
  examples: string[];
}

const SignUp = () => {
  const navigate = useNavigate();
  const [selectedGoal, setSelectedGoal] = useState<GoalType | null>(null);

  const handleSelectGoal = (goalType: GoalType) => {
    setSelectedGoal(goalType);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-white via-soft-green/20 to-white">
      <div className="container mx-auto px-4 py-12">
        <button 
          onClick={() => navigate('/')}
          className="flex items-center gap-2 text-gray-600 hover:text-gray-800 transition-colors mb-8"
        >
          <ChevronLeft className="w-4 h-4" />
          Back to Home
        </button>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="max-w-4xl mx-auto"
        >
          <h1 className="text-4xl font-bold mb-4 text-center bg-gradient-to-r from-green-600 to-green-400 bg-clip-text text-transparent">
            What's Your Goal?
          </h1>
          <p className="text-gray-600 text-center mb-12">
            Select your primary focus and we'll customize your nutrition plan accordingly
          </p>

          <div className="grid md:grid-cols-3 gap-6">
            {goalOptions.map((goal) => (
              <motion.div
                key={goal.id}
                className={`p-6 rounded-2xl backdrop-blur-sm border transition-all duration-300 cursor-pointer
                  ${selectedGoal === goal.id 
                    ? 'bg-green-50/80 border-green-400 shadow-lg' 
                    : 'bg-white/80 border-gray-100 hover:border-green-200'}`}
                onClick={() => handleSelectGoal(goal.id)}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                <h3 className="text-xl font-semibold mb-3">{goal.title}</h3>
                <p className="text-gray-600 mb-4 text-sm">{goal.description}</p>
                <ul className="space-y-2">
                  {goal.examples.map((example, idx) => (
                    <li key={idx} className="text-sm text-gray-600">
                      • {example}
                    </li>
                  ))}
                </ul>
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
                onClick={() => console.log(`Selected goal: ${selectedGoal}`)}
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

const goalOptions: GoalOption[] = [
  {
    id: "health",
    title: "Health Condition",
    description: "Get personalized alternatives that support your health needs",
    examples: [
      "Diabetes Management",
      "Heart Health",
      "Digestive Issues",
      "Food Allergies"
    ]
  },
  {
    id: "fitness",
    title: "Fitness Goal",
    description: "Optimize your nutrition to achieve your fitness objectives",
    examples: [
      "Muscle Gain",
      "Weight Loss",
      "Athletic Performance",
      "Energy Boost"
    ]
  },
  {
    id: "dietary",
    title: "Dietary Need",
    description: "Find alternatives that align with your dietary preferences",
    examples: [
      "Vegetarian/Vegan",
      "Gluten-Free",
      "Low-Carb",
      "Mediterranean"
    ]
  }
];

export default SignUp;
